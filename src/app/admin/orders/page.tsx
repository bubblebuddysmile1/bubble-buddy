import AdminHeader from "@/components/admin/AdminHeader";
import OrderManagementTable, { type AdminOrderRow } from "@/components/admin/OrderManagementTable";
import { prisma } from "@/lib/prisma";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { placedAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: { select: { id: true } },
    },
  });

  const rows: AdminOrderRow[] = orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.user?.name ?? null,
    customerEmail: order.user?.email ?? null,
    status: order.status,
    paymentStatus: order.paymentStatus,
    totalAmount: order.totalAmount.toString(),
    itemCount: order.items.length,
    placedAt: order.placedAt?.toISOString() ?? null,
  }));

  return (
    <>
      <AdminHeader
        title="Order management"
        description="Review orders, update the shipment workflow, and keep order status current."
      />
      <div className="p-6">
        <OrderManagementTable orders={rows} />
      </div>
    </>
  );
}
