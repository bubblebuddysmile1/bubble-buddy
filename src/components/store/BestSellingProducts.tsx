'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import AddToCartButton from "@/components/cart/AddToCartButton";
import { toCartProduct } from "@/lib/cart";
import type { CartProduct } from "@/types/cart";

type BestSellerProduct = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  currency: string;
  stockQuantity: number;
  thumbnail: string | null;
  category: { name: string; slug: string } | null;
  featured: boolean;
};

export default function BestSellingProducts() {
  const [products, setProducts] = useState<BestSellerProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedProducts() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/products?featured=1&limit=8");
        const data = await response.json();

        if (!response.ok) {
          setError(data?.error ?? "Unable to load best-selling products.");
          setProducts([]);
          return;
        }

        setProducts(
          (data.products ?? []).map((product: BestSellerProduct) => ({
            ...product,
            price: String(product.price ?? "0"),
          })),
        );
      } catch {
        setError("Unable to load best-selling products.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadFeaturedProducts();
  }, []);

  return (
    <section className="relative overflow-hidden py-4 bg-background">
      <div className="w-full mx-auto px-4">
        <div className="mb-10 flex flex-col gap-4 rounded-[2rem] border border-border bg-card p-8 shadow-lg shadow-black/5">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.32em] text-primary">
            <span className="inline-flex rounded-full bg-primary/80 px-3 py-1 text-white">Best Sellers</span>
            <span className="text-muted-foreground">Curated collection of our most-loved beauty essentials for a radiant daily glow. ✨</span>
          </div>
        </div>

        {error ? (
          <div className="rounded-[2rem] border border-border bg-card p-8 text-center text-sm text-destructive">
            {error}
          </div>
        ) : loading ? (
          <div className="rounded-[2rem] border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Loading best sellers...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No best seller products are available yet. Mark products as best seller in admin to populate this section.
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            spaceBetween={16}
            loop
            autoplay={{ delay: 3200, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 1.2, spaceBetween: 14 },
              768: { slidesPerView: 2, spaceBetween: 16 },
              1024: { slidesPerView: 2.8, spaceBetween: 18 },
              1280: { slidesPerView: 3.5, spaceBetween: 20 },
            }}
            className="pb-8"
          >
            {products.map((product) => {
              const cartProduct: CartProduct = toCartProduct(product);

              return (
                <SwiperSlide key={product.id}>
                  <article className="group relative overflow-hidden rounded-[2rem] border border-border bg-card p-5 shadow-lg shadow-black/5 transition duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/10">
                    <div className="pointer-events-none absolute -right-10 top-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl animate-pulse" />
                    <div className="pointer-events-none absolute -left-12 bottom-6 h-28 w-28 rounded-full bg-accent/10 blur-3xl animate-pulse" />
                    <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-accent to-secondary" />

                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-secondary/10 px-3 py-1 text-[11px] uppercase tracking-[0.32em] text-secondary-foreground">
                        Best Seller
                      </span>
                      <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
                        {product.stockQuantity > 0 ? "In stock" : "Out of stock"}
                      </span>
                    </div>

                    <div className="mt-5 overflow-hidden rounded-[1.75rem] bg-muted p-4 transition duration-500 group-hover:-translate-y-1">
                      <div className="relative aspect-square overflow-hidden rounded-[1.5rem]">
                        <Image
                          src={product.thumbnail ?? "/category/1.jpg"}
                          alt={product.name}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-b from-transparent via-card/10 to-card/20" />
                      </div>
                    </div>

                    <div className="mt-5 space-y-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
                          {product.category?.name ?? "Uncategorized"}
                        </p>
                        <h3 className="mt-3 text-lg font-semibold text-foreground">{product.name}</h3>
                        {/* <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{product.description}</p> */}
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Price</p>
                          <p className="text-xl font-semibold text-foreground">
                            {cartProduct.currency} {cartProduct.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                          <AddToCartButton
                            product={cartProduct}
                            size="sm"
                            label="Add to cart"
                            variant="default"
                            className="w-full sm:w-auto"
                          />
                          <Link
                            href={`/shop/${product.slug}`}
                            className="inline-flex items-center justify-center rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
    </section>
  );
}
