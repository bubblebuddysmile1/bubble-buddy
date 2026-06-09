import AdminHeader from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";
import { TrendingUp, Calendar, DollarSign, BarChart3 } from "lucide-react";

export default async function AdminSalesChartsPage() {
  const orders = await prisma.order.findMany({
    where: { paymentStatus: "PAID" },
    select: {
      totalAmount: true,
      placedAt: true,
      status: true,
    },
    orderBy: { placedAt: "desc" },
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount.toNumber(), 0);

  const dailySales = new Map<string, number>();
  const weeklySales = new Map<string, number>();
  const monthlySales = new Map<string, number>();

  orders.forEach((order) => {
    if (!order.placedAt) return;
    
    const date = order.placedAt;
    const dayKey = date.toISOString().split('T')[0];
    const weekKey = getWeekKey(date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    dailySales.set(dayKey, (dailySales.get(dayKey) || 0) + order.totalAmount.toNumber());
    weeklySales.set(weekKey, (weeklySales.get(weekKey) || 0) + order.totalAmount.toNumber());
    monthlySales.set(monthKey, (monthlySales.get(monthKey) || 0) + order.totalAmount.toNumber());
  });

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const last4Weeks = Array.from({ length: 4 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (i * 7));
    return getWeekKey(date);
  }).reverse();

  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }).reverse();

  function getWeekKey(date: Date): string {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().split('T')[0];
  }

  const maxDailyValue = Math.max(...last7Days.map(day => dailySales.get(day) || 0), 1);
  const maxWeeklyValue = Math.max(...last4Weeks.map(week => weeklySales.get(week) || 0), 1);
  const maxMonthlyValue = Math.max(...last6Months.map(month => monthlySales.get(month) || 0), 1);

  return (
    <>
      <AdminHeader
        title="Sales Charts"
        description="Explore your sales performance with visual trends and breakdowns."
      />

      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <DollarSign className="size-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="mt-1 text-2xl font-bold text-foreground">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <BarChart3 className="size-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{orders.length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <TrendingUp className="size-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  ${orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : "0.00"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-foreground">Daily Sales (Last 7 Days)</h2>
              <Calendar className="size-5 text-muted-foreground" />
            </div>
            <div className="mt-6 space-y-3">
              {last7Days.map((day) => {
                const value = dailySales.get(day) || 0;
                const percentage = (value / maxDailyValue) * 100;
                const date = new Date(day);
                return (
                  <div key={day} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      <span className="font-semibold text-foreground">${value.toFixed(2)}</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-foreground">Weekly Sales (Last 4 Weeks)</h2>
              <Calendar className="size-5 text-muted-foreground" />
            </div>
            <div className="mt-6 space-y-3">
              {last4Weeks.map((week) => {
                const value = weeklySales.get(week) || 0;
                const percentage = (value / maxWeeklyValue) * 100;
                const date = new Date(week);
                return (
                  <div key={week} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Week of {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="font-semibold text-foreground">${value.toFixed(2)}</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-6 shadow-lg xl:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-foreground">Monthly Sales (Last 6 Months)</h2>
              <Calendar className="size-5 text-muted-foreground" />
            </div>
            <div className="mt-6 space-y-3">
              {last6Months.map((month) => {
                const value = monthlySales.get(month) || 0;
                const percentage = (value / maxMonthlyValue) * 100;
                const [year, monthNum] = month.split('-');
                const date = new Date(parseInt(year), parseInt(monthNum) - 1);
                return (
                  <div key={month} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                      <span className="font-semibold text-foreground">${value.toFixed(2)}</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
