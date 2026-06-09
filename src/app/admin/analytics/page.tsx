import AdminHeader from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";
import { TrendingUp, Users, ShoppingCart, DollarSign, Package, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default async function AdminAnalyticsPage() {
  const [totalRevenue, totalOrders, totalCustomers, totalProducts, recentOrders, topProducts] = await Promise.all([
    prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { totalAmount: true },
    }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count(),
    prisma.order.findMany({
      orderBy: { placedAt: "desc" },
      take: 5,
      select: {
        orderNumber: true,
        totalAmount: true,
        status: true,
        placedAt: true,
      },
    }),
    prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  const revenue = totalRevenue._sum.totalAmount?.toNumber() || 0;

  const stats = [
    {
      label: "Total Revenue",
      value: `$${revenue.toFixed(2)}`,
      icon: DollarSign,
      trend: "+12.5%",
      trendUp: true,
    },
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      icon: ShoppingCart,
      trend: "+8.2%",
      trendUp: true,
    },
    {
      label: "Total Customers",
      value: totalCustomers.toString(),
      icon: Users,
      trend: "+5.1%",
      trendUp: true,
    },
    {
      label: "Total Products",
      value: totalProducts.toString(),
      icon: Package,
      trend: "+2.3%",
      trendUp: true,
    },
  ];

  return (
    <>
      <AdminHeader
        title="Analytics Dashboard"
        description="Monitor your store traffic, product performance, and growth trends."
      />

      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trendUp ? ArrowUpRight : ArrowDownRight;
            return (
              <div
                key={stat.label}
                className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${stat.trendUp ? "text-green-600" : "text-red-600"}`}>
                    <TrendIcon className="size-4" />
                    {stat.trend}
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-foreground">Recent Orders</h2>
            <div className="mt-4 space-y-3">
              {recentOrders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No orders yet.</p>
              ) : (
                recentOrders.map((order) => (
                  <div
                    key={order.orderNumber}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-background/80 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">#{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.status} · {order.placedAt?.toLocaleDateString() || "N/A"}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      ${order.totalAmount.toString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-foreground">Quick Stats</h2>
            <div className="mt-4 space-y-4">
              <div className="rounded-3xl bg-background/80 px-4 py-3">
                <p className="text-xs text-muted-foreground">Average Order Value</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  ${totalOrders > 0 ? (revenue / totalOrders).toFixed(2) : "0.00"}
                </p>
              </div>
              <div className="rounded-3xl bg-background/80 px-4 py-3">
                <p className="text-xs text-muted-foreground">Conversion Rate</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {totalCustomers > 0 ? ((totalOrders / totalCustomers) * 100).toFixed(1) : "0.0"}%
                </p>
              </div>
              <div className="rounded-3xl bg-background/80 px-4 py-3">
                <p className="text-xs text-muted-foreground">Revenue per Customer</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  ${totalCustomers > 0 ? (revenue / totalCustomers).toFixed(2) : "0.00"}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
