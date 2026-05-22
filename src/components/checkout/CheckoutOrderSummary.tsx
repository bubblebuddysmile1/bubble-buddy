"use client";

import Image from "next/image";
import Link from "next/link";
import { Package, Sparkles } from "lucide-react";
import { formatCartMoney } from "@/lib/cart";
import type { CheckoutTotals } from "@/lib/checkout";
import type { CartItem } from "@/types/cart";

type CheckoutOrderSummaryProps = {
  items: CartItem[];
  totals: CheckoutTotals;
};

export default function CheckoutOrderSummary({ items, totals }: CheckoutOrderSummaryProps) {
  const { subtotal, shipping, total, currency, itemCount } = totals;

  return (
    <aside className="checkout-summary-enter lg:sticky lg:top-24">
      <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-xl">
        <div className="bg-linear-to-r from-primary/15 via-accent/10 to-secondary/20 px-6 py-5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-primary">
            <Sparkles className="size-4" />
            Order summary
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your order
          </p>
        </div>

        <div className="max-h-72 space-y-3 overflow-y-auto p-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="checkout-line-enter flex gap-3 rounded-2xl border border-border/80 bg-background/60 p-3"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {formatCartMoney(item.price * item.quantity, item.currency)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 border-t border-border p-6">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatCartMoney(subtotal, currency)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium">
              {shipping === 0 ? "Free" : formatCartMoney(shipping, currency)}
            </span>
          </div>
          {subtotal > 0 && subtotal < 50 && (
            <p className="rounded-2xl bg-primary/10 px-3 py-2 text-xs text-primary">
              Add {formatCartMoney(50 - subtotal, currency)} more on future orders for free shipping
            </p>
          )}
          <div className="flex items-end justify-between border-t border-border pt-4">
            <span className="text-sm text-muted-foreground">Total due</span>
            <span className="text-2xl font-semibold text-foreground">
              {formatCartMoney(total, currency)}
            </span>
          </div>
        </div>
      </div>

      <Link
        href="/cart"
        className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-primary transition hover:underline"
      >
        <Package className="size-4" />
        Edit cart
      </Link>
    </aside>
  );
}
