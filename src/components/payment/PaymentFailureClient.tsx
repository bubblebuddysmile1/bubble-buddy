"use client";

import Link from "next/link";
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
  const message =
    REASON_MESSAGES[reason] ??
    "Something went wrong during payment. You can try again from checkout.";

  return (
    <PaymentStatusLayout
      variant="failure"
      badge="Payment not completed"
      title="Payment failed or cancelled"
      icon={<AlertCircle className="size-10 text-destructive" />}
      description={message}
      actions={
        <>
          <Link
            href="/checkout"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <RotateCcw className="size-4" />
            Try again
          </Link>
          <Link
            href="/cart"
            className="inline-flex rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            Back to cart
          </Link>
        </>
      }
    />
  );
}
