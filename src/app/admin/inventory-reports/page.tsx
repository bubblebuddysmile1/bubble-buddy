import AdminHeader from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";
import { Package, AlertTriangle, CheckCircle, TrendingDown, TrendingUp } from "lucide-react";

export default async function InventoryReportsPage() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      sku: true,
      stockQuantity: true,
      price: true,
      category: { select: { name: true } },
    },
    orderBy: { stockQuantity: "asc" },
  });

  const totalProducts = products.length;
  const lowStockThreshold = 10;
  const outOfStockProducts = products.filter((p) => p.stockQuantity === 0);
  const lowStockProducts = products.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= lowStockThreshold);
  const healthyStockProducts = products.filter((p) => p.stockQuantity > lowStockThreshold);

  const totalStockValue = products.reduce((sum, product) => sum + product.price.toNumber() * product.stockQuantity, 0);
  const totalStockQuantity = products.reduce((sum, product) => sum + product.stockQuantity, 0);

  const stats = [
    {
      label: "Total Products",
      value: totalProducts.toString(),
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-600/10",
    },
    {
      label: "Out of Stock",
      value: outOfStockProducts.length.toString(),
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-600/10",
    },
    {
      label: "Low Stock",
      value: lowStockProducts.length.toString(),
      icon: TrendingDown,
      color: "text-orange-600",
      bgColor: "bg-orange-600/10",
    },
    {
      label: "Healthy Stock",
      value: healthyStockProducts.length.toString(),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-600/10",
    },
  ];

  return (
    <>
      <AdminHeader
        title="Inventory Reports"
        description="Monitor your inventory levels, stock alerts, and product availability."
      />

      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
                <div className="rounded-2xl p-3 text-primary">
                  <Icon className={`size-6 ${stat.color}`} />
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-foreground">Stock Value Summary</h2>
            <div className="mt-4 space-y-4">
              <div className="rounded-3xl bg-background/80 px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Total Stock Value</p>
                  <p className="text-lg font-bold text-foreground">${totalStockValue.toFixed(2)}</p>
                </div>
              </div>
              <div className="rounded-3xl bg-background/80 px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Total Stock Quantity</p>
                  <p className="text-lg font-bold text-foreground">{totalStockQuantity}</p>
                </div>
              </div>
              <div className="rounded-3xl bg-background/80 px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Average Stock per Product</p>
                  <p className="text-lg font-bold text-foreground">
                    {totalProducts > 0 ? (totalStockQuantity / totalProducts).toFixed(1) : "0"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-foreground">Stock Alerts</h2>
            <div className="mt-4 space-y-3">
              {outOfStockProducts.length > 0 && (
                <div className="rounded-3xl bg-red-50 border border-red-200 px-4 py-3">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="size-5" />
                    <p className="font-semibold">{outOfStockProducts.length} products out of stock</p>
                  </div>
                </div>
              )}
              {lowStockProducts.length > 0 && (
                <div className="rounded-3xl bg-orange-50 border border-orange-200 px-4 py-3">
                  <div className="flex items-center gap-2 text-orange-700">
                    <TrendingDown className="size-5" />
                    <p className="font-semibold">{lowStockProducts.length} products low on stock</p>
                  </div>
                </div>
              )}
              {outOfStockProducts.length === 0 && lowStockProducts.length === 0 && (
                <div className="rounded-3xl bg-green-50 border border-green-200 px-4 py-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="size-5" />
                    <p className="font-semibold">All products have healthy stock levels</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-foreground">Inventory Details</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-190 text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">SKU</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Stock Quantity</th>
                  <th className="px-5 py-4">Unit Price</th>
                  <th className="px-5 py-4">Stock Value</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const stockValue = product.price.toNumber() * product.stockQuantity;
                  let status = "Healthy";
                  let statusColor = "text-green-600";
                  
                  if (product.stockQuantity === 0) {
                    status = "Out of Stock";
                    statusColor = "text-red-600";
                  } else if (product.stockQuantity <= lowStockThreshold) {
                    status = "Low Stock";
                    statusColor = "text-orange-600";
                  }

                  return (
                    <tr key={product.id} className="border-b border-border/70 last:border-0">
                      <td className="px-5 py-4 font-medium text-foreground">{product.name}</td>
                      <td className="px-5 py-4 text-muted-foreground">{product.sku}</td>
                      <td className="px-5 py-4 text-muted-foreground">{product.category?.name || "N/A"}</td>
                      <td className="px-5 py-4 font-semibold text-foreground">{product.stockQuantity}</td>
                      <td className="px-5 py-4 text-muted-foreground">${product.price.toString()}</td>
                      <td className="px-5 py-4 font-semibold text-foreground">${stockValue.toFixed(2)}</td>
                      <td className="px-5 py-4">
                        <span className={`font-semibold ${statusColor}`}>{status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
