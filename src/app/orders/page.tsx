import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function formatOrderDate(date: Date | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

async function getUserOrders() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    redirect("/auth?returnTo=/orders");
  }

  const payload = verifyAuthToken(token);
  if (!payload) {
    redirect("/auth?returnTo=/orders");
  }

  return prisma.order.findMany({
    where: { userId: payload.id },
    orderBy: { placedAt: "desc" },
    include: {
      items: {
        select: { name: true, quantity: true, totalPrice: true, unitPrice: true },
      },
    },
  });
}

export default async function OrdersPage() {
  const orders = await getUserOrders();

  return (
    <main className="min-h-screen bg-background text-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 rounded-[2rem] border border-border bg-card p-8 shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">My Orders</p>
          <h1 className="mt-3 text-4xl font-bold">Order history</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Review your recent orders and check the latest status of each purchase.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-[2rem] border border-border bg-card p-10 text-center shadow-lg">
            <p className="text-xl font-semibold text-foreground">No orders yet</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Once you place an order while signed in, it will appear here with full details.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Order #{order.orderNumber}</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">
                      ${order.totalAmount.toString()}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Placed {formatOrderDate(order.placedAt)}
                    </p>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      Status:{" "}
                      <span className="font-semibold text-foreground">{formatStatus(order.status)}</span>
                    </p>
                    <p>
                      Payment:{" "}
                      <span className="font-semibold text-foreground">
                        {formatStatus(order.paymentStatus)}
                      </span>
                    </p>
                    <p>Items: {order.items.length}</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 rounded-3xl bg-background/80 p-4 text-sm text-muted-foreground">
                  {order.items.map((item) => (
                    <div key={`${order.id}-${item.name}`} className="flex items-center justify-between gap-3">
                      <span>{item.name}</span>
                      <span className="font-medium text-foreground">
                        {item.quantity} × ${item.unitPrice.toString()} = ${item.totalPrice.toString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex justify-end">
                  <Link
                    href={`/orders/${order.orderNumber}`}
                    className="inline-flex rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
                  >
                    Track order
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
