import type { CartItem } from "@/types/cart";

const FREE_SHIPPING_THRESHOLD = 50;
const STANDARD_SHIPPING = 4.99;

export type CheckoutTotals = {
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  itemCount: number;
};

export function getCheckoutTotals(items: CartItem[]): CheckoutTotals {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const currency = items[0]?.currency ?? "USD";
  const shipping =
    items.length === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const total = subtotal + shipping;

  return { subtotal, shipping, total, currency, itemCount };
}

export function generateMockOrderNumber(): string {
  const suffix = Date.now().toString(36).toUpperCase().slice(-6);
  return `BB-${suffix}`;
}
