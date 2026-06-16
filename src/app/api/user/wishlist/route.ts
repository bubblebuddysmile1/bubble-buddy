import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ items: [] }, { status: 401 });

  const payload = verifyAuthToken(token);
  if (!payload) return NextResponse.json({ items: [] }, { status: 401 });

  const items = await prisma.favorite.findMany({
    where: { userId: payload.id },
    include: { product: true },
  });

  const result = items.map((it) => ({
    id: it.productId,
    createdAt: it.createdAt,
    name: it.product.name,
    price: Number(it.product.price),
    thumbnail: it.product.thumbnail,
  }));

  return NextResponse.json({ items: result });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyAuthToken(token);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const items: { id: number }[] = Array.isArray(body) ? body : body.items ?? [];

  await prisma.$transaction([
    prisma.favorite.deleteMany({ where: { userId: payload.id } }),
    prisma.favorite.createMany({
      data: items.map((it) => ({ userId: payload.id, productId: it.id })),
      skipDuplicates: true,
    }),
  ]);

  return NextResponse.json({ ok: true });
}
