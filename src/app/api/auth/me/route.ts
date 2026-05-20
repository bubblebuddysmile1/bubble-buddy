import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const payload = verifyAuthToken(token);
  if (!payload) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}
