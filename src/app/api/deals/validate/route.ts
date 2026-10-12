import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getDealByCouponCode,
  getDealCouponDiscount,
  getDealCouponValidationMessage,
} from "@/lib/deal-coupons";
import { cartItemSchema } from "@/lib/validations/payment";

const validateDealSchema = z.object({
  code: z.string().trim().min(1),
  items: z.array(cartItemSchema).min(1),
});

export async function POST(request: Request) {
  try {
    const parsed = validateDealSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid Deal validation request.", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { code, items } = parsed.data;
    const deal = await getDealByCouponCode(code);
    if (!deal) {
      return NextResponse.json({ error: "Deal code is invalid." }, { status: 404 });
    }

    const discount = getDealCouponDiscount(deal, items);
    if (discount <= 0) {
      return NextResponse.json(
        {
          error: "Deal code cannot be applied.",
          message: getDealCouponValidationMessage(deal, items),
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      code: deal.couponCode,
      title: deal.title,
      discount: Number(discount.toFixed(2)),
    });
  } catch (error) {
    console.error("[api/deals/validate]", error);
    return NextResponse.json({ error: "Unable to validate Deal code." }, { status: 500 });
  }
}
