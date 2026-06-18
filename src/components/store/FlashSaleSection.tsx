"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ActivePromotion } from "./OfferDiscountSection";

function formatCountdown(target: Date): string {
  const totalSeconds = Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return parts.join(" ");
}

export default function FlashSaleSection() {
  const [promotions, setPromotions] = useState<ActivePromotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadPromotions() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/promotions?active=1&limit=6");
        const data = await response.json();

        if (!response.ok) {
          setError(data.error ?? "Unable to load flash sale offers.");
          setPromotions([]);
          return;
        }

        setPromotions(data.promotions ?? []);
      } catch {
        setError("Unable to load flash sale offers.");
        setPromotions([]);
      } finally {
        setLoading(false);
      }
    }

    loadPromotions();
  }, []);

  const flashPromotions = promotions.filter((promotion) => promotion.activeUntil);

  return (
    <section className="py-16 bg-linear-to-r from-[#fff7f0] via-[#fef0e7] to-[#fff7f0]">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-secondary">Flash Sale</p>
          <h2 className="mt-3 text-4xl font-bold text-foreground sm:text-5xl">
            Limited Time Deals Ending Soon
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Shop fast before these special offers expire. Real-time countdowns help you catch the best prices.
          </p>
        </div>

        {error ? (
          <div className="rounded-[2rem] border border-border bg-card p-8 text-center text-sm text-destructive">
            {error}
          </div>
        ) : loading ? (
          <div className="rounded-[2rem] border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Loading flash sale deals...
          </div>
        ) : flashPromotions.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No flash sale offers are active right now. Explore all current promotions below.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {flashPromotions.map((promotion) => {
              const expiresAt = promotion.activeUntil ? new Date(promotion.activeUntil) : null;
              const countdown = expiresAt ? formatCountdown(expiresAt) : null;
              const badge = promotion.discountType === "PERCENTAGE"
                ? `${promotion.discountValue}% off`
                : `₹${promotion.discountValue} off`;

              return (
                <article
                  key={promotion.id}
                  className="group relative overflow-hidden rounded-[2rem] border border-border bg-card p-6 shadow-lg shadow-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="mb-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-destructive">
                        Flash Sale
                      </span>
                      <span className="rounded-full border border-border bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-primary">
                        {promotion.code}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-foreground">{promotion.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {promotion.description ?? "Save more on your order with this limited-time coupon."}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 rounded-[1.5rem] border border-border bg-muted p-5">
                    <div className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Deal</div>
                    <p className="mt-1 text-3xl font-semibold text-foreground">{badge}</p>
                    {promotion.minOrderAmount > 0 && (
                      <p className="text-sm text-muted-foreground">Minimum order ₹{promotion.minOrderAmount.toFixed(2)}</p>
                    )}
                    <p className="mt-3 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      {promotion.activeFrom ? `Valid from ${promotion.activeFrom.slice(0, 10)}` : "Active now"}
                    </p>
                    {countdown && (
                      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive">
                        <span>Ends in</span>
                        <span>{countdown}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-between items-center gap-3">
                    <Link
                      href="/shop"
                      className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                    >
                      Shop now
                    </Link>
                    <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                      Limited offer
                    </span>
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
