import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ slug: string }>;
};

const siteUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") || "https://bubblebuddysmile.com";

export const revalidate = 60;
export const dynamicParams = true;

async function getBlogPost(slug: string) {
  return prisma.blogPost.findUnique({
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
    ? await prisma.blogPost.findMany({
        where: { slug: { in: post.relatedSlugs.split(",").map((item) => item.trim()).filter(Boolean) }, isPublished: true },
        select: { slug: true, title: true, excerpt: true },
      })
    : [];

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
    <main className="min-h-screen bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row">
        <article className="flex-1 rounded-[2rem] border border-border bg-card p-8 shadow-sm">
          {post.featuredImage ? <img src={post.featuredImage} alt={post.featuredImageAlt ?? post.title} className="mb-8 h-72 w-full rounded-[1.5rem] object-cover" /> : null}
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Blog</p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{post.title}</h1>
          {post.heading ? <h2 className="mt-4 text-2xl font-medium text-muted-foreground">{post.heading}</h2> : null}
          <p className="mt-4 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
          <div className="prose prose-neutral mt-8 max-w-none whitespace-pre-line text-base leading-8 text-foreground">
            {post.content}
          </div>
          {post.faq ? <section className="mt-10 rounded-[1.5rem] border border-border bg-background/70 p-6">
            <h3 className="text-xl font-semibold">FAQ</h3>
            <div className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">{post.faq}</div>
          </section> : null}
        </article>

        <aside className="w-full max-w-sm space-y-6">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Related posts</h3>
            {relatedPosts.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No related blog posts available right now.</p> : <div className="mt-4 space-y-3">{relatedPosts.map((related) => (
              <Link key={related.slug} href={`/blogs/${related.slug}`} className="block rounded-2xl border border-border bg-background/70 p-3 text-sm font-medium text-foreground hover:border-primary/40">
                {related.title}
              </Link>
            ))}</div>}
          </div>
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Explore more</h3>
            <Link href="/blogs" className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline">View all blogs</Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
