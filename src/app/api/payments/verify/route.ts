import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";
import { issueVerificationOtp } from "@/lib/account-auth";
import {
  persistOrderAfterPayment,
  confirmOrder,
  cancelOrder,
  mapRazorpayPaymentMethod,
} from "@/lib/orders";
import { isMockPaymentMode, createRazorpayClient } from "@/lib/razorpay";
import { verifyPaymentSchema } from "@/lib/validations/payment";
import { prisma } from "@/lib/prisma";
import { notifyOrderConfirmation, notifyPaymentFailure } from "@/lib/order-notifications";

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
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      address,
      items,
      user,
      couponCode,
      redeemPoints,
    });

    // Check payment status from Razorpay
    let paymentSuccessful = false;
    let paymentFetchFailed = false;
    let paymentPending = false;
    let paymentMethod: ReturnType<typeof mapRazorpayPaymentMethod> = null;
    let confirmedPaymentId = razorpay_payment_id;
    let confirmedPaymentSignature: string | null = razorpay_signature;
    if (isMockPaymentMode()) {
      paymentSuccessful = true;
    } else {
      try {
        const razorpay = createRazorpayClient();
        const { items: payments } = await razorpay.orders.fetchPayments(razorpay_order_id);
        const orderPayments = payments.filter((payment) => payment.order_id === razorpay_order_id);
        const payment =
          orderPayments.find(
            (candidate) => candidate.status === "captured" || candidate.status === "authorized",
          ) ??
          orderPayments.find((candidate) => candidate.id === razorpay_payment_id) ??
          orderPayments.sort((left, right) => right.created_at - left.created_at)[0];

        if (!payment) {
          paymentPending = true;
        } else {
          paymentSuccessful = payment.status === "captured" || payment.status === "authorized";
          paymentMethod = mapRazorpayPaymentMethod(payment.method);
          paymentPending = !paymentSuccessful && payment.status !== "failed";
          confirmedPaymentId = payment.id;
          confirmedPaymentSignature = payment.id === razorpay_payment_id ? razorpay_signature : null;
        }
      } catch (error) {
        console.error("[payments/verify] Failed to fetch order payment status:", error);
        paymentFetchFailed = true;
      }
    }

    // Confirm only when Razorpay explicitly reports a successful payment. A valid
    // signature alone does not prove capture if the payment lookup failed.
    let finalOrder = savedOrder;
    if (paymentSuccessful) {
      finalOrder = await confirmOrder(
        razorpay_order_id,
        confirmedPaymentId,
        confirmedPaymentSignature,
        paymentMethod,
      );
      await notifyOrderConfirmation(finalOrder.orderNumber);
      if (verificationRequired && user?.id) {
        await issueVerificationOtp(user.id, authUser?.email ?? address.email ?? null).catch((error) => {
          console.error("[payments/verify] Failed to issue verification OTP", error);
        });
      }
    } else if (paymentFetchFailed || paymentPending) {
      return NextResponse.json({
        verified: false,
        pending: true,
        mock: false,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        orderNumber: savedOrder.orderNumber,
        dbOrderId: savedOrder.id,
        error: "Payment was received but its final status is not available yet. Do not pay again while we confirm it.",
        reason: "payment_status_pending",
      }, { status: 202 });
    } else {
      const cancelledOrder = await cancelOrder(razorpay_order_id);
      if (cancelledOrder.paymentStatus === "PAID") {
        return NextResponse.json({
          verified: true,
          mock: isMockPaymentMode(),
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          orderNumber: cancelledOrder.orderNumber,
          dbOrderId: cancelledOrder.id,
          verificationRequired,
          email: authUser?.email ?? address.email ?? null,
        });
      }
      await notifyPaymentFailure(cancelledOrder.orderNumber);
      return NextResponse.json({
        verified: false,
        mock: isMockPaymentMode(),
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        orderNumber: cancelledOrder.orderNumber,
        dbOrderId: cancelledOrder.id,
        error: "Razorpay reported that this payment failed.",
        reason: "payment_declined",
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
