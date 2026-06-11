import AdminHeader from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";
import { Activity, AlertCircle, CheckCircle, Clock, ShieldCheck, TrendingUp, Users, ShoppingCart, Package } from "lucide-react";

export default async function AdminMetricsPage() {
  const periodStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    totalOrders,
    totalProducts,
    totalCategories,
    pendingOrders,
    completedOrders,
    recentUsers,
    recentOrders,
    recentLogins,
    recentFailedLogins,
    recentAdminActions,
    recentSecurityAlerts,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: periodStart,
        },
      },
    }),
    prisma.order.count({
      where: {
        placedAt: {
          gte: periodStart,
        },
      },
    }),
    prisma.activityLog.count({
      where: { eventType: "LOGIN", createdAt: { gte: periodStart } },
    }),
    prisma.activityLog.count({
      where: { eventType: "FAILED_LOGIN", createdAt: { gte: periodStart } },
    }),
    prisma.activityLog.count({
      where: { eventType: "ADMIN_ACTION", createdAt: { gte: periodStart } },
    }),
    prisma.activityLog.count({
      where: { eventType: "SECURITY_ALERT", createdAt: { gte: periodStart } },
    }),
  ]);

  const totalRevenue = await prisma.order.aggregate({
    where: { paymentStatus: "PAID" },
    _sum: { totalAmount: true },
  });

  const revenue = totalRevenue._sum.totalAmount?.toNumber() || 0;

  const metrics = [
    {
      label: "Total Users",
      value: totalUsers.toString(),
      icon: Users,
      trend: `+${recentUsers} this month`,
      trendUp: true,
      color: "text-blue-600",
      bgColor: "bg-blue-600/10",
    },
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      icon: ShoppingCart,
      trend: `+${recentOrders} this month`,
      trendUp: true,
      color: "text-green-600",
      bgColor: "bg-green-600/10",
    },
    {
      label: "Total Products",
      value: totalProducts.toString(),
      icon: Package,
      trend: "Active catalog",
      trendUp: true,
      color: "text-purple-600",
      bgColor: "bg-purple-600/10",
    },
    {
      label: "Total Categories",
      value: totalCategories.toString(),
      icon: Activity,
      trend: "Organized",
      trendUp: true,
      color: "text-orange-600",
      bgColor: "bg-orange-600/10",
    },
  ];

  const orderMetrics = [
    {
      label: "Pending Orders",
      value: pendingOrders.toString(),
      icon: Clock,
      description: "Orders awaiting processing",
      color: "text-orange-600",
      bgColor: "bg-orange-600/10",
    },
    {
      label: "Completed Orders",
      value: completedOrders.toString(),
      icon: CheckCircle,
      description: "Successfully delivered orders",
      color: "text-green-600",
      bgColor: "bg-green-600/10",
    },
    {
      label: "Total Revenue",
      value: `$${revenue.toFixed(2)}`,
      icon: TrendingUp,
      description: "Lifetime revenue",
      color: "text-blue-600",
      bgColor: "bg-blue-600/10",
    },
    {
      label: "Avg Order Value",
      value: `$${totalOrders > 0 ? (revenue / totalOrders).toFixed(2) : "0.00"}`,
      icon: Activity,
      description: "Average per order",
      color: "text-purple-600",
      bgColor: "bg-purple-600/10",
    },
  ];

  const healthMetrics = [
    {
      label: "System Health",
      value: "Good",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-600/10",
    },
    {
      label: "Database Status",
      value: "Connected",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-600/10",
    },
    {
      label: "Payment Gateway",
      value: "Active",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-600/10",
    },
    {
      label: "Email Service",
      value: "Active",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-600/10",
    },
  ];

  return (
    <>
      <AdminHeader
        title="Admin Metrics"
        description="Monitor overall site performance, user activity, and key administrative indicators."
      />

      <div className="space-y-6 p-6">
        <section className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-foreground">Overview Metrics</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
                  <div className="rounded-2xl p-3 text-primary">
                    <Icon className={`size-6 ${metric.color}`} />
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">{metric.label}</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{metric.value}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{metric.trend}</p>
                </div>
              );
            })}
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-foreground">Order Performance</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {orderMetrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div key={metric.label} className="rounded-3xl bg-background/80 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-xl p-2 ${metric.bgColor}`}>
                        <Icon className={`size-5 ${metric.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">{metric.label}</p>
                        <p className="mt-1 text-lg font-bold text-foreground">{metric.value}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{metric.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-foreground">System Health</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {healthMetrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div key={metric.label} className="rounded-3xl bg-background/80 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-xl p-2 ${metric.bgColor}`}>
                        <Icon className={`size-5 ${metric.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">{metric.label}</p>
                        <p className="mt-1 text-lg font-bold text-foreground">{metric.value}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <section className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-foreground">Activity Summary</h2>
          <div className="mt-4 space-y-4">
            <div className="rounded-3xl bg-background/80 px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">New Users (Last 30 Days)</p>
                  <p className="text-xs text-muted-foreground">User registration activity</p>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="size-5 text-primary" />
                  <span className="text-2xl font-bold text-foreground">{recentUsers}</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-background/80 px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">New Orders (Last 30 Days)</p>
                  <p className="text-xs text-muted-foreground">Order placement activity</p>
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="size-5 text-primary" />
                  <span className="text-2xl font-bold text-foreground">{recentOrders}</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-background/80 px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Conversion Rate</p>
                  <p className="text-xs text-muted-foreground">Orders per user ratio</p>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-5 text-primary" />
                  <span className="text-2xl font-bold text-foreground">
                    {totalUsers > 0 ? ((totalOrders / totalUsers) * 100).toFixed(1) : "0.0"}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {pendingOrders > 0 && (
          <section className="rounded-[2rem] border border-orange-200 bg-orange-50 p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="size-6 text-orange-600" />
              <div>
                <h3 className="text-lg font-semibold text-orange-900">Action Required</h3>
                <p className="text-sm text-orange-700">
                  You have {pendingOrders} pending order{pendingOrders > 1 ? "s" : ""} that need attention.
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-foreground">Security Monitoring</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[1.75rem] border border-border bg-background p-6 shadow-sm">
              <div className="rounded-2xl bg-blue-600/10 p-3 text-blue-600">
                <Clock className="size-6" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Successful Logins</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{recentLogins}</p>
            </div>
            <div className="rounded-[1.75rem] border border-border bg-background p-6 shadow-sm">
              <div className="rounded-2xl bg-red-600/10 p-3 text-red-600">
                <Activity className="size-6" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Failed Login Attempts</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{recentFailedLogins}</p>
            </div>
            <div className="rounded-[1.75rem] border border-border bg-background p-6 shadow-sm">
              <div className="rounded-2xl bg-purple-600/10 p-3 text-purple-600">
                <ShieldCheck className="size-6" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Admin Actions</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{recentAdminActions}</p>
            </div>
            <div className="rounded-[1.75rem] border border-border bg-background p-6 shadow-sm">
              <div className="rounded-2xl bg-yellow-600/10 p-3 text-yellow-600">
                <AlertCircle className="size-6" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Security Alerts</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{recentSecurityAlerts}</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
