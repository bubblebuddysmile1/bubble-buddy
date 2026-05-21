"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import CartQuantityControl from "@/components/cart/CartQuantityControl";
import { formatCartMoney } from "@/lib/cart";
import { useCartStore } from "@/store/cart-store";
import type { CartItem } from "@/types/cart";

type CartItemRowProps = {
  item: CartItem;
  index: number;
};

export default function CartItemRow({ item, index }: CartItemRowProps) {
  const removeItem = useCartStore((s) => s.removeItem);
  const lineTotal = item.price * item.quantity;

  return (
    <article
      className="cart-item-enter group relative flex gap-4 rounded-[1.75rem] border border-border bg-card p-4 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:gap-6 sm:p-5"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition group-hover:bg-primary/20" />

      <Link
        href={`/shop/${item.slug}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[1.25rem] bg-muted sm:h-28 sm:w-28"
      >
        <Image src={item.image} alt={item.name} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="112px" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {item.category && (
              <p className="text-[10px] uppercase tracking-[0.28em] text-primary">{item.category}</p>
            )}
            <Link href={`/shop/${item.slug}`} className="mt-1 block truncate text-lg font-semibold text-foreground hover:text-primary">
              {item.name}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatCartMoney(item.price, item.currency)} each
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.name}`}
            className="rounded-full p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <CartQuantityControl
            productId={item.id}
            quantity={item.quantity}
            stockQuantity={item.stockQuantity}
          />
          <p className="text-lg font-semibold text-foreground">
            {formatCartMoney(lineTotal, item.currency)}
          </p>
        </div>
      </div>
    </article>
  );
}
