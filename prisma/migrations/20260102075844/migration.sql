-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "referralPercentage" SET DEFAULT 0.0;

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "referralPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
