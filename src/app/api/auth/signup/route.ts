import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, authCookieOptions, createAuthToken } from "@/lib/auth";
import { logActivity } from "@/lib/activity-log";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "This email is already registered." }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name || null,
    },
  });

  const token = createAuthToken({
    id: user.id,
    email: user.email,
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
