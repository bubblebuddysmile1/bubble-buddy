"use client";

import AddToCartButton from "@/components/cart/AddToCartButton";
import { formatCartMoney } from "@/lib/cart";
import type { CartProduct } from "@/types/cart";

type ProductDetailCartProps = {
  product: CartProduct;
  compareAtPrice?: number | null;
};

export default function ProductDetailCart({ product, compareAtPrice }: ProductDetailCartProps) {
  return (
    <div className="rounded-3xl border border-border bg-background p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Price</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {formatCartMoney(product.price, product.currency)}
          </p>
          {compareAtPrice != null && compareAtPrice > product.price && (
            <p className="mt-1 text-sm text-muted-foreground line-through">
              {formatCartMoney(compareAtPrice, product.currency)}
            </p>
          )}
        </div>
        <AddToCartButton product={product} size="lg" className="min-w-[160px]" />
      </div>
    </div>
  );
}
