"use client";

import Link from "next/link";
import { Clock3 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import PaymentStatusLayout from "@/components/payment/PaymentStatusLayout";

export default function PaymentPendingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order_number") ?? "";
  const paymentId = searchParams.get("payment_id") ?? "";

  useEffect(() => {
    if (!orderNumber) return;

    let attempts = 0;
    let isActive = true;
    const checkPayment = async () => {
      attempts += 1;
      try {
        const response = await fetch("/api/payments/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderNumber, paymentId: paymentId || undefined }),
        });
        if (!response.ok) return;

        const result = (await response.json()) as { status?: string; paymentId?: string };
        if (!isActive) return;

        if (result.status === "paid") {
          const params = new URLSearchParams({
            order_number: orderNumber,
            payment_id: result.paymentId || paymentId,
          });
          router.replace(`/payment/success?${params.toString()}`);
        } else if (result.status === "failed") {
          const params = new URLSearchParams({
            reason: "payment_declined",
            order_number: orderNumber,
          });
          router.replace(`/payment/failure?${params.toString()}`);
        }
      } catch (error) {
        console.error("[payment-pending] Failed to refresh status:", error);
      }
    };

    void checkPayment();
    const interval = window.setInterval(() => {
      if (attempts >= 6) {
        window.clearInterval(interval);
        return;
      }
      void checkPayment();
    }, 10000);

    return () => {
      isActive = false;
      window.clearInterval(interval);
    };
  }, [orderNumber, paymentId, router]);

  return (
    <PaymentStatusLayout
      variant="pending"
      badge="Payment status pending"
      title="We are confirming your payment"
      icon={<Clock3 className="size-10 text-amber-600" />}
      description={
        <>
          <p>
            Your bank or payment app may have debited the amount, but the gateway has not
            confirmed the final status yet. Please do not pay again while this is being checked.
          </p>
          {(orderNumber || paymentId) && (
            <div className="mt-6 rounded-2xl bg-muted p-4 text-left">
              {orderNumber && (
                <p className="text-sm">
                  Order reference: <span className="font-semibold text-foreground">{orderNumber}</span>
                </p>
              )}
              {paymentId && (
                <p className="mt-2 break-all text-sm">
                  Payment reference: <span className="font-mono text-foreground">{paymentId}</span>
                </p>
              )}
            </div>
          )}
          <p className="mt-4">
            Check your order status again shortly. If it remains pending or the debit is not reversed,
            contact support with these references.
          </p>
        </>
      }
      actions={
        <>
          <Link
            href="/orders"
            className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            View Orders
          </Link>
          <Link
            href="/contact-us"
            className="inline-flex rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            Contact Support
          </Link>
        </>
      }
    />
  );
}
