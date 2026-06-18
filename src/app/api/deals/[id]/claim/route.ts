import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(
  req: NextRequest,
  { params }: RouteContext
) {
  const { id } = await params;

  try {
    const body = await req.json();
    const { email } = body;

    const token = req.cookies.get(COOKIE_NAME)?.value;
    const authPayload = token ? verifyAuthToken(token) : null;
    const userId = authPayload?.id ?? null;
    const claimEmail = email || authPayload?.email || null;

    const deal = await prisma.deal.findUnique({
      where: { id: parseInt(id) }
    });

    if (!deal) {
      return NextResponse.json(
        { error: "Deal not found" },
        { status: 404 }
      );
    }

    // Check if deal is still active
    if (!deal.isActive || (deal.endsAt && new Date() > deal.endsAt)) {
      return NextResponse.json(
        { error: "This deal is no longer active" },
        { status: 400 }
      );
    }

    // Check if limited quantity is exhausted
    if (deal.limitedQuantity && deal.claimedQuantity >= deal.limitedQuantity) {
      return NextResponse.json(
        { error: "All items have been claimed" },
        { status: 400 }
      );
    }

    // Check if coupons are exhausted
    if (deal.maxCoupons && deal.usedCoupons >= deal.maxCoupons) {
      return NextResponse.json(
        { error: "All coupons have been used" },
        { status: 400 }
      );
    }

    // Create claim record
    const claim = await prisma.dealClaim.create({
      data: {
        dealId: parseInt(id),
        userId: userId || null,
        email: claimEmail,
      }
    });

    // Update deal claimed quantity
    await prisma.deal.update({
      where: { id: parseInt(id) },
      data: {
        claimedQuantity: { increment: 1 },
        usedCoupons: { increment: 1 }
      }
    });

    // Return coupon code or claim confirmation
    return NextResponse.json({
      success: true,
      claim,
      couponCode: deal.couponCode || undefined,
      message: deal.couponCode
        ? `Coupon code: ${deal.couponCode}`
        : "Deal claimed successfully! Check your email for details."
    });
  } catch (error) {
    console.error("Error claiming deal:", error);
    return NextResponse.json(
      { error: "Failed to claim deal" },
      { status: 500 }
    );
  }
}
