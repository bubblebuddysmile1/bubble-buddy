import * as PrismaPkg from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Some Prisma client builds may export differently depending on environment.
// Safely resolve the PrismaClient constructor at runtime and fall back to any.
const PrismaClientCtor = (PrismaPkg as any).PrismaClient ?? (PrismaPkg as any).default ?? (PrismaPkg as any);

type PrismaClientAny = PrismaPkg.PrismaClient;

const globalForPrisma = global as unknown as { prisma?: PrismaClientAny };

const mariadbAdapter = new PrismaMariaDb(process.env.DATABASE_URL ?? "");

export const prisma: PrismaPkg.PrismaClient =
  globalForPrisma.prisma ??
  new (PrismaClientCtor as any)({
    adapter: mariadbAdapter,
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
