import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OrderTrackingTimeline from "@/components/order/OrderTrackingTimeline";

function formatOrderDate(date: Date | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(amount: number | string) {
  return `$${amount.toString()}`;
}

async function getOrderForUser(orderNumber: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    redirect(`/auth?returnTo=/orders/${orderNumber}`);
  }

  const payload = verifyAuthToken(token);
  if (!payload) {
    redirect(`/auth?returnTo=/orders/${orderNumber}`);
  }

  return prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        select: { name: true, quantity: true, unitPrice: true, totalPrice: true },
      },
      trackingEvents: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export default async function OrderDetailPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const order = await getOrderForUser(orderNumber);

  if (!order) {
    notFound();
  }

  const events = order.trackingEvents.length
    ? order.trackingEvents
    : [
        {
          id: 0,
          status: order.status,
          description: `Current order status: ${order.status}`,
          createdAt: order.placedAt?.toISOString() ?? new Date().toISOString(),
        },
      ];

  return (
    <main className="min-h-screen bg-background text-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 rounded-[2rem] border border-border bg-card p-8 shadow-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Order tracking</p>
              <h1 className="mt-3 text-4xl font-bold">Order #{order.orderNumber}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Review the latest status updates and delivery timeline for your order.
              </p>
            </div>
            <Link
              href="/orders"
              className="inline-flex rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Back to order history
            </Link>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <section className="rounded-[2rem] border border-border bg-card p-8 shadow-lg">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-[1.75rem] bg-background/80 p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Order status</p>
                <p className="mt-3 text-2xl font-semibold text-foreground">{order.status}</p>
                <p className="mt-2 text-sm text-muted-foreground">Payment: {order.paymentStatus}</p>
              </div>
              <div className="rounded-[1.75rem] bg-background/80 p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Placed on</p>
                <p className="mt-3 text-2xl font-semibold text-foreground">{formatOrderDate(order.placedAt)}</p>
                <p className="mt-2 text-sm text-muted-foreground">Total: {formatCurrency(order.totalAmount.toString())}</p>
              </div>
            </div>

            <div className="mt-8 rounded-[1.75rem] border border-border bg-background/80 p-6">
              <h2 className="text-xl font-semibold text-foreground">Tracking timeline</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Follow each step of your order, from placement to delivery.
              </p>
              <div className="mt-6">
                <OrderTrackingTimeline events={events.map((event) => ({
                  id: event.id,
                  status: event.status,
                  description: event.description,
                  createdAt: event.createdAt,
                }))} />
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
              <h2 className="text-lg font-semibold">Order details</h2>
              <div className="mt-6 space-y-4 text-sm text-muted-foreground">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em]">Items</p>
                  <p className="mt-2 text-foreground">{order.items.length} products</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.28em]">Payment method</p>
                  <p className="mt-2 text-foreground">{order.paymentMethod ?? "Card"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.28em]">Shipping</p>
                  <p className="mt-2 text-foreground">Calculated at checkout</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
              <h2 className="text-lg font-semibold">Items</h2>
              <div className="mt-4 space-y-4">
                {order.items.map((item, index) => (
                  <div key={`${order.id}-${item.name}-${index}`} className="rounded-3xl bg-background/80 p-4">
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.quantity} × {formatCurrency(item.unitPrice.toString())}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">{formatCurrency(item.totalPrice.toString())}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
