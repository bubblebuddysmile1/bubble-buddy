import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { toCartProduct } from "@/lib/cart";
import type { CartProduct } from "@/types/cart";
import { Heart } from "lucide-react";
import ProductList from "@/components/store/ProductList";

const blogPrisma = prisma as unknown as {
  blogPost: {
    findUnique: (args: Record<string, unknown>) => Promise<{
      id: number;
      title: string;
      slug: string;
      excerpt: string | null;
      heading: string | null;
      content: string;
      featuredImage: string | null;
      featuredImageAlt: string | null;
      faq: string | null;
      metaTitle: string | null;
      metaDescription: string | null;
      metaKeywords: string | null;
      relatedSlugs: string | null;
      isPublished: boolean;
      publishedAt: Date | null;
      updatedAt: Date;
    } | null>;
    findMany: (args: Record<string, unknown>) => Promise<Array<{
      slug: string;
      title: string;
      excerpt: string | null;
    }>>;
  };
};

type Props = {
  params: Promise<{ slug: string }>;
};

const siteUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") || "https://bubblebuddysmile.com";

function renderTextWithLinks(text: string) {
  const parts: Array<React.ReactNode> = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`} className="whitespace-pre-wrap">
          {text.slice(lastIndex, match.index).replace(/\n/g, "\n")}
        </span>,
      );
    }

    const label = match[1];
    const target = match[2].trim();
    const normalizedTarget = target.startsWith("http")
      ? target
      : target.startsWith("/")
        ? target
        : `/${target.replace(/^\.+\//, "")}`;

    const isInternalLink = !target.startsWith("http") && !target.startsWith("mailto:");

    parts.push(
      isInternalLink ? (
        <Link key={`link-${match.index}`} href={normalizedTarget} className="font-semibold text-primary underline-offset-4 transition hover:underline">
          {label}
        </Link>
      ) : (
        <a
          key={`link-${match.index}`}
          href={target}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary underline-offset-4 transition hover:underline"
        >
          {label}
        </a>
      ),
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(
      <span key={`text-${lastIndex}`} className="whitespace-pre-wrap">
        {text.slice(lastIndex).replace(/\n/g, "\n")}
      </span>,
    );
  }

  return parts.map((part, index) => (
    <React.Fragment key={`fragment-${index}`}>{part}</React.Fragment>
  ));
}

export const revalidate = 60;
export const dynamicParams = true;

async function getBlogPost(slug: string) {
  return blogPrisma.blogPost.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      heading: true,
      content: true,
      featuredImage: true,
      featuredImageAlt: true,
      faq: true,
      metaTitle: true,
      metaDescription: true,
      metaKeywords: true,
      relatedSlugs: true,
      isPublished: true,
      publishedAt: true,
      updatedAt: true,
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post || !post.isPublished) {
    return { title: "Blog not found" };
  }

  const canonicalUrl = `${siteUrl}/blogs/${slug}`;
  const description = post.metaDescription ?? post.excerpt ?? `Read ${post.title} on Bubble Buddy.`;
  const imageUrl = post.featuredImage ? new URL(post.featuredImage, siteUrl).toString() : `${siteUrl}/category/1.jpg`;

  return {
    title: post.metaTitle ?? `${post.title} | Bubble Buddy`,
    description,
    keywords: [post.metaKeywords ?? post.title, "Bubble Buddy", "beauty blog"],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: post.metaTitle ?? post.title,
      description,
      url: canonicalUrl,
      type: "article",
      images: [{ url: imageUrl, alt: post.featuredImageAlt ?? post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle ?? post.title,
      description,
      images: [imageUrl],
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post || !post.isPublished) {
    notFound();
  }

  const relatedPosts = post.relatedSlugs
    ? await blogPrisma.blogPost.findMany({
        where: { slug: { in: post.relatedSlugs.split(",").map((item: string) => item.trim()).filter(Boolean) }, isPublished: true },
        select: { slug: true, title: true, excerpt: true },
      })
    : [];

  const bestSellingProducts = await prisma.product.findMany({
    where: { isActive: true, featured: true },
    take: 4,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      thumbnail: true,
      price: true,
      currency: true,
    },
  });

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription ?? post.excerpt ?? post.title,
    image: post.featuredImage ? [post.featuredImage] : undefined,
    author: { "@type": "Organization", name: "Bubble Buddy" },
    publisher: { "@type": "Organization", name: "Bubble Buddy" },
    url: `${siteUrl}/blogs/${post.slug}`,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
  };

  return (
    <>
    <main className="min-h-screen bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row">
        <article className="flex-1 rounded-[2rem] border border-border bg-card p-8 shadow-sm">
          {post.featuredImage ? (
            <div className="relative mb-8 h-72 w-full overflow-hidden rounded-[1.5rem]">
              <Image
                src={post.featuredImage}
                alt={post.featuredImageAlt ?? post.title}
                fill
                sizes="(max-width: 768px) 100vw, 70vw"
                className="object-cover"
              />
            </div>
          ) : null}
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Blog</p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{post.title}</h1>
          {post.heading ? <h2 className="mt-4 text-2xl font-medium text-muted-foreground">{post.heading}</h2> : null}
          <p className="mt-4 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
          <div className="prose prose-neutral mt-8 max-w-none whitespace-pre-line text-base leading-8 text-foreground">
            {renderTextWithLinks(post.content)}
          </div>
          {post.faq ? <section className="mt-10 rounded-[1.5rem] border border-border bg-background/70 p-6">
            <h3 className="text-xl font-semibold">FAQ</h3>
            <div className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">{renderTextWithLinks(post.faq ?? "")}</div>
          </section> : null}
        </article>

        <aside className="w-full max-w-sm space-y-6">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Related posts</h3>
            {relatedPosts.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No related blog posts available right now.</p> : <div className="mt-4 space-y-3">{relatedPosts.map((related: { slug: string; title: string }) => (
              <Link key={related.slug} href={`/blogs/${related.slug}`} className="block rounded-2xl border border-border bg-background/70 p-3 text-sm font-medium text-foreground hover:border-primary/40">
                {related.title}
              </Link>
            ))}</div>}
          </div>
         
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Explore more</h3>
            <Link href="/blogs" className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline">View all blogs</Link>
          </div>
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold">About Bubble Buddy</h3>
            <p className="mt-3 text-sm text-muted-foreground">Bubble Buddy is your go-to source for beauty, skincare, and haircare advice. Our blog offers expert tips, product reviews, and guides to help you make informed choices for your self-care routine.</p>
          </div>
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Contact us</h3>
            <p className="mt-3 text-sm text-muted-foreground">Have questions or need assistance? Reach out to our support team for help with your beauty and skincare needs.</p>
            <Link href="/contact-us" className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline">Get in touch</Link>
          </div>
           <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Best selling products</h3>
            <div className="mt-4 space-y-3">
              {bestSellingProducts.map((product) => {
                const cartProduct: CartProduct = toCartProduct({
                  ...product,
                  price: product.price.toString(),
                  stockQuantity: 999,
                });

                return (
                  <div key={product.id} className="rounded-[1.25rem] border border-border bg-background/70 p-3">
                    <div className="flex gap-3">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[1rem] border border-border bg-muted">
                        <Image
                          src={product.thumbnail ?? "/category/1.jpg"}
                          alt={product.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link href={`/shop/${product.slug}`} className="text-sm font-semibold text-foreground hover:text-primary">
                          {product.name}
                        </Link>
                        <p className="mt-1 text-sm font-medium text-primary">
                          {product.currency} {product.price.toString()}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <AddToCartButton
                            product={cartProduct}
                            size="sm"
                            label="Add"
                            variant="default"
                            className="h-8 px-3 text-xs"
                          />
                          <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:border-primary hover:text-primary"
                            aria-label={`Add ${product.name} to wishlist`}
                          >
                            <Heart className="size-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Follow us</h3>
            <p className="mt-3 text-sm text-muted-foreground">Stay connected with Bubble Buddy on social media for the latest updates, tips, and promotions.</p>
            <div className="mt-4 flex gap-4">
              <Link href="https://www.facebook.com/bubblebuddysmile" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Facebook</Link>
              <Link href="https://www.instagram.com/bubble_buddy_smile" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Instagram</Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
    <ProductList/>
              
    </>
  );
}
