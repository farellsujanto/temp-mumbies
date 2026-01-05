-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'DECLINED', 'ACCEPTED');

-- AlterTable
ALTER TABLE "ReferralEarningsLog" ADD COLUMN     "partnerTagName" TEXT,
ADD COLUMN     "partnerTagReferralEarnings" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "partnerTagId" INTEGER;

-- CreateTable
CREATE TABLE "PartnerTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "referralEarnings" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PartnerTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerApplication" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "instagramUrl" TEXT,
    "tiktokUrl" TEXT,
    "facebookUrl" TEXT,
    "youtubeUrl" TEXT,
    "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PartnerApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerApplicationAnswer" (
    "id" SERIAL NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnerApplicationAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PartnerTag_name_key" ON "PartnerTag"("name");

-- CreateIndex
CREATE INDEX "PartnerApplication_userId_idx" ON "PartnerApplication"("userId");

-- CreateIndex
CREATE INDEX "PartnerApplication_approvalStatus_idx" ON "PartnerApplication"("approvalStatus");

-- CreateIndex
CREATE INDEX "PartnerApplicationAnswer_applicationId_idx" ON "PartnerApplicationAnswer"("applicationId");

-- CreateIndex
CREATE INDEX "User_partnerTagId_idx" ON "User"("partnerTagId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_partnerTagId_fkey" FOREIGN KEY ("partnerTagId") REFERENCES "PartnerTag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerApplication" ADD CONSTRAINT "PartnerApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerApplicationAnswer" ADD CONSTRAINT "PartnerApplicationAnswer_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "PartnerApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
