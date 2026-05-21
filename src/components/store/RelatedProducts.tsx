import type { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type RelatedProduct = Prisma.ProductGetPayload<{
  include: {
    category: { select: { name: true } };
  };
}>;

type RelatedProductsProps = {
  products: RelatedProduct[];
  categoryName?: string;
};

export default function RelatedProducts({ products, categoryName }: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 rounded-[2rem] border border-border bg-card p-6 shadow-lg sm:p-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.32em] text-primary">You may also like</p>
        <h2 className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl">Related products</h2>
        {categoryName && (
          <p className="mt-2 text-sm text-muted-foreground">
            More picks from {categoryName}
          </p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <article
            key={product.id}
            className="group overflow-hidden rounded-[1.75rem] border border-border bg-background p-4 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative aspect-square overflow-hidden rounded-[1.25rem] bg-muted">
              <Image
                src={product.thumbnail ?? "/category/1.jpg"}
                alt={product.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {product.category?.name ?? "Uncategorized"}
              </p>
              <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
              <p className="text-sm font-semibold text-foreground">
                {product.currency} {product.price.toString()}
              </p>
            </div>

            <Link
              href={`/shop/${product.slug}`}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              View details
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
