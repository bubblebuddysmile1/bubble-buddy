"use client";

import { AlertCircle, Zap, Gift, Clock } from "lucide-react";

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
}

interface LimitedOfferBadgeProps {
  deal: Deal;
}

export default function LimitedOfferBadge({ deal }: LimitedOfferBadgeProps) {
  const getIcon = () => {
    switch (deal.dealType) {
      case "LIMITED_STOCK":
        return <AlertCircle className="w-3 h-3" />;
      case "FLASH_SALE":
        return <Zap className="w-3 h-3" />;
      case "COUPON_CODE":
        return <Gift className="w-3 h-3" />;
      case "BUNDLE_DEAL":
        return <Clock className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getUrgencyColor = () => {
    switch (deal.urgencyLevel) {
      case "CRITICAL":
        return "bg-red-500 text-white";
      case "URGENT":
        return "bg-orange-500 text-white";
      default:
        return "bg-primary text-white";
    }
  };

  const getRemaining = () => {
    if (deal.dealType === "LIMITED_STOCK" && deal.limitedQuantity) {
      const remaining = deal.limitedQuantity - deal.claimedQuantity;
      return remaining > 0 ? `Only ${remaining} Left` : "Sold Out";
    }
    if (deal.dealType === "COUPON_CODE" && deal.maxCoupons) {
      const remaining = deal.maxCoupons - deal.usedCoupons;
      return remaining > 0 ? `${remaining} Coupons Available` : "All Used";
    }
    return deal.title;
  };

  const discount = deal.discountPercent 
    ? `${deal.discountPercent}% OFF`
    : deal.discountFixed
    ? `${deal.discountFixed} OFF`
    : null;

  return (
    <div className={`${getUrgencyColor()} rounded-lg px-3 py-2 text-xs font-semibold flex items-center gap-2 w-full`}>
      {getIcon()}
      <span className="truncate">
        {discount ? `${discount} - ${getRemaining()}` : getRemaining()}
      </span>
    </div>
  );
}
