import { prisma } from "@/lib/prisma";
import type { Promotion } from "@prisma/client";

export function normalizeCouponCode(code: string): string {
  return code.trim().toUpperCase();
}

export async function getPromotionByCode(code: string): Promise<Promotion | null> {
  const normalizedCode = normalizeCouponCode(code);
  return prisma.promotion.findUnique({
    where: { code: normalizedCode },
  });
}

export function isPromotionEligibleForCart(promotion: Promotion, items: Array<{ id: number }>): boolean {
  if (promotion.productId == null) return true;
  return items.some((item) => item.id === promotion.productId);
}

export function isPromotionActive(promotion: Promotion): boolean {
  const now = new Date();
  if (!promotion.isActive) return false;
  if (promotion.availableQuantity !== null && promotion.availableQuantity <= 0) return false;
  if (promotion.activeFrom && promotion.activeFrom > now) return false;
  if (promotion.activeUntil && promotion.activeUntil < now) return false;
  return true;
}

export function getPromotionDiscountAmount(
  promotion: Promotion,
  subtotal: number,
  items: Array<{ id: number }> = [],
): number {
  if (!isPromotionActive(promotion)) return 0;
  if (!isPromotionEligibleForCart(promotion, items)) return 0;

  const minOrderAmount = Number(promotion.minOrderAmount);
  if (subtotal < minOrderAmount) return 0;

  const discountValue = Number(promotion.discountValue);
  if (promotion.discountType === "PERCENTAGE") {
    return Math.min(subtotal, subtotal * (discountValue / 100));
  }

  return Math.min(subtotal, discountValue);
}

export function getPromotionValidationMessage(
  promotion: Promotion,
  subtotal: number,
  items: Array<{ id: number }> = [],
): string {
  if (!promotion.isActive) {
    return "This coupon is no longer active.";
  }

  if (promotion.availableQuantity !== null && promotion.availableQuantity <= 0) {
    return "This coupon is no longer available.";
  }

  if (!isPromotionEligibleForCart(promotion, items)) {
    return "Add the promotional product to your cart to use this coupon.";
  }

  const minOrderAmount = Number(promotion.minOrderAmount);
  if (subtotal < minOrderAmount) {
    return `Spend ${minOrderAmount.toFixed(2)} or more to use this coupon.`;
  }

  return "Coupon applied successfully.";
}
