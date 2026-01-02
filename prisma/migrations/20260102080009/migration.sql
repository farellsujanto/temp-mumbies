/*
  Warnings:

  - A unique constraint covering the columns `[shopifyProductId]` on the table `ProductVariant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "shopifyProductId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_shopifyProductId_key" ON "ProductVariant"("shopifyProductId");
