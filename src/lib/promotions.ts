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

export function isPromotionActive(promotion: Promotion): boolean {
  const now = new Date();
  if (!promotion.isActive) return false;
  if (promotion.activeFrom && promotion.activeFrom > now) return false;
  if (promotion.activeUntil && promotion.activeUntil < now) return false;
  return true;
}

export function getPromotionDiscountAmount(promotion: Promotion, subtotal: number): number {
  if (!isPromotionActive(promotion)) return 0;

  const minOrderAmount = Number(promotion.minOrderAmount);
  if (subtotal < minOrderAmount) return 0;

  const discountValue = Number(promotion.discountValue);
  if (promotion.discountType === "PERCENTAGE") {
    return Math.min(subtotal, subtotal * (discountValue / 100));
  }

  return Math.min(subtotal, discountValue);
}

export function getPromotionValidationMessage(promotion: Promotion, subtotal: number): string {
  if (!promotion.isActive) {
    return "This coupon is no longer active.";
  }

  const minOrderAmount = Number(promotion.minOrderAmount);
  if (subtotal < minOrderAmount) {
    return `Spend ${minOrderAmount.toFixed(2)} or more to use this coupon.`;
  }

  return "Coupon applied successfully.";
}
