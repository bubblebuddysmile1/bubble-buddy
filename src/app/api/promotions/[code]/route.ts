import type { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { normalizeCouponCode } from "@/lib/promotions";

type PromotionRecord = {
  id: number;
  code: string;
  title: string;
  description: string | null;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: Prisma.Decimal;
  minOrderAmount: Prisma.Decimal;
  productId: number | null;
  availableQuantity: number | null;
  activeFrom: Date | null;
  activeUntil: Date | null;
  isActive: boolean;
  product: { id: number; name: string; slug: string; thumbnail: string | null } | null;
  createdAt: Date;
  updatedAt: Date;
};

function normalizePromotion(promotion: PromotionRecord) {
  return {
    id: promotion.id,
    code: promotion.code,
    title: promotion.title,
    description: promotion.description,
    discountType: promotion.discountType,
    discountValue: Number(promotion.discountValue),
    minOrderAmount: Number(promotion.minOrderAmount),
    productId: promotion.productId,
    availableQuantity: promotion.availableQuantity,
    product: promotion.product
      ? {
          id: promotion.product.id,
          name: promotion.product.name,
          slug: promotion.product.slug,
          thumbnail: promotion.product.thumbnail,
        }
      : null,
    activeFrom: promotion.activeFrom?.toISOString() ?? null,
    activeUntil: promotion.activeUntil?.toISOString() ?? null,
    isActive: promotion.isActive,
    createdAt: promotion.createdAt.toISOString(),
    updatedAt: promotion.updatedAt.toISOString(),
  };
}

type RouteContext = { params: Promise<{ code: string }> };

function parseDate(value: unknown): Date | null {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { code } = await params;
  const normalizedCode = normalizeCouponCode(code);

  const promotion = await prisma.promotion.findUnique({
    where: { code: normalizedCode },
    include: { product: { select: { id: true, name: true, slug: true, thumbnail: true } } },
  });
  if (!promotion) {
    return NextResponse.json({ error: "Promotion not found." }, { status: 404 });
  }

  return NextResponse.json({ promotion: normalizePromotion(promotion) });
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const { code } = await params;
  const normalizedCode = normalizeCouponCode(code);
  const body = await req.json();
  const updates: Record<string, unknown> = {};

  const parseNullableNumber = (value: unknown) => {
    if (value === null || value === undefined || String(value).trim() === "") return null;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  };

  if (body.code !== undefined) {
    updates.code = normalizeCouponCode(String(body.code ?? "").trim());
  }
  if (body.title !== undefined) updates.title = String(body.title ?? "").trim();
  if (body.description !== undefined) updates.description = body.description ? String(body.description).trim() : null;
  if (body.discountType !== undefined)
    updates.discountType = String(body.discountType).toUpperCase();
  if (body.discountValue !== undefined) updates.discountValue = String(Number(body.discountValue));
  if (body.minOrderAmount !== undefined) updates.minOrderAmount = String(Number(body.minOrderAmount));
  if (body.productId !== undefined) updates.productId = parseNullableNumber(body.productId);
  if (body.availableQuantity !== undefined) updates.availableQuantity = parseNullableNumber(body.availableQuantity);
  if (body.activeFrom !== undefined) updates.activeFrom = parseDate(body.activeFrom);
  if (body.activeUntil !== undefined) updates.activeUntil = parseDate(body.activeUntil);
  if (body.isActive !== undefined) updates.isActive = Boolean(body.isActive);

  const existing = await prisma.promotion.findUnique({ where: { code: normalizedCode } });
  if (!existing) {
    return NextResponse.json({ error: "Promotion not found." }, { status: 404 });
  }

  if (updates.code && updates.code !== normalizedCode) {
    const codeTaken = await prisma.promotion.findUnique({ where: { code: String(updates.code) } });
    if (codeTaken) {
      return NextResponse.json({ error: "Promotion code already exists." }, { status: 409 });
    }
  }

  if (updates.productId !== undefined && updates.productId !== null) {
    const product = await prisma.product.findUnique({ where: { id: Number(updates.productId) } });
    if (!product) {
      return NextResponse.json({ error: "Selected product not found." }, { status: 400 });
    }
  }

  if (updates.availableQuantity !== undefined && updates.availableQuantity !== null && Number(updates.availableQuantity) < 0) {
    return NextResponse.json({ error: "Available quantity must be zero or greater." }, { status: 400 });
  }

  const promotion = await prisma.promotion.update({
    where: { code: normalizedCode },
    data: updates,
    include: { product: { select: { id: true, name: true, slug: true, thumbnail: true } } },
  });

  return NextResponse.json({ promotion: normalizePromotion(promotion) });
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const auth = await requireAdmin(_req);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const { code } = await params;
  const normalizedCode = normalizeCouponCode(code);

  const promotion = await prisma.promotion.findUnique({ where: { code: normalizedCode } });
  if (!promotion) {
    return NextResponse.json({ error: "Promotion not found." }, { status: 404 });
  }

  await prisma.promotion.delete({ where: { code: normalizedCode } });
  return NextResponse.json({ success: true });
}
