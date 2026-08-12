import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";
import { notifyOrderStatusUpdate } from "@/lib/order-notifications";
import { logActivity } from "@/lib/activity-log";
import { createRazorpayClient, isMockPaymentMode } from "@/lib/razorpay";

const updateOrderSchema = z.object({
  orderId: z.number(),
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "RETURN_REQUESTED",
    "CANCELLED",
    "RETURNED",
  ]),
  returnAllowed: z.boolean().optional(),
});

const refundOrderSchema = z.object({
  orderId: z.number(),
});

async function requireAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const payload = verifyAuthToken(token);
  if (!payload || payload.role !== "ADMIN") {
    return null;
  }

  return payload;
}

export async function PATCH(request: Request) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = updateOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid order update payload." }, { status: 400 });
    }

    const { orderId, status, returnAllowed } = parsed.data;
    const order = await prisma.$transaction(async (tx) => {
      const existingOrder = await tx.order.findUnique({
        where: { id: orderId },
        select: { paymentStatus: true },
      });

      const updateData: Record<string, unknown> = {
        status,
        paymentStatus: existingOrder?.paymentStatus === "PAID" && (status === "CANCELLED" || status === "RETURNED")
          ? "PAID"
          : undefined,
      };

      if (returnAllowed !== undefined) {
        updateData.returnAllowed = returnAllowed;
      }

      const updated = await tx.order.update({
        where: { id: orderId },
        data: updateData,
      });

      await tx.orderTrackingEvent.create({
        data: {
          orderId: updated.id,
          status,
          description: `Order status changed to ${status}`,
        },
      });

      return updated;
    });

    await notifyOrderStatusUpdate(order.orderNumber, order.status).catch((error) => {
      console.error("[api/admin/orders] Failed to send order status update notification:", error);
    });

    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    const payload = token ? verifyAuthToken(token) : null;
    if (payload) {
      await logActivity({
        userId: payload.id,
        eventType: "ADMIN_ACTION",
        action: "Updated order status",
        description: `Order ${order.orderNumber} updated to ${order.status}`,
      });
    }

    return NextResponse.json({ id: order.id, status: order.status });
  } catch (error) {
    console.error("[api/admin/orders]", error);
    return NextResponse.json({ error: "Unable to update order status." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = refundOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid refund payload." }, { status: 400 });
    }

    const { orderId } = parsed.data;

    const order = await prisma.$transaction(async (tx) => {
      const existing = await tx.order.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          orderNumber: true,
          status: true,
          paymentStatus: true,
          razorpayPaymentId: true,
          totalAmount: true,
        },
      });

      if (!existing) {
        throw new Error("Order not found");
      }

      if (existing.status !== "CANCELLED" && existing.status !== "RETURNED") {
        throw new Error("Refunds are only allowed for cancelled or returned orders.");
      }

      if (existing.paymentStatus === "REFUNDED") {
        throw new Error("This order has already been refunded.");
      }

      if (existing.paymentStatus !== "PAID") {
        throw new Error("Only paid orders can be refunded.");
      }

      if (isMockPaymentMode() || !existing.razorpayPaymentId) {
        const updated = await tx.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "REFUNDED",
            returnAllowed: false,
          },
        });

        await tx.orderTrackingEvent.create({
          data: {
            orderId: updated.id,
            status: existing.status,
            description: `Refund processed for order ${updated.orderNumber}`,
          },
        });

        return updated;
      }

      const razorpay = createRazorpayClient();
      const refundAmount = Math.round(Number(existing.totalAmount) * 100);
      await razorpay.payments.refund(existing.razorpayPaymentId, {
        amount: refundAmount,
        speed: "normal",
        notes: {
          orderNumber: existing.orderNumber,
          reason: existing.status,
        },
      });

      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "REFUNDED",
          returnAllowed: false,
        },
      });

      await tx.orderTrackingEvent.create({
        data: {
          orderId: updated.id,
          status: existing.status,
          description: `Refund processed through Razorpay for order ${updated.orderNumber}`,
        },
      });

      return updated;
    });

    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    const payload = token ? verifyAuthToken(token) : null;
    if (payload) {
      await logActivity({
        userId: payload.id,
        eventType: "ADMIN_ACTION",
        action: "Processed refund",
        description: `Refund issued for order ${order.orderNumber}`,
      });
    }

    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      status: order.status,
    });
  } catch (error) {
    console.error("[api/admin/orders][refund]", error);
    const message = error instanceof Error ? error.message : "Unable to process refund.";
    return NextResponse.json({ error: message }, { status: message === "Order not found" ? 404 : 400 });
  }
}
