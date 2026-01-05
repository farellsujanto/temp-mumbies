-- CreateTable
CREATE TABLE "PartnerApplicationQuestion" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "placeholder" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PartnerApplicationQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PartnerApplicationQuestion_order_idx" ON "PartnerApplicationQuestion"("order");
CREATE INDEX "PartnerApplicationQuestion_enabled_idx" ON "PartnerApplicationQuestion"("enabled");
