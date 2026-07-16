import Link from "next/link";
import { notFound } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductForm from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AdminEditProductPage({ params }: PageProps) {
  const { slug } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { slug },
      include: { category: { select: { slug: true } } },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { slug: true, name: true },
    }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <>
      <AdminHeader title={`Edit: ${product.name}`} description="Update product details and visibility." />

      <div className="mx-auto max-w-3xl space-y-4 p-6">
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/admin/products" className="font-semibold text-primary hover:underline">
            ← Back to products
          </Link>
          <Link
            href={`/admin/products/${product.slug}/images`}
            className="font-semibold text-primary hover:underline"
          >
            Manage images →
          </Link>
        </div>

        <ProductForm
          mode="edit"
          currentSlug={product.slug}
          categories={categories}
          initialValues={{
            name: product.name,
            sku: product.sku,
            slug: product.slug,
            description: product.description,
            benefits: product.benefits ?? "",
            howToApply: product.howToApply ?? "",
            faq: product.faq ?? "",
            details: product.details ?? "",
            price: product.price.toString(),
            compareAtPrice: product.compareAtPrice?.toString() ?? "",
            currency: product.currency,
            stockQuantity: product.stockQuantity,
            categorySlug: product.category.slug,
            thumbnail: product.thumbnail ?? "",
            featured: product.featured,
            isActive: product.isActive,
          }}
        />
      </div>
    </>
  );
}
