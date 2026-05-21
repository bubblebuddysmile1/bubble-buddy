import type { Prisma } from "@prisma/client";
import ShopProductCard from "@/components/store/ShopProductCard";
import { toCartProduct } from "@/lib/cart";
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
            Explore our full catalog of beauty products, handcrafted for skincare, haircare, and
            makeup lovers.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ShopProductCard
              key={product.id}
              product={toCartProduct(product)}
              description={product.description}
              featured={product.featured}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
