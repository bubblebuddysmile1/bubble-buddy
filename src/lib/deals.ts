/**
 * Deal Management Utilities
 * Handle deal-related calculations and validations
 */

export interface Deal {
  id: number;
  title: string;
  dealType: "LIMITED_STOCK" | "COUPON_CODE" | "FLASH_SALE" | "BUNDLE_DEAL";
  urgencyLevel: "NORMAL" | "URGENT" | "CRITICAL";
  discountPercent?: number | null;
  discountFixed?: string | number | null;
  limitedQuantity?: number | null;
  claimedQuantity: number;
  maxCoupons?: number | null;
  usedCoupons: number;
  isActive: boolean;
  endsAt?: Date | string | null;
  startsAt?: Date | string | null;
}

/**
 * Check if a deal is currently active
 */
export function isDealActive(deal: Deal): boolean {
  if (!deal.isActive) return false;

  const now = new Date();

  // Check if deal has started
  if (deal.startsAt) {
    const startDate = new Date(deal.startsAt);
    if (now < startDate) return false;
  }

  // Check if deal has ended
  if (deal.endsAt) {
    const endDate = new Date(deal.endsAt);
    if (now > endDate) return false;
  }

  return true;
}

/**
 * Get remaining quantity for a deal
 */
export function getRemainingQuantity(deal: Deal): number | null {
  if (deal.dealType === "LIMITED_STOCK" && deal.limitedQuantity) {
    return Math.max(0, deal.limitedQuantity - deal.claimedQuantity);
  }
  return null;
}

/**
 * Get remaining coupons for a deal
 */
export function getRemainingCoupons(deal: Deal): number | null {
  if (deal.dealType === "COUPON_CODE" && deal.maxCoupons) {
    return Math.max(0, deal.maxCoupons - deal.usedCoupons);
  }
  return null;
}

/**
 * Check if a deal is exhausted
 */
export function isDealExhausted(deal: Deal): boolean {
  if (deal.dealType === "LIMITED_STOCK" && deal.limitedQuantity) {
    return deal.claimedQuantity >= deal.limitedQuantity;
  }

  if (deal.dealType === "COUPON_CODE" && deal.maxCoupons) {
    return deal.usedCoupons >= deal.maxCoupons;
  }

  return false;
}

/**
 * Format deal discount text
 */
export function getDiscountText(deal: Deal): string {
  if (deal.discountPercent) return `${deal.discountPercent}% OFF`;
  if (deal.discountFixed) return `₹${deal.discountFixed} OFF`;
  return "Special Deal";
}

/**
 * Get urgency badge color
 */
export function getUrgencyColor(level: string): {
  bg: string;
  text: string;
  border: string;
} {
  switch (level) {
    case "CRITICAL":
      return { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" };
    case "URGENT":
      return { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200" };
    default:
      return { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" };
  }
}

/**
 * Get deal type display name
 */
export function getDealTypeLabel(dealType: string): string {
  const labels: Record<string, string> = {
    LIMITED_STOCK: "Limited Stock",
    COUPON_CODE: "Coupon Code",
    FLASH_SALE: "Flash Sale",
    BUNDLE_DEAL: "Bundle Deal"
  };
  return labels[dealType] || dealType;
}

/**
 * Calculate discount amount from percentage
 */
export function calculatePercentageDiscount(
  originalPrice: number,
  discountPercent: number
): number {
  return (originalPrice * discountPercent) / 100;
}

/**
 * Calculate final price after discount
 */
export function calculateFinalPrice(
  originalPrice: number,
  deal: Deal
): number {
  let discount = 0;

  if (deal.discountPercent) {
    discount = calculatePercentageDiscount(originalPrice, deal.discountPercent);
  } else if (deal.discountFixed) {
    discount = parseFloat(deal.discountFixed.toString());
  }

  return Math.max(0, originalPrice - discount);
}

/**
 * Format remaining stock/coupon message
 */
export function getAvailabilityMessage(deal: Deal): string {
  if (!isDealActive(deal)) return "Deal Expired";

  if (isDealExhausted(deal)) {
    return deal.dealType === "COUPON_CODE" ? "All Coupons Used" : "Sold Out";
  }

  if (deal.dealType === "LIMITED_STOCK") {
    const remaining = getRemainingQuantity(deal);
    if (remaining !== null) {
      if (remaining === 0) return "Sold Out";
      if (remaining === 1) return "Last 1 Left";
      if (remaining <= 5) return `Only ${remaining} Left`;
      if (remaining <= 10) return `${remaining} Available`;
      return "In Stock";
    }
  }

  if (deal.dealType === "COUPON_CODE") {
    const remaining = getRemainingCoupons(deal);
    if (remaining !== null) {
      if (remaining === 0) return "All Used";
      if (remaining === 1) return "Last 1 Code";
      if (remaining <= 5) return `${remaining} Codes Left`;
      return `${remaining} Available`;
    }
  }

  return "Available";
}
