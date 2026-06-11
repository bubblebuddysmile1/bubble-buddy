import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";
import { notifyOrderStatusUpdate } from "@/lib/order-notifications";
import { logActivity } from "@/lib/activity-log";

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

    const { orderId, status } = parsed.data;
    const order = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          status,
          paymentStatus: status === "RETURNED" ? "REFUNDED" : status === "CANCELLED" ? "FAILED" : undefined,
        },
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
