import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getProfileData() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    redirect("/auth?returnTo=/profile");
  }

  const payload = verifyAuthToken(token);
  if (!payload) {
    redirect("/auth?returnTo=/profile");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
      loyaltyPoints: true,
      createdAt: true,
      _count: { select: { orders: true, favorites: true } },
      orders: {
        select: { id: true, orderNumber: true, status: true, totalAmount: true, placedAt: true },
        orderBy: { placedAt: "desc" },
        take: 3,
      },
      favorites: {
        select: {
          product: {
            select: { id: true, name: true, price: true, thumbnail: true },
          },
        },
        orderBy: { id: "desc" },
        take: 3,
      },
    },
  });

  if (!user) {
    redirect("/auth?returnTo=/profile");
  }

  return user;
}

export default async function ProfilePage() {
  const user = await getProfileData();

  const createdAt = new Date(user.createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-background text-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-border bg-card p-8 shadow-lg md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Your Account</p>
            <h1 className="mt-3 text-4xl font-bold">{user.name ?? "Welcome back"}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Manage your profile, recent orders, and wishlist in one place.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/orders"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              View Orders
            </Link>
            <Link
              href="/wishlist"
              className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              View Wishlist
            </Link>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[2rem] border border-border bg-card p-8 shadow-lg">
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-border bg-background/80 p-5 text-center">
                <p className="text-sm text-muted-foreground">Joined</p>
                <p className="mt-3 text-xl font-semibold text-foreground">{createdAt}</p>
              </div>
              <div className="rounded-3xl border border-border bg-background/80 p-5 text-center">
                <p className="text-sm text-muted-foreground">Total orders</p>
                <p className="mt-3 text-xl font-semibold text-foreground">{user._count.orders}</p>
              </div>
              <div className="rounded-3xl border border-border bg-background/80 p-5 text-center">
                <p className="text-sm text-muted-foreground">Wishlist items</p>
                <p className="mt-3 text-xl font-semibold text-foreground">{user._count.favorites}</p>
              </div>
              <div className="rounded-3xl border border-border bg-background/80 p-5 text-center">
                <p className="text-sm text-muted-foreground">Loyalty points</p>
                <p className="mt-3 text-xl font-semibold text-foreground">{user.loyaltyPoints}</p>
              </div>
            </div>

            <div className="space-y-6">
              <ProfileEditForm
                initialName={user.name ?? ""}
                initialPhone={user.phone ?? ""}
              />

              <div className="rounded-[1.75rem] border border-border bg-background/80 p-6">
                <h2 className="text-xl font-semibold">Account details</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-card p-4 shadow-sm">
                    <p className="text-xs uppercase text-muted-foreground">Email</p>
                    <p className="mt-2 text-sm text-foreground">{user.email}</p>
                  </div>
                  <div className="rounded-3xl bg-card p-4 shadow-sm">
                    <p className="text-xs uppercase text-muted-foreground">Role</p>
                    <p className="mt-2 text-sm text-foreground">{user.role}</p>
                  </div>
                  <div className="rounded-3xl bg-card p-4 shadow-sm">
                    <p className="text-xs uppercase text-muted-foreground">Phone</p>
                    <p className="mt-2 text-sm text-foreground">{user.phone ?? "Not added"}</p>
                  </div>
                  <div className="rounded-3xl bg-card p-4 shadow-sm">
                    <p className="text-xs uppercase text-muted-foreground">Recent order</p>
                    <p className="mt-2 text-sm text-foreground">{user.orders[0]?.orderNumber ?? "No orders yet"}</p>
                  </div>
                </div>
              </div>

              {user.orders.length > 0 && (
                <div className="rounded-[1.75rem] border border-border bg-background/80 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl font-semibold">Recent orders</h2>
                    <Link href="/orders" className="text-sm font-semibold text-primary hover:underline">
                      View all
                    </Link>
                  </div>
                  <div className="mt-4 space-y-3">
                    {user.orders.map((order) => (
                      <div
                        key={order.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-card p-4 shadow-sm"
                      >
                        <div>
                          <p className="text-sm font-semibold text-foreground">#{order.orderNumber}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {order.placedAt
                              ? new Date(order.placedAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "—"}
                          </p>
                        </div>
                        <div className="text-right text-sm">
                          <p className="font-semibold text-foreground">${order.totalAmount.toString()}</p>
                          <p className="text-muted-foreground">{order.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-[1.75rem] border border-border bg-background/80 p-6">
                <h2 className="text-xl font-semibold">Quick summary</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-card p-5 shadow-sm">
                    <p className="text-sm text-muted-foreground">Recent order status</p>
                    <p className="mt-3 text-lg font-semibold text-foreground">{user.orders[0]?.status ?? "N/A"}</p>
                  </div>
                  <div className="rounded-3xl bg-card p-5 shadow-sm">
                    <p className="text-sm text-muted-foreground">Wishlist sample</p>
                    <p className="mt-3 text-lg font-semibold text-foreground">{user.favorites[0]?.product.name ?? "No favorites yet"}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
              <h2 className="text-lg font-semibold">Need help?</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Update your profile data or reach out to support for help with orders and wishlist.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <Link href="/shop" className="rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                  Shop now
                </Link>
                <Link href="/auth" className="rounded-full border border-border px-4 py-3 text-center text-sm font-semibold text-foreground transition hover:bg-muted">
                  Auth settings
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
              <h3 className="text-lg font-semibold">Recent favorites</h3>
              <div className="mt-4 space-y-3">
                {user.favorites.length > 0 ? (
                  user.favorites.map((favorite) => (
                    <div key={favorite.product.id} className="rounded-3xl bg-background/80 p-4">
                      <p className="text-sm font-semibold text-foreground">{favorite.product.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">${favorite.product.price.toString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No favorites yet. Add products to your wishlist to see them here.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
