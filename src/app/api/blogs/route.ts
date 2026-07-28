import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

type BlogRecord = {
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
  createdAt: Date;
  updatedAt: Date;
};

const blogPrisma = prisma as unknown as {
  blogPost: {
    findUnique: (args: Record<string, unknown>) => Promise<BlogRecord | null>;
    findMany: (args: Record<string, unknown>) => Promise<BlogRecord[]>;
    create: (args: Record<string, unknown>) => Promise<BlogRecord>;
  };
};

function normalizePost(post: {
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
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    heading: post.heading,
    content: post.content,
    featuredImage: post.featuredImage,
    featuredImageAlt: post.featuredImageAlt,
    faq: post.faq,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    metaKeywords: post.metaKeywords,
    relatedSlugs: post.relatedSlugs,
    isPublished: post.isPublished,
    publishedAt: post.publishedAt?.toISOString() ?? null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const adminView = searchParams.get("admin") === "1";
  const slug = searchParams.get("slug")?.trim();

  if (slug) {
    const post = await blogPrisma.blogPost.findUnique({ where: { slug } });
    if (!post) {
      return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    }

    if (!adminView && !post.isPublished) {
      return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    }

    return NextResponse.json({ post: normalizePost(post) });
  }

  const where = adminView ? {} : { isPublished: true };
  const posts = await blogPrisma.blogPost.findMany({
    where,
    orderBy: [{ isPublished: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ posts: posts.map(normalizePost) });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const body = await req.json();
  const title = String(body?.title ?? "").trim();
  const slug = String(body?.slug ?? "").trim() || slugify(title);
  const excerpt = body?.excerpt ? String(body.excerpt).trim() : null;
  const heading = body?.heading ? String(body.heading).trim() : null;
  const content = String(body?.content ?? "").trim();
  const featuredImage = body?.featuredImage ? String(body.featuredImage).trim() : null;
  const featuredImageAlt = body?.featuredImageAlt ? String(body.featuredImageAlt).trim() : null;
  const faq = body?.faq ? String(body.faq).trim() : null;
  const metaTitle = body?.metaTitle ? String(body.metaTitle).trim() : null;
  const metaDescription = body?.metaDescription ? String(body.metaDescription).trim() : null;
  const metaKeywords = body?.metaKeywords ? String(body.metaKeywords).trim() : null;
  const relatedSlugs = body?.relatedSlugs ? String(body.relatedSlugs).trim() : null;
  const isPublished = Boolean(body?.isPublished ?? false);

  if (!title || !content) {
    return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
  }

  const existing = await blogPrisma.blogPost.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "A blog post with this slug already exists." }, { status: 409 });
  }

  const post = await blogPrisma.blogPost.create({
    data: {
      title,
      slug,
      excerpt,
      heading,
      content,
      featuredImage,
      featuredImageAlt,
      faq,
      metaTitle,
      metaDescription,
      metaKeywords,
      relatedSlugs,
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    },
  });

  return NextResponse.json({ post: normalizePost(post) }, { status: 201 });
}
