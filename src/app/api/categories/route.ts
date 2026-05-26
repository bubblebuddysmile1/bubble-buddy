import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

function normalizeCategory(category: {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  _count?: { products: number };
}) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: category.image,
    isActive: category.isActive,
    productCount: category._count?.products ?? 0,
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const includeInactive = searchParams.get("all") === "1";

  const categories = await prisma.category.findMany({
    where: includeInactive ? undefined : { isActive: true },
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return NextResponse.json({ categories: categories.map(normalizeCategory) });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const body = await req.json();
  const name = String(body?.name ?? "").trim();
  const slug = String(body?.slug ?? slugify(name)).trim();
  const description = body?.description ? String(body.description).trim() : null;
  const image = body?.image ? String(body.image).trim() : null;
  const isActive = body?.isActive !== undefined ? Boolean(body.isActive) : true;

  if (!name || !slug) {
    return NextResponse.json({ error: "Category name and slug are required." }, { status: 400 });
  }

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Category slug already exists." }, { status: 409 });
  }

  const category = await prisma.category.create({
    data: { name, slug, description, image, isActive },
    include: { _count: { select: { products: true } } },
  });

  return NextResponse.json({ category: normalizeCategory(category) }, { status: 201 });
}
