import * as PrismaPkg from "@prisma/client";

// Some Prisma client builds may export differently depending on environment.
// Safely resolve the PrismaClient constructor at runtime and fall back to any.
const PrismaClientCtor = (PrismaPkg as any).PrismaClient ?? (PrismaPkg as any).default ?? (PrismaPkg as any);

type PrismaClientAny = any;

const globalForPrisma = global as unknown as { prisma?: PrismaClientAny };

export const prisma =
  globalForPrisma.prisma ??
  new (PrismaClientCtor as any)({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
