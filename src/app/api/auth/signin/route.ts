import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, authCookieOptions, createAuthToken } from "@/lib/auth";
import { logActivity } from "@/lib/activity-log";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    await logActivity({
      eventType: "FAILED_LOGIN",
      action: "Failed sign-in attempt",
      description: `Invalid credentials for ${email}`,
      metadata: JSON.stringify({ email }),
    });

    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    await logActivity({
      userId: user.id,
      eventType: "FAILED_LOGIN",
      action: "Failed sign-in attempt",
      description: `Incorrect password for ${email}`,
      metadata: JSON.stringify({ email }),
    });

    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const token = createAuthToken({
    id: user.id,
    email: user.email,
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

  const response = NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token,
  });

  response.cookies.set(COOKIE_NAME, token, authCookieOptions);
  return response;
}
