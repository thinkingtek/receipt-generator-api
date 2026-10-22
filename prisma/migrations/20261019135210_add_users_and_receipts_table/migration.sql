/*
  Warnings:

  - You are about to drop the column `costPrice` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `sellingPrice` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `receipts` table. All the data in the column will be lost.
  - You are about to drop the column `customerEmail` on the `receipts` table. All the data in the column will be lost.
  - You are about to drop the column `customerName` on the `receipts` table. All the data in the column will be lost.
  - You are about to drop the column `customerPhone` on the `receipts` table. All the data in the column will be lost.
  - You are about to drop the column `paidDate` on the `receipts` table. All the data in the column will be lost.
  - You are about to drop the column `receivedDate` on the `receipts` table. All the data in the column will be lost.
  - You are about to drop the column `shippingFee` on the `receipts` table. All the data in the column will be lost.
  - You are about to drop the column `totalProfit` on the `receipts` table. All the data in the column will be lost.
  - You are about to drop the column `trackingId` on the `receipts` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `receipts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tracking_id]` on the table `receipts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cost_price` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selling_price` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_amount` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_name` to the `receipts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paid_date` to the `receipts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `receipts` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "receipts_createdAt_idx";

-- DropIndex
DROP INDEX "receipts_trackingId_key";

-- AlterTable
ALTER TABLE "items" DROP COLUMN "costPrice",
DROP COLUMN "quantity",
DROP COLUMN "sellingPrice",
DROP COLUMN "totalAmount",
ADD COLUMN     "cost_price" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "selling_price" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "total_amount" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "receipts" DROP COLUMN "createdAt",
DROP COLUMN "customerEmail",
DROP COLUMN "customerName",
DROP COLUMN "customerPhone",
DROP COLUMN "paidDate",
DROP COLUMN "receivedDate",
DROP COLUMN "shippingFee",
DROP COLUMN "totalProfit",
DROP COLUMN "trackingId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "customer_email" VARCHAR(60),
ADD COLUMN     "customer_name" VARCHAR(80) NOT NULL,
ADD COLUMN     "customer_phone" VARCHAR(14),
ADD COLUMN     "paid_date" DATE NOT NULL,
ADD COLUMN     "received_date" DATE,
ADD COLUMN     "shipping_fee" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "total_profit" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "tracking_id" VARCHAR(15),
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "receipts_tracking_id_key" ON "receipts"("tracking_id");

-- CreateIndex
CREATE INDEX "receipts_created_at_idx" ON "receipts"("created_at" DESC);
