import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";
import { ensureCheckoutAutoAuthUser } from "@/lib/account-auth";
import { getCheckoutTotals } from "@/lib/checkout";
import { getMaxRedeemablePoints, loyaltyDiscountFromRedeem } from "@/lib/loyalty";
import {
  createRazorpayClient,
  getPaymentCurrency,
  getRazorpayKeyId,
  isMockPaymentMode,
  toSmallestCurrencyUnit,
} from "@/lib/razorpay";
import { createPaymentOrderSchema } from "@/lib/validations/payment";
import { prisma } from "@/lib/prisma";
import { getPromotionByCode, getPromotionDiscountAmount, getPromotionValidationMessage, isPromotionActive } from "@/lib/promotions";
import { authCookieOptions } from "@/lib/auth";
import type { CartItem } from "@/types/cart";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    const existingPayload = token ? verifyAuthToken(token) : null;

    let payload = existingPayload;
    let authToken: string | null = null;

    if (!payload) {
      const email = String(json?.address?.email ?? "").trim().toLowerCase();
      const phone = String(json?.address?.phone ?? "").trim();
      const fullName = String(json?.address?.fullName ?? "").trim();
      const autoAuth = await ensureCheckoutAutoAuthUser({
        email,
        phone,
        name: fullName,
        address: json?.address,
      });

      if (autoAuth.kind === "existing_active") {
        return NextResponse.json({ error: autoAuth.message }, { status: 409 });
      }

      payload = autoAuth.user ? { id: autoAuth.user.id, email: autoAuth.user.email ?? email, name: autoAuth.user.name, role: autoAuth.user.role } : null;
      authToken = autoAuth.token ?? null;
    }

    if (!payload) {
      return NextResponse.json({ error: "Unable to prepare checkout. Please try again." }, { status: 400 });
    }
    const parsed = createPaymentOrderSchema.safeParse(json);

    if (!parsed.success) {
      console.error("[payments/create-order] Validation failed:", {
        requestBody: json,
        errors: parsed.error.flatten(),
      });
      return NextResponse.json(
        { error: "Invalid checkout data.", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { address, items, couponCode, redeemPoints = 0 } = parsed.data;
    const cartItems: CartItem[] = items.map((item) => ({
      ...item,
      image: "",
      category: undefined,
    }));

    const checkoutUser = payload?.id
      ? await prisma.user.findUnique({
          where: { id: payload.id },
          select: { id: true, loyaltyPoints: true, email: true, name: true, role: true, accountStatus: true },
        })
      : null;

    if (!checkoutUser && payload?.id) {
      const fallbackEmail = String(address?.email ?? "").trim().toLowerCase() || null;
      const fallbackPhone = String(address?.phone ?? "").trim() || null;
      const fallbackName = String(address?.fullName ?? "").trim() || null;

      const createdUser = await prisma.user.create({
        data: {
          id: payload.id,
          email: fallbackEmail,
          phone: fallbackPhone,
          name: fallbackName,
          authType: "CHECKOUT_AUTO",
          accountStatus: "PENDING",
          emailVerified: false,
          phoneVerified: false,
          password: null,
        },
        select: { id: true, loyaltyPoints: true, email: true, name: true, role: true, accountStatus: true },
      });

      payload = {
        id: createdUser.id,
        email: createdUser.email ?? payload.email ?? fallbackEmail ?? "",
        name: createdUser.name,
        role: createdUser.role,
      };
    }

    const products: Array<{ id: number; stockQuantity: number }> = await prisma.product.findMany({
      where: { id: { in: items.map((item) => item.id) } },
      select: { id: true, stockQuantity: true },
    });
    const productById = new Map<number, { id: number; stockQuantity: number }>(
      products.map((product) => [product.id, product] as const),
    );

    for (const item of items) {
      const product = productById.get(item.id);
      if (!product) {
        return NextResponse.json({ error: `Product ${item.name} is no longer available.` }, { status: 400 });
      }
      if (product.stockQuantity < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${item.name}. Only ${product.stockQuantity} left.`,
          },
          { status: 400 },
        );
      }
    }

    let promotion;
    if (couponCode) {
      promotion = await getPromotionByCode(couponCode);
      if (!promotion || !isPromotionActive(promotion)) {
        return NextResponse.json({ error: "Coupon code is invalid or expired." }, { status: 400 });
      }

      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const discount = getPromotionDiscountAmount(promotion, subtotal, cartItems);
      if (discount <= 0) {
        return NextResponse.json(
          {
            error: "Coupon cannot be applied to this order.",
            message: getPromotionValidationMessage(promotion, subtotal, cartItems),
          },
          { status: 400 },
        );
      }
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const promotionDiscount = promotion ? getPromotionDiscountAmount(promotion, subtotal) : 0;
    const discountedSubtotal = Math.max(0, subtotal - promotionDiscount);

    const user = payload?.id
      ? await prisma.user.findUnique({
          where: { id: payload.id },
          select: { loyaltyPoints: true },
        })
      : null;

    if (!user) {
      return NextResponse.json({ error: "Unable to load your account." }, { status: 400 });
    }

    const maxRedeemable = getMaxRedeemablePoints(user.loyaltyPoints, discountedSubtotal);
    if (redeemPoints > maxRedeemable) {
      return NextResponse.json({ error: `You can redeem up to ${maxRedeemable} points on this order.` }, { status: 400 });
    }

    const totals = getCheckoutTotals(cartItems, promotion && {
      discountType: promotion.discountType,
      discountValue: Number(promotion.discountValue),
      minOrderAmount: Number(promotion.minOrderAmount),
    }, loyaltyDiscountFromRedeem(redeemPoints));

    const currency = getPaymentCurrency(totals.currency);
    const amount = toSmallestCurrencyUnit(totals.total);
    const receipt = `bb_${Date.now()}`;

    const responsePayload = {
      mock: false,
      orderId: "",
      amount,
      currency,
      keyId: "",
      receipt,
      totals,
      address,
    };

    if (isMockPaymentMode()) {
      const mockOrderId = `order_mock_${Date.now()}`;
      const response = NextResponse.json({
        ...responsePayload,
        mock: true,
        orderId: mockOrderId,
        keyId: "mock_key",
      });
      if (authToken) {
        response.cookies.set(COOKIE_NAME, authToken, authCookieOptions);
      }
      return response;
    }

    const razorpay = createRazorpayClient();
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt,
      payment_capture: true,
      notes: {
        customer: address.fullName,
        phone: address.phone,
        city: address.city,
      },
    });

    const response = NextResponse.json({
      ...responsePayload,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: getRazorpayKeyId(),
      receipt: order.receipt,
    });
    if (authToken) {
      response.cookies.set(COOKIE_NAME, authToken, authCookieOptions);
    }
    return response;
  } catch (error) {
    console.error("[payments/create-order]", error);
    return NextResponse.json(
      { error: "Unable to create payment order. Please try again." },
      { status: 500 },
    );
  }
}
