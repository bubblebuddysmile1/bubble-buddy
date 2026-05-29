import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import WishlistPageClient from "@/components/wishlist/WishlistPageClient";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

export const metadata = {
  title: "Wishlist",
};

async function verifyWishlistAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    redirect("/auth?returnTo=/wishlist");
  }

  const payload = verifyAuthToken(token);
  if (!payload) {
    redirect("/auth?returnTo=/wishlist");
  }

  return payload;
}

export default async function WishlistPage() {
  await verifyWishlistAuth();

  return (
    <main className="relative min-h-screen overflow-hidden bg-background py-12 text-foreground">
      <div className="pointer-events-none absolute -left-16 top-8 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <div className="mb-10 rounded-[2rem] border border-border bg-card p-8 shadow-lg">
          <p className="text-xs uppercase tracking-[0.32em] text-primary">Saved for later</p>
          <h1 className="mt-3 text-4xl font-semibold text-foreground">Your wishlist</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            Heart the products you love — they stay saved on this device. Move them to cart when
            you are ready to buy.
          </p>
        </div>

        <WishlistPageClient />
      </div>
    </main>
  );
}
