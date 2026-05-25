import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifyAuthToken, type AuthTokenPayload } from "@/lib/auth";

export function getAuthPayload(req: NextRequest): AuthTokenPayload | null {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAuthToken(token);
}

export async function requireAdmin(
  req: NextRequest,
): Promise<AuthTokenPayload | NextResponse> {
  const payload = getAuthPayload(req);
  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  return payload;
}
