import jwt from "jsonwebtoken";

export type UserRole = "CUSTOMER" | "ADMIN";

export type AuthTokenPayload = {
  id: number;
  email: string;
  name?: string | null;
  role: UserRole;
};

export const ADMIN_ROLE: UserRole = "ADMIN";
export const CUSTOMER_ROLE: UserRole = "CUSTOMER";

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

export function isAdminPayload(payload: AuthTokenPayload | null): payload is AuthTokenPayload {
  return payload?.role === ADMIN_ROLE;
}

export function hasRole(payload: AuthTokenPayload | null, role: UserRole | UserRole[]): boolean {
  if (!payload) return false;
  if (Array.isArray(role)) {
    return role.includes(payload.role);
  }

  return payload.role === role;
}
