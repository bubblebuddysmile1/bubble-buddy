import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

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

export default async function OfferDiscountSection() {
  const now = new Date();
  const promotions = await prisma.promotion.findMany({
    where: {
      isActive: true,
      AND: [
        { OR: [{ activeFrom: null }, { activeFrom: { lte: now } }] },
        { OR: [{ activeUntil: null }, { activeUntil: { gte: now } }] },
      ],
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-primary">Offers & Discounts</p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Exclusive beauty deals and special savings on your favorite essentials. 💖
          </p>
        </div>

        {promotions.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No active promotions available yet. Add coupons in admin to populate this section.
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-4">
            {promotions.map((promotion) => {
              const discountValue = Number(promotion.discountValue ?? 0);
              const minOrderAmount = Number(promotion.minOrderAmount ?? 0);
              const badge = promotion.discountType === "PERCENTAGE"
                ? `${discountValue}% off`
                : `₹${discountValue} off`;
              const activeRange = promotion.activeFrom || promotion.activeUntil
                ? `Valid ${promotion.activeFrom ? promotion.activeFrom.toISOString().slice(0, 10) : "now"} to ${promotion.activeUntil ? promotion.activeUntil.toISOString().slice(0, 10) : "end"}`
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
            })}
          </div>
        )}
      </div>
    </section>
  );
}
