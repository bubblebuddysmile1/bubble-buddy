import { NextResponse } from "next/server";
import { getCheckoutTotals } from "@/lib/checkout";
import {
  createRazorpayClient,
  getPaymentCurrency,
  getRazorpayKeyId,
  isMockPaymentMode,
  toSmallestCurrencyUnit,
} from "@/lib/razorpay";
import { createPaymentOrderSchema } from "@/lib/validations/payment";
import type { CartItem } from "@/types/cart";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = createPaymentOrderSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid checkout data.", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { address, items } = parsed.data;
    const cartItems: CartItem[] = items.map((item) => ({
      ...item,
      image: "",
      category: undefined,
    }));
    const totals = getCheckoutTotals(cartItems);
    const currency = getPaymentCurrency(totals.currency);
    const amount = toSmallestCurrencyUnit(totals.total);
    const receipt = `bb_${Date.now()}`;

    if (isMockPaymentMode()) {
      const mockOrderId = `order_mock_${Date.now()}`;
      return NextResponse.json({
        mock: true,
        orderId: mockOrderId,
        amount,
        currency,
        keyId: "mock_key",
        receipt,
        totals,
        address,
      });
    }

    const razorpay = createRazorpayClient();
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt,
      notes: {
        customer: address.fullName,
        phone: address.phone,
        city: address.city,
      },
    });

    return NextResponse.json({
      mock: false,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: getRazorpayKeyId(),
      receipt: order.receipt,
      totals,
      address,
    });
  } catch (error) {
    console.error("[payments/create-order]", error);
    return NextResponse.json(
      { error: "Unable to create payment order. Please try again." },
      { status: 500 },
    );
  }
}
