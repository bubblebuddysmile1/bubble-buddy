"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import CheckoutAddressForm from "@/components/checkout/CheckoutAddressForm";
import CheckoutOrderSummary from "@/components/checkout/CheckoutOrderSummary";
import { getCheckoutTotals, generateMockOrderNumber } from "@/lib/checkout";
import {
  checkoutAddressDefaultValues,
  checkoutAddressSchema,
  formatZodFieldErrors,
  type CheckoutAddressForm,
} from "@/lib/validations/checkout";
import { useCartStore } from "@/store/cart-store";

export default function CheckoutPageClient() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const [mounted, setMounted] = useState(false);
  const [values, setValues] = useState<CheckoutAddressForm>(checkoutAddressDefaultValues);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutAddressForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (items.length === 0 && !orderPlaced) {
      router.replace("/cart");
    }
  }, [mounted, items.length, orderPlaced, router]);

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

    await new Promise((resolve) => window.setTimeout(resolve, 900));

    const orderNumber = generateMockOrderNumber();
    setOrderPlaced(orderNumber);
    clearCart();
    setIsSubmitting(false);
  };

  if (!mounted) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="checkout-success-enter mx-auto max-w-lg rounded-[2rem] border border-border bg-card p-10 text-center shadow-xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15">
          <CheckCircle2 className="size-10 text-emerald-600" />
        </div>
        <p className="mt-6 text-xs uppercase tracking-[0.32em] text-primary">Order confirmed</p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">Thank you for your order!</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Order <span className="font-semibold text-foreground">{orderPlaced}</span> has been placed
          successfully (mock checkout).
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/shop"
            className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Continue shopping
          </Link>
          <Link
            href="/orders"
            className="inline-flex rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            View orders
          </Link>
        </div>
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
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
      <CheckoutAddressForm
        values={values}
        errors={errors}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
      <CheckoutOrderSummary items={items} totals={totals} />
    </div>
  );
}
