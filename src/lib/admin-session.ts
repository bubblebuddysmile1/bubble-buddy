import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  COOKIE_NAME,
  verifyAuthToken,
  type AuthTokenPayload,
  type UserRole,
  ADMIN_ROLE,
} from "@/lib/auth";

export async function requireRoleSession(
  allowedRoles: UserRole | UserRole[],
  returnTo = "/admin",
): Promise<AuthTokenPayload> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    redirect(`/auth?returnTo=${encodeURIComponent(returnTo)}`);
  }

  const payload = verifyAuthToken(token);
  if (!payload || (Array.isArray(allowedRoles) ? !allowedRoles.includes(payload.role) : payload.role !== allowedRoles)) {
    redirect(`/auth?returnTo=${encodeURIComponent(returnTo)}&error=admin_required`);
  }

  return payload;
}

export async function requireAdminSession(returnTo = "/admin"): Promise<AuthTokenPayload> {
  return requireRoleSession(ADMIN_ROLE, returnTo);
}
