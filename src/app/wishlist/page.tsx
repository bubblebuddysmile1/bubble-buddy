import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getWishlistItems() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    redirect("/auth?returnTo=/wishlist");
  }

  const payload = verifyAuthToken(token);
  if (!payload) {
    redirect("/auth?returnTo=/wishlist");
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: payload.id },
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        select: { id: true, name: true, price: true, thumbnail: true },
      },
    },
  });

  return favorites;
}

export default async function WishlistPage() {
  const favorites = await getWishlistItems();

  return (
    <main className="min-h-screen bg-background text-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 rounded-[2rem] border border-border bg-card p-8 shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Wishlist</p>
          <h1 className="mt-3 text-4xl font-bold">Saved products</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Your wishlist lets you save products for later. Add items now and check them out when you're ready.
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="rounded-[2rem] border border-border bg-card p-10 text-center shadow-lg">
            <p className="text-xl font-semibold text-foreground">Wishlist is empty</p>
            <p className="mt-3 text-sm text-muted-foreground">Save your favorite products and return whenever you want.</p>
            <Link href="/shop" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {favorites.map((favorite) => (
              <div key={favorite.product.id} className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
                <div className="h-48 bg-muted">
                  {favorite.product.thumbnail ? (
                    <img
                      src={favorite.product.thumbnail}
                      alt={favorite.product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No image</div>
                  )}
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-foreground">{favorite.product.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">₹{favorite.product.price.toString()}</p>
                  <Link
                    href="/shop"
                    className="mt-4 inline-flex rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
                  >
                    Shop now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
