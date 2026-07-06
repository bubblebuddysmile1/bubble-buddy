import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, authCookieOptions, createAuthToken, isAccountLocked, getAccountLockoutDuration } from "@/lib/auth";
import { logActivity } from "@/lib/activity-log";
import { sendLoginNotificationEmail } from "@/lib/email";

const MAX_FAILED_ATTEMPTS = 5;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      name: true,
      phone: true,
      role: true,
      authType: true,
      accountStatus: true,
      failedLoginAttempts: true,
      lockedUntil: true,
    },
  });

  // Check if account is locked
  if (user && user.lockedUntil && isAccountLocked(user.lockedUntil)) {
    const lockoutExpiry = user.lockedUntil as Date;
    const remainingMinutes = Math.ceil((lockoutExpiry.getTime() - Date.now()) / 60000);

    await logActivity({
      eventType: "SECURITY_ALERT",
      action: "Login attempt on locked account",
      description: `Account locked for ${email}. Locked until ${lockoutExpiry.toISOString()}`,
      metadata: JSON.stringify({ email }),
    });

    return NextResponse.json(
      {
        error: `Account is temporarily locked. Please try again in ${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}. Too many failed login attempts.`,
      },
      { status: 429 },
    );
  }

  if (!user) {
    await logActivity({
      eventType: "FAILED_LOGIN",
      action: "Failed sign-in attempt",
      description: `Invalid credentials for ${email}`,
      metadata: JSON.stringify({ email }),
    });

    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  if (user.accountStatus !== "ACTIVE") {
    return NextResponse.json({ error: "Please verify your account before signing in with a password." }, { status: 403 });
  }

  if (!user.password) {
    return NextResponse.json({ error: "Please verify your account and set a password before signing in with a password." }, { status: 403 });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    // Increment failed attempts and lock if threshold reached
    const newFailedAttempts = user.failedLoginAttempts + 1;
    const shouldLock = newFailedAttempts >= MAX_FAILED_ATTEMPTS;
    const lockedUntil = shouldLock ? new Date(Date.now() + getAccountLockoutDuration()) : null;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: newFailedAttempts,
        lockedUntil,
      },
    });

    await logActivity({
      userId: user.id,
      eventType: "FAILED_LOGIN",
      action: "Failed sign-in attempt",
      description: `Incorrect password for ${email}. Attempt ${newFailedAttempts}/${MAX_FAILED_ATTEMPTS}`,
      metadata: JSON.stringify({ email, attemptCount: newFailedAttempts }),
    });

    if (shouldLock) {
      await logActivity({
        userId: user.id,
        eventType: "SECURITY_ALERT",
        action: "Account locked",
        description: `Account ${email} locked due to ${MAX_FAILED_ATTEMPTS} failed login attempts`,
        metadata: JSON.stringify({ email, lockedUntil: lockedUntil?.toISOString() }),
      });

      await sendLoginNotificationEmail(user, "failed").catch((error) => {
        console.error("[auth/signin] Failed login email notification failed:", error);
      });

      return NextResponse.json(
        {
          error: "Too many failed login attempts. Your account is locked for 1.5 hours. Please try again later.",
        },
        { status: 429 },
      );
    }

    await sendLoginNotificationEmail(user, "failed").catch((error) => {
      console.error("[auth/signin] Failed login email notification failed:", error);
    });

    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  // Successful login - reset failed attempts
  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
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
    eventType: "LOGIN",
    action: "User signed in",
    description: `User signed in with ${email}`,
    metadata: JSON.stringify({ email }),
  });

  await sendLoginNotificationEmail(user, "success").catch((error) => {
    console.error("[auth/signin] Success login email notification failed:", error);
  });

  const response = NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token,
  });

  response.cookies.set(COOKIE_NAME, token, authCookieOptions);
  return response;
}
