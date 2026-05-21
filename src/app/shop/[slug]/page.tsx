import type { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type ProductDetailPayload = Prisma.ProductGetPayload<{
  include: {
    category: { select: { name: true; slug: true } };
    images: true;
  };
}>;

async function getProductBySlug(slug: string): Promise<ProductDetailPayload | null> {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: {
        select: { name: true, slug: true },
      },
      images: true,
    },
  });
}

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ select: { slug: true } });
  return products.map((product: { slug: string }) => ({ slug: product.slug }));
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-primary">Product details</p>
            <h1 className="mt-3 text-4xl font-semibold text-foreground">{product.name}</h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{product.category?.name ?? "Uncategorized"} · ₹{product.price.toString()}</p>
          </div>
          <Link
            href="/shop"
            className="inline-flex rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            Back to shop
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4">
                <div className="relative h-96 overflow-hidden rounded-[2rem] bg-muted">
                  <Image
                    src={product.thumbnail ?? "/category/1.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                {product.images.length > 0 && (
                  <div className="grid gap-3 sm:grid-cols-3">
                    {product.images.map((image: { id: number; url: string; altText?: string | null }) => (
                      <div key={image.id} className="relative h-28 overflow-hidden rounded-3xl bg-muted">
                        <Image
                          src={image.url}
                          alt={image.altText ?? product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6 rounded-[2rem] border border-border bg-background/80 p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Description</p>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{product.description}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl bg-card p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">SKU</p>
                      <p className="mt-2 text-sm text-foreground">{product.sku}</p>
                    </div>
                    <div className="rounded-3xl bg-card p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Stock</p>
                      <p className="mt-2 text-sm text-foreground">{product.stockQuantity} available</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="mt-2 text-3xl font-semibold text-foreground">{product.currency} {product.price.toString()}</p>
                    </div>
                    <button className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
