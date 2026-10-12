import { prisma } from "@/lib/prisma";
import { getDealDiscountAmount, isDealActive, type Deal } from "@/lib/deals";

export type DealWithProducts = Deal & {
  couponCode: string | null;
  products: Array<{ id: number }>;
};

export async function getDealByCouponCode(code: string): Promise<DealWithProducts | null> {
  return prisma.deal.findFirst({
    where: {
      couponCode: {
        equals: code.trim(),
        mode: "insensitive",
      },
    },
    include: { products: { select: { id: true } } },
  }) as Promise<DealWithProducts | null>;
}

export function getDealCouponDiscount(
  deal: DealWithProducts,
  items: Array<{ id: number; price: number; quantity: number }>,
): number {
  if (!deal.couponCode || !isDealActive(deal)) return 0;
  return getDealDiscountAmount(deal, items, deal.products.map((product) => product.id));
}

export function getDealCouponValidationMessage(
  deal: DealWithProducts,
  items: Array<{ id: number; price: number; quantity: number }>,
): string {
  if (!deal.isActive) return "This Deal is no longer active.";
  if (deal.startsAt && new Date(deal.startsAt) > new Date()) return "This Deal has not started yet.";
  if (deal.endsAt && new Date(deal.endsAt) < new Date()) return "This Deal has expired.";
  if (isDealActive(deal)) {
    const eligibleIds = new Set(deal.products.map((product) => product.id));
    if (!items.some((item) => eligibleIds.has(item.id))) {
      return "Add a product included in this Deal to your cart.";
    }
    return "This Deal does not have a discount configured.";
  }
  if (deal.dealType === "LIMITED_STOCK" && deal.limitedQuantity != null) {
    return "All items in this Deal have been claimed.";
  }
  if (deal.dealType === "COUPON_CODE" && deal.maxCoupons != null) {
    return "All coupons for this Deal have been used.";
  }
  return "This Deal is not currently available.";
}
