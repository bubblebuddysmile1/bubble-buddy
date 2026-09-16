"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, RotateCcw, ShieldCheck, ShoppingBag } from "lucide-react";
import CheckoutAddressFormComponent from "@/components/checkout/CheckoutAddressForm";
import CheckoutConfirmationSheet from "@/components/checkout/CheckoutConfirmationSheet";
import CheckoutOrderSummary from "@/components/checkout/CheckoutOrderSummary";
import { getCheckoutTotals } from "@/lib/checkout";
import { formatCartMoney } from "@/lib/cart";
import { loadRazorpayScript, openRazorpayCheckout } from "@/lib/razorpay-client";
import { formatLoyaltyPoints, getMaxRedeemablePoints, loyaltyDiscountFromRedeem } from "@/lib/loyalty";
import * as CheckoutValidation from "@/lib/validations/checkout";
import { useCartStore } from "@/store/cart-store";
import type { RazorpayHandlerResponse } from "@/types/razorpay-checkout";

type CheckoutAddressValues = typeof CheckoutValidation.checkoutAddressDefaultValues;

type CheckoutPageClientProps = {
  loyaltyPoints: number;
};

type CreateOrderResponse = {
  mock: boolean;
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  error?: string;
  reason?: string;
};

type AppliedPromotion = {
  code: string;
  title: string;
  discount: number;
  discountType: string;
  discountValue: number;
  minOrderAmount: number;
};

export default function CheckoutPageClient({ loyaltyPoints }: CheckoutPageClientProps) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const [values, setValues] = useState<CheckoutAddressValues>(CheckoutValidation.checkoutAddressDefaultValues);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutAddressValues, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMode, setPaymentMode] = useState<"mock" | "razorpay" | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [pendingAddress, setPendingAddress] = useState<CheckoutAddressValues | null>(null);
  const [confirmationError, setConfirmationError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [appliedPromotion, setAppliedPromotion] = useState<AppliedPromotion | null>(null);
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [redeemError, setRedeemError] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0 && !isSubmitting && !isConfirmationOpen) {
      router.replace("/cart");
    }
  }, [items.length, isSubmitting, isConfirmationOpen, router]);

  const promotionDefinition = useMemo(
    () =>
      appliedPromotion
        ? {
          discountType: appliedPromotion.discountType as "PERCENTAGE" | "FIXED",
          discountValue: appliedPromotion.discountValue,
          minOrderAmount: appliedPromotion.minOrderAmount,
        }
        : undefined,
    [appliedPromotion],
  );

  const baseTotals = useMemo(
    () => getCheckoutTotals(items, promotionDefinition),
    [items, promotionDefinition],
  );

  const maxRedeemablePoints = useMemo(
    () => getMaxRedeemablePoints(loyaltyPoints, Math.max(0, baseTotals.subtotal - baseTotals.discount)),
    [loyaltyPoints, baseTotals.subtotal, baseTotals.discount],
  );

  const effectiveRedeemPoints = Math.min(Math.max(redeemPoints, 0), maxRedeemablePoints);
  const totals = useMemo(
    () => getCheckoutTotals(items, promotionDefinition, loyaltyDiscountFromRedeem(effectiveRedeemPoints)),
    [items, promotionDefinition, effectiveRedeemPoints],
  );

  const handleChange = (field: keyof CheckoutAddressValues, value: string) => {
    if (field === "postalCode") {
      const nextValue = value;
      setValues((prev) => ({
        ...prev,
        postalCode: nextValue,
        city: "",
        state: "",
        country: "",
      }));

      const trimmed = nextValue.trim();
      if (!/^[0-9]{6,}$/.test(trimmed)) {
        if (isConfirmationOpen) {
          setIsConfirmationOpen(false);
          setPendingAddress(null);
          setConfirmationError(null);
        }
        if (errors[field]) {
          setErrors((prev: Partial<Record<keyof CheckoutAddressValues, string>>) => {
            const next = { ...prev };
            delete next[field];
            return next;
          });
        }
        return;
      }

      window.setTimeout(async () => {
        try {
          const response = await fetch(`https://api.postalpincode.in/pincode/${trimmed}`, {
            headers: { Accept: "application/json" },
          });

          if (!response.ok) {
            return;
          }

          const result = (await response.json()) as Array<{
            PostOffice?: Array<{ District?: string; State?: string; Country?: string; Name?: string }>;
          }>;

          const postOffice = result?.[0]?.PostOffice?.[0];
          if (!postOffice) {
            setValues((prev) => ({
              ...prev,
              city: "",
              state: "",
              country: "",
            }));
            return;
          }

          setValues((prev) => ({
            ...prev,
            city: postOffice.District || postOffice.Name || "",
            state: postOffice.State || "",
            country: postOffice.Country || prev.country || "India",
          }));
        } catch {
          // Ignore lookup errors silently and allow manual edits.
        }
      }, 500);

      if (isConfirmationOpen) {
        setIsConfirmationOpen(false);
        setPendingAddress(null);
        setConfirmationError(null);
      }
      if (errors[field]) {
        setErrors((prev: Partial<Record<keyof CheckoutAddressValues, string>>) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
      return;
    }

    setValues((prev) => ({ ...prev, [field]: value }));
    if (isConfirmationOpen) {
      setIsConfirmationOpen(false);
      setPendingAddress(null);
      setConfirmationError(null);
    }
    if (errors[field]) {
      setErrors((prev: Partial<Record<keyof CheckoutAddressValues, string>>) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleCancelConfirmation = () => {
    setIsConfirmationOpen(false);
    setPendingAddress(null);
    setConfirmationError(null);
  };

  const verifyAndRedirect = async (
    payload: RazorpayHandlerResponse,
    mock: boolean,
    address: CheckoutAddressValues,
  ) => {
    const verifyRes = await fetch("/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        address,
        items: items.map(({ id, slug, name, price, currency, quantity, stockQuantity }) => ({
          id,
          slug,
          name,
          price,
          currency,
          quantity,
          stockQuantity,
        })),
        couponCode: appliedPromotion?.code,
        redeemPoints: effectiveRedeemPoints,
      }),
    });

    const verifyData = await verifyRes.json();

    if (!verifyRes.ok || !verifyData.verified) {
      const failParams = new URLSearchParams({
        reason: verifyData.reason || "verification_failed",
        order_id: verifyData.orderId || "",
      });
      if (verifyData.orderNumber) failParams.set("order_number", verifyData.orderNumber);
      if (mock) failParams.set("mock", "1");
      if (verifyData.verificationRequired) {
        failParams.set("redirectToComplete", "1");
        if (verifyData.email) failParams.set("email", verifyData.email);
      }
      setIsSubmitting(false);
      router.push(`/payment/failure?${failParams.toString()}`);
      return;
    }

    const params = new URLSearchParams({
      order_id: verifyData.orderId,
      payment_id: verifyData.paymentId,
    });
    if (verifyData.orderNumber) params.set("order_number", verifyData.orderNumber);
    if (mock) params.set("mock", "1");
    if (verifyData.verificationRequired) {
      params.set("redirectToComplete", "1");
      if (verifyData.email) params.set("email", verifyData.email);
    }

    setIsSubmitting(false);
    setIsConfirmationOpen(false);

    router.push(`/payment/success?${params.toString()}`);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Enter a coupon code to apply.");
      setCouponSuccess(null);
      setAppliedPromotion(null);
      return;
    }

    setCouponError(null);
    setCouponSuccess(null);
    setIsApplyingCoupon(true);

    try {
      const response = await fetch("/api/promotions/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode,
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

      const data = await response.json();
      if (!response.ok) {
        setCouponError(data.message ?? data.error ?? "Unable to apply coupon.");
        setAppliedPromotion(null);
        return;
      }

      setAppliedPromotion({
        code: data.code,
        title: data.title,
        discount: data.discount,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrderAmount: data.minOrderAmount,
      });
      setCouponSuccess(`Coupon applied: ${data.code}`);
      setCouponError(null);
    } catch {
      setCouponError("Unable to apply coupon. Please try again.");
      setAppliedPromotion(null);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleSubmit = () => {
    const payload = {
      ...values,
      line2: values.line2?.trim() ? values.line2 : undefined,
    };

    const result = CheckoutValidation.checkoutAddressSchema.safeParse(payload);

    if (!result.success) {
      setErrors(CheckoutValidation.formatZodFieldErrors(result.error));
      return;
    }

    setErrors({});
    setPendingAddress(result.data);
    setIsConfirmationOpen(true);
    setConfirmationError(null);
  };

  const handleConfirmPayment = async () => {
    if (!pendingAddress) {
      setConfirmationError("Please confirm your delivery address before payment.");
      return;
    }

    setConfirmationError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        address: pendingAddress,
        items: items.map(({ id, slug, name, price, currency, quantity, stockQuantity }) => ({
          id,
          slug,
          name,
          price,
          currency,
          quantity,
          stockQuantity,
        })),
        couponCode: appliedPromotion?.code,
        redeemPoints: effectiveRedeemPoints,
      };

      console.log("[checkout] Sending create-order payload:", payload);

      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const orderData: CreateOrderResponse = await orderRes.json();

      if (!orderRes.ok) {
        console.error("[checkout] Create-order failed:", {
          status: orderRes.status,
          error: orderData,
        });
        setIsSubmitting(false);
        const failReason = orderData?.error ? encodeURIComponent(String(orderData.error)) : "create_order_failed";
        router.push(`/payment/failure?reason=${failReason}`);
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
          pendingAddress,
        );
        setIsConfirmationOpen(false);
        setIsSubmitting(false);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setIsSubmitting(false);
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
          name: pendingAddress.fullName,
          contact: pendingAddress.phone,
        },
        theme: { color: "#a67c52" },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
          emi: true,
        },
        handler: async (response) => {
          setIsSubmitting(true);
          await verifyAndRedirect(response, false, pendingAddress);
          setIsSubmitting(false);
        },
        modal: {
          backdrop: true,
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
  

  if (items.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <ShoppingBag className="size-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Redirecting to cart…</p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-6xl space-y-6 px-3 sm:px-4 lg:px-6">
      {paymentMode === "mock" && (
        <div className="checkout-back-enter rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center text-sm text-amber-900">
          Mock payment mode — Razorpay keys not set. Payments are simulated for testing.
        </div>
      )}

      <div className="checkout-back-enter flex items-center gap-2 rounded-2xl border border-border bg-card/80 px-4 py-3 text-sm text-muted-foreground">
        <CreditCard className="size-4 text-primary" />
        Secure checkout powered by Razorpay
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="flex items-center gap-3 rounded-3xl border border-border bg-card p-4 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Secure payment</p>
            <p className="text-xs text-muted-foreground">Protected checkout with trusted gateways</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-3xl border border-border bg-card p-4 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700">
            <ShoppingBag className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Fast delivery</p>
            <p className="text-xs text-muted-foreground">Get your items delivered quickly and safely</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-3xl border border-border bg-card p-4 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <RotateCcw className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Easy returns</p>
            <p className="text-xs text-muted-foreground">Hassle-free returns and order support</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-3xl border border-border bg-card p-4 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CreditCard className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Receive Card Payments</p>
            <p className="text-xs text-muted-foreground">Accept credit and debit card payments securely</p>
          </div>
        </div>
      </div>

      <CheckoutConfirmationSheet
        open={isConfirmationOpen}
        onOpenChange={(open) => {
          if (!open) handleCancelConfirmation();
          setIsConfirmationOpen(open);
        }}
        address={pendingAddress ?? CheckoutValidation.checkoutAddressDefaultValues}
        items={items}
        totals={totals}
        couponCode={appliedPromotion?.code ?? null}
        redeemPoints={effectiveRedeemPoints}
        isSubmitting={isSubmitting}
        error={confirmationError}
        onEdit={handleCancelConfirmation}
        onConfirm={handleConfirmPayment}
      />

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <CheckoutAddressFormComponent
          values={values}
          errors={errors}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Review order"
        />
        <div className="space-y-4">
          <section className="rounded-4xl border border-border bg-card p-6 shadow-xl">
            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.28em] text-primary">Delivery address</p>
              <h2 className="mt-2 text-lg font-semibold text-foreground">Your delivery details</h2>
            </div>
            <div className="space-y-3 rounded-3xl border border-border/50 bg-background/80 p-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="mt-1 font-medium text-foreground">{values.fullName || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="mt-1 font-semibold text-primary text-base">{values.email || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone number</p>
                <p className="mt-1 font-semibold text-primary text-base">{values.phone || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="mt-1 text-foreground">
                  {values.line1 || "—"}{values.line2 && `, ${values.line2}`}
                </p>
                <p className="text-foreground">
                  {values.city || "—"}{values.state && `, ${values.state}`} {values.postalCode || "—"}
                </p>
              </div>
            </div>
          </section>
          
          <CheckoutOrderSummary items={items} totals={totals} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-4xl border border-border bg-card p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-primary">Coupon code</p>
              <h2 className="mt-2 text-lg font-semibold text-foreground">Unlock extra savings</h2>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              type="text"
              value={couponCode}
              onChange={(event) => {
                setCouponCode(event.target.value);
                setCouponError(null);
                setCouponSuccess(null);
                if (appliedPromotion && event.target.value.trim().toUpperCase() !== appliedPromotion.code) {
                  setAppliedPromotion(null);
                }
              }}
              placeholder="Enter your coupon"
              className="w-full rounded-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={isApplyingCoupon}
              className="inline-flex h-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-background transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isApplyingCoupon ? "Applying…" : "Apply"}
            </button>
          </div>
          {couponError && <p className="mt-3 text-sm text-destructive">{couponError}</p>}
          {couponSuccess && <p className="mt-3 text-sm text-emerald-700">{couponSuccess}</p>}
          {appliedPromotion && (
            <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {appliedPromotion.title} — saved {appliedPromotion.discountType === "PERCENTAGE" ? `${appliedPromotion.discountValue}%` : formatCartMoney(appliedPromotion.discountValue, totals.currency)} off.
            </div>
          )}
        </section>
        
        <section className="rounded-4xl border border-border bg-card p-6 shadow-xl">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.28em] text-primary">Loyalty rewards</p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">Redeem your points</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl border border-border bg-background/80 p-4 text-sm">
              <p className="text-muted-foreground">Available points</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{formatLoyaltyPoints(loyaltyPoints)}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                1 point = {formatCartMoney(0.01, totals.currency)}
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground" htmlFor="redeemPoints">
                Points to redeem
              </label>
              <input
                id="redeemPoints"
                type="number"
                min={0}
                max={maxRedeemablePoints}
                value={redeemPoints}
                onChange={(event) => {
                  const value = Math.max(0, Number(event.target.value));
                  setRedeemPoints(Number.isNaN(value) ? 0 : value);
                  setRedeemError(null);
                }}
                placeholder={`Max ${maxRedeemablePoints}`}
                className="w-full rounded-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
              />
              {redeemError && <p className="text-sm text-destructive">{redeemError}</p>}
              <p className="text-xs text-muted-foreground">
                You can redeem up to {formatLoyaltyPoints(maxRedeemablePoints)} on this order.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Redeeming {redeemPoints} points gives you {formatCartMoney(loyaltyDiscountFromRedeem(effectiveRedeemPoints), totals.currency)} off.
          </div>
        </section>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        By placing your order you agree to our terms.{" "}
        <Link href="/payment/failure" className="text-primary hover:underline">
          Payment help
        </Link>
      </p>
      </div>
    </div>
  );
}
