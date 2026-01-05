/*
  Warnings:

  - You are about to drop the column `referralEarnings` on the `PartnerTag` table. All the data in the column will be lost.
  - You are about to drop the column `referralPercentage` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `referralPercentage` on the `ProductVariant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PartnerTag" DROP COLUMN "referralEarnings",
ADD COLUMN     "referralPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "referralPercentage";

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "referralPercentage";
