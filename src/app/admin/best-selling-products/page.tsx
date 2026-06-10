import AdminHeader from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";
import { TrendingUp, Package, DollarSign } from "lucide-react";

export default async function BestSellingProductsPage() {
  const bestSellingProducts = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true, totalPrice: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 10,
  });

  const productIds = bestSellingProducts.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      name: true,
      sku: true,
      price: true,
      thumbnail: true,
      category: { select: { name: true } },
    },
  });

  const productsMap = new Map(products.map((product) => [product.id, product]));

  const data = bestSellingProducts.map((item) => {
    const product = productsMap.get(item.productId);
    return {
      productName: product?.name || "Unknown Product",
      sku: product?.sku || "N/A",
      category: product?.category?.name || "N/A",
      quantitySold: item._sum.quantity || 0,
      revenue: item._sum.totalPrice?.toNumber() || 0,
      thumbnail: product?.thumbnail,
    };
  });

  const totalQuantitySold = data.reduce((sum, item) => sum + item.quantitySold, 0);
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <>
      <AdminHeader
        title="Best Selling Products"
        description="Identify your top-performing products and analyze sales trends."
      />

      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <Package className="size-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Products Sold</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{totalQuantitySold}</p>
              </div>
            </div>
          </div>
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
                <TrendingUp className="size-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Revenue per Product</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  ${data.length > 0 ? (totalRevenue / data.length).toFixed(2) : "0.00"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-foreground">Top 10 Best Selling Products</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-190 text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-4">Rank</th>
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">SKU</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Quantity Sold</th>
                  <th className="px-5 py-4">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={item.productName} className="border-b border-border/70 last:border-0">
                      <td className="px-5 py-4 font-semibold text-foreground">#{index + 1}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {item.thumbnail && (
                            <img
                              src={item.thumbnail}
                              alt={item.productName}
                              className="size-10 rounded-lg object-cover"
                            />
                          )}
                          <span className="font-medium text-foreground">{item.productName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{item.sku}</td>
                      <td className="px-5 py-4 text-muted-foreground">{item.category}</td>
                      <td className="px-5 py-4 font-semibold text-foreground">{item.quantitySold}</td>
                      <td className="px-5 py-4 font-semibold text-foreground">${item.revenue.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
                      No sales data available yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
