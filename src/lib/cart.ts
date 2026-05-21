import type { CartProduct } from "@/types/cart";

type ProductLike = {
  id: number;
  slug: string;
  name: string;
  price: { toString(): string } | number | string;
  currency: string;
  thumbnail?: string | null;
  stockQuantity: number;
  category?: { name: string } | null;
};

export function parseProductPrice(price: ProductLike["price"]): number {
  if (typeof price === "number") return price;
  return Number.parseFloat(String(price)) || 0;
}

export function toCartProduct(product: ProductLike): CartProduct {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: parseProductPrice(product.price),
    currency: product.currency,
    image: product.thumbnail ?? "/category/1.jpg",
    category: product.category?.name,
    stockQuantity: product.stockQuantity,
  };
}

export function formatCartMoney(amount: number, currency: string): string {
  return `${currency} ${amount.toFixed(2)}`;
}
