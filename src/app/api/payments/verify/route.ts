import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";
import { persistOrderAfterPayment } from "@/lib/orders";
import { isMockPaymentMode } from "@/lib/razorpay";
import { verifyPaymentSchema } from "@/lib/validations/payment";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = verifyPaymentSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payment verification payload." }, { status: 400 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      address,
      items,
      couponCode,
    } = parsed.data;

    if (isMockPaymentMode()) {
      if (!razorpay_order_id.startsWith("order_mock_")) {
        return NextResponse.json({ error: "Invalid mock order." }, { status: 400 });
      }
    } else {
      const secret = process.env.RAZORPAY_KEY_SECRET;
      if (!secret) {
        return NextResponse.json({ error: "Payment verification is not configured." }, { status: 500 });
      }

      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
      }
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    const user = token ? verifyAuthToken(token) : null;

    const savedOrder = await persistOrderAfterPayment({
      razorpayOrderId: razorpay_order_id,
      address,
      items,
      user,
      couponCode,
    });

    return NextResponse.json({
      verified: true,
      mock: isMockPaymentMode(),
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      orderNumber: savedOrder.orderNumber,
      dbOrderId: savedOrder.id,
    });
  } catch (error) {
    console.error("[payments/verify]", error);
    return NextResponse.json(
      { error: "Unable to verify payment. Please contact support." },
      { status: 500 },
    );
  }
}
