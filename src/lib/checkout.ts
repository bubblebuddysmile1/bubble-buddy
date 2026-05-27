import type { CartItem } from "@/types/cart";

const FREE_SHIPPING_THRESHOLD = 50;
const STANDARD_SHIPPING = 4.99;

export type PromotionDefinition = {
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderAmount: number;
};

export type CheckoutTotals = {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  currency: string;
  itemCount: number;
};

export function getPromotionDiscount(subtotal: number, promotion?: PromotionDefinition): number {
  if (!promotion) return 0;
  if (subtotal < promotion.minOrderAmount) return 0;

  if (promotion.discountType === "PERCENTAGE") {
    return Math.min(subtotal, subtotal * (promotion.discountValue / 100));
  }

  return Math.min(subtotal, promotion.discountValue);
}

export function getCheckoutTotals(
  items: CartItem[],
  promotion?: PromotionDefinition,
): CheckoutTotals {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const currency = items[0]?.currency ?? "USD";
  const discount = getPromotionDiscount(subtotal, promotion);
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const shipping = items.length === 0 ? 0 : discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const total = discountedSubtotal + shipping;

  return { subtotal, discount, shipping, total, currency, itemCount };
}

export function generateMockOrderNumber(): string {
  const suffix = Date.now().toString(36).toUpperCase().slice(-6);
  return `BB-${suffix}`;
}
