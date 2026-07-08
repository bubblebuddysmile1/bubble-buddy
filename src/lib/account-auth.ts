import crypto from "crypto";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, authCookieOptions, createAuthToken } from "@/lib/auth";
import { logActivity } from "@/lib/activity-log";
import { sendEmail } from "@/lib/email";
import type { AuthType, AccountStatus } from "@prisma/client";

export type ExistingAccountState = "no_account" | "pending_claimable" | "active_exists";

export async function checkExistingAccount(email?: string | null, phone?: string | null): Promise<ExistingAccountState> {
  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedPhone = phone?.trim();

  if (!normalizedEmail && !normalizedPhone) {
    return "no_account";
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
        ...(normalizedPhone ? [{ phone: normalizedPhone }] : []),
      ],
    },
    select: {
      id: true,
      email: true,
      phone: true,
      accountStatus: true,
      authType: true,
      emailVerified: true,
      phoneVerified: true,
    },
  });

  if (!user) {
    return "no_account";
  }

  if (user.accountStatus === "PENDING") {
    return "pending_claimable";
  }

  return "active_exists";
}

export async function ensureCheckoutAutoAuthUser(input: {
  email?: string | null;
  phone?: string | null;
  name?: string | null;
  address?: { fullName?: string; phone?: string; line1?: string; city?: string; state?: string; postalCode?: string; country?: string } | null;
}) {
  const normalizedEmail = input.email?.trim().toLowerCase();
  const normalizedPhone = input.phone?.trim();

  const existingAccount = await checkExistingAccount(normalizedEmail, normalizedPhone);
  if (existingAccount === "active_exists") {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
          ...(normalizedPhone ? [{ phone: normalizedPhone }] : []),
        ],
      },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
        accountStatus: true,
        authType: true,
      },
    });

    if (!existingUser) {
      return {
        kind: "created" as const,
        message: null,
        user: null,
        token: null,
      };
    }

    const token = createAuthToken({
      id: existingUser.id,
      email: existingUser.email ?? normalizedEmail ?? "",
      name: existingUser.name,
      role: existingUser.role,
    });

    await logActivity({
      userId: existingUser.id,
      eventType: "AUDIT_TRAIL",
      action: "Checkout auto-auth session",
      description: `Checkout session continued for existing account ${existingUser.email ?? normalizedEmail ?? existingUser.phone ?? "checkout user"}`,
      metadata: JSON.stringify({ authType: "CHECKOUT_AUTO", email: normalizedEmail, phone: normalizedPhone }),
    });

    return {
      kind: "existing_active" as const,
      message: null,
      user: existingUser,
      token,
    };
  }

  const existingPendingUser = await prisma.user.findFirst({
    where: {
      OR: [
        ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
        ...(normalizedPhone ? [{ phone: normalizedPhone }] : []),
      ],
    },
    select: {
      id: true,
      email: true,
      phone: true,
      name: true,
      accountStatus: true,
      authType: true,
    },
  });

  const user = existingPendingUser
    ? await prisma.user.update({
        where: { id: existingPendingUser.id },
        data: {
          authType: "CHECKOUT_AUTO",
          accountStatus: "PENDING",
          emailVerified: false,
          phoneVerified: false,
          name: input.name?.trim() || existingPendingUser.name || null,
          phone: normalizedPhone || existingPendingUser.phone || null,
          email: normalizedEmail || existingPendingUser.email || null,
          password: null,
        },
      })
    : await prisma.user.create({
        data: {
          email: normalizedEmail ?? null,
          phone: normalizedPhone ?? null,
          name: input.name?.trim() || null,
          authType: "CHECKOUT_AUTO",
          accountStatus: "PENDING",
          emailVerified: false,
          phoneVerified: false,
          password: null,
        },
      });

  const token = createAuthToken({
    id: user.id,
    email: user.email ?? normalizedEmail ?? "",
    name: user.name,
    role: user.role,
  });

  await logActivity({
    userId: user.id,
    eventType: "AUDIT_TRAIL",
    action: "Checkout auto-auth session",
    description: `Auto-auth session created for ${user.email ?? normalizedEmail ?? user.phone ?? "checkout user"}`,
    metadata: JSON.stringify({ authType: "CHECKOUT_AUTO", email: normalizedEmail, phone: normalizedPhone }),
  });

  return {
    kind: "created" as const,
    message: null,
    user,
    token,
  };
}

export async function issueVerificationOtp(userId: number, email?: string | null) {
  const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { id: userId },
    data: {
      verificationToken: otp,
      verificationExpiresAt: expiresAt,
    },
  });

  if (email?.trim()) {
    await sendEmail({
      to: email,
      subject: "Verify your Bubble Buddy account",
      text: `Use the following code to verify your account: ${otp}. This code expires in 10 minutes.`,
    });
  }

  return { otp, expiresAt };
}

export async function verifyAccountWithOtp(userId: number, otp: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      verificationToken: true,
      verificationExpiresAt: true,
      accountStatus: true,
      emailVerified: true,
      phoneVerified: true,
    },
  });

  if (!user || !user.verificationToken || !user.verificationExpiresAt) {
    return { ok: false, message: "No verification request was found." };
  }

  if (new Date(user.verificationExpiresAt) < new Date()) {
    return { ok: false, message: "This verification code has expired. Please request a new one." };
  }

  if (user.verificationToken !== otp) {
    return { ok: false, message: "The verification code is invalid." };
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      accountStatus: "ACTIVE",
      emailVerified: true,
      phoneVerified: true,
      verificationToken: null,
      verificationExpiresAt: null,
    },
  });

  return { ok: true, message: "Account verified successfully." };
}

export async function setPasswordForUser(userId: number, password: string) {
  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
      verificationToken: null,
      verificationExpiresAt: null,
    },
  });
}

export function buildAuthResponse(user: { id: number; email: string | null; name: string | null; role: string }) {
  const response = NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
  const token = createAuthToken({
    id: user.id,
    email: user.email ?? "",
    name: user.name,
    role: user.role as any,
  });
  response.cookies.set(COOKIE_NAME, token, authCookieOptions);
  return response;
}
