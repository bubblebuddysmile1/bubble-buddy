import Link from "next/link";
import { notFound } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductImageUpload from "@/components/admin/ProductImageUpload";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AdminProductImagesPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: { select: { name: true } },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <>
      <AdminHeader
        title={product.name}
        description={`${product.category.name} · SKU ${product.sku} · Images`}
      />

      <div className="mx-auto max-w-4xl space-y-6 p-6">
        <Link href="/admin/products" className="text-sm font-semibold text-primary hover:underline">
          ← Back to products
        </Link>

        <ProductImageUpload
          slug={product.slug}
          productName={product.name}
          initialThumbnail={product.thumbnail}
          initialImages={product.images.map((image) => ({
            id: image.id,
            url: image.url,
            altText: image.altText,
            sortOrder: image.sortOrder,
          }))}
        />
      </div>
    </>
  );
}
