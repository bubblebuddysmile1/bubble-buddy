"use client";

import { MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import CheckoutField from "@/components/checkout/CheckoutField";
import type { CheckoutAddressForm } from "@/lib/validations/checkout";

type CheckoutAddressFormProps = {
  values: CheckoutAddressForm;
  errors: Partial<Record<keyof CheckoutAddressForm, string>>;
  onChange: (field: keyof CheckoutAddressForm, value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitLabel?: string;
};

export default function CheckoutAddressForm({
  values,
  errors,
  onChange,
  onSubmit,
  isSubmitting,
  submitLabel = "Place order",
}: CheckoutAddressFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="checkout-form-enter space-y-6 rounded-[2rem] border border-border bg-card p-6 shadow-lg sm:p-8"
      noValidate
    >
      <div className="flex items-center gap-3 border-b border-border pb-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
          <MapPin className="size-5 text-primary" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-primary">Delivery</p>
          <h2 className="text-xl font-semibold text-foreground">Shipping address</h2>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <CheckoutField
          id="fullName"
          label="Full name"
          placeholder="kamyar khan"
          value={values.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
          error={errors.fullName}
          className="sm:col-span-2"
          autoComplete="name"
        />
        <CheckoutField
          id="phone"
          label="Phone"
          type="tel"
        placeholder="+91 "
          value={values.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          error={errors.phone}
          className="sm:col-span-2"
          autoComplete="tel"
        />
        <CheckoutField
          id="line1"
          label="Address line 1"
          placeholder="House 12, Street 4 ....."
          value={values.line1}
          onChange={(e) => onChange("line1", e.target.value)}
          error={errors.line1}
          className="sm:col-span-2"
          autoComplete="address-line1"
        />
        <CheckoutField
          id="line2"
          label="Address line 2 (optional)"
          placeholder="Apartment, suite, landmark"
          value={values.line2 ?? ""}
          onChange={(e) => onChange("line2", e.target.value)}
          error={errors.line2}
          className="sm:col-span-2"
          autoComplete="address-line2"
        />
        <CheckoutField
          id="city"
          label="City"
          placeholder="Gurgaon"
          value={values.city}
          onChange={(e) => onChange("city", e.target.value)}
          error={errors.city}
          autoComplete="address-level2"
        />
        <CheckoutField
          id="state"
          label="State / Province"
          placeholder="Haryana"
          value={values.state}
          onChange={(e) => onChange("state", e.target.value)}
          error={errors.state}
          autoComplete="address-level1"
        />
        <CheckoutField
          id="postalCode"
          label="Postal code"
          placeholder="54000"
          value={values.postalCode}
          onChange={(e) => onChange("postalCode", e.target.value)}
          error={errors.postalCode}
          autoComplete="postal-code"
        />
        <CheckoutField
          id="country"
          label="Country"
          placeholder="India"
          value={values.country}
          onChange={(e) => onChange("country", e.target.value)}
          error={errors.country}
          autoComplete="country-name"
        />
      </div>

      <div className="flex items-center gap-2 rounded-2xl bg-muted/60 px-4 py-3 text-xs text-muted-foreground">
        <User className="size-4 shrink-0 text-primary" />
        We will use this address for delivery updates on your order.
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full rounded-full sm:w-auto sm:min-w-[220px]"
      >
        {isSubmitting ? "Processing…" : submitLabel}
      </Button>
    </form>
  );
}
