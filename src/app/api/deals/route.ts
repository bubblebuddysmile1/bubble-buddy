import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const activeOnly = searchParams.get("active") === "1";

  try {
    const where = activeOnly 
      ? { 
          isActive: true,
          endsAt: { gt: new Date() }
        }
      : {};

    const deals = await prisma.deal.findMany({
      where,
      include: {
        products: true,
        _count: {
          select: { dealClaims: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      deals: deals.map(deal => ({
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

    const deal = await prisma.deal.create({
      data: {
        title,
        description,
        dealType,
        urgencyLevel,
        discountPercent,
        discountFixed: discountFixed ? parseFloat(discountFixed) : null,
        limitedQuantity,
        couponCode,
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
