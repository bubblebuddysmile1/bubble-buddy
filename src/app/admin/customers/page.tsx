import AdminHeader from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: {
      orders: { select: { id: true } },
    },
  });

  return (
    <>
      <AdminHeader
        title="Customer management"
        description="Browse your customers and review account activity from a single admin view."
      />
      <div className="p-6">
        <div className="overflow-x-auto rounded-[2rem] border border-border bg-card shadow-lg">
          <table className="w-full min-w-190 text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4">Joined</th>
                <th className="px-5 py-4">Orders</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-border/70 last:border-0">
                  <td className="px-5 py-4 font-medium text-foreground">
                    {customer.name ?? "Customer"}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground wrap-break-word">{customer.email}</td>
                  <td className="px-5 py-4 text-muted-foreground">{customer.phone ?? "—"}</td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {customer.createdAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{customer.orders.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
