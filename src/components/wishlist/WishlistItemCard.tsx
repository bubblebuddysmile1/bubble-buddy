"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { formatCartMoney } from "@/lib/cart";
import { useWishlistStore } from "@/store/wishlist-store";
import type { WishlistProduct } from "@/types/wishlist";

type WishlistItemCardProps = {
  product: WishlistProduct;
  index: number;
};

export default function WishlistItemCard({ product, index }: WishlistItemCardProps) {
  const removeItem = useWishlistStore((s) => s.removeItem);

  return (
    <article
      className="wishlist-item-enter group relative overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl transition group-hover:bg-primary/20" />

      <Link href={`/shop/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </Link>

      <div className="space-y-4 p-5">
        {product.category && (
          <p className="text-[10px] uppercase tracking-[0.28em] text-primary">{product.category}</p>
        )}
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link href={`/shop/${product.slug}`}>
              <h2 className="text-lg font-semibold text-foreground transition hover:text-primary">
                {product.name}
              </h2>
            </Link>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {formatCartMoney(product.price, product.currency)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeItem(product.id)}
            aria-label={`Remove ${product.name}`}
            className="rounded-full p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <AddToCartButton product={product} size="sm" label="Add to cart" className="flex-1 sm:flex-none" />
          <Link
            href={`/shop/${product.slug}`}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted sm:flex-none"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}