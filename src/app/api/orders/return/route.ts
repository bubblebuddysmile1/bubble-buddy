import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

const returnRequestSchema = z.object({
  orderNumber: z.string().min(1),
  reason: z.string().min(10),
});

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const payload = verifyAuthToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = returnRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid return request payload." }, { status: 400 });
    }

    const { orderNumber, reason } = parsed.data;
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      select: { id: true, userId: true, status: true },
    });

    if (!order || order.userId !== payload.id) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    if (order.status !== "DELIVERED") {
      return NextResponse.json({ error: "Return requests are only allowed for delivered orders." }, { status: 400 });
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: order.id },
        data: {
          status: "RETURN_REQUESTED",
          returnRequestedAt: new Date(),
          returnReason: reason,
        },
      });

      await tx.orderTrackingEvent.create({
        data: {
          orderId: updated.id,
          status: "RETURN_REQUESTED",
          description: "Customer requested a return for this order.",
        },
      });

      return updated;
    });

    return NextResponse.json({ id: updatedOrder.id, status: updatedOrder.status });
  } catch (error) {
    console.error("[api/orders/return]", error);
    return NextResponse.json({ error: "Unable to create return request." }, { status: 500 });
  }
}
