import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, authCookieOptions, verifyAuthToken } from "@/lib/auth";
import { logActivity } from "@/lib/activity-log";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const payload = token ? verifyAuthToken(token) : null;

  if (payload) {
    await logActivity({
      userId: payload.id,
      eventType: "LOGOUT",
      action: "User logged out",
      description: `User logged out: ${payload.email}`,
    });
  }

  const response = NextResponse.json({ message: "Logged out" });

  response.cookies.set(COOKIE_NAME, "", {
    ...authCookieOptions,
    maxAge: 0,
  });

  return response;
}
