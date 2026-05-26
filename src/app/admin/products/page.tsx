import Link from "next/link";
import { Plus } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductManageTable, { type AdminProductRow } from "@/components/admin/ProductManageTable";
import { prisma } from "@/lib/prisma";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    include: { category: { select: { name: true, slug: true } } },
  });

  const rows: AdminProductRow[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    price: product.price.toString(),
    stockQuantity: product.stockQuantity,
    isActive: product.isActive,
    featured: product.featured,
    thumbnail: product.thumbnail,
    category: product.category,
  }));

  return (
    <>
      <AdminHeader
        title="Product management"
        description="Add, edit, and remove products from your catalog."
      />

      <div className="space-y-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">{rows.length} product(s) in catalog</p>
          <Link
            href="/admin/products/new"
            className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <Plus className="size-4" />
            Add product
          </Link>
        </div>

        <ProductManageTable products={rows} />
      </div>
    </>
  );
}
