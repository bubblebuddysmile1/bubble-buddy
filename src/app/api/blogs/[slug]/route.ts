import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

const blogPrisma = prisma as unknown as {
  blogPost: {
    findUnique: (args: Record<string, unknown>) => Promise<any>;
    findMany: (args: Record<string, unknown>) => Promise<any[]>;
    update: (args: Record<string, unknown>) => Promise<any>;
    delete: (args: Record<string, unknown>) => Promise<any>;
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

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await blogPrisma.blogPost.findUnique({ where: { slug } });

  if (!post) {
    return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
  }

  if (!post.isPublished) {
    return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
  }

  return NextResponse.json({ post: normalizePost(post) });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const { slug: slugParam } = await params;
  const body = await req.json();

  const post = await blogPrisma.blogPost.findUnique({ where: { slug: slugParam } });
  if (!post) {
    return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
  }

  const title = body?.title != null ? String(body.title).trim() : undefined;
  const slug = body?.slug != null ? String(body.slug).trim() || slugify(title ?? post.title) : undefined;
  const excerpt = body?.excerpt != null ? String(body.excerpt).trim() : undefined;
  const heading = body?.heading != null ? String(body.heading).trim() : undefined;
  const content = body?.content != null ? String(body.content).trim() : undefined;
  const featuredImage = body?.featuredImage != null ? String(body.featuredImage).trim() : undefined;
  const featuredImageAlt = body?.featuredImageAlt != null ? String(body.featuredImageAlt).trim() : undefined;
  const faq = body?.faq != null ? String(body.faq).trim() : undefined;
  const metaTitle = body?.metaTitle != null ? String(body.metaTitle).trim() : undefined;
  const metaDescription = body?.metaDescription != null ? String(body.metaDescription).trim() : undefined;
  const metaKeywords = body?.metaKeywords != null ? String(body.metaKeywords).trim() : undefined;
  const relatedSlugs = body?.relatedSlugs != null ? String(body.relatedSlugs).trim() : undefined;
  const isPublished = body?.isPublished != null ? Boolean(body.isPublished) : undefined;

  const updated = await blogPrisma.blogPost.update({
    where: { slug: slugParam },
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
      publishedAt: isPublished !== undefined ? (isPublished ? (post.publishedAt ?? new Date()) : null) : undefined,
    },
  });

  return NextResponse.json({ post: normalizePost(updated) });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const { slug } = await params;
  await blogPrisma.blogPost.delete({ where: { slug } });
  return NextResponse.json({ success: true });
}
