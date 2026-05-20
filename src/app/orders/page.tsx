import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type OrderItem = {
  name: string;
  quantity: number;
  totalPrice: { toString(): string };
};

type UserOrder = {
  id: number;
  orderNumber: string;
  totalAmount: { toString(): string };
  status: string;
  items: OrderItem[];
};

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

  const orders = await prisma.order.findMany({
    where: { userId: payload.id },
    orderBy: { placedAt: "desc" },
    include: {
      items: {
        select: { name: true, quantity: true, totalPrice: true },
      },
    },
  }) as UserOrder[];

  return orders;
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
            <p className="mt-3 text-sm text-muted-foreground">Once you place an order, it will appear here with full tracking details.</p>
            <Link href="/shop" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
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
                    <p className="mt-2 text-2xl font-semibold text-foreground">₹{order.totalAmount.toString()}</p>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Status: <span className="font-semibold text-foreground">{order.status}</span></p>
                    <p>Items: {order.items.length}</p>
                    <p>{order.items.length > 0 ? `${order.items[0].name}` : "No items"}</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 rounded-3xl bg-background/80 p-4 text-sm text-muted-foreground">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between gap-3">
                      <span>{item.name}</span>
                      <span className="font-medium text-foreground">{item.quantity} × ₹{item.totalPrice.toString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
