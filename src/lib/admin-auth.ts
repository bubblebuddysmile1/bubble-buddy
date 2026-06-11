import { NextRequest, NextResponse } from "next/server";
import {
  COOKIE_NAME,
  verifyAuthToken,
  type AuthTokenPayload,
  type UserRole,
  ADMIN_ROLE,
} from "@/lib/auth";

export function getAuthPayload(req: NextRequest): AuthTokenPayload | null {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAuthToken(token);
}

export function hasRole(req: NextRequest, allowedRoles: UserRole | UserRole[]): boolean {
  const payload = getAuthPayload(req);
  if (!payload) return false;
  if (Array.isArray(allowedRoles)) {
    return allowedRoles.includes(payload.role);
  }
  return payload.role === allowedRoles;
}

export async function requireRole(
  req: NextRequest,
  allowedRoles: UserRole | UserRole[],
): Promise<AuthTokenPayload | NextResponse> {
  const payload = getAuthPayload(req);
  if (!payload || (Array.isArray(allowedRoles) ? !allowedRoles.includes(payload.role) : payload.role !== allowedRoles)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  return payload;
}

export async function requireAdmin(
  req: NextRequest,
): Promise<AuthTokenPayload | NextResponse> {
  return requireRole(req, ADMIN_ROLE);
}
