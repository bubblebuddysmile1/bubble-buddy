import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CartPageClient from "@/components/cart/CartPageClient";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

export const metadata = {
  title: "Your cart",
};

async function verifyCartAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    redirect("/auth?returnTo=/cart");
  }

  const payload = verifyAuthToken(token);
  if (!payload) {
    redirect("/auth?returnTo=/cart");
  }

  return payload;
}

export default async function CartPage() {
  await verifyCartAuth();

  return (
    <main className="relative min-h-screen overflow-hidden bg-background py-12 text-foreground">
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <div className="mb-10 text-center md:text-left">
          <p className="text-xs uppercase tracking-[0.32em] text-primary">Shopping bag</p>
          <h1 className="mt-3 text-4xl font-semibold text-foreground">Your cart</h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Adjust quantities, remove items, and review your order total with a smooth, modern
            checkout-ready layout.
          </p>
        </div>

        <CartPageClient />
      </div>
    </main>
  );
}
