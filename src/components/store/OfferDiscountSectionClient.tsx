"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

type OfferDiscountSectionClientProps = {
  promotions: ActivePromotion[];
};

export default function OfferDiscountSectionClient({ promotions }: OfferDiscountSectionClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (promotions.length === 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % promotions.length);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [promotions.length]);

  const activePromotion = promotions[activeIndex];
  const hasPromotions = promotions.length > 0;

  const promotionCards = useMemo(
    () => promotions.map((promotion) => {
      const discountValue = Number(promotion.discountValue ?? 0);
      const minOrderAmount = Number(promotion.minOrderAmount ?? 0);
      const badge = promotion.discountType === "PERCENTAGE"
        ? `${discountValue}% off`
        : `₹${discountValue} off`;
      const activeRange = promotion.activeFrom || promotion.activeUntil
        ? `Valid ${promotion.activeFrom ? promotion.activeFrom.slice(0, 10) : "now"} to ${promotion.activeUntil ? promotion.activeUntil.slice(0, 10) : "end"}`
        : "Ongoing offer";

      return (
        <article
          key={promotion.id}
          className="overflow-hidden rounded-4xl border border-border bg-card p-6 shadow-lg shadow-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
        >
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="text-sm font-bold leading-tight text-foreground">{promotion.title}</div>
            <span className="rounded-full border border-border bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-primary">
              {promotion.code}
            </span>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-border bg-muted p-5">
              <p className="text-sm text-muted-foreground">
                {promotion.description ?? "Use this coupon for instant savings on your order."}
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-background p-5">
              <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Offer</p>
              <p className="mt-2 text-xl font-semibold text-foreground">{badge}</p>
              {minOrderAmount > 0 && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Minimum order ₹{minOrderAmount.toFixed(2)}
                </p>
              )}
              {promotion.activeUntil ? (
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
                  <span>Ends in</span>
                  <span>{formatCountdown(new Date(promotion.activeUntil))}</span>
                </div>
              ) : (
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {activeRange}
                </p>
              )}
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
    }),
    [promotions],
  );

  return (
    <section className="bg-background py-16">
      <div className="mx-auto px-4">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-primary">Offers & Discounts</p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Exclusive beauty deals and special savings on your favorite essentials. 💖
          </p>
        </div>

        {!hasPromotions ? (
          <div className="rounded-4xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No active promotions available yet. Add coupons in admin to populate this section.
          </div>
        ) : (
          <>
            <div className="hidden gap-6 xl:grid xl:grid-cols-4">
              {promotionCards}
            </div>

            <div className="space-y-6 md:hidden">
              <div className="relative overflow-hidden rounded-4xl border border-border bg-card p-6 shadow-lg shadow-black/5">
                <div className="absolute inset-x-0 top-0 z-10 flex justify-center gap-2 pt-4">
                  {promotions.map((promotion, index) => (
                    <span
                      key={promotion.id}
                      className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${index === activeIndex ? "bg-primary" : "bg-border"}`}
                    />
                  ))}
                </div>

                <div className="pt-8">
                  {activePromotion ? (
                    <article className="space-y-6">
                      <div className="mb-5 flex flex-col gap-3">
                        <div className="text-sm font-bold leading-tight text-foreground">{activePromotion.title}</div>
                        <span className="inline-flex items-center rounded-full border border-border bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-primary">
                          {activePromotion.code}
                        </span>
                      </div>

                      <div className="space-y-4 rounded-3xl border border-border bg-muted p-5">
                        <p className="text-sm text-muted-foreground">
                          {activePromotion.description ?? "Use this coupon for instant savings on your order."}
                        </p>
                        <div>
                          <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Offer</p>
                          <p className="mt-2 text-2xl font-semibold text-foreground">
                            {activePromotion.discountType === "PERCENTAGE"
                              ? `${Number(activePromotion.discountValue)}% off`
                              : `₹${Number(activePromotion.discountValue)} off`}
                          </p>
                          {Number(activePromotion.minOrderAmount) > 0 && (
                            <p className="mt-1 text-sm text-muted-foreground">
                              Minimum order ₹{Number(activePromotion.minOrderAmount).toFixed(2)}
                            </p>
                          )}
                        </div>
                        {activePromotion.activeUntil ? (
                          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
                            <span>Ends in</span>
                            <span>{formatCountdown(new Date(activePromotion.activeUntil))}</span>
                          </div>
                        ) : (
                          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            {activePromotion.activeFrom || activePromotion.activeUntil
                              ? `Valid ${activePromotion.activeFrom ? activePromotion.activeFrom.slice(0, 10) : "now"} to ${activePromotion.activeUntil ? activePromotion.activeUntil.slice(0, 10) : "end"}`
                              : "Ongoing offer"}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <Link
                          href="/shop"
                          className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                        >
                          Use offer
                        </Link>
                      </div>
                    </article>
                  ) : null}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
