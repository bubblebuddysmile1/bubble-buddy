import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getAppUrl } from "@/lib/site";
import CategoryProducts from "@/components/store/CategoryProducts";

type Props = {
  params: Promise<{ slug: string }>;
};

const siteUrl = getAppUrl();

export const revalidate = 60;
export const dynamicParams = true;

async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    select: { id: true, name: true, description: true, image: true, isActive: true },
  });
}

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { slug: true },
  });

  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category not found" };
  }

  const canonicalUrl = `${siteUrl}/categories/${slug}`;
  const imageUrl = category.image ? new URL(category.image, siteUrl).toString() : `${siteUrl}/category/1.jpg`;

  const seoTitle = `${category.name} Products | Bubble Buddy`;
  const seoDescription = `Shop ${category.name.toLowerCase()} products at Bubble Buddy. Discover high-quality beauty essentials for your routine with trusted formulas and fast delivery.`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [
      category.name,
      `${category.name} products`,
      `buy ${category.name.toLowerCase()}`,
      "Bubble Buddy",
      "beauty essentials",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: canonicalUrl,
      type: "website",
      images: [{ url: imageUrl, alt: `${category.name} products` }],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category || !category.isActive) {
    notFound();
  }

  const canonicalUrl = `${siteUrl}/categories/${slug}`;
  const description = category.description ?? `Explore products in the ${category.name} category.`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description,
    url: canonicalUrl,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: "Shop", item: `${siteUrl}/shop` },
        { "@type": "ListItem", position: 3, name: category.name, item: canonicalUrl },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: category.name,
          url: canonicalUrl,
        },
      ],
    },
  };

  return (
    <main className="min-h-screen bg-background text-foreground py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="container mx-auto px-4">
        <div className="mb-10 grid gap-8 lg:grid-cols-[1fr_minmax(260px,320px)] items-center">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.32em] text-primary">Category</p>
            <h1 className="text-4xl font-semibold text-foreground">{category.name}</h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              {category.description ?? "Explore products selected for this category."}
            </p>
          </div>
          <div className="rounded-4xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-semibold text-foreground">Browse filtered products</p>
            <p className="mt-2 text-sm text-muted-foreground">
              All active products in the {category.name} category are shown below.
            </p>
          </div>
        </div>

        <CategoryProducts categorySlug={slug} />
      </div>
    </main>
  );
}
