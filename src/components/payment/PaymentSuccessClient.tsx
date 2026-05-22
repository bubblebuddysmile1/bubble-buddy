"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Copy } from "lucide-react";
import PaymentStatusLayout from "@/components/payment/PaymentStatusLayout";
import { useCartStore } from "@/store/cart-store";

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const clearCart = useCartStore((s) => s.clearCart);
  const [copied, setCopied] = useState(false);

  const orderId = searchParams.get("order_id") ?? "";
  const paymentId = searchParams.get("payment_id") ?? "";
  const mock = searchParams.get("mock") === "1";

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const copyOrderId = async () => {
    if (!orderId) return;
    await navigator.clipboard.writeText(orderId);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PaymentStatusLayout
      variant="success"
      badge="Payment successful"
      title="Thank you! Your order is confirmed"
      icon={<CheckCircle2 className="size-10 text-emerald-600" />}
      description={
        <>
          {mock && (
            <span className="mb-3 block rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-800">
              Mock payment mode — no real charge
            </span>
          )}
          Your payment was verified successfully. We will deliver to your shipping address soon.
          {orderId && (
            <span className="mt-4 block rounded-2xl bg-muted/60 px-4 py-3 font-mono text-xs text-foreground">
              Order: {orderId}
              {paymentId && (
                <>
                  <br />
                  Payment: {paymentId}
                </>
              )}
            </span>
          )}
        </>
      }
      actions={
        <>
          {orderId && (
            <button
              type="button"
              onClick={copyOrderId}
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              <Copy className="size-4" />
              {copied ? "Copied!" : "Copy order ID"}
            </button>
          )}
          <Link
            href="/orders"
            className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            View orders
          </Link>
          <Link
            href="/shop"
            className="inline-flex rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            Continue shopping
          </Link>
        </>
      }
    />
  );
}
