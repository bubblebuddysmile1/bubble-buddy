import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const blogPrisma = prisma as unknown as {
  blogPost: {
    findMany: (args: Record<string, unknown>) => Promise<Array<{
      id: number;
      title: string;
      slug: string;
      excerpt: string | null;
      featuredImage: string | null;
      featuredImageAlt: string | null;
      publishedAt: Date | null;
    }>>;
  };
};

export const metadata: Metadata = {
  title: "Blogs | Bubble Buddy",
  description: "Explore helpful beauty, skincare, and haircare guides written by Bubble Buddy.",
  alternates: { canonical: "https://bubblebuddysmile.com/blogs" },
};

export const revalidate = 60;

export default async function BlogsPage() {
  const posts = await blogPrisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      featuredImage: true,
      featuredImageAlt: true,
      publishedAt: true,
    },
  });

  return (
    <main className="min-h-screen bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Blogs</p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Beauty tips, guides, and product advice</h1>
          <p className="mt-4 text-lg text-muted-foreground">Stay informed with expert advice that helps you choose products that suit your routine.</p>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-[2rem] border border-border bg-card p-8 text-sm text-muted-foreground">
            No blog posts published yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post: { id: number; slug: string; title: string; excerpt: string | null; featuredImage: string | null; featuredImageAlt: string | null }) => (
              <Link key={post.id} href={`/blogs/${post.slug}`} className="group overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                {post.featuredImage ? (
                  <div className="relative h-48 w-full">
                    <Image
                      src={post.featuredImage}
                      alt={post.featuredImageAlt ?? post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 w-full bg-linear-to-br from-primary/20 to-muted" />
                )}
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-primary">Blog</p>
                  <h2 className="mt-3 text-xl font-semibold text-foreground">{post.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{post.excerpt ?? "Read the full guide to discover more."}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
