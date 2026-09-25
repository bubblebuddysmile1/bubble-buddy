export const DEFAULT_PRODUCTION_APP_URL = "https://bubblebuddysmile.com";
export const DEFAULT_LOCAL_APP_URL = "http://localhost:3000";

export function getAppUrl(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configured) {
    return configured.replace(/\/+$/, "");
  }

  return process.env.NODE_ENV === "production"
    ? DEFAULT_PRODUCTION_APP_URL
    : DEFAULT_LOCAL_APP_URL;
}

export function getAppHost(): string {
  return new URL(getAppUrl()).host;
}

export function isIndexablePath(pathname: string): boolean {
  return !/^(?:\/admin|\/api|\/checkout|\/cart|\/profile|\/payment|\/orders|\/auth|\/wishlist|\/compare)(?:\/|$)/.test(pathname);
}
