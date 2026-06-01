import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, authCookieOptions, createAuthToken } from "@/lib/auth";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

function sanitizeReturnTo(state: string | null, origin: string) {
  if (!state) return "/";

  const decoded = decodeURIComponent(state);
  if (decoded.startsWith("/")) {
    return decoded;
  }

  try {
    const parsed = new URL(decoded, origin);
    if (parsed.origin === origin) {
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
  } catch {
    // invalid state value
  }

  return "/";
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const origin = url.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/auth?error=google_failed`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${origin}/auth?error=google_not_configured`);
  }

  const redirectUri = `${origin}/api/auth/google/callback`;
  const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenResponse.ok) {
    return NextResponse.redirect(`${origin}/auth?error=google_failed`);
  }

  const tokenData = await tokenResponse.json();
  const accessToken = String(tokenData?.access_token ?? "");
  if (!accessToken) {
    return NextResponse.redirect(`${origin}/auth?error=google_failed`);
  }

  const userInfoResponse = await fetch(GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!userInfoResponse.ok) {
    return NextResponse.redirect(`${origin}/auth?error=google_failed`);
  }

  const userInfo = await userInfoResponse.json();
  const email = String(userInfo.email ?? "").trim().toLowerCase();
  const name = String(userInfo.name ?? email.split("@")[0] ?? "").trim();

  if (!email) {
    return NextResponse.redirect(`${origin}/auth?error=google_failed`);
  }

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const randomPassword = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(randomPassword, 12);
    user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        password: hashedPassword,
      },
    });
  } else if (!user.name && name) {
    user = await prisma.user.update({
      where: { email },
      data: { name },
    });
  }

  const token = createAuthToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  const response = NextResponse.redirect(sanitizeReturnTo(state, origin));
  response.cookies.set(COOKIE_NAME, token, authCookieOptions);
  return response;
}
