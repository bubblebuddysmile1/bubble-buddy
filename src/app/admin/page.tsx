import Link from "next/link";
import { FolderTree, Package, ShoppingBag, Users } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [productCount, orderCount, userCount, categoryCount, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.category.count(),
    prisma.order.findMany({
      orderBy: { placedAt: "desc" },
      take: 5,
      select: {
        orderNumber: true,
        totalAmount: true,
        status: true,
        placedAt: true,
        user: { select: { email: true } },
      },
    }),
  ]);

  const stats = [
    { label: "Products", value: productCount, icon: Package, href: "/admin/products" },
    { label: "Categories", value: categoryCount, icon: FolderTree, href: "/admin/categories" },
    { label: "Orders", value: orderCount, icon: ShoppingBag, href: "/admin/orders" },
    { label: "Customers", value: userCount, icon: Users, href: "/admin/customers" },
  ];

  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="Overview of your store activity and quick admin actions."
      />

      <div className="space-y-8 p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm transition hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <Icon className="size-6" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-foreground">Recent orders</h2>
              <Link href="/admin/orders" className="text-sm font-semibold text-primary hover:underline">
                View all
              </Link>
            </div>
            {recentOrders.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.orderNumber}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-background/80 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">#{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.user?.email ?? "Guest"} · {order.status}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      ${order.totalAmount.toString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-foreground">Quick actions</h2>
            <div className="mt-4 space-y-3">
              <Link
                href="/admin/products"
                className="flex items-center gap-3 rounded-3xl border border-border bg-background/80 px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary/40"
              >
                <Package className="size-4 text-primary" />
                Manage products
              </Link>
              <Link
                href="/admin/categories"
                className="flex items-center gap-3 rounded-3xl border border-border bg-background/80 px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary/40"
              >
                <FolderTree className="size-4 text-primary" />
                Manage categories
              </Link>
              <Link
                href="/shop"
                className="flex items-center gap-3 rounded-3xl border border-border bg-background/80 px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary/40"
              >
                <Package className="size-4 text-primary" />
                Open storefront
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
