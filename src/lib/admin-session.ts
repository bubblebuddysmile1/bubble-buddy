import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, verifyAuthToken, type AuthTokenPayload } from "@/lib/auth";

export async function requireAdminSession(returnTo = "/admin"): Promise<AuthTokenPayload> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    redirect(`/auth?returnTo=${encodeURIComponent(returnTo)}`);
  }

  const payload = verifyAuthToken(token);
  if (!payload || payload.role !== "ADMIN") {
    redirect(`/auth?returnTo=${encodeURIComponent(returnTo)}&error=admin_required`);
  }

  return payload;
}
