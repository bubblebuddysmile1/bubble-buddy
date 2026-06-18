import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";
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
import type { CartItem } from "@/types/cart";

export async function POST(request: Request) {
  try {
    // Authentication check
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized. Please login to continue." }, { status: 401 });
    }

    const payload = verifyAuthToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized. Invalid session." }, { status: 401 });
    }
    const json = await request.json();
    const parsed = createPaymentOrderSchema.safeParse(json);

    if (!parsed.success) {
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

    const products = await prisma.product.findMany({
      where: { id: { in: items.map((item) => item.id) } },
      select: { id: true, stockQuantity: true },
    });
    const productById = new Map(products.map((product) => [product.id, product]));

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

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { loyaltyPoints: true },
    });

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

    if (isMockPaymentMode()) {
      const mockOrderId = `order_mock_${Date.now()}`;
      return NextResponse.json({
        mock: true,
        orderId: mockOrderId,
        amount,
        currency,
        keyId: "mock_key",
        receipt,
        totals,
        address,
      });
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

    return NextResponse.json({
      mock: false,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: getRazorpayKeyId(),
      receipt: order.receipt,
      totals,
      address,
    });
  } catch (error) {
    console.error("[payments/create-order]", error);
    return NextResponse.json(
      { error: "Unable to create payment order. Please try again." },
      { status: 500 },
    );
  }
}
