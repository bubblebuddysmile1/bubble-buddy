import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";
import { hasDealDiscount, isDealActive } from "@/lib/deals";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(
  req: NextRequest,
  { params }: RouteContext
) {
  const { id } = await params;
  const dealId = Number(id);
  if (!Number.isInteger(dealId) || dealId <= 0) {
    return NextResponse.json({ error: "Invalid deal ID." }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { email } = body;

    const token = req.cookies.get(COOKIE_NAME)?.value;
    const authPayload = token ? verifyAuthToken(token) : null;
    const userId = authPayload?.id ?? null;
    const claimEmail = email || authPayload?.email || null;

    const deal = await prisma.deal.findUnique({
      where: { id: dealId }
    });

    if (!deal) {
      return NextResponse.json(
        { error: "Deal not found" },
        { status: 404 }
      );
    }

    if (!isDealActive(deal)) {
      return NextResponse.json(
        { error: "This deal is no longer active" },
        { status: 400 }
      );
    }

    if (!deal.couponCode || !hasDealDiscount(deal)) {
      return NextResponse.json(
        { error: "This Deal does not have an active checkout code." },
        { status: 400 }
      );
    }

    const claim = await prisma.dealClaim.create({
      data: {
        dealId: deal.id,
        userId,
        email: claimEmail,
      },
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
