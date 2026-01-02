-- AlterTable
ALTER TABLE "User" ADD COLUMN     "totalReferralEarnings" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "totalReferredUsers" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "withdrawableBalance" DECIMAL(10,2) NOT NULL DEFAULT 0.00;

-- CreateTable
CREATE TABLE "ReferralLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "codeUsed" TEXT NOT NULL,
    "refererId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralEarningsLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "refererId" INTEGER NOT NULL,
    "shopifyOrderId" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralEarningsLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReferralLog_userId_idx" ON "ReferralLog"("userId");

-- CreateIndex
CREATE INDEX "ReferralLog_refererId_idx" ON "ReferralLog"("refererId");

-- CreateIndex
CREATE INDEX "ReferralEarningsLog_userId_idx" ON "ReferralEarningsLog"("userId");

-- CreateIndex
CREATE INDEX "ReferralEarningsLog_refererId_idx" ON "ReferralEarningsLog"("refererId");

-- CreateIndex
CREATE INDEX "ReferralEarningsLog_shopifyOrderId_idx" ON "ReferralEarningsLog"("shopifyOrderId");

-- AddForeignKey
ALTER TABLE "ReferralLog" ADD CONSTRAINT "ReferralLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralLog" ADD CONSTRAINT "ReferralLog_refererId_fkey" FOREIGN KEY ("refererId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralEarningsLog" ADD CONSTRAINT "ReferralEarningsLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralEarningsLog" ADD CONSTRAINT "ReferralEarningsLog_refererId_fkey" FOREIGN KEY ("refererId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
