import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthPayload } from "@/lib/admin-auth";

function normalizeReview(r: any) {
  return {
    id: r.id,
    rating: r.rating,
    title: r.title,
    body: r.body,
    approved: r.approved,
    user: r.user ? { id: r.user.id, name: r.user.name, email: r.user.email } : null,
    productId: r.productId,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const productId = searchParams.has("productId") ? Number(searchParams.get("productId")) : null;
  const productSlug = searchParams.get("productSlug") ?? null;
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? "10")));

  let pid = productId;
  if (!pid && productSlug) {
    const p = await prisma.product.findUnique({ where: { slug: String(productSlug) } });
    if (!p) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    pid = p.id;
  }

  if (!pid) {
    return NextResponse.json({ error: "productId or productSlug is required." }, { status: 400 });
  }

  const where = { productId: pid, approved: true };

  const total = await prisma.review.count({ where });
  const agg = await prisma.review.aggregate({
    where,
    _avg: { rating: true },
  });
  const averageRating = Number(agg._avg.rating ?? 0);

  const reviews = await prisma.review.findMany({
    where,
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return NextResponse.json({
    reviews: reviews.map(normalizeReview),
    total,
    averageRating,
    page,
    perPage: limit,
  });
}


export async function POST(req: NextRequest) {
  const auth = getAuthPayload(req);
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 403 });

  const body = await req.json();
  const productId = body?.productId ? Number(body.productId) : null;
  const productSlug = body?.productSlug ?? null;
  const rating = Number(body?.rating ?? 0);
  const title = body?.title ? String(body.title).trim() : null;
  const text = body?.body ? String(body.body).trim() : null;

  let pid = productId;
  if (!pid && productSlug) {
    const p = await prisma.product.findUnique({ where: { slug: String(productSlug) } });
    if (!p) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    pid = p.id;
  }

  if (!pid) return NextResponse.json({ error: "productId or productSlug is required." }, { status: 400 });
  if (!(rating >= 1 && rating <= 5)) return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });

  // Check if user has purchased this product (delivered orders)
  const hasPurchased = await prisma.order.findFirst({
    where: {
      userId: auth.id,
      status: "DELIVERED",
      items: { some: { productId: pid } },
    },
  });

  const verified = Boolean(hasPurchased);

  const review = await prisma.review.create({
    data: {
      rating,
      title,
      body: text,
      approved: true, // show reviews immediately
      verifiedPurchase: verified,
      user: { connect: { id: auth.id } },
      product: { connect: { id: pid } },
    },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  // Recalculate product aggregates (averageRating, reviewCount)
  const agg = await prisma.review.aggregate({
    where: { productId: pid, approved: true },
    _avg: { rating: true },
    _count: { id: true },
  });

  const avg = agg._avg.rating ?? 0;
  const count = agg._count.id ?? 0;

  await prisma.product.update({ where: { id: pid }, data: { averageRating: Number(avg), reviewCount: count } });

  return NextResponse.json({ review: normalizeReview(review) }, { status: 201 });
}
