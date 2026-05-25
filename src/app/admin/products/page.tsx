import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      sku: true,
      thumbnail: true,
      isActive: true,
      _count: { select: { images: true } },
    },
  });

  return (
    <main className="py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8 rounded-[2rem] border border-border bg-card p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-foreground">Product image upload</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Select a product to upload images to Cloudinary and attach them as the thumbnail and
            gallery.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/admin/products/${product.slug}`}
              className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-muted">
                  {product.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">{product.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{product.sku}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {product._count.images} gallery image{product._count.images === 1 ? "" : "s"}
                    {!product.isActive && " · Inactive"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
