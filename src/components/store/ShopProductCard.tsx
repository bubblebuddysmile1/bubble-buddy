"use client";

import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/cart/AddToCartButton";
import CompareButton from "@/components/compare/CompareButton";
import WishlistButton from "@/components/wishlist/WishlistButton";
import LimitedOfferBadge from "@/components/store/LimitedOfferBadge";
import ClaimFastButton from "@/components/store/ClaimFastButton";
import ShareProductButton from "@/components/store/ShareProductButton";
import { formatCartMoney, getDiscountDetails } from "@/lib/cart";
import type { CartProduct } from "@/types/cart";

interface Deal {
  id: number;
  title: string;
  dealType: "LIMITED_STOCK" | "COUPON_CODE" | "FLASH_SALE" | "BUNDLE_DEAL";
  urgencyLevel: "NORMAL" | "URGENT" | "CRITICAL";
  discountPercent?: number | null;
  discountFixed?: string | null;
  limitedQuantity?: number | null;
  claimedQuantity: number;
  maxCoupons?: number | null;
  usedCoupons: number;
  couponCode?: string | null;
  isActive: boolean;
  endsAt?: Date | null;
}

type ShopProductCardProps = {
  product: CartProduct & { deal?: Deal | null };
  description: string;
  featured?: boolean;
};

export default function ShopProductCard({
  product,
  description,
  featured,
}: ShopProductCardProps) {
  const isDealActive = product.deal?.isActive && 
    (!product.deal?.endsAt || new Date(product.deal.endsAt) > new Date());
  const discount = getDiscountDetails(product.price, product.compareAtPrice ?? null);

  return (
    <article className="group overflow-hidden rounded-4xl border border-border bg-card p-0 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative h-52 md:h-80 overflow-hidden bg-muted">
        <Link href={`/shop/${product.slug}`} className="relative block h-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </Link>
        <WishlistButton product={product} variant="overlay" className="absolute right-4 top-4 z-10" />
        {isDealActive && product.deal && (
          <div className="absolute left-4 top-4 z-10 max-w-[calc(100%-2rem)]">
            <LimitedOfferBadge deal={product.deal} />
          </div>
        )}
      </div>
      <div className="space-y-3 p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary">
          <span>{product.category ?? "Uncategorized"}</span>
          {featured && (
            <span className="rounded-full bg-primary/10 px-2 py-1 font-semibold text-primary">
              Featured
            </span>
          )}
        </div>
        <div>
          <Link href={`/shop/${product.slug}`}>
            <h2 className="text-lg md:text-2xl font-semibold text-foreground transition hover:text-primary">
              {product.name}
            </h2>
          </Link>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <p className="text-lg md:text-xl font-semibold text-foreground">
                {formatCartMoney(product.price, product.currency)}
              </p>
              {discount.mrp && (
                <p className="text-xs text-muted-foreground line-through">
                  MRP {formatCartMoney(discount.mrp, product.currency)}
                </p>
              )}
              {discount.mrp && (
                <span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
                  {discount.discountPercent}% OFF
                </span>
              )}
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center gap-2">
            {isDealActive && product.deal && (
              <ClaimFastButton dealId={product.deal.id} />
            )}
            <AddToCartButton product={product} size="sm" label="Add" className="shrink-0 px-3" />
            <CompareButton product={product} variant="icon" className="text-foreground" />
            <ShareProductButton name={product.name} slug={product.slug} />
            <Link
              href={`/shop/${product.slug}`}
              className="ml-auto inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
