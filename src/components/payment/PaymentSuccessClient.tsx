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
  const orderNumber = searchParams.get("order_number") ?? "";
  const paymentId = searchParams.get("payment_id") ?? "";
  const mock = searchParams.get("mock") === "1";

  useEffect(() => {
    // Clear cart on successful payment
    if (orderNumber || orderId) {
      clearCart();
    }
  }, [orderNumber, orderId, clearCart]);

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
          <p>Your payment was verified successfully. We will deliver to your shipping address soon.</p>
          {(orderNumber || orderId) && (
            <div className="mt-6 space-y-3">
              <div className="rounded-2xl bg-muted/60 p-4 text-left">
                {orderNumber && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Order #:</span>
                    <span className="font-semibold text-foreground">{orderNumber}</span>
                  </div>
                )}
                {orderId && (
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Payment Ref:</span>
                    <span className="font-mono text-sm text-foreground">{orderId}</span>
                  </div>
                )}
                {paymentId && (
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Transaction:</span>
                    <span className="font-mono text-sm text-foreground">{paymentId}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Check your email for order confirmation and tracking details.</p>
            </div>
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
              {copied ? "Copied!" : "Copy Order ID"}
            </button>
          )}
          <Link
            href="/orders"
            className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Track Order
          </Link>
          <Link
            href="/shop"
            className="inline-flex rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            Continue Shopping
          </Link>
        </>
      }
    />
  );
}
