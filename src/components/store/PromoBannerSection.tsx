"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ArrowRight } from "lucide-react";

type CategoryBanner = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  showInBanner: boolean;
};

export default function PromoBannerSection() {
  const [banners, setBanners] = useState<CategoryBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBanners() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/categories", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          setError(data.error ?? "Unable to load promo banners.");
          setBanners([]);
          return;
        }

        const categories = (data.categories ?? []) as CategoryBanner[];
        setBanners(categories.filter((category) => category.showInBanner && category.isActive));
      } catch {
        setError("Unable to load promo banners.");
        setBanners([]);
      } finally {
        setLoading(false);
      }
    }

    loadBanners();
  }, []);

  return (
    <section className="py-14 bg-pink-50">

      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-primary">Promotional categories</p>
          <h2 className="mt-4 text-3xl font-semibold text-foreground sm:text-4xl">
            Shop by category with featured banner offers
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Click any category to explore products curated for that collection.
          </p>
        </div>

        {error ? (
          <div className="rounded-[2rem] border border-border bg-card p-8 text-center text-sm text-destructive">
            {error}
          </div>
        ) : loading ? (
          <div className="rounded-[2rem] border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Loading promo banners...
          </div>
        ) : banners.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No category banners configured yet. Enable "Show in promo banners" from category admin.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <div key={banner.id} className="relative overflow-hidden rounded-3xl group min-h-112">
                <Image
                  src={banner.image ?? "/category/1.jpg"}
                  alt={banner.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex flex-col justify-between p-8 text-white">
                  <div className="space-y-4">
                    <p className="uppercase tracking-[4px] text-sm font-medium text-pink-200">
                      {banner.name}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                      {banner.description ?? `Shop the best products in ${banner.name}.`}
                    </h2>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                      href={`/shop?category=${encodeURIComponent(banner.slug)}`}
                      className="inline-flex items-center gap-3 bg-pink-100 text-black px-7 py-3 rounded-full text-lg font-medium hover:bg-white transition"
                    >
                      Shop {banner.name}
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.26em] text-white/90">
                      Category
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </section>
  );
}