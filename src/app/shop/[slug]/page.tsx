import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductImageGallery from "@/components/store/ProductImageGallery";
import ProductDetailCart from "@/components/store/ProductDetailCart";
import ProductTabs from "@/components/store/ProductTabs";
import ProductViewTracker from "@/components/store/ProductViewTracker";
import RelatedProducts from "@/components/store/RelatedProducts";
import ProductReviews from "@/components/store/ProductReviews";
import RecentlyViewedSection from "@/components/store/RecentlyViewedSection";
import FrequentlyBoughtTogether from "@/components/store/FrequentlyBoughtTogether";
import { parseProductPrice, toCartProduct } from "@/lib/cart";
import { prisma } from "@/lib/prisma";
import { getAppUrl } from "@/lib/site";

type PageParams = Promise<{ slug: string }>;

const siteUrl = getAppUrl();

export const revalidate = 60;
export const dynamicParams = true;

type ProductDetailPayload = Prisma.ProductGetPayload<{
  include: {
    category: { select: { name: true; slug: true } };
    images: true;
  };
}> & {
  benefits?: string | null;
  howToApply?: string | null;
  faq?: string | null;
  details?: string | null;
};

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
  }) as Promise<ProductDetailPayload | null>;
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
      title: "Product not found | Bubble Buddy",
      description: "The product you are looking for could not be found.",
    };
  }

  const categoryName = product.category?.name ?? "Beauty";
  const baseDescription = product.description?.trim() || `Shop ${product.name} by Bubble Buddy for effective ${categoryName.toLowerCase()} care.`;
  const description = baseDescription.length > 160 ? `${baseDescription.slice(0, 157).trimEnd()}...` : baseDescription;
  const canonicalUrl = `${siteUrl}/shop/${slug}`;
  const imageUrl = product.thumbnail ?? product.images[0]?.url ?? `${siteUrl}/category/1.jpg`;

  return {
    title: `${product.name} | ${categoryName} | Bubble Buddy`,
    description,
    keywords: [
      product.name,
      `${product.name} ${categoryName}`,
      categoryName,
      "Bubble Buddy",
      "beauty essentials",
      "skincare products",
    ],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${product.name} | Bubble Buddy`,
      description,
      url: canonicalUrl,
      type: "website",
      images: [{ url: imageUrl, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Bubble Buddy`,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: PageParams }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const productReviews = await prisma.review.findMany({
    where: { productId: product.id, approved: true },
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      rating: true,
      title: true,
      body: true,
      createdAt: true,
      verifiedPurchase: true,
      user: { select: { name: true } },
    },
  });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${siteUrl}/shop` },
      ...(product.category?.name
        ? [{ "@type": "ListItem", position: 3, name: product.category.name, item: `${siteUrl}/categories/${product.category.slug}` }]
        : []),
      { "@type": "ListItem", position: product.category?.name ? 4 : 3, name: product.name, item: `${siteUrl}/shop/${product.slug}` },
    ],
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [
      product.thumbnail,
      ...product.images.map((image) => image.url),
    ].filter(Boolean),
    description: product.description,
    sku: product.sku,
    brand: { "@type": "Brand", name: "Bubble Buddy" },
    category: product.category?.name ?? "Beauty",
    mpn: product.sku,
    url: `${siteUrl}/shop/${product.slug}`,
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency || "USD",
      price: Number(product.price),
      availability: product.stockQuantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${siteUrl}/shop/${product.slug}`,
      seller: { "@type": "Organization", name: "Bubble Buddy" },
      ...(product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price)
        ? { priceSpecification: { "@type": "UnitPriceSpecification", price: Number(product.compareAtPrice), priceCurrency: product.currency || "USD" } }
        : {}),
    },
    ...(product.averageRating && product.reviewCount && product.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(product.averageRating.toFixed(1)),
            reviewCount: product.reviewCount,
          },
          review: productReviews.map((review) => ({
            "@type": "Review",
            author: { "@type": "Person", name: review.user?.name ?? "Verified Buyer" },
            reviewRating: {
              "@type": "Rating",
              ratingValue: review.rating,
            },
            name: review.title ?? `${product.name} review`,
            reviewBody: review.body ?? undefined,
            datePublished: review.createdAt.toISOString(),
          })),
        }
      : {}),
  };

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id);
  const frequentlyBoughtTogetherProducts = await getFrequentlyBoughtTogetherProducts(product.id);
  const cartProduct = toCartProduct(product);

  return (
    <main className="min-h-screen bg-background text-foreground py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
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

        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          {/* Left Column: Product Images */}
          <section className="rounded-4xl border border-border bg-card p-8 shadow-lg">
            <ProductViewTracker product={cartProduct} />
            <ProductImageGallery
              productName={product.name}
              thumbnail={product.thumbnail}
              images={product.images}
            />
          </section>

          {/* Right Column: Product Details */}
          <section className="space-y-6">
            {/* Product Info Card */}
            <div className="space-y-4 rounded-4xl border border-border bg-card p-8 shadow-lg">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-primary">
                  {product.category?.name ?? "Uncategorized"}
                </p>
                <h2 className="mt-3 text-3xl font-bold text-foreground">
                  {product.name}
                </h2>
              </div>

              {/* Price Section */}
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
                  Price
                </p>
                <div className="flex items-baseline gap-3">
                  <p className="text-4xl font-bold text-foreground">
                    {product.currency} {product.price.toString()}
                  </p>
                  {product.compareAtPrice &&
                    parseProductPrice(product.compareAtPrice) > parseProductPrice(product.price) && (
                      <p className="text-lg text-muted-foreground line-through">
                        {product.currency}{" "}
                        {parseProductPrice(product.compareAtPrice).toFixed(2)}
                      </p>
                    )}
                </div>
              </div>

              {/* Stock and Reviews Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-background p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Stock
                  </p>
                  <p className="mt-2 text-xl font-semibold text-foreground">
                    {product.stockQuantity > 0 ? (
                      <span className="text-green-600">
                        {product.stockQuantity} Available
                      </span>
                    ) : (
                      <span className="text-red-600">Out of Stock</span>
                    )}
                  </p>
                </div>
                <div className="rounded-2xl bg-background p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Reviews
                  </p>
                  <p className="mt-2 text-xl font-semibold text-foreground">
                    {product.reviewCount ?? 0} Reviews
                  </p>
                  {product.averageRating && (
                    <p className="mt-1 text-sm text-yellow-500">
                      ★ {(product.averageRating as number).toFixed(1)}
                    </p>
                  )}
                </div>
              </div>

              {/* SKU */}
              <div className="rounded-2xl bg-background p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  SKU
                </p>
                <p className="mt-2 text-sm text-foreground">{product.sku}</p>
              </div>
            </div>

            {/* Action Buttons Card */}
            <ProductDetailCart
              product={cartProduct}
              compareAtPrice={
                product.compareAtPrice
                  ? parseProductPrice(product.compareAtPrice)
                  : null
              }
            />
          </section>
        </div>

        {/* Product Tabs Section */}
        <ProductTabs
          description={product.description}
          benefits={product.benefits}
          howToApply={product.howToApply}
          faq={product.faq}
          details={product.details}
        />

        {/* Reviews Section */}
        <ProductReviews
          key={product.id}
          productId={product.id}
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
