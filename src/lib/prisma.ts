import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

type PrismaClientAny = PrismaClient;
const globalForPrisma = global as unknown as { prisma?: PrismaClientAny };
const adapter = new PrismaPg(process.env.DATABASE_URL ?? "");

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: [],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
