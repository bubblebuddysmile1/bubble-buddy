import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import CheckoutPageClient from "@/components/checkout/CheckoutPageClient";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Checkout",
};

async function verifyCheckoutAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    redirect("/auth?returnTo=/checkout");
  }

  const payload = verifyAuthToken(token);
  if (!payload) {
    redirect("/auth?returnTo=/checkout");
  }

  return payload;
}

export default async function CheckoutPage() {
  const payload = await verifyCheckoutAuth();
  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { loyaltyPoints: true },
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-background py-12 text-foreground">
      <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <Link
          href="/cart"
          className="checkout-back-enter mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary"
        >
          <ChevronLeft className="size-4" />
          Back to cart
        </Link>

        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.32em] text-primary">Secure checkout</p>
          <h1 className="mt-3 text-4xl font-semibold text-foreground">Complete your order</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Enter your delivery address, review your bag, and pay securely with Razorpay. Address
            fields are validated with Zod before payment starts.
          </p>
        </div>

        <CheckoutPageClient loyaltyPoints={user?.loyaltyPoints ?? 0} />
      </div>
    </main>
  );
}
