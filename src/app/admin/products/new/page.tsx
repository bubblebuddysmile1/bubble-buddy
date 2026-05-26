import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductForm from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

export default async function AdminNewProductPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { slug: true, name: true },
  });

  return (
    <>
      <AdminHeader title="Add product" description="Create a new product in your catalog." />

      <div className="mx-auto max-w-3xl space-y-4 p-6">
        <Link href="/admin/products" className="text-sm font-semibold text-primary hover:underline">
          ← Back to products
        </Link>

        <ProductForm
          mode="create"
          categories={categories}
          initialValues={{
            name: "",
            sku: "",
            slug: "",
            description: "",
            details: "",
            price: "",
            compareAtPrice: "",
            currency: "USD",
            stockQuantity: 0,
            categorySlug: categories[0]?.slug ?? "",
            thumbnail: "",
            featured: false,
            isActive: true,
          }}
        />
      </div>
    </>
  );
}
