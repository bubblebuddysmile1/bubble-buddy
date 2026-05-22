"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type CheckoutFieldProps = {
  id: string;
  label: string;
  error?: string;
  className?: string;
} & React.ComponentProps<"input">;

export default function CheckoutField({
  id,
  label,
  error,
  className,
  ...props
}: CheckoutFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <Input
        id={id}
        aria-invalid={Boolean(error)}
        className={cn(error && "checkout-field-error")}
        {...props}
      />
      {error && (
        <p className="checkout-error-enter text-xs font-medium text-destructive">{error}</p>
      )}
    </div>
  );
}
