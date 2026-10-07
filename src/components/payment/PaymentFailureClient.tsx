"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, RotateCcw } from "lucide-react";
import PaymentStatusLayout from "@/components/payment/PaymentStatusLayout";
import { trackPaymentFailure } from "@/lib/analytics";

const REASON_MESSAGES: Record<string, string> = {
  cancelled: "You closed the payment window before completing checkout.",
  payment_declined: "The payment provider reported that this payment failed. If your bank shows a debit, it may be a temporary authorization and should be reversed by your bank or payment provider.",
  verification_failed: "We could not verify your payment. If your bank shows a debit, it may be a temporary authorization; please contact support with your order reference before trying again.",
  payment_status_unavailable: "We could not confirm your payment status. Please retry or contact support if you were charged.",
  create_order_failed: "We could not start the payment session. Please try again.",
  gateway_unavailable: "Payment gateway failed to load. Check your connection and retry.",
};

export default function PaymentFailureClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") ?? "unknown";
  const orderId = searchParams.get("order_id") ?? "";
  const paymentId = searchParams.get("payment_id") ?? "";
  const orderNumber = searchParams.get("order_number") ?? "";
  const paymentCheckUrl = useMemo(() => {
    if (!orderNumber) return null;
    const params = new URLSearchParams({ order_number: orderNumber });
    if (paymentId) params.set("payment_id", paymentId);
    return `/payment/pending?${params.toString()}`;
  }, [orderNumber, paymentId]);
  const redirectToComplete = searchParams.get("redirectToComplete") === "1";
  const email = searchParams.get("email") ?? "";
  const message =
    REASON_MESSAGES[reason] ??
    "Something went wrong during payment. You can try again from checkout.";

  useEffect(() => {
    if (!orderNumber) return;

    let active = true;
    void fetch("/api/payments/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNumber, paymentId: paymentId || undefined }),
    })
      .then(async (response) => {
        if (!response.ok) return;
        return (await response.json()) as { status?: string; paymentId?: string };
      })
      .then((result) => {
        if (!active || !result) return;
        if (result.status === "paid") {
          const params = new URLSearchParams({
            order_number: orderNumber,
            payment_id: result.paymentId || paymentId,
          });
          router.replace(`/payment/success?${params.toString()}`);
        } else if (result.status === "pending") {
          router.replace(paymentCheckUrl ?? "/payment/pending");
        }
      })
      .catch((error) => {
        console.error("[payment-failure] Failed to reconcile order status:", error);
      });

    return () => {
      active = false;
    };
  }, [orderNumber, paymentCheckUrl, paymentId, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.sessionStorage.getItem("bubble-buddy-last-checkout");
      if (!raw) {
        trackPaymentFailure(orderId || orderNumber || null, reason);
        return;
      }

      const payload = JSON.parse(raw) as {
        orderId?: string;
        currency?: string;
        value?: number;
        items?: Array<{ id: number | string; name: string; price: number; quantity: number; currency?: string; category?: string | null }>;
      };

      trackPaymentFailure(payload.orderId || orderId || orderNumber || null, reason, payload.currency, payload.value, payload.items ?? []);
    } catch {
      trackPaymentFailure(orderId || orderNumber || null, reason);
    }
  }, [orderId, orderNumber, reason]);

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
          {paymentCheckUrl && (
            <Link
              href={paymentCheckUrl}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Check Payment Status
            </Link>
          )}
          {!paymentCheckUrl && (
            <Link
              href="/checkout"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <RotateCcw className="size-4" />
              Retry Payment
            </Link>
          )}
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
