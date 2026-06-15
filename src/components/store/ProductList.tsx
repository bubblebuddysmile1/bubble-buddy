"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import AddToCartButton from "@/components/cart/AddToCartButton";
import CompareButton from "@/components/compare/CompareButton";
import { toCartProduct } from "@/lib/cart";
import type { CartProduct } from "@/types/cart";

type ProductListItem = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string | null;
  currency: string;
  stockQuantity: number;
  thumbnail: string | null;
  category: { name: string; slug: string } | null;
};

export default function ProductList() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/products?limit=9");
        const data = await response.json();

        if (!response.ok) {
          setError(data.error ?? "Unable to load products.");
          setProducts([]);
          setHasMore(false);
          return;
        }

        const allProducts = (data.products ?? []) as ProductListItem[];
        setHasMore(allProducts.length > 8);
        setProducts(allProducts.slice(0, 8));
      } catch {
        setError("Unable to load products.");
        setProducts([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-primary">
            Product List
          </p>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Explore our complete collection of beauty essentials for every
            routine. ✨{" "}
          </p>
        </div>

        {error ? (
          <div className="rounded-[2rem] border border-border bg-card p-8 text-center text-sm text-destructive">
            {error}
          </div>
        ) : loading ? (
          <div className="rounded-[2rem] border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Loading products...
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => {
                const cartProduct: CartProduct = toCartProduct({
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price ?? "0",
                  currency: product.currency,
                  thumbnail: product.thumbnail ?? null,
                  stockQuantity: product.stockQuantity,
                  category: product.category,
                });

                return (
                  <article
                    key={product.id}
                    className="group overflow-hidden rounded-[2rem] border border-border bg-card p-4 shadow-lg shadow-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <div className="relative overflow-hidden rounded-[1.75rem] bg-muted">
                      <Link
                        href={`/shop/${product.slug}`}
                        className="block h-52 w-full"
                      >
                        <Image
                          src={product.thumbnail ?? "/category/1.jpg"}
                          alt={product.name}
                          width={360}
                          height={360}
                          className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </Link>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div>
                        <Link
                          href={`/shop/${product.slug}`}
                          className="hover:text-primary"
                        >
                          <h3 className="mt-2 text-lg font-semibold text-foreground">
                            {product.name}
                          </h3>
                        </Link>
                      </div>
                      {/* <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {product.description}
                      </p> */}
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-lg font-bold text-foreground">
                        {product.price ?? "₹0"}
                      </p>
                      <div className="flex items-center gap-2">
                        <AddToCartButton
                          product={cartProduct}
                          size="sm"
                          label="Add"
                        />
                        <CompareButton product={cartProduct} variant="icon" />
                        <Link
                          href={`/shop/${product.slug}`}
                          className="hover:text-primary border border-border rounded-full bg-background px-3 py-1 text-sm font-semibold text-foreground transition hover:bg-muted"
                        >
                          view
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  View all products
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
