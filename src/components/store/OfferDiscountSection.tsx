'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

export type ActivePromotion = {
  id: number;
  code: string;
  title: string;
  description: string | null;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderAmount: number;
  activeFrom: string | null;
  activeUntil: string | null;
  isActive: boolean;
};

export default function OfferDiscountSection() {
  const [promotions, setPromotions] = useState<ActivePromotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPromotions() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/promotions?active=1&limit=4");
        const data = await response.json();

        if (!response.ok) {
          setError(data.error ?? "Unable to load offers.");
          setPromotions([]);
          return;
        }

        setPromotions(data.promotions ?? []);
      } catch {
        setError("Unable to load offers.");
        setPromotions([]);
      } finally {
        setLoading(false);
      }
    }

    loadPromotions();
  }, []);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-primary">Offers & Discounts</p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Exclusive beauty deals and special savings on your favorite essentials. 💖          </p>
        </div>

        {error ? (
          <div className="rounded-[2rem] border border-border bg-card p-8 text-center text-sm text-destructive">
            {error}
          </div>
        ) : loading ? (
          <div className="rounded-[2rem] border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Loading offers...
          </div>
        ) : promotions.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No active promotions available yet. Add coupons in admin to populate this section.
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-4">
            {promotions.map((promotion) => {
              const badge = promotion.discountType === "PERCENTAGE"
                ? `${promotion.discountValue}% off`
                : `₹${promotion.discountValue} off`;
              const activeRange = promotion.activeFrom || promotion.activeUntil
                ? `Valid ${promotion.activeFrom ? promotion.activeFrom.slice(0, 10) : "now"} to ${promotion.activeUntil ? promotion.activeUntil.slice(0, 10) : "end"}`
                : "Ongoing offer";

              return (
                <article
                  key={promotion.id}
                  className="overflow-hidden rounded-[2rem] border border-border bg-card p-6 shadow-lg shadow-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div className="text-sm font-bold leading-tight text-foreground">{promotion.title}</div>
                    <span className="rounded-full border border-border bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-primary">
                      {promotion.code}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[1.5rem] border border-border bg-muted p-5">
                      <p className="text-sm text-muted-foreground">
                        {promotion.description ?? "Use this coupon for instant savings on your order."}
                      </p>
                    </div>

                    <div className="rounded-[1.5rem] border border-border bg-background p-5">
                      <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Offer</p>
                      <p className="mt-2 text-xl font-semibold text-foreground">{badge}</p>
                      {promotion.minOrderAmount > 0 && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          Minimum order ₹{promotion.minOrderAmount.toFixed(2)}
                        </p>
                      )}
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {activeRange}
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <Link
                        href="/shop"
                        className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                      >
                        Use offer
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
