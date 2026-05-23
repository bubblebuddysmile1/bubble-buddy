import { z } from "zod";
import { checkoutAddressSchema } from "@/lib/validations/checkout";

const cartItemSchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  price: z.number().positive(),
  currency: z.string(),
  quantity: z.number().int().positive(),
  stockQuantity: z.number().int().nonnegative(),
});

export const createPaymentOrderSchema = z.object({
  address: checkoutAddressSchema,
  items: z.array(cartItemSchema).min(1, "Cart cannot be empty"),
});

export type CreatePaymentOrderInput = z.infer<typeof createPaymentOrderSchema>;

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;

