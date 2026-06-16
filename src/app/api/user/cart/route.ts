import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ items: [] }, { status: 401 });

  const payload = verifyAuthToken(token);
  if (!payload) return NextResponse.json({ items: [] }, { status: 401 });

  const items = await prisma.cartItem.findMany({
    where: { userId: payload.id },
    include: { product: true },
  });

  const result = items.map((it) => ({
    id: it.productId,
    quantity: it.quantity,
    price: Number(it.product.price),
    stockQuantity: it.product.stockQuantity,
    name: it.product.name,
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
  const items: { id: number; quantity: number }[] = Array.isArray(body) ? body : body.items ?? [];

  // replace user's cart items atomically
  await prisma.$transaction([
    prisma.cartItem.deleteMany({ where: { userId: payload.id } }),
    prisma.cartItem.createMany({
      data: items.map((it) => ({ userId: payload.id, productId: it.id, quantity: it.quantity })),
      skipDuplicates: true,
    }),
  ]);

  return NextResponse.json({ ok: true });
}
