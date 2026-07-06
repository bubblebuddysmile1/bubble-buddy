import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, authCookieOptions, createAuthToken } from "@/lib/auth";
import { issueVerificationOtp, verifyAccountWithOtp } from "@/lib/account-auth";
import { logActivity } from "@/lib/activity-log";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = String(body?.email ?? "").trim().toLowerCase();
  const otp = String(body?.otp ?? "").trim();

  if (!email) {
    return NextResponse.json({ error: "Email is required for OTP login." }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      accountStatus: true,
      authType: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "No account was found for that email." }, { status: 404 });
  }

  if (!otp) {
    await issueVerificationOtp(user.id, user.email).catch((error) => {
      console.error("[auth/otp] OTP request failed", error);
    });

    await logActivity({
      userId: user.id,
      eventType: "AUDIT_TRAIL",
      action: "OTP requested",
      description: `OTP requested for ${user.email}`,
      metadata: JSON.stringify({ authType: user.authType }),
    });

    return NextResponse.json({
      ok: true,
      message: "We sent a one-time code to your email. Enter it to continue.",
      requiresOtp: true,
    });
  }

  const verification = await verifyAccountWithOtp(user.id, otp);
  if (!verification.ok) {
    return NextResponse.json({ error: verification.message }, { status: 400 });
  }

  const token = createAuthToken({
    id: user.id,
    email: user.email ?? email,
    name: user.name,
    role: user.role,
  });

  const response = NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token,
    verified: true,
  });

  response.cookies.set(COOKIE_NAME, token, authCookieOptions);
  return response;
}
