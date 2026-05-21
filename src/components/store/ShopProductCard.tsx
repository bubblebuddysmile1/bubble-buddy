"use client";

import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { formatCartMoney } from "@/lib/cart";
import type { CartProduct } from "@/types/cart";

type ShopProductCardProps = {
  product: CartProduct;
  description: string;
  featured?: boolean;
};

export default function ShopProductCard({
  product,
  description,
  featured,
}: ShopProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-border bg-card p-0 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <Link href={`/shop/${product.slug}`} className="relative block h-80 overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </Link>
      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary">
          <span>{product.category ?? "Uncategorized"}</span>
          {featured && (
            <span className="rounded-full bg-primary/10 px-2 py-1 font-semibold text-primary">
              Featured
            </span>
          )}
        </div>
        <div>
          <Link href={`/shop/${product.slug}`}>
            <h2 className="text-2xl font-semibold text-foreground transition hover:text-primary">
              {product.name}
            </h2>
          </Link>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="text-xl font-semibold text-foreground">
              {formatCartMoney(product.price, product.currency)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <AddToCartButton product={product} size="sm" label="Add" />
            <Link
              href={`/shop/${product.slug}`}
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
