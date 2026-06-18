import { Prisma } from "@prisma/client";
import { getCheckoutTotals } from "@/lib/checkout";
import { getLoyaltyPointsEarned, loyaltyDiscountFromRedeem } from "@/lib/loyalty";
import { getPromotionByCode, getPromotionDiscountAmount, isPromotionActive } from "@/lib/promotions";
import { prisma } from "@/lib/prisma";
import type { AuthTokenPayload } from "@/lib/auth";
import type { CheckoutAddressForm } from "@/lib/validations/checkout";
import type { CreatePaymentOrderInput } from "@/lib/validations/payment";
import type { CartItem } from "@/types/cart";

export type PersistOrderInput = {
  razorpayOrderId: string;
  address: CheckoutAddressForm;
  items: CreatePaymentOrderInput["items"];
  user?: AuthTokenPayload | null;
  couponCode?: string;
  redeemPoints?: number;
};

export function orderNumberFromRazorpay(razorpayOrderId: string): string {
  const suffix = razorpayOrderId.replace(/^order_(mock_)?/, "").slice(-12).toUpperCase();
  return `BB-${suffix}`;
}

export async function persistOrderAfterPayment(input: PersistOrderInput) {
  const orderNumber = orderNumberFromRazorpay(input.razorpayOrderId);

  const existing = await prisma.order.findUnique({
    where: { orderNumber },
    select: { id: true, orderNumber: true },
  });

  if (existing) {
    return existing;
  }

  const cartItems: CartItem[] = input.items.map((item) => ({
    ...item,
    image: "",
    category: undefined,
  }));

  let promotion;
  if (input.couponCode) {
    promotion = await getPromotionByCode(input.couponCode);
    if (!promotion || !isPromotionActive(promotion)) {
      throw new Error("Invalid coupon code.");
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = getPromotionDiscountAmount(promotion, subtotal, cartItems);
    if (discount <= 0) {
      throw new Error("Coupon code is not eligible for this order.");
    }
  }

  const loyaltyDiscount = loyaltyDiscountFromRedeem(input.redeemPoints ?? 0);
  const totals = getCheckoutTotals(cartItems, promotion && {
    discountType: promotion.discountType,
    discountValue: Number(promotion.discountValue),
    minOrderAmount: Number(promotion.minOrderAmount),
  }, loyaltyDiscount);

  const products = (await prisma.product.findMany({
    where: { id: { in: input.items.map((item) => item.id) } },
    select: { id: true, sku: true },
  })) as Array<{ id: number; sku: string }>;
  const productById = new Map<number, { id: number; sku: string }>(
    products.map((product) => [product.id, product] as const),
  );

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    let shippingAddressId: number | undefined;
    let billingAddressId: number | undefined;

    // Always persist the provided shipping/billing address so admin can view it,
    // associate with user when available.
    const addressData: any = {
      recipient: input.address.fullName,
      line1: input.address.line1,
      line2: input.address.line2 ?? null,
      city: input.address.city,
      state: input.address.state,
      postalCode: input.address.postalCode,
      country: input.address.country,
      phone: input.address.phone,
    };
    if (input.user?.id) {
      addressData.userId = input.user.id;
    }

    const address = await tx.address.create({ data: addressData });
    shippingAddressId = address.id;
    billingAddressId = address.id;

    if (input.user?.id && (input.redeemPoints ?? 0) > 0) {
      const user = await tx.user.findUnique({
        where: { id: input.user.id },
        select: { loyaltyPoints: true },
      });

      if (!user || user.loyaltyPoints < (input.redeemPoints ?? 0)) {
        throw new Error("Insufficient loyalty points to redeem.");
      }

      await tx.user.update({
        where: { id: input.user.id },
        data: {
          loyaltyPoints: { decrement: input.redeemPoints ?? 0 },
        },
      });
    }

    const order = await tx.order.create({
      data: {
        orderNumber,
        userId: input.user?.id ?? null,
        status: "PENDING",
        paymentStatus: "PENDING",
        paymentMethod: "CARD",
        couponCode: input.couponCode?.trim().toUpperCase() ?? null,
        razorpayOrderId: input.razorpayOrderId,
        totalAmount: new Prisma.Decimal(totals.total),
        shippingAmount: new Prisma.Decimal(totals.shipping),
        taxAmount: new Prisma.Decimal(0),
        discountAmount: new Prisma.Decimal(totals.discount),
        redeemedLoyaltyPoints: input.redeemPoints ?? 0,
        loyaltyPointsEarned: getLoyaltyPointsEarned(totals.total),
        shippingAddressId,
        billingAddressId,
        placedAt: new Date(),
        items: {
          create: input.items.map((item) => {
            const product = productById.get(item.id);
            const unitPrice = new Prisma.Decimal(item.price);
            return {
              productId: item.id,
              name: item.name,
              sku: product?.sku ?? `SKU-${item.id}`,
              quantity: item.quantity,
              unitPrice,
              totalPrice: new Prisma.Decimal(item.price * item.quantity),
            };
          }),
        },
      },
      select: { id: true, orderNumber: true },
    });

    return order;
  });
}

export async function confirmOrder(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) {
  const orderNumber = orderNumberFromRazorpay(razorpayOrderId);
  
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: {
      id: true,
      userId: true,
      redeemedLoyaltyPoints: true,
      loyaltyPointsEarned: true,
      paymentStatus: true,
      couponCode: true,
      items: { select: { productId: true, quantity: true } },
    },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  if (order.paymentStatus === "PAID") {
    return { id: order.id, orderNumber };
  }

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const updatedOrder = await tx.order.update({
      where: { orderNumber },
      data: {
        status: "CONFIRMED",
        paymentStatus: "PAID",
        razorpayPaymentId,
        razorpaySignature,
      },
      select: { id: true, orderNumber: true },
    });

    if (order.userId && order.loyaltyPointsEarned > 0) {
      await tx.user.update({
        where: { id: order.userId },
        data: {
          loyaltyPoints: { increment: order.loyaltyPointsEarned },
        },
      });
    }

    if (order.couponCode) {
      await tx.promotion.updateMany({
        where: {
          code: order.couponCode,
          availableQuantity: { gt: 0 },
        },
        data: {
          availableQuantity: { decrement: 1 },
        },
      });
    }

    // Decrement stock for each item
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { decrement: item.quantity } },
      });
    }

    return updatedOrder;
  });
}

export async function cancelOrder(razorpayOrderId: string) {
  const orderNumber = orderNumberFromRazorpay(razorpayOrderId);
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: { id: true, orderNumber: true, userId: true, redeemedLoyaltyPoints: true },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    if (order.userId && order.redeemedLoyaltyPoints > 0) {
      await tx.user.update({
        where: { id: order.userId },
        data: {
          loyaltyPoints: { increment: order.redeemedLoyaltyPoints },
        },
      });
    }

    return tx.order.update({
      where: { orderNumber },
      data: {
        status: "CANCELLED",
        paymentStatus: "FAILED",
      },
      select: { id: true, orderNumber: true },
    });
  });
}
