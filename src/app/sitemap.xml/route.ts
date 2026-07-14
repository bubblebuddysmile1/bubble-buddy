import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") ?? "http://localhost:3000";

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

function buildUrl(path: string, lastmod?: Date, changefreq = "weekly", priority = "0.7") {
  const lastmodTag = lastmod ? `    <lastmod>${formatDate(lastmod)}</lastmod>\n` : "";

  return `  <url>\n    <loc>${APP_URL}${path}</loc>\n${lastmodTag}    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
}

export async function GET() {
  const now = new Date();

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const staticPaths = [
    { path: "/", lastmod: now, changefreq: "daily", priority: "1.0" },
    { path: "/shop", lastmod: now, changefreq: "daily", priority: "0.9" },
    { path: "/categories", lastmod: now, changefreq: "weekly", priority: "0.8" },
    { path: "/offers", lastmod: now, changefreq: "weekly", priority: "0.8" },
    { path: "/cart", lastmod: now, changefreq: "monthly", priority: "0.3" },
    { path: "/checkout", lastmod: now, changefreq: "monthly", priority: "0.3" },
    { path: "/profile", lastmod: now, changefreq: "monthly", priority: "0.4" },
    { path: "/wishlist", lastmod: now, changefreq: "weekly", priority: "0.5" },
    { path: "/compare", lastmod: now, changefreq: "weekly", priority: "0.4" },
    { path: "/about", lastmod: now, changefreq: "monthly", priority: "0.6" },
    { path: "/contact-us", lastmod: now, changefreq: "monthly", priority: "0.6" },
    { path: "/frequently-asked-questions", lastmod: now, changefreq: "monthly", priority: "0.5" },
    { path: "/auth", lastmod: now, changefreq: "monthly", priority: "0.4" },
    { path: "/terms-and-conditions", lastmod: now, changefreq: "yearly", priority: "0.4" },
    { path: "/privacy-policy", lastmod: now, changefreq: "yearly", priority: "0.4" },
    { path: "/shipping-policy", lastmod: now, changefreq: "yearly", priority: "0.4" },
    { path: "/refund-policy", lastmod: now, changefreq: "yearly", priority: "0.4" },
  ];

  const urls = [
    ...staticPaths.map((item) => buildUrl(item.path, item.lastmod, item.changefreq, item.priority)),
    ...categories.map((category) => buildUrl(`/categories/${category.slug}`, category.updatedAt, "weekly", "0.7")),
    ...products.map((product) => buildUrl(`/shop/${product.slug}`, product.updatedAt, "weekly", "0.6")),
  ].join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
