"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ClaimFastButton from "@/components/store/ClaimFastButton";
import { getDiscountText, hasDealDiscount, isDealActive, type Deal } from "@/lib/deals";

type PublicDeal = Deal & {
  description: string | null;
  couponCode: string | null;
  claimedQuantity: number;
  usedCoupons: number;
  products: Array<{ id: number; name: string; slug: string; thumbnail: string | null }>;
};

export default function DealOffersSection() {
  const [deals, setDeals] = useState<PublicDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDeals() {
      try {
        const response = await fetch("/api/deals?active=1");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? "Unable to load Deals.");
        }
        setDeals(data.deals ?? []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load Deals.");
      } finally {
        setLoading(false);
      }
    }

    void loadDeals();
  }, []);

  if (loading) {
    return <section className="container mx-auto px-4 py-12 text-center text-muted-foreground">Loading Deals…</section>;
  }

  if (error) {
    return <section className="container mx-auto px-4 py-12 text-center text-destructive">{error}</section>;
  }

  const activeDeals = deals.filter(
    (deal) => Boolean(deal.couponCode) && hasDealDiscount(deal) && isDealActive(deal),
  );
  if (activeDeals.length === 0) return null;

  return (
    <section className="container mx-auto space-y-6 px-4 py-12">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.32em] text-primary">Claim separately from Promotions</p>
        <h2 className="mt-3 text-3xl font-bold text-foreground">Deals & claim codes</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Claim a Deal code, add an included product to your cart, then apply the code at checkout.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {activeDeals.map((deal) => (
          <article key={deal.id} className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                {deal.dealType.replace(/_/g, " ")}
              </p>
              <h3 className="mt-2 text-xl font-semibold">{deal.title}</h3>
              {deal.description && <p className="mt-2 text-sm text-muted-foreground">{deal.description}</p>}
            </div>
            <p className="text-2xl font-bold">{getDiscountText(deal)}</p>
            {deal.endsAt && (
              <p className="text-xs text-muted-foreground">
                Valid until {new Date(deal.endsAt).toLocaleString()}
              </p>
            )}
            {deal.products.length > 0 && (
              <div className="space-y-1 text-sm">
                <p className="font-medium">Included products</p>
                {deal.products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/shop/${product.slug}`}
                    className="block text-primary hover:underline"
                  >
                    {product.name}
                  </Link>
                ))}
              </div>
            )}
            {deal.couponCode ? (
              <ClaimFastButton dealId={deal.id} />
            ) : (
              <p className="text-sm text-muted-foreground">This Deal does not have a checkout code.</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
