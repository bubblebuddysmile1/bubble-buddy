import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { isPromotionActive, normalizeCouponCode } from "@/lib/promotions";

type PromotionRecord = {
  id: number;
  code: string;
  title: string;
  description: string | null;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderAmount: number;
  activeFrom: Date | null;
  activeUntil: Date | null;
  isActive: boolean;
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
    activeFrom: promotion.activeFrom?.toISOString() ?? null,
    activeUntil: promotion.activeUntil?.toISOString() ?? null,
    isActive: promotion.isActive,
    createdAt: promotion.createdAt.toISOString(),
    updatedAt: promotion.updatedAt.toISOString(),
  };
}

function parseDate(value: unknown): Date | null {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const activeOnly = searchParams.get("active") === "1";
  const includeInactive = searchParams.get("all") === "1";
  const adminView = searchParams.get("admin") === "1";
  const limit = Math.min(20, Math.max(1, Number(searchParams.get("limit") ?? "4")));

  if (adminView) {
    const auth = await requireAdmin(req);
    if (auth instanceof NextResponse) {
      return auth;
    }
  }

  const now = new Date();
  const where: Record<string, unknown> = {};

  if (activeOnly) {
    where.isActive = true;
    where.AND = [
      { OR: [{ activeFrom: null }, { activeFrom: { lte: now } }] },
      { OR: [{ activeUntil: null }, { activeUntil: { gte: now } }] },
    ];
  } else if (!includeInactive) {
    where.isActive = true;
  }

  const promotions = await prisma.promotion.findMany({
    where,
    orderBy: [{ activeFrom: "desc" }, { createdAt: "desc" }],
    take: limit,
  });

  return NextResponse.json({ promotions: promotions.map(normalizePromotion) });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const body = await req.json();
  const code = normalizeCouponCode(String(body?.code ?? "").trim());
  const title = String(body?.title ?? "").trim();
  const description = body?.description ? String(body.description).trim() : null;
  const discountType = String(body?.discountType ?? "PERCENTAGE").toUpperCase() as
    | "PERCENTAGE"
    | "FIXED";
  const discountValue = Number(body?.discountValue ?? 0);
  const minOrderAmount = Number(body?.minOrderAmount ?? 0);
  const activeFrom = parseDate(body?.activeFrom);
  const activeUntil = parseDate(body?.activeUntil);
  const isActive = body?.isActive !== undefined ? Boolean(body.isActive) : true;

  if (!code || !title || !discountValue || discountValue < 0) {
    return NextResponse.json(
      { error: "Code, title, and valid discount value are required." },
      { status: 400 },
    );
  }

  const existing = await prisma.promotion.findUnique({ where: { code } });
  if (existing) {
    return NextResponse.json({ error: "Promotion code already exists." }, { status: 409 });
  }

  const promotion = await prisma.promotion.create({
    data: {
      code,
      title,
      description,
      discountType,
      discountValue: discountValue.toString(),
      minOrderAmount: minOrderAmount.toString(),
      activeFrom,
      activeUntil,
      isActive,
    },
  });

  return NextResponse.json({ promotion: normalizePromotion(promotion) }, { status: 201 });
}
