const POINT_VALUE = 0.01;
const EARN_RATE = 1;

export function loyaltyDiscountFromRedeem(points: number): number {
  return Math.max(0, points) * POINT_VALUE;
}

export function getMaxRedeemablePoints(pointsBalance: number, orderAmount: number): number {
  const maxByOrder = Math.floor(Math.max(0, orderAmount) / POINT_VALUE);
  return Math.max(0, Math.min(pointsBalance, maxByOrder));
}

export function getLoyaltyPointsEarned(orderAmount: number): number {
  return Math.floor(Math.max(0, orderAmount) * EARN_RATE);
}

export function formatLoyaltyPoints(points: number): string {
  return `${points.toLocaleString()} pts`;
}
