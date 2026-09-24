import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get("orderNumber")?.trim();

  if (!orderNumber) {
    return NextResponse.json({ error: "orderNumber is required." }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              currency: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  if (order.paymentStatus !== "PAID") {
    return NextResponse.json({ error: "Order payment is not confirmed." }, { status: 409 });
  }

  const items = order.items.map((item) => ({
    id: item.productId,
    name: item.name,
    price: Number(item.unitPrice),
    quantity: item.quantity,
    currency: item.product?.currency ?? "INR",
    category: null,
  }));

  return NextResponse.json({
    orderId: order.orderNumber,
    transactionId: order.razorpayPaymentId ?? order.orderNumber,
    currency: items[0]?.currency ?? "INR",
    value: Number(order.totalAmount.toString()),
    items,
  });
}
