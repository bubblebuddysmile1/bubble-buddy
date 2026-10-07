import { NextResponse } from "next/server";
import { cancelOrder, confirmOrder, mapRazorpayPaymentMethod, orderNumberFromRazorpay } from "@/lib/orders";
import { createRazorpayClient } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { notifyOrderConfirmation, notifyPaymentFailure } from "@/lib/order-notifications";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderNumber = typeof body.orderNumber === "string" ? body.orderNumber : "";
    const paymentId = typeof body.paymentId === "string" ? body.paymentId : "";

    if (!orderNumber) {
      return NextResponse.json({ error: "Order reference is required." }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      select: {
        id: true,
        orderNumber: true,
        paymentStatus: true,
        razorpayOrderId: true,
        razorpayPaymentId: true,
        razorpaySignature: true,
      },
    });

    if (
      !order?.razorpayOrderId ||
      (paymentId && order.razorpayPaymentId && order.razorpayPaymentId !== paymentId) ||
      orderNumberFromRazorpay(order.razorpayOrderId) !== orderNumber
    ) {
      return NextResponse.json({ error: "Payment reference was not found." }, { status: 404 });
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.json({
        status: "paid",
        orderNumber,
        paymentId: order.razorpayPaymentId ?? paymentId,
      });
    }
    const razorpay = createRazorpayClient();
    const payments = (await razorpay.orders.fetchPayments(order.razorpayOrderId)).items;
    const matchingPayments = payments.filter(
      (candidate) => candidate.order_id === order.razorpayOrderId,
    );
    const payment =
      matchingPayments.find(
        (candidate) =>
          (candidate.status === "captured" || candidate.status === "authorized") &&
          (!paymentId || candidate.id === paymentId),
      ) ??
      matchingPayments.find(
        (candidate) => candidate.status === "captured" || candidate.status === "authorized",
      ) ??
      matchingPayments.find((candidate) => candidate.id === paymentId) ??
      matchingPayments.sort((left, right) => right.created_at - left.created_at)[0];
    if (!payment) {
      return NextResponse.json({ status: "pending", orderNumber });
    }
    if (payment.status === "captured" || payment.status === "authorized") {
      await confirmOrder(
        order.razorpayOrderId,
        payment.id,
        payment.id === order.razorpayPaymentId ? order.razorpaySignature : null,
        mapRazorpayPaymentMethod(payment.method),
      );
      await notifyOrderConfirmation(orderNumber);
      return NextResponse.json({ status: "paid", orderNumber, paymentId: payment.id });
    }

    if (payment.status === "failed") {
      if (order.paymentStatus === "PENDING") {
        await cancelOrder(order.razorpayOrderId);
        await notifyPaymentFailure(orderNumber);
      }
      return NextResponse.json({ status: "failed", orderNumber, paymentId: payment.id });
    }

    return NextResponse.json({ status: "pending", orderNumber, paymentId: payment.id });
  } catch (error) {
    console.error("[payments/status]", error);
    return NextResponse.json(
      { error: "Unable to refresh payment status." },
      { status: 503 },
    );
  }
}
