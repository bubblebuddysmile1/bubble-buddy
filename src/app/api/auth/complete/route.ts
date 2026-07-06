import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { issueVerificationOtp, setPasswordForUser } from "@/lib/account-auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "").trim();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      accountStatus: true,
      emailVerified: true,
      password: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "No account was found for that email." }, { status: 404 });
  }

  if (user.accountStatus === "ACTIVE" && user.password) {
    return NextResponse.json({ error: "A password is already set for this account. Use the sign-in page to log in." }, { status: 409 });
  }

  await setPasswordForUser(user.id, password);

  const needsVerification = user.accountStatus !== "ACTIVE" || !user.emailVerified;
  if (needsVerification) {
    await issueVerificationOtp(user.id, email).catch((error) => {
      console.error("[auth/complete] Failed to issue verification OTP", error);
    });
  }

  await logActivity({
    userId: user.id,
    eventType: "AUDIT_TRAIL",
    action: "Account completion password set",
    description: `Password set for ${email} via account completion`,
  });

  return NextResponse.json({
    message: needsVerification
      ? "Password saved. A verification OTP has been sent to your email."
      : "Password saved successfully. You can now sign in with it.",
  });
}
