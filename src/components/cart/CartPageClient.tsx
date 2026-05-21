"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CartItemRow from "@/components/cart/CartItemRow";
import { formatCartMoney } from "@/lib/cart";
import { selectCartSubtotal, useCartStore } from "@/store/cart-store";

export default function CartPageClient() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const subtotal = useCartStore(selectCartSubtotal);
  const currency = items[0]?.currency ?? "USD";
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : subtotal > 0 ? 4.99 : 0;
  const total = subtotal + shipping;

  if (!mounted) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart-empty-enter mx-auto max-w-lg rounded-[2rem] border border-border bg-card p-10 text-center shadow-xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <ShoppingBag className="size-9 text-primary" />
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-foreground">Your cart is empty</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Discover radiant skincare and beauty essentials crafted for your daily ritual.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          Browse shop
          <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your bag
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-4" />
            Clear cart
          </Button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <CartItemRow key={item.id} item={item} index={index} />
          ))}
        </div>
      </section>

      <aside className="cart-summary-enter lg:sticky lg:top-24">
        <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-xl">
          <div className="bg-linear-to-r from-primary/15 via-accent/10 to-secondary/20 px-6 py-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-primary">
              <Sparkles className="size-4" />
              Order summary
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Review totals before checkout</p>
          </div>

          <div className="space-y-4 p-6">
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
                Add {formatCartMoney(50 - subtotal, currency)} more for free shipping
              </p>
            )}

            <div className="border-t border-border pt-4">
              <div className="flex items-end justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-2xl font-semibold text-foreground">
                  {formatCartMoney(total, currency)}
                </span>
              </div>
            </div>

            <Button type="button" size="lg" className="w-full rounded-full">
              Proceed to checkout
            </Button>
            <Link
              href="/shop"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Continue shopping
            </Link>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-dashed border-border bg-background/80 p-4">
          <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-muted">
            <Image src={items[0].image} alt="" fill className="object-cover" sizes="56px" />
          </div>
          <p className="text-xs leading-5 text-muted-foreground">
            Secure checkout coming soon. Your cart is saved on this device.
          </p>
        </div>
      </aside>
    </div>
  );
}
