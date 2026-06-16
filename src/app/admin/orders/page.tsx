import AdminHeader from "@/components/admin/AdminHeader";
import OrderManagementTable, { type AdminOrderRow } from "@/components/admin/OrderManagementTable";
import { prisma } from "@/lib/prisma";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { placedAt: "desc" },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      shippingAddress: { select: { recipient: true, phone: true, line1: true, line2: true, city: true, state: true, postalCode: true } },
      items: { select: { id: true } },
    },
  });

  const rows: AdminOrderRow[] = orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.user?.name ?? null,
    customerEmail: order.user?.email ?? null,
    customerPhone: order.user?.phone ?? null,
    shippingAddress: order.shippingAddress
      ? `${order.shippingAddress.line1}${order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}`
      : null,
    shippingPhone: order.shippingAddress?.phone ?? null,
    shippingName: order.shippingAddress?.recipient ?? null,
    status: order.status,
    paymentStatus: order.paymentStatus,
    totalAmount: order.totalAmount.toString(),
    itemCount: order.items.length,
    placedAt: order.placedAt?.toISOString() ?? null,
    returnReason: order.returnReason,
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
