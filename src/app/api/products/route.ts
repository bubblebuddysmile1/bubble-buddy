import type { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

type ProductWithCategory = Prisma.ProductGetPayload<{
  include: {
    category: { select: { id: true; name: true; slug: true } };
  };
}>;

type ProductCreateImage = {
  url: string;
  altText?: string | null;
};

function normalizeProduct(product: ProductWithCategory) {
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
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

function getAuthPayload(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAuthToken(token);
}

async function requireAdmin(req: NextRequest) {
  const payload = getAuthPayload(req);
  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  return payload;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const query = String(searchParams.get("q") ?? "").trim();
  const categorySlug = String(searchParams.get("category") ?? "").trim();

  const where: {
    isActive: boolean;
    OR?: Array<{
      name?: { contains: string; mode: "insensitive" };
      description?: { contains: string; mode: "insensitive" };
      sku?: { contains: string; mode: "insensitive" };
    }>;
    category?: { slug: string };
  } = { isActive: true };

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { sku: { contains: query, mode: "insensitive" } },
    ];
  }

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    include: { category: { select: { id: true, name: true, slug: true } } },
    take: 100,
  });

  return NextResponse.json({ products: products.map(normalizeProduct) });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const body = await req.json();
  const name = String(body?.name ?? "").trim();
  const sku = String(body?.sku ?? "").trim();
  const slug = String(body?.slug ?? "").trim();
  const description = String(body?.description ?? "").trim();
  const details = body?.details ? String(body.details).trim() : null;
  const currency = String(body?.currency ?? "USD").trim();
  const thumbnail = body?.thumbnail ? String(body.thumbnail).trim() : null;
  const categorySlug = String(body?.categorySlug ?? "").trim();
  const price = body?.price ? String(body.price) : null;
  const compareAtPrice = body?.compareAtPrice ? String(body.compareAtPrice) : null;
  const stockQuantity = Number(body?.stockQuantity ?? 0);
  const featured = Boolean(body?.featured ?? false);
  const isActive = Boolean(body?.isActive ?? true);
  const images = Array.isArray(body?.images) ? (body.images as Array<Record<string, unknown>>) : [];

  if (!name || !sku || !slug || !description || !price || !categorySlug) {
    return NextResponse.json(
      { error: "Product name, sku, slug, description, price, and categorySlug are required." },
      { status: 400 },
    );
  }

  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) {
    return NextResponse.json({ error: "Category not found." }, { status: 400 });
  }

  const existingProduct = await prisma.product.findUnique({ where: { slug } });
  if (existingProduct) {
    return NextResponse.json({ error: "Product with this slug already exists." }, { status: 409 });
  }

  const product = await prisma.product.create({
    data: {
      name,
      sku,
      slug,
      description,
      details,
      price,
      compareAtPrice: compareAtPrice ?? undefined,
      currency,
      stockQuantity,
      featured,
      isActive,
      thumbnail,
      category: { connect: { id: category.id } },
      images: {
        create: images
          .filter((item): item is ProductCreateImage => Boolean(item?.url))
          .map((item) => ({ url: String(item.url), altText: item?.altText ? String(item.altText) : null })),
      },
    },
    include: { category: { select: { id: true, name: true, slug: true } } },
  });

  return NextResponse.json({ product: normalizeProduct(product) }, { status: 201 });
}
