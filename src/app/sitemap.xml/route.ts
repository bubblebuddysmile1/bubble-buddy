import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") ?? "http://localhost:3000";

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

function buildUrl(path: string, lastmod?: Date) {
  return `  <url>\n    <loc>${APP_URL}${path}</loc>\n${lastmod ? `    <lastmod>${formatDate(lastmod)}</lastmod>\n` : ""}  </url>\n`;
}

export async function GET() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const staticPaths = [
    { path: "/", lastmod: undefined },
    { path: "/shop", lastmod: undefined },
    { path: "/categories", lastmod: undefined },
    { path: "/offers", lastmod: undefined },
    { path: "/cart", lastmod: undefined },
    { path: "/checkout", lastmod: undefined },
    { path: "/profile", lastmod: undefined },
    { path: "/wishlist", lastmod: undefined },
    { path: "/compare", lastmod: undefined },
    { path: "/about", lastmod: undefined },
    { path: "/contact-us", lastmod: undefined },
    { path: "/frequently-asked-questions", lastmod: undefined },
    { path: "/auth", lastmod: undefined },
    { path: "/terms-and-conditions", lastmod: undefined },
    { path: "/privacy-policy", lastmod: undefined },
    { path: "/shipping-policy", lastmod: undefined },
    { path: "/refund-policy", lastmod: undefined },
  ];

  const urls = [
    ...staticPaths.map((item) => buildUrl(item.path, item.lastmod)),
    ...categories.map((category) => buildUrl(`/categories/${category.slug}`, category.updatedAt)),
    ...products.map((product) => buildUrl(`/shop/${product.slug}`, product.updatedAt)),
  ].join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
