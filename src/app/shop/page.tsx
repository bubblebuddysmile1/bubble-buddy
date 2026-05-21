import type { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type ShopProduct = Prisma.ProductGetPayload<{
  include: {
    category: { select: { name: true; slug: true } };
  };
}>;

async function getProducts(): Promise<ShopProduct[]> {
  return prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    include: {
      category: {
        select: { name: true, slug: true },
      },
    },
  });
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-background text-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-primary">Shop</p>
          <h1 className="mt-4 text-4xl font-semibold text-foreground">Browse all products</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Explore our full catalog of beauty products, handcrafted for skincare, haircare, and makeup lovers.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product: ShopProduct) => (
            <article key={product.id} className="group overflow-hidden rounded-[2rem] border border-border bg-card p-0 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <div className="relative h-80 overflow-hidden bg-muted">
                <Image
                  src={product.thumbnail ?? "/category/1.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-4 p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary">
                  <span>{product.category?.name ?? "Uncategorized"}</span>
                  {product.featured && <span className="rounded-full bg-primary/10 px-2 py-1 font-semibold text-primary">Featured</span>}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">{product.name}</h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{product.description}</p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-xl font-semibold text-foreground">{product.currency} {product.price.toString()}</p>
                  </div>
                  <Link
                    href={`/shop/${product.slug}`}
                    className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
