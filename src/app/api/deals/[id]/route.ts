import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
  req: NextRequest,
  { params }: RouteContext
) {
  const { id } = await params;

  try {
    const deal = await prisma.deal.findUnique({
      where: { id: parseInt(id) },
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

    const deal = await prisma.deal.update({
      where: { id: parseInt(id) },
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
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    await prisma.deal.delete({
      where: { id: parseInt(id) }
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
