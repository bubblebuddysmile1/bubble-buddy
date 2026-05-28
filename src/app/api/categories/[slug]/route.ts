import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

function normalizeCategory(category: {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  showInBanner: boolean;
  _count?: { products: number };
}) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: category.image,
    isActive: category.isActive,
    showInBanner: category.showInBanner,
    productCount: category._count?.products ?? 0,
  };
}

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: { _count: { select: { products: true } } },
  });

  if (!category) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }

  return NextResponse.json({ category: normalizeCategory(category) });
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const { slug } = await params;
  const body = await req.json();
  const updates: Record<string, unknown> = {};

  if (body.name !== undefined) updates.name = String(body.name).trim();
  if (body.slug !== undefined) updates.slug = String(body.slug).trim();
  if (body.description !== undefined) updates.description = body.description ? String(body.description).trim() : null;
  if (body.image !== undefined) updates.image = body.image ? String(body.image).trim() : null;
  if (body.isActive !== undefined) updates.isActive = Boolean(body.isActive);
  if (body.showInBanner !== undefined) updates.showInBanner = Boolean(body.showInBanner);

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (!existing) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }

  if (updates.slug && updates.slug !== slug) {
    const slugTaken = await prisma.category.findUnique({ where: { slug: String(updates.slug) } });
    if (slugTaken) {
      return NextResponse.json({ error: "Category slug already exists." }, { status: 409 });
    }
  }

  const category = await prisma.category.update({
    where: { slug },
    data: updates,
    include: { _count: { select: { products: true } } },
  });

  return NextResponse.json({ category: normalizeCategory(category) });
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: { _count: { select: { products: true } } },
  });

  if (!category) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }

  if (category._count.products > 0) {
    return NextResponse.json(
      { error: "Cannot delete a category that has products. Reassign or remove products first." },
      { status: 400 },
    );
  }

  await prisma.category.delete({ where: { slug } });

  return NextResponse.json({ success: true });
}
