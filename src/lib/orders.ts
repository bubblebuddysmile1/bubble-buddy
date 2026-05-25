import { Prisma } from "@prisma/client";
import { getCheckoutTotals } from "@/lib/checkout";
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
  const totals = getCheckoutTotals(cartItems);

  const products = await prisma.product.findMany({
    where: { id: { in: input.items.map((item) => item.id) } },
    select: { id: true, sku: true },
  });
  const productById = new Map(products.map((product) => [product.id, product]));

  return prisma.$transaction(async (tx) => {
    let shippingAddressId: number | undefined;
    let billingAddressId: number | undefined;

    if (input.user?.id) {
      const address = await tx.address.create({
        data: {
          userId: input.user.id,
          recipient: input.address.fullName,
          line1: input.address.line1,
          line2: input.address.line2 ?? null,
          city: input.address.city,
          state: input.address.state,
          postalCode: input.address.postalCode,
          country: input.address.country,
          phone: input.address.phone,
        },
      });
      shippingAddressId = address.id;
      billingAddressId = address.id;
    }

    const order = await tx.order.create({
      data: {
        orderNumber,
        userId: input.user?.id ?? null,
        status: "CONFIRMED",
        paymentStatus: "PAID",
        paymentMethod: "CARD",
        totalAmount: new Prisma.Decimal(totals.total),
        shippingAmount: new Prisma.Decimal(totals.shipping),
        taxAmount: new Prisma.Decimal(0),
        discountAmount: new Prisma.Decimal(0),
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

    for (const item of input.items) {
      if (!productById.has(item.id)) continue;
      await tx.product.update({
        where: { id: item.id },
        data: { stockQuantity: { decrement: item.quantity } },
      });
    }

    return order;
  });
}
