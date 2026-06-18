import { NextResponse } from "next/server";
import { z } from "zod";
import { getPromotionByCode, getPromotionDiscountAmount, isPromotionActive, getPromotionValidationMessage } from "@/lib/promotions";
import { cartItemSchema } from "@/lib/validations/payment";
import type { CartItem } from "@/types/cart";

const validatePromotionSchema = z.object({
  code: z.string().min(1),
  items: z.array(cartItemSchema).min(1),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = validatePromotionSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid coupon validation request.", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { code, items } = parsed.data;
    const promotion = await getPromotionByCode(code);

    if (!promotion || !isPromotionActive(promotion)) {
      return NextResponse.json({ error: "Coupon code is invalid or expired." }, { status: 404 });
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = getPromotionDiscountAmount(promotion, subtotal, items);

    if (discount <= 0) {
      return NextResponse.json(
        {
          error: "Coupon code cannot be applied.",
          message: getPromotionValidationMessage(promotion, subtotal, items),
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      code: promotion.code,
      title: promotion.title,
      description: promotion.description,
      discount: Number(discount.toFixed(2)),
      discountType: promotion.discountType,
      discountValue: Number(promotion.discountValue),
      minOrderAmount: Number(promotion.minOrderAmount),
    });
  } catch (error) {
    console.error("[api/promotions/validate]", error);
    return NextResponse.json(
      { error: "Unable to validate coupon code." },
      { status: 500 },
    );
  }
}
