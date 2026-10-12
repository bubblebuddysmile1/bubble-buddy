import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { hasDealDiscount } from "@/lib/deals";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
  req: NextRequest,
  { params }: RouteContext
) {
  const { id } = await params;
  const dealId = Number(id);
  if (!Number.isInteger(dealId) || dealId <= 0) {
    return NextResponse.json({ error: "Invalid deal ID." }, { status: 400 });
  }

  try {
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: {
        products: {
          include: {
            category: true,
            images: true
          }
        },
        dealClaims: true
      }
    });

    if (!deal) {
      return NextResponse.json(
        { error: "Deal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(deal);
  } catch (error) {
    console.error("Error fetching deal:", error);
    return NextResponse.json(
      { error: "Failed to fetch deal" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: RouteContext
) {
  const { id } = await params;
  const dealId = Number(id);
  if (!Number.isInteger(dealId) || dealId <= 0) {
    return NextResponse.json({ error: "Invalid deal ID." }, { status: 400 });
  }

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
        { error: "Set a percentage or fixed discount before saving a Deal." },
        { status: 400 },
      );
    }

    if (normalizedCouponCode) {
      const duplicate = await prisma.deal.findFirst({
        where: {
          couponCode: { equals: normalizedCouponCode, mode: "insensitive" },
          id: { not: dealId },
        },
        select: { id: true },
      });
      if (duplicate) {
        return NextResponse.json({ error: "This Deal code is already in use." }, { status: 409 });
      }
    }

    const deal = await prisma.deal.update({
      where: { id: dealId },
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
          set: productIds?.map((id: number) => ({ id })) || []
        }
      },
      include: {
        products: true,
        dealClaims: true
      }
    });

    return NextResponse.json(deal);
  } catch (error) {
    console.error("Error updating deal:", error);
    return NextResponse.json(
      { error: "Failed to update deal" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: RouteContext
) {
  const { id } = await params;
  const dealId = Number(id);
  if (!Number.isInteger(dealId) || dealId <= 0) {
    return NextResponse.json({ error: "Invalid deal ID." }, { status: 400 });
  }

  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    await prisma.deal.delete({
      where: { id: dealId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting deal:", error);
    return NextResponse.json(
      { error: "Failed to delete deal" },
      { status: 500 }
    );
  }
}
