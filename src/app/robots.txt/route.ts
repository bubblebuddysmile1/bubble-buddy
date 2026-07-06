import { NextResponse } from "next/server";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") ?? "http://localhost:3000";
const host = new URL(APP_URL).host;

const ROBOTS_TXT = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
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
