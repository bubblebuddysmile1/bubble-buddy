import { z } from "zod";

export const checkoutAddressSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(80, "Name is too long"),
  phone: z
    .string()
    .trim()
    .min(10, "Enter a valid phone number")
    .max(20, "Phone number is too long")
    .regex(/^[0-9+\-\s()]+$/, "Phone can only contain numbers and + - ( )"),
  line1: z
    .string()
    .trim()
    .min(5, "Street address is required")
    .max(120, "Address is too long"),
  line2: z.string().trim().max(120, "Address line 2 is too long").optional(),
  city: z.string().trim().min(2, "City is required").max(60, "City name is too long"),
  state: z
    .string()
    .trim()
    .min(2, "State / province is required")
    .max(60, "State name is too long"),
  postalCode: z
    .string()
    .trim()
    .min(4, "Postal code is required")
    .max(12, "Postal code is too long"),
  country: z.string().trim().min(2, "Country is required").max(60, "Country name is too long"),
});

export type CheckoutAddressForm = z.infer<typeof checkoutAddressSchema>;

export const checkoutAddressDefaultValues: CheckoutAddressForm = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

export function formatZodFieldErrors(
  error: z.ZodError<CheckoutAddressForm>,
): Partial<Record<keyof CheckoutAddressForm, string>> {
  const fieldErrors: Partial<Record<keyof CheckoutAddressForm, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof CheckoutAddressForm | undefined;
    if (key && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}
