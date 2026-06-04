"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatCartMoney, toCartProduct } from "@/lib/cart";
import { addRecentlyViewedSlug, getRecentlyViewedSlugs } from "@/lib/recently-viewed";
import type { CartProduct } from "@/types/cart";

type RecentProductPayload = {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: string;
  currency: string;
  stockQuantity: number;
  thumbnail: string | null;
  category: { name: string; slug: string } | null;
  featured: boolean;
};

export default function RecentlyViewedSection({ currentSlug }: { currentSlug: string }) {
  const [products, setProducts] = useState<RecentProductPayload[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    addRecentlyViewedSlug(currentSlug);
  }, [currentSlug]);

  useEffect(() => {
    const slugs = getRecentlyViewedSlugs().filter((slug) => slug !== currentSlug);
    if (slugs.length === 0) {
      setProducts([]);
      return;
    }

    setIsLoading(true);
    fetch(`/api/products?slugs=${encodeURIComponent(slugs.join(","))}`, {
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load recently viewed products.");
        }

        const data = await response.json();
        setProducts(Array.isArray(data.products) ? data.products : []);
      })
      .catch((error) => {
        console.error(error);
        setProducts([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentSlug]);

  if (isLoading || products.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 rounded-[2rem] border border-border bg-card p-6 shadow-lg sm:p-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.32em] text-primary">Recently viewed</p>
        <h2 className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl">
          Your browsing history
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Products you have viewed recently for quick access.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => {
          const cartProduct: CartProduct = toCartProduct(product);

          return (
            <article
              key={product.id}
              className="group overflow-hidden rounded-[1.75rem] border border-border bg-background p-4 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-square overflow-hidden rounded-[1.25rem] bg-muted">
                <Link href={`/shop/${product.slug}`} className="block h-full w-full">
                  <Image
                    src={product.thumbnail ?? "/category/1.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </Link>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  {product.category?.name ?? "Uncategorized"}
                </p>
                <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
                <p className="text-sm font-semibold text-foreground">
                  {formatCartMoney(cartProduct.price, cartProduct.currency)}
                </p>
              </div>

              <Link
                href={`/shop/${product.slug}`}
                className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                View details
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
