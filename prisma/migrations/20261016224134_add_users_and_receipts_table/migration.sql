-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'STAFF');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('NGN', 'USD', 'EURO', 'POUNDS');

-- CreateEnum
CREATE TYPE "ReceiptStatus" AS ENUM ('in-transit', 'delivered', 'paid', 'refunded');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STAFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipts" (
    "id" SERIAL NOT NULL,
    "createdById" INTEGER,
    "createdByName" TEXT NOT NULL,
    "customerName" VARCHAR(80) NOT NULL,
    "customerEmail" VARCHAR(60),
    "customerPhone" VARCHAR(14),
    "paidDate" DATE NOT NULL,
    "receivedDate" DATE,
    "trackingId" VARCHAR(15),
    "status" "ReceiptStatus" NOT NULL DEFAULT 'paid',
    "currency" "Currency" NOT NULL DEFAULT 'NGN',
    "shippingFee" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "subtotal" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "total" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "totalProfit" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "receiptId" INTEGER NOT NULL,
    "itemName" VARCHAR(80) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "costPrice" DECIMAL(10,2) NOT NULL,
    "sellingPrice" DECIMAL(10,2) NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "profit" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "receipts_trackingId_key" ON "receipts"("trackingId");

-- CreateIndex
CREATE INDEX "receipts_createdAt_idx" ON "receipts"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "items_createdAt_idx" ON "items"("createdAt" DESC);

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "receipts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
