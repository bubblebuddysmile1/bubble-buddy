import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/cart/AddToCartButton";
import CompareButton from "@/components/compare/CompareButton";
import { toCartProduct } from "@/lib/cart";
import { prisma } from "@/lib/prisma";
import type { CartProduct } from "@/types/cart";

export const revalidate = 60;

export default async function ProductList() {
  const [products, totalProducts] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      take: 8,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        currency: true,
        stockQuantity: true,
        thumbnail: true,
        category: { select: { name: true, slug: true } },
      },
    }),
    prisma.product.count({ where: { isActive: true } }),
  ]);

  const hasMore = totalProducts > products.length;

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-primary">Product List</p>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Explore our complete collection of beauty essentials for every routine. ✨
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => {
            const cartProduct: CartProduct = toCartProduct({
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price.toString(),
              currency: product.currency,
              thumbnail: product.thumbnail ?? null,
              stockQuantity: product.stockQuantity,
              category: product.category,
            });

            return (
              <article
                key={product.id}
                className="group overflow-hidden rounded-[2rem] border border-border bg-card p-4 shadow-lg shadow-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative overflow-hidden rounded-[1.75rem] bg-muted">
                  <Link href={`/shop/${product.slug}`} className="block h-52 w-full">
                    <Image
                      src={product.thumbnail ?? "/category/1.jpg"}
                      alt={product.name}
                      width={360}
                      height={360}
                      className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </Link>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <Link href={`/shop/${product.slug}`} className="hover:text-primary">
                      <h3 className="mt-2 text-lg font-semibold text-foreground">{product.name}</h3>
                    </Link>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-lg font-bold text-foreground">{product.price.toString()}</p>
                  <div className="flex items-center gap-2">
                    <AddToCartButton product={cartProduct} size="sm" label="Add" />
                    <CompareButton product={cartProduct} variant="icon" />
                    <Link
                      href={`/shop/${product.slug}`}
                      className="hover:text-primary rounded-full border border-border bg-background px-3 py-1 text-sm font-semibold text-foreground transition hover:bg-muted"
                    >
                      view
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {hasMore && (
          <div className="mt-10 flex justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              View all products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
