import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";
import { issueVerificationOtp } from "@/lib/account-auth";
import { persistOrderAfterPayment, confirmOrder, cancelOrder } from "@/lib/orders";
import { isMockPaymentMode, createRazorpayClient } from "@/lib/razorpay";
import { verifyPaymentSchema } from "@/lib/validations/payment";
import { prisma } from "@/lib/prisma";
import { notifyOrderConfirmation, notifyPaymentFailure } from "@/lib/order-notifications";
import { sendOrderConfirmationEmail, sendPaymentFailureEmail } from "@/lib/order-emails";

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
      redeemPoints = 0,
    } = parsed.data;

    // Verify signature
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
    const authUser = user
      ? await prisma.user.findUnique({
          where: { id: user.id },
          select: { accountStatus: true, email: true },
        })
      : null;
    const verificationRequired = authUser?.accountStatus !== "ACTIVE";

    // Create order with PENDING status
    const savedOrder = await persistOrderAfterPayment({
      razorpayOrderId: razorpay_order_id,
      address,
      items,
      user,
      couponCode,
      redeemPoints,
    });

    // Check payment status from Razorpay
    let paymentSuccessful = false;
    let paymentFetchFailed = false;

    if (isMockPaymentMode()) {
      paymentSuccessful = true;
    } else {
      try {
        const razorpay = createRazorpayClient();
        const payment = await razorpay.payments.fetch(razorpay_payment_id);
        paymentSuccessful = payment.status === "captured" || payment.status === "authorized";
      } catch (error) {
        console.error("[payments/verify] Failed to fetch payment status:", error);
        paymentFetchFailed = true;
      }
    }

    // Confirm or cancel order based on payment status. If the payment fetch fails after
    // the Razorpay signature is already verified, use the signature as the primary proof
    // and confirm the order rather than cancelling a potentially valid payment.
    let finalOrder = savedOrder;
    if (paymentSuccessful || paymentFetchFailed) {
      finalOrder = await confirmOrder(razorpay_order_id, razorpay_payment_id, razorpay_signature);
      await notifyOrderConfirmation(finalOrder.orderNumber);
      if (verificationRequired && user?.id) {
        await issueVerificationOtp(user.id, authUser?.email ?? address.email ?? null).catch((error) => {
          console.error("[payments/verify] Failed to issue verification OTP", error);
        });
      }
    } else {
      finalOrder = await cancelOrder(razorpay_order_id);
      await notifyPaymentFailure(finalOrder.orderNumber);
      return NextResponse.json({
        verified: false,
        mock: isMockPaymentMode(),
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        orderNumber: finalOrder.orderNumber,
        dbOrderId: finalOrder.id,
        error: "Payment was not successful",
      }, { status: 400 });
    }

    return NextResponse.json({
      verified: true,
      mock: isMockPaymentMode(),
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      orderNumber: finalOrder.orderNumber,
      dbOrderId: finalOrder.id,
      verificationRequired,
      email: authUser?.email ?? address.email ?? null,
    });
  } catch (error) {
    console.error("[payments/verify]", error);
    return NextResponse.json(
      { error: "Unable to verify payment. Please contact support." },
      { status: 500 },
    );
  }
}
