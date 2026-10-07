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
      const razorpay = createRazorpayClient();
      let callbackPaymentStatus: string | null = null;
      let orderPaymentsFetched = false;

      try {
        const callbackPayment = await razorpay.payments.fetch(razorpay_payment_id);
        if (callbackPayment.order_id !== razorpay_order_id) {
          return NextResponse.json({ error: "Payment does not match this order." }, { status: 400 });
        }
        callbackPaymentStatus = callbackPayment.status;
        paymentSuccessful =
          callbackPayment.status === "captured" || callbackPayment.status === "authorized";
        paymentMethod = mapRazorpayPaymentMethod(callbackPayment.method);
      } catch (error) {
        console.error("[payments/verify] Failed to fetch callback payment:", error);
        paymentFetchFailed = true;
      }

      if (!paymentSuccessful) {
        try {
          const { items: payments } = await razorpay.orders.fetchPayments(razorpay_order_id);
          orderPaymentsFetched = true;
          const orderPayments = payments.filter((payment) => payment.order_id === razorpay_order_id);
          const successfulPayment = orderPayments.find(
            (candidate) => candidate.status === "captured" || candidate.status === "authorized",
          );

          if (successfulPayment) {
            paymentSuccessful = true;
            paymentMethod = mapRazorpayPaymentMethod(successfulPayment.method);
            confirmedPaymentId = successfulPayment.id;
            confirmedPaymentSignature =
              successfulPayment.id === razorpay_payment_id ? razorpay_signature : null;
          } else if (
            callbackPaymentStatus === "failed" &&
            orderPayments.length > 0 &&
            orderPayments.every((payment) => payment.status === "failed")
          ) {
            paymentPending = false;
          } else {
            paymentPending = true;
          }
        } catch (error) {
          console.error("[payments/verify] Failed to fetch order payment status:", error);
          paymentFetchFailed = true;
          paymentPending = callbackPaymentStatus !== "failed";
        }
      }

      if (!paymentSuccessful && callbackPaymentStatus === "failed" && !orderPaymentsFetched) {
        paymentPending = true;
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
