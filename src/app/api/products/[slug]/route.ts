import type { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

type ProductWithCategoryAndImages = Prisma.ProductGetPayload<{
  include: {
    category: { select: { id: true; name: true; slug: true } };
    images: true;
  };
}>;

type ProductImageInput = {
  url: string;
  altText?: string | null;
  sortOrder?: number;
};

function normalizeProduct(product: ProductWithCategoryAndImages) {
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    slug: product.slug,
    description: product.description,
    details: product.details,
    price: product.price?.toString() ?? null,
    compareAtPrice: product.compareAtPrice?.toString() ?? null,
    currency: product.currency,
    stockQuantity: product.stockQuantity,
    featured: product.featured,
    isActive: product.isActive,
    averageRating: product.averageRating,
    reviewCount: product.reviewCount,
    category: product.category
      ? { id: product.category.id, name: product.category.name, slug: product.category.slug }
      : null,
    thumbnail: product.thumbnail,
    images: product.images.map((image) => ({
      id: image.id,
      url: image.url,
      altText: image.altText,
      sortOrder: image.sortOrder,
    })),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const slug = String(params.slug ?? "");
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  return NextResponse.json({ product: normalizeProduct(product) });
}

export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const slug = String(params.slug ?? "");
  const body = await req.json();
  const updates: Record<string, unknown> = {};

  if (body.name !== undefined) updates.name = String(body.name).trim();
  if (body.sku !== undefined) updates.sku = String(body.sku).trim();
  if (body.slug !== undefined) updates.slug = String(body.slug).trim();
  if (body.description !== undefined) updates.description = String(body.description).trim();
  if (body.details !== undefined) updates.details = body.details ? String(body.details).trim() : null;
  if (body.price !== undefined) updates.price = String(body.price);
  if (body.compareAtPrice !== undefined) updates.compareAtPrice = body.compareAtPrice ? String(body.compareAtPrice) : null;
  if (body.currency !== undefined) updates.currency = String(body.currency).trim();
  if (body.stockQuantity !== undefined) updates.stockQuantity = Number(body.stockQuantity);
  if (body.featured !== undefined) updates.featured = Boolean(body.featured);
  if (body.isActive !== undefined) updates.isActive = Boolean(body.isActive);
  if (body.thumbnail !== undefined) updates.thumbnail = body.thumbnail ? String(body.thumbnail).trim() : null;

  if (body.categorySlug !== undefined) {
    const categorySlug = String(body.categorySlug).trim();
    const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (!category) {
      return NextResponse.json({ error: "Category not found." }, { status: 400 });
    }
    updates.category = { connect: { id: category.id } };
  }

  const images = Array.isArray(body.images) ? (body.images as ProductImageInput[]) : null;

  const existing = await prisma.product.findUnique({ where: { slug } });
  if (!existing) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const product = await prisma.product.update({
    where: { slug },
    data: {
      ...updates,
      ...(images
        ? {
            images: {
              deleteMany: {},
              create: images
                .filter((item): item is ProductImageInput => Boolean(item?.url))
                .map((item) => ({
                  url: String(item.url),
                  altText: item?.altText ? String(item.altText) : null,
                  sortOrder: Number(item?.sortOrder ?? 0),
                })),
            },
          }
        : {}),
    },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  return NextResponse.json({ product: normalizeProduct(product) });
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const slug = String(params.slug ?? "");
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const updated = await prisma.product.update({
    where: { slug },
    data: { isActive: false },
  });

  return NextResponse.json({ product: normalizeProduct(updated) });
}
