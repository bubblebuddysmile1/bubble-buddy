import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductImageGallery from "@/components/store/ProductImageGallery";
import ProductDetailCart from "@/components/store/ProductDetailCart";
import RelatedProducts from "@/components/store/RelatedProducts";
import ProductReviews from "@/components/store/ProductReviews";
import RecentlyViewedSection from "@/components/store/RecentlyViewedSection";
import FrequentlyBoughtTogether from "@/components/store/FrequentlyBoughtTogether";
import { parseProductPrice, toCartProduct } from "@/lib/cart";
import { prisma } from "@/lib/prisma";

type PageParams = Promise<{ slug: string }>;

export const revalidate = 60;
export const dynamicParams = true;

type ProductDetailPayload = Prisma.ProductGetPayload<{
  include: {
    category: { select: { name: true; slug: true } };
    images: true;
  };
}>;

type RelatedProduct = Prisma.ProductGetPayload<{
  include: {
    category: { select: { name: true } };
  };
}>;

async function getProductBySlug(slug: string): Promise<ProductDetailPayload | null> {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: {
        select: { name: true, slug: true },
      },
      images: { orderBy: { sortOrder: "asc" } },
    },
  });
}

async function getRelatedProducts(
  categoryId: number,
  excludeProductId: number,
): Promise<RelatedProduct[]> {
  return prisma.product.findMany({
    where: {
      isActive: true,
      categoryId,
      id: { not: excludeProductId },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
    },
  });
}

async function getFrequentlyBoughtTogetherProducts(productId: number): Promise<RelatedProduct[]> {
  const groupedOrderItems = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: {
      order: {
        status: { not: "CANCELLED" },
        paymentStatus: "PAID",
        items: {
          some: {
            productId,
          },
        },
      },
      productId: { not: productId },
      product: {
        isActive: true,
      },
    },
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 4,
  });

  if (groupedOrderItems.length === 0) {
    return [];
  }

  const productIds = groupedOrderItems.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: {
      category: { select: { name: true } },
    },
  });

  const productById = new Map(products.map((product) => [product.id, product] as const));
  return productIds
    .map((id) => productById.get(id))
    .filter((product): product is RelatedProduct => Boolean(product));
}

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ select: { slug: true } });
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found",
      description: "The product you are looking for could not be found.",
    };
  }

  const description =
    product.description.length > 160
      ? `${product.description.slice(0, 157)}...`
      : product.description;
  const imageUrl = product.thumbnail ?? product.images[0]?.url ?? "/category/1.jpg";

  return {
    title: product.name,
    description,
    keywords: [
      product.name,
      product.category?.name ?? "beauty",
      product.sku,
      "Bubble Buddy",
    ],
    openGraph: {
      title: product.name,
      description,
      type: "website",
      images: [{ url: imageUrl, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: PageParams }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id);
  const frequentlyBoughtTogetherProducts = await getFrequentlyBoughtTogetherProducts(product.id);
  const cartProduct = toCartProduct(product);
  const compareAtPrice = product.compareAtPrice
    ? parseProductPrice(product.compareAtPrice)
    : null;

  return (
    <main className="min-h-screen bg-background text-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-primary">Product details</p>
            <h1 className="mt-3 text-4xl font-semibold text-foreground">{product.name}</h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              {product.category?.name ?? "Uncategorized"} · {product.currency}{" "}
              {product.price.toString()}
            </p>
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
            <ProductImageGallery
              productName={product.name}
              thumbnail={product.thumbnail}
              images={product.images}
            />
          </section>

          <section className="space-y-6 rounded-[2rem] border border-border bg-card p-6 shadow-lg">
            <div className="space-y-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
                  Description
                </p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {product.description}
                </p>
              </div>
              {product.details && (
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
                    Details
                  </p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{product.details}</p>
                </div>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-background p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">SKU</p>
                  <p className="mt-2 text-sm text-foreground">{product.sku}</p>
                </div>
                <div className="rounded-3xl bg-background p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Stock</p>
                  <p className="mt-2 text-sm text-foreground">{product.stockQuantity} available</p>
                </div>
              </div>
            </div>

            <ProductDetailCart product={cartProduct} compareAtPrice={compareAtPrice} />
          </section>
        </div>

        <ProductReviews
          productId={product.id}
          productSlug={product.slug}
          averageRating={product.averageRating}
          reviewCount={product.reviewCount}
        />

        <RecentlyViewedSection currentSlug={product.slug} />

        <FrequentlyBoughtTogether products={frequentlyBoughtTogetherProducts} />

        <RelatedProducts
          products={relatedProducts}
          categoryName={product.category?.name}
        />
      </div>
    </main>
  );
}
