"use client";

import { useEffect, useState } from "react";
import ShopProductCard from "@/components/store/ShopProductCard";
import { toCartProduct } from "@/lib/cart";

type ApiProduct = {
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

type CategoryProductsProps = {
  categorySlug: string;
};

export default function CategoryProducts({ categorySlug }: CategoryProductsProps) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/products?category=${encodeURIComponent(categorySlug)}&sort=featured&page=1&limit=24`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error("Unable to load products.");
        }

        const data = await response.json();
        setProducts(data.products ?? []);
      } catch (err) {
        console.error(err);
        setError("Could not fetch products for this category.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [categorySlug]);

  return (
    <section className="space-y-6">
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="rounded-[2rem] border border-border bg-card p-0 shadow-lg">
                <div className="relative h-80 overflow-hidden bg-muted">
                  <div className="h-full w-full bg-muted" />
                </div>
                <div className="space-y-4 p-6">
                  <div className="h-4 w-24 bg-muted rounded-md" />
                  <div className="h-6 w-3/4 bg-muted rounded-md" />
                  <div className="h-4 w-20 bg-muted rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-[2rem] border border-destructive/20 bg-destructive/5 p-10 text-center text-sm text-destructive">
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-[2rem] border border-border bg-card p-10 text-center text-sm text-muted-foreground">
          No products were found in this category.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ShopProductCard
              key={product.id}
              product={toCartProduct(product)}
              description={product.description}
              featured={product.featured}
            />
          ))}
        </div>
      )}
    </section>
  );
}
