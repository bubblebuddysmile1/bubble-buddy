-- Create enums for dual authentication support
CREATE TYPE "AuthType" AS ENUM ('MANUAL', 'CHECKOUT_AUTO');
CREATE TYPE "AccountStatus" AS ENUM ('PENDING', 'VERIFIED', 'ACTIVE');

-- Add new columns to User
ALTER TABLE "User"
  ADD COLUMN "authType" "AuthType" NOT NULL DEFAULT 'MANUAL',
  ADD COLUMN "accountStatus" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
  ADD COLUMN "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "verificationToken" TEXT,
  ADD COLUMN "verificationExpiresAt" TIMESTAMP(3);

-- Support nullable password and optional email for checkout-created users
ALTER TABLE "User"
  ALTER COLUMN "email" DROP NOT NULL,
  ALTER COLUMN "password" DROP NOT NULL;

-- Ensure phone is unique across users for account identity
CREATE UNIQUE INDEX IF NOT EXISTS "User_phone_key" ON "User"("phone") WHERE "phone" IS NOT NULL;
