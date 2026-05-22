"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, ShoppingBag } from "lucide-react";
import CheckoutAddressForm from "@/components/checkout/CheckoutAddressForm";
import CheckoutOrderSummary from "@/components/checkout/CheckoutOrderSummary";
import { getCheckoutTotals } from "@/lib/checkout";
import { loadRazorpayScript, openRazorpayCheckout } from "@/lib/razorpay-client";
import {
  checkoutAddressDefaultValues,
  checkoutAddressSchema,
  formatZodFieldErrors,
  type CheckoutAddressForm,
} from "@/lib/validations/checkout";
import { useCartStore } from "@/store/cart-store";
import type { RazorpayHandlerResponse } from "@/types/razorpay-checkout";

type CreateOrderResponse = {
  mock: boolean;
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  error?: string;
};

export default function CheckoutPageClient() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const [mounted, setMounted] = useState(false);
  const [values, setValues] = useState<CheckoutAddressForm>(checkoutAddressDefaultValues);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutAddressForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMode, setPaymentMode] = useState<"mock" | "razorpay" | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [mounted, items.length, router]);

  const totals = getCheckoutTotals(items);

  const handleChange = (field: keyof CheckoutAddressForm, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const verifyAndRedirect = async (payload: RazorpayHandlerResponse, mock: boolean) => {
    const verifyRes = await fetch("/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const verifyData = await verifyRes.json();

    if (!verifyRes.ok || !verifyData.verified) {
      router.push("/payment/failure?reason=verification_failed");
      return;
    }

    const params = new URLSearchParams({
      order_id: verifyData.orderId,
      payment_id: verifyData.paymentId,
    });
    if (mock) params.set("mock", "1");

    router.push(`/payment/success?${params.toString()}`);
  };

  const handleSubmit = async () => {
    const payload = {
      ...values,
      line2: values.line2?.trim() ? values.line2 : undefined,
    };

    const result = checkoutAddressSchema.safeParse(payload);

    if (!result.success) {
      setErrors(formatZodFieldErrors(result.error));
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: result.data,
          items: items.map(({ id, slug, name, price, currency, quantity, stockQuantity }) => ({
            id,
            slug,
            name,
            price,
            currency,
            quantity,
            stockQuantity,
          })),
        }),
      });

      const orderData: CreateOrderResponse = await orderRes.json();

      if (!orderRes.ok) {
        router.push("/payment/failure?reason=create_order_failed");
        return;
      }

      setPaymentMode(orderData.mock ? "mock" : "razorpay");

      if (orderData.mock) {
        const paymentId = `pay_mock_${Date.now()}`;
        await verifyAndRedirect(
          {
            razorpay_order_id: orderData.orderId,
            razorpay_payment_id: paymentId,
            razorpay_signature: "mock_signature",
          },
          true,
        );
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        router.push("/payment/failure?reason=gateway_unavailable");
        return;
      }

      openRazorpayCheckout({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Bubble Buddy",
        description: `Order ${orderData.orderId}`,
        order_id: orderData.orderId,
        prefill: {
          name: result.data.fullName,
          contact: result.data.phone,
        },
        theme: { color: "#a67c52" },
        handler: async (response) => {
          setIsSubmitting(true);
          await verifyAndRedirect(response, false);
          setIsSubmitting(false);
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
            router.push("/payment/failure?reason=cancelled");
          },
        },
      });
    } catch {
      setIsSubmitting(false);
      router.push("/payment/failure?reason=create_order_failed");
    }
  };

  if (!mounted) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <ShoppingBag className="size-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Redirecting to cart…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {paymentMode === "mock" && (
        <div className="checkout-back-enter rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center text-sm text-amber-900">
          Mock payment mode — Razorpay keys not set. Payments are simulated for testing.
        </div>
      )}

      <div className="checkout-back-enter flex items-center gap-2 rounded-2xl border border-border bg-card/80 px-4 py-3 text-sm text-muted-foreground">
        <CreditCard className="size-4 text-primary" />
        Secure checkout powered by Razorpay
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <CheckoutAddressForm
          values={values}
          errors={errors}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Pay securely"
        />
        <CheckoutOrderSummary items={items} totals={totals} />
      </div>

      <p className="text-center text-xs text-muted-foreground">
        By placing your order you agree to our terms.{" "}
        <Link href="/payment/failure" className="text-primary hover:underline">
          Payment help
        </Link>
      </p>
    </div>
  );
}
