import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

type QueryParams = {
  page?: number;
  limit?: number;
  approved?: string | null;
};

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = Math.min(200, Math.max(1, Number(searchParams.get("limit") ?? "50")));
  const approvedParam = searchParams.get("approved");

  const where: any = {};
  if (approvedParam === "1") where.approved = true;
  if (approvedParam === "0") where.approved = false;

  const total = await prisma.review.count({ where });

  const reviews = await prisma.review.findMany({
    where,
    include: { user: { select: { id: true, name: true, email: true } }, product: { select: { id: true, name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return NextResponse.json({ reviews, total, page, perPage: limit });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const body = await req.json();
  const id = Number(body?.id);
  const approve = Boolean(body?.approve);

  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Review not found" }, { status: 404 });

  const updated = await prisma.review.update({ where: { id }, data: { approved: approve } });

  // If approved, recalc product aggregates
  if (approve) {
    const agg = await prisma.review.aggregate({
      where: { productId: updated.productId, approved: true },
      _avg: { rating: true },
      _count: { id: true },
    });
    const avg = agg._avg.rating ?? 0;
    const count = agg._count.id ?? 0;
    await prisma.product.update({ where: { id: updated.productId }, data: { averageRating: Number(avg), reviewCount: count } });
  }

  return NextResponse.json({ review: updated });
}
