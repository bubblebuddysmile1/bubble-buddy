import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, authCookieOptions, createAuthToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const token = createAuthToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  const response = NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name },
    token,
  });

  response.cookies.set(COOKIE_NAME, token, authCookieOptions);
  return response;
}
