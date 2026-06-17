"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { formatCartMoney } from "@/lib/cart";
import { formatLoyaltyPoints } from "@/lib/loyalty";
import type { CartItem } from "@/types/cart";
import type { CheckoutTotals } from "@/lib/checkout";
import type { CheckoutAddressForm } from "@/lib/validations/checkout";
import { 
  CheckCircle, 
  MapPin, 
  Package, 
  CreditCard, 
  ShoppingBag,
  Truck,
  Shield,
  Clock
} from "lucide-react";

type CheckoutConfirmationSheetProps = {
  open: boolean;
  address: CheckoutAddressForm;
  items: CartItem[];
  totals: CheckoutTotals;
  couponCode?: string | null;
  redeemPoints: number;
  isSubmitting: boolean;
  error?: string | null;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onConfirm: () => void;
};

export default function CheckoutConfirmationSheet({
  open,
  address,
  items,
  totals,
  couponCode,
  redeemPoints,
  isSubmitting,
  error,
  onOpenChange,
  onEdit,
  onConfirm,
}: CheckoutConfirmationSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="max-w-xl overflow-y-auto p-0">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
                    Step 2 of
                  </p>
                  <h2 className="text-xl font-semibold text-foreground">
                    Confirm Order
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={onEdit}
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Edit
                </Button>
                <Button
                  onClick={onConfirm}
                  disabled={isSubmitting}
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                      Confirming…
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay {formatCartMoney(totals.total, totals.currency)}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-6 rounded-2xl bg-primary/5 px-4 py-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                <span>Free Returns</span>
              </div>
            </div>

            {/* Shipping Address */}
            <section className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="border-b border-border bg-muted/30 px-4 py-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground">Shipping Address</p>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{address.fullName}</p>
                  <p className="text-sm text-muted-foreground">{address.phone}</p>
                  <p className="text-sm text-foreground">
                    {address.line1}
                    {address.line2 && `, ${address.line2}`}
                  </p>
                  <p className="text-sm text-foreground">
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p className="text-sm text-foreground">{address.country}</p>
                </div>
              </div>
            </section>

            {/* Order Items */}
            <section className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="border-b border-border bg-muted/30 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <p className="text-sm font-semibold text-foreground">Order Items</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                </div>
              </div>
              <div className="divide-y divide-border">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 hover:bg-muted/20 transition-colors">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground line-clamp-2">
                        {item.name}
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Qty: {item.quantity}</span>
                        <span>•</span>
                        <span>{formatCartMoney(item.price, item.currency)} each</span>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-foreground">
                        {formatCartMoney(item.price * item.quantity, item.currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Order Summary */}
            <section className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="border-b border-border bg-muted/30 px-4 py-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground">Order Summary</p>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">
                    {formatCartMoney(totals.subtotal, totals.currency)}
                  </span>
                </div>
                
                {totals.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-600">Discount</span>
                    <span className="text-emerald-600">
                      -{formatCartMoney(totals.discount, totals.currency)}
                    </span>
                  </div>
                )}
                
                {redeemPoints > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-600">
                      Points Redeemed ({formatLoyaltyPoints(redeemPoints)})
                    </span>
                    <span className="text-emerald-600">
                      -{formatCartMoney(totals.loyaltyDiscount, totals.currency)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {totals.shipping === 0 ? (
                      <span className="text-emerald-600">Free</span>
                    ) : (
                      formatCartMoney(totals.shipping, totals.currency)
                    )}
                  </span>
                </div>
                
                {couponCode && (
                  <div className="rounded-xl bg-primary/5 px-3 py-2 text-sm">
                    <span className="text-muted-foreground">Coupon Applied:</span>
                    <span className="ml-2 font-semibold text-primary">{couponCode}</span>
                  </div>
                )}
                
                <div className="border-t border-border pt-3">
                  <div className="flex items-center justify-between text-base font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary text-lg">
                      {formatCartMoney(totals.total, totals.currency)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground text-right">
                    {totals.total > 0 && "Including taxes"}
                  </p>
                </div>
              </div>
            </section>

            {/* Error */}
            {error && (
              <div className="rounded-2xl bg-destructive/10 border border-destructive/20 px-4 py-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Terms */}
            <p className="text-center text-xs text-muted-foreground">
              By confirming your order, you agree to our{" "}
              <button className="text-primary hover:underline">Terms & Conditions</button>
              {" "}and{" "}
              <button className="text-primary hover:underline">Privacy Policy</button>
            </p>
          </div>

          {/* Footer - Mobile Action Buttons */}
          <div className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur-sm px-6 py-4 md:hidden">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onEdit}
                className="flex-1"
              >
                Edit
              </Button>
              <Button
                onClick={onConfirm}
                disabled={isSubmitting}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Confirming…
                  </>
                ) : (
                  `Pay ${formatCartMoney(totals.total, totals.currency)}`
                )}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}