/*
  Warnings:

  - You are about to drop the column `option1` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `option2` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `option3` on the `ProductVariant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "option1",
DROP COLUMN "option2",
DROP COLUMN "option3",
ADD COLUMN     "parentVariantId" INTEGER,
ALTER COLUMN "price" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "ProductVariant_parentVariantId_idx" ON "ProductVariant"("parentVariantId");

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_parentVariantId_fkey" FOREIGN KEY ("parentVariantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
