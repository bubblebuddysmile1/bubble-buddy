"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AddToCartButton from "@/components/cart/AddToCartButton";
import ShareProductButton from "@/components/store/ShareProductButton";
import { getDiscountDetails, toCartProduct } from "@/lib/cart";
import type { CartProduct } from "@/types/cart";

export type BestSellingProduct = {
  id: number;
  name: string;
  slug: string;
  thumbnail: string | null;
  price: number;
  compareAtPrice?: number | null;
  currency: string;
  category: { name: string; slug: string } | null;
  stockQuantity: number;
};

type BestSellingProductsClientProps = {
  products: BestSellingProduct[];
};

export default function BestSellingProductsClient({ products }: BestSellingProductsClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (products.length === 0) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % products.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [products.length]);

  const activeProduct = products[activeIndex];
  const hasProducts = products.length > 0;

  return (
    <section className="relative overflow-hidden bg-background py-4">
      <div className="mx-auto w-full px-4">
        <div className="mb-10 flex flex-col gap-4 rounded-4xl border border-border bg-card p-8 shadow-lg shadow-black/5">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.32em] text-primary">
            <span className="inline-flex rounded-full bg-primary/80 px-3 py-1 text-white">Best Sellers</span>
            <span className="text-muted-foreground">
              Curated collection of our most-loved beauty essentials for a radiant daily glow. ✨
            </span>
          </div>
        </div>

        {!hasProducts ? (
          <div className="rounded-4xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No best seller products are available yet. Mark products as best seller in admin to populate this section.
          </div>
        ) : (
          <>
            <div className="overflow-hidden pb-3 sm:hidden">
              <div className="relative rounded-4xl border border-border bg-card p-4 shadow-lg shadow-black/5">
                {activeProduct ? (
                  <article>
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-secondary/10 px-3 py-1 text-[11px] uppercase tracking-[0.32em] text-secondary-foreground">
                        Best Seller
                      </span>
                      <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
                        {activeProduct.stockQuantity > 0 ? "In stock" : "Out of stock"}
                      </span>
                    </div>

                    <div className="mt-4 overflow-hidden rounded-3xl bg-muted p-3">
                      <div className="relative aspect-square overflow-hidden rounded-3xl">
                        <Image
                          src={activeProduct.thumbnail ?? "/category/1.jpg"}
                          alt={activeProduct.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
                          {activeProduct.category?.name ?? "Uncategorized"}
                        </p>
                        <h3 className="mt-2 text-base font-semibold text-foreground">{activeProduct.name}</h3>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-lg font-semibold text-foreground">
                            {activeProduct.currency}{activeProduct.price.toFixed(2)}
                          </p>
                          {getDiscountDetails(activeProduct.price, activeProduct.compareAtPrice ?? null).mrp && (
                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-xs text-muted-foreground line-through">
                                {activeProduct.currency}{(activeProduct.compareAtPrice ?? activeProduct.price).toFixed(2)}
                              </span>
                              <span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
                                {getDiscountDetails(activeProduct.price, activeProduct.compareAtPrice ?? null).discountPercent}% OFF
                              </span>
                            </div>
                          )}
                        </div>
                        <Link
                          href={`/shop/${activeProduct.slug}`}
                          className="inline-flex items-center justify-center rounded-full border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground"
                        >
                          View
                        </Link>
                      </div>
                      <AddToCartButton
                        product={toCartProduct({
                          ...activeProduct,
                          price: activeProduct.price.toString(),
                        })}
                        size="sm"
                        label="Add"
                        variant="default"
                        className="w-full"
                      />
                      <ShareProductButton name={activeProduct.name} slug={activeProduct.slug} className="w-full" />
                    </div>
                  </article>
                ) : null}

                <div className="mt-4 flex justify-center gap-2">
                  {products.map((_, index) => (
                    <span
                      key={index}
                      className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${index === activeIndex ? "bg-primary" : "bg-border"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden grid-cols-2 gap-5 sm:grid xl:grid-cols-4">
              {products.map((product) => {
                const cartProduct: CartProduct = toCartProduct({
                  ...product,
                  price: product.price.toString(),
                });

                return (
                  <article
                    key={product.id}
                    className="group relative overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-lg shadow-black/5 transition duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/10"
                  >
                    <div className="pointer-events-none absolute -right-10 top-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
                    <div className="pointer-events-none absolute -left-12 bottom-6 h-28 w-28 rounded-full bg-accent/10 blur-3xl" />
                    <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-accent to-secondary" />

                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-secondary/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-secondary-foreground">
                        Best Seller
                      </span>
                      <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
                        {product.stockQuantity > 0 ? "In stock" : "Out of stock"}
                      </span>
                    </div>

                    <div className="mt-4 overflow-hidden rounded-2xl bg-muted p-2 transition duration-500 group-hover:-translate-y-1">
                      <div className="relative h-44 overflow-hidden rounded-2xl">
                        <Image
                          src={product.thumbnail ?? "/category/1.jpg"}
                          alt={product.name}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-b from-transparent via-card/10 to-card/20" />
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex min-h-12 items-start gap-2">
                        <p className="shrink-0 pt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          {product.category?.name ?? "Uncategorized"}
                        </p>
                        <h3 className="line-clamp-2 text-base font-semibold leading-5 text-foreground"><Link href={`/shop/${product.slug}`}>
                          {product.name}
                        </Link></h3>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Price</p>
                          <p className="text-lg font-semibold text-foreground">
                            ₹{cartProduct.price.toFixed(2)}
                          </p>
                          {cartProduct.compareAtPrice && cartProduct.compareAtPrice > cartProduct.price && (
                            <div className="flex flex-wrap items-center gap-1">
                              <span className="text-[11px] text-muted-foreground line-through">
                                MRP ₹{cartProduct.compareAtPrice.toFixed(2)}
                              </span>
                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                {getDiscountDetails(cartProduct.price, cartProduct.compareAtPrice).discountPercent}% OFF
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <AddToCartButton
                            product={cartProduct}
                            size="sm"
                            label="Add"
                            variant="default"
                            className="px-2.5"
                          />
                          <Link
                            href={`/shop/${product.slug}`}
                            className="inline-flex items-center justify-center rounded-full border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted"
                          >
                            View
                          </Link>
                          <ShareProductButton name={product.name} slug={product.slug} />
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
