import Razorpay from "razorpay";

export function isRazorpayConfigured(): boolean {
  return Boolean(
    process.env.RAZORPAY_KEY_ID &&
      process.env.RAZORPAY_KEY_SECRET &&
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  );
}

/** Use mock payment flow when keys are missing or MOCK_PAYMENTS=true */
export function isMockPaymentMode(): boolean {
  return process.env.MOCK_PAYMENTS === "true" || !isRazorpayConfigured();
}

export function getRazorpayKeyId(): string {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? process.env.RAZORPAY_KEY_ID ?? "";
}

export function createRazorpayClient(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured.");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

export function toSmallestCurrencyUnit(amount: number): number {
  return Math.round(amount * 100);
}

export function getPaymentCurrency(cartCurrency: string): string {
  const normalized = cartCurrency.toUpperCase();
  if (normalized === "INR" || normalized === "USD") {
    return normalized;
  }
  return "INR";
}
