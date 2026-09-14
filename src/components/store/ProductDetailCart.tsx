"use client";

import AddToCartButton from "@/components/cart/AddToCartButton";
import CompareButton from "@/components/compare/CompareButton";
import ShareProductButton from "@/components/store/ShareProductButton";
import WishlistButton from "@/components/wishlist/WishlistButton";
import { formatCartMoney, getDiscountDetails } from "@/lib/cart";
import type { CartProduct } from "@/types/cart";

type ProductDetailCartProps = {
  product: CartProduct;
  compareAtPrice?: number | null;
};

export default function ProductDetailCart({ product, compareAtPrice }: ProductDetailCartProps) {
  const finalCompareAtPrice = compareAtPrice ?? product.compareAtPrice ?? null;
  const discount = getDiscountDetails(product.price, finalCompareAtPrice);

  return (
    <div className="rounded-3xl border border-border bg-background p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Price</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {formatCartMoney(product.price, product.currency)}
          </p>

          {discount.mrp && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground line-through">
                {formatCartMoney(discount.mrp, product.currency)}
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                {discount.discountPercent}% OFF
              </span>
              <span className="text-xs font-semibold text-green-600">
                Save {formatCartMoney(discount.discountAmount, product.currency)}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <AddToCartButton product={product} size="lg" className="min-w-35" />
          <WishlistButton product={product} variant="pill" showLabel />
          <CompareButton product={product} variant="pill" showLabel />
          <ShareProductButton name={product.name} slug={product.slug} />
        </div>
      </div>
    </div>
  );
}
