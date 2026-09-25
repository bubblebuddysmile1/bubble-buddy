import { NextResponse } from "next/server";

import { getAppHost, getAppUrl } from "@/lib/site";

const APP_URL = getAppUrl();
const host = getAppHost();

const ROBOTS_TXT = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /checkout/
Disallow: /cart/
Disallow: /profile/
Disallow: /payment/
Disallow: /orders/
Disallow: /auth/
Disallow: /wishlist/
Disallow: /compare/
Sitemap: ${APP_URL}/sitemap.xml
Host: ${host}
`;

export function GET() {
  return new NextResponse(ROBOTS_TXT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
