import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { hasDealDiscount, isDealActive } from "@/lib/deals";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const activeOnly = searchParams.get("active") === "1";

  try {
    const deals = await prisma.deal.findMany({
      include: {
        products: {
          select: { id: true, name: true, slug: true, thumbnail: true },
        },
        _count: {
          select: { dealClaims: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      deals: (
        activeOnly
          ? deals.filter((deal) => isDealActive(deal) && Boolean(deal.couponCode) && hasDealDiscount(deal))
          : deals
      ).map(deal => ({
        ...deal,
        claimsCount: deal._count.dealClaims
      }))
    });
  } catch (error) {
    console.error("Error fetching deals:", error);
    return NextResponse.json(
      { error: "Failed to fetch deals" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const body = await req.json();
    const {
      title,
      description,
      dealType,
      urgencyLevel,
      discountPercent,
      discountFixed,
      limitedQuantity,
      couponCode,
      maxCoupons,
      isActive,
      startsAt,
      endsAt,
      productIds
    } = body;
    const normalizedCouponCode = String(couponCode ?? "").trim().toUpperCase() || null;

    if (!normalizedCouponCode) {
      return NextResponse.json(
        { error: "A Deal code is required so customers can apply this Deal at checkout." },
        { status: 400 },
      );
    }

    if (!hasDealDiscount({
      discountPercent: Number(discountPercent ?? 0),
      discountFixed: Number(discountFixed ?? 0),
    })) {
      return NextResponse.json(
        { error: "Set a percentage or fixed discount before creating a Deal." },
        { status: 400 },
      );
    }

    if (normalizedCouponCode) {
      const duplicate = await prisma.deal.findFirst({
        where: { couponCode: { equals: normalizedCouponCode, mode: "insensitive" } },
        select: { id: true },
      });
      if (duplicate) {
        return NextResponse.json({ error: "This Deal code is already in use." }, { status: 409 });
      }
    }

    const deal = await prisma.deal.create({
      data: {
        title,
        description,
        dealType,
        urgencyLevel,
        discountPercent,
        discountFixed: discountFixed ? parseFloat(discountFixed) : null,
        limitedQuantity,
        couponCode: normalizedCouponCode,
        maxCoupons,
        isActive,
        startsAt: startsAt ? new Date(startsAt) : null,
        endsAt: endsAt ? new Date(endsAt) : null,
        products: {
          connect: productIds?.map((id: number) => ({ id })) || []
        }
      },
      include: {
        products: true,
        dealClaims: true
      }
    });

    return NextResponse.json(deal, { status: 201 });
  } catch (error) {
    console.error("Error creating deal:", error);
    return NextResponse.json(
      { error: "Failed to create deal" },
      { status: 500 }
    );
  }
}
