-- CreateEnum for DealType
CREATE TYPE "DealType" AS ENUM ('LIMITED_STOCK', 'COUPON_CODE', 'FLASH_SALE', 'BUNDLE_DEAL');

-- CreateEnum for UrgencyLevel
CREATE TYPE "UrgencyLevel" AS ENUM ('NORMAL', 'URGENT', 'CRITICAL');

-- CreateTable Deal
CREATE TABLE "Deal" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dealType" "DealType" NOT NULL,
    "urgencyLevel" "UrgencyLevel" NOT NULL DEFAULT 'NORMAL',
    "discountPercent" INTEGER,
    "discountFixed" DECIMAL(10,2),
    "limitedQuantity" INTEGER,
    "claimedQuantity" INTEGER NOT NULL DEFAULT 0,
    "couponCode" TEXT,
    "maxCoupons" INTEGER,
    "usedCoupons" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateTable DealClaim
CREATE TABLE "DealClaim" (
    "id" SERIAL NOT NULL,
    "dealId" INTEGER NOT NULL,
    "userId" INTEGER,
    "email" TEXT,
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DealClaim_pkey" PRIMARY KEY ("id")
);

-- AddColumn dealId to Product
ALTER TABLE "Product" ADD COLUMN "dealId" INTEGER;

-- CreateIndex
CREATE INDEX "DealClaim_dealId_idx" ON "DealClaim"("dealId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealClaim" ADD CONSTRAINT "DealClaim_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
