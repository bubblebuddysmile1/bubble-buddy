import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, authCookieOptions, createAuthToken } from "@/lib/auth";
import { logActivity } from "@/lib/activity-log";
import { checkExistingAccount, issueVerificationOtp, setPasswordForUser } from "@/lib/account-auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const accountState = await checkExistingAccount(email, null);
  if (accountState === "active_exists") {
    return NextResponse.json({ error: "This email is already registered. Please log in to continue." }, { status: 409 });
  }

  let user = await prisma.user.findUnique({ where: { email } });
  if (accountState === "pending_claimable") {
    user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      await setPasswordForUser(user.id, password);
      await issueVerificationOtp(user.id, user.email).catch((error) => {
        console.error("[auth/signup] Failed to issue verification OTP", error);
      });
      await logActivity({
        userId: user.id,
        eventType: "AUDIT_TRAIL",
        action: "Pending account claimed",
        description: `Pending account for ${email} was claimed during signup`,
      });
      return NextResponse.json({
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        message: "We found your pending checkout account. Please verify it and complete setup.",
      }, { status: 200 });
    }
  }

  if (user) {
    return NextResponse.json({ error: "This email is already registered." }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name || null,
      authType: "MANUAL",
      accountStatus: "ACTIVE",
      emailVerified: true,
    },
  });

  const token = createAuthToken({
    id: user.id,
    email: user.email ?? email,
    name: user.name,
    role: user.role,
  });

  await logActivity({
    userId: user.id,
    eventType: "AUDIT_TRAIL",
    action: "User registered",
    description: `New user created with email ${user.email}`,
  });

  const response = NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token,
  });

  response.cookies.set(COOKIE_NAME, token, authCookieOptions);
  return response;
}
