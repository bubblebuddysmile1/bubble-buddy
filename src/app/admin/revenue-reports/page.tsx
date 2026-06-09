import AdminHeader from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";
import { DollarSign, TrendingUp, Receipt, PieChart, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default async function AdminRevenueReportsPage() {
  const [totalRevenue, orders, revenueByStatus, revenueByMonth] = await Promise.all([
    prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { totalAmount: true },
    }),
    prisma.order.findMany({
      where: { paymentStatus: "PAID" },
      select: {
        totalAmount: true,
        taxAmount: true,
        shippingAmount: true,
        discountAmount: true,
        placedAt: true,
        status: true,
      },
      orderBy: { placedAt: "desc" },
    }),
    prisma.order.groupBy({
      by: ["status"],
      where: { paymentStatus: "PAID" },
      _sum: { totalAmount: true },
      _count: true,
    }),
    prisma.order.groupBy({
      by: ["placedAt"],
      where: { paymentStatus: "PAID" },
      _sum: { totalAmount: true },
    }),
  ]);

  const revenue = totalRevenue._sum.totalAmount?.toNumber() || 0;
  const totalTax = orders.reduce((sum, order) => sum + order.taxAmount.toNumber(), 0);
  const totalShipping = orders.reduce((sum, order) => sum + order.shippingAmount.toNumber(), 0);
  const totalDiscounts = orders.reduce((sum, order) => sum + order.discountAmount.toNumber(), 0);
  const netRevenue = revenue - totalTax - totalShipping + totalDiscounts;

  const currentMonth = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const currentMonthRevenue = orders
    .filter((order) => order.placedAt && order.placedAt.getMonth() === currentMonth.getMonth())
    .reduce((sum, order) => sum + order.totalAmount.toNumber(), 0);

  const lastMonthRevenue = orders
    .filter((order) => order.placedAt && order.placedAt.getMonth() === lastMonth.getMonth())
    .reduce((sum, order) => sum + order.totalAmount.toNumber(), 0);

  const monthlyGrowth = lastMonthRevenue > 0 
    ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
    : 0;

  return (
    <>
      <AdminHeader
        title="Revenue Reports"
        description="Review revenue summaries, earnings reports, and financial insights."
      />

      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <DollarSign className="size-6" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${monthlyGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
                {monthlyGrowth >= 0 ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
                {Math.abs(monthlyGrowth).toFixed(1)}%
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Total Revenue</p>
            <p className="mt-2 text-3xl font-bold text-foreground">${revenue.toFixed(2)}</p>
          </div>

          <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <TrendingUp className="size-6" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Net Revenue</p>
            <p className="mt-2 text-3xl font-bold text-foreground">${netRevenue.toFixed(2)}</p>
          </div>

          <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <Receipt className="size-6" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Total Tax</p>
            <p className="mt-2 text-3xl font-bold text-foreground">${totalTax.toFixed(2)}</p>
          </div>

          <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <PieChart className="size-6" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Total Discounts</p>
            <p className="mt-2 text-3xl font-bold text-foreground">${totalDiscounts.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-foreground">Revenue by Order Status</h2>
            <div className="mt-4 space-y-3">
              {revenueByStatus.map((status) => (
                <div
                  key={status.status}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-background/80 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{status.status}</p>
                    <p className="text-xs text-muted-foreground">{status._count} orders</p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    ${(status._sum.totalAmount?.toNumber() || 0).toFixed(2)}
                  </p>
                </div>
              ))}
              {revenueByStatus.length === 0 && (
                <p className="text-sm text-muted-foreground">No revenue data available.</p>
              )}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-foreground">Financial Breakdown</h2>
            <div className="mt-4 space-y-3">
              <div className="rounded-3xl bg-background/80 px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Gross Revenue</p>
                  <p className="text-sm font-semibold text-foreground">${revenue.toFixed(2)}</p>
                </div>
              </div>
              <div className="rounded-3xl bg-background/80 px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Tax Collected</p>
                  <p className="text-sm font-semibold text-foreground">${totalTax.toFixed(2)}</p>
                </div>
              </div>
              <div className="rounded-3xl bg-background/80 px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Shipping Fees</p>
                  <p className="text-sm font-semibold text-foreground">${totalShipping.toFixed(2)}</p>
                </div>
              </div>
              <div className="rounded-3xl bg-background/80 px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Discounts Given</p>
                  <p className="text-sm font-semibold text-foreground">${totalDiscounts.toFixed(2)}</p>
                </div>
              </div>
              <div className="rounded-3xl bg-primary/10 px-4 py-3 border border-primary/20">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-primary">Net Revenue</p>
                  <p className="text-lg font-bold text-primary">${netRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-6 shadow-lg xl:col-span-2">
            <h2 className="text-xl font-semibold text-foreground">Recent Revenue Transactions</h2>
            <div className="mt-4 space-y-3">
              {orders.slice(0, 10).map((order) => (
                <div
                  key={order.placedAt?.toISOString()}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-background/80 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">${order.totalAmount.toString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.status} · {order.placedAt?.toLocaleDateString() || "N/A"}
                    </p>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Tax: ${order.taxAmount.toString()}</span>
                    <span>Shipping: ${order.shippingAmount.toString()}</span>
                    {order.discountAmount.toNumber() > 0 && (
                      <span className="text-green-600">Discount: -${order.discountAmount.toString()}</span>
                    )}
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-sm text-muted-foreground">No revenue transactions yet.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
