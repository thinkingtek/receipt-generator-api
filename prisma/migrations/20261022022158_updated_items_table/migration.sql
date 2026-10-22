/*
  Warnings:

  - The values [in-transit,delivered,paid,refunded] on the enum `ReceiptStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReceiptStatus_new" AS ENUM ('In-transit', 'Delivered', 'Paid', 'Refunded');
ALTER TABLE "public"."receipts" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "receipts" ALTER COLUMN "status" TYPE "ReceiptStatus_new" USING ("status"::text::"ReceiptStatus_new");
ALTER TYPE "ReceiptStatus" RENAME TO "ReceiptStatus_old";
ALTER TYPE "ReceiptStatus_new" RENAME TO "ReceiptStatus";
DROP TYPE "public"."ReceiptStatus_old";
ALTER TABLE "receipts" ALTER COLUMN "status" SET DEFAULT 'Paid';
COMMIT;

-- AlterTable
ALTER TABLE "items" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "receipts" ALTER COLUMN "status" SET DEFAULT 'Paid';
