import Link from "next/link";
import { notFound } from "next/navigation";
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
    <main className="py-10">
      <div className="container mx-auto max-w-4xl px-4">
        <Link
          href="/admin/products"
          className="text-sm font-semibold text-primary hover:underline"
        >
          ← All products
        </Link>

        <div className="mt-6 rounded-[2rem] border border-border bg-card p-8 shadow-lg">
          <p className="text-sm text-muted-foreground">{product.category.name}</p>
          <h2 className="mt-2 text-3xl font-bold text-foreground">{product.name}</h2>
          <p className="mt-2 text-sm text-muted-foreground">SKU: {product.sku}</p>
        </div>

        <div className="mt-8">
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
      </div>
    </main>
  );
}
