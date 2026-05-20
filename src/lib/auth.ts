import jwt from "jsonwebtoken";

export type AuthTokenPayload = {
  id: number;
  email: string;
  name?: string | null;
  role: string;
};

export const COOKIE_NAME = "bubble_auth_token";

export const authCookieOptions = {
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

const JWT_SECRET = process.env.JWT_SECRET ?? "bubble-buddy-jwt-secret";
const JWT_EXPIRES_IN = "7d";

export function createAuthToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
  } catch (error) {
    return null;
  }
}
