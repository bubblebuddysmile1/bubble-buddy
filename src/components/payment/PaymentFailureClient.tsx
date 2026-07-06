"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, RotateCcw } from "lucide-react";
import PaymentStatusLayout from "@/components/payment/PaymentStatusLayout";

const REASON_MESSAGES: Record<string, string> = {
  cancelled: "You closed the payment window before completing checkout.",
  verification_failed: "We could not verify your payment. No amount was charged.",
  create_order_failed: "We could not start the payment session. Please try again.",
  gateway_unavailable: "Payment gateway failed to load. Check your connection and retry.",
};

export default function PaymentFailureClient() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") ?? "unknown";
  const orderId = searchParams.get("order_id") ?? "";
  const orderNumber = searchParams.get("order_number") ?? "";
  const redirectToComplete = searchParams.get("redirectToComplete") === "1";
  const email = searchParams.get("email") ?? "";
  const message =
    REASON_MESSAGES[reason] ??
    "Something went wrong during payment. You can try again from checkout.";

  const accountSetupUrl = useMemo(() => {
    const params = new URLSearchParams({
      order_id: orderId,
      payment_id: "",
    });
    if (orderNumber) params.set("order_number", orderNumber);
    if (email) params.set("email", email);
    return `/auth/complete?${params.toString()}`;
  }, [email, orderId, orderNumber]);

  return (
    <PaymentStatusLayout
      variant="failure"
      badge="Payment not completed"
      title="Payment failed or cancelled"
      icon={<AlertCircle className="size-10 text-destructive" />}
      description={
        <>
          <p>{message}</p>
          {redirectToComplete && (
            <div className="mt-3 rounded-2xl bg-primary/10 p-3 text-sm text-primary">
              <p>Your payment status is shown here. You can complete your account setup after reviewing this result.</p>
              <Link
                href={accountSetupUrl}
                className="mt-3 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Complete account setup
              </Link>
            </div>
          )}
          {(orderNumber || orderId) && (
            <div className="mt-6 space-y-3">
              <p className="text-xs text-muted-foreground">Your order was created but payment was not confirmed:</p>
              <div className="rounded-2xl bg-destructive/10 p-4 text-left">
                {orderNumber && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Order #:</span>
                    <span className="font-semibold text-foreground">{orderNumber}</span>
                  </div>
                )}
                {orderId && (
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Ref ID:</span>
                    <span className="font-mono text-sm text-foreground">{orderId}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">You can retry payment or contact support with the order number above.</p>
            </div>
          )}
        </>
      }
      actions={
        <>
          <Link
            href="/checkout"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <RotateCcw className="size-4" />
            Retry Payment
          </Link>
          <Link
            href="/cart"
            className="inline-flex rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            Back to Cart
          </Link>
          <Link
            href="/orders"
            className="inline-flex rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            View Orders
          </Link>
        </>
      }
    />
  );
}
