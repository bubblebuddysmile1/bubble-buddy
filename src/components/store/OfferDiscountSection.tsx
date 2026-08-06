import { prisma } from "@/lib/prisma";
import OfferDiscountSectionClient from "./OfferDiscountSectionClient";

export const revalidate = 60;

export type ActivePromotion = {
  id: number;
  code: string;
  title: string;
  description: string | null;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderAmount: number;
  activeFrom: string | null;
  activeUntil: string | null;
  isActive: boolean;
};

function normalizePromotion(promotion: {
  id: number;
  code: string;
  title: string;
  description: string | null;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: { toString(): string };
  minOrderAmount: { toString(): string };
  activeFrom: Date | null;
  activeUntil: Date | null;
  isActive: boolean;
}) {
  return {
    id: promotion.id,
    code: promotion.code,
    title: promotion.title,
    description: promotion.description,
    discountType: promotion.discountType,
    discountValue: Number(promotion.discountValue?.toString() ?? 0),
    minOrderAmount: Number(promotion.minOrderAmount?.toString() ?? 0),
    activeFrom: promotion.activeFrom?.toISOString() ?? null,
    activeUntil: promotion.activeUntil?.toISOString() ?? null,
    isActive: promotion.isActive,
  };
}

export default async function OfferDiscountSection() {
  const now = new Date();
  const promotions = await prisma.promotion.findMany({
    where: {
      isActive: true,
      AND: [
        { OR: [{ activeFrom: null }, { activeFrom: { lte: now } }] },
        { OR: [{ activeUntil: null }, { activeUntil: { gte: now } }] },
      ],
    },
    select: {
      id: true,
      code: true,
      title: true,
      description: true,
      discountType: true,
      discountValue: true,
      minOrderAmount: true,
      activeFrom: true,
      activeUntil: true,
      isActive: true,
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return <OfferDiscountSectionClient promotions={promotions.map(normalizePromotion)} />;
}
