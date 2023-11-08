-- CreateTable
CREATE TABLE "StatOnuDevice" (
    "id" SERIAL NOT NULL,
    "eponBoard" TEXT NOT NULL,
    "eponPort" TEXT NOT NULL,
    "eponInterface" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "macAddressOnu" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "bindType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "deregReason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "networkDeviceId" INTEGER NOT NULL,

    CONSTRAINT "StatOnuDevice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StatOnuDevice_macAddressOnu_idx" ON "StatOnuDevice"("macAddressOnu");

-- CreateIndex
CREATE INDEX "StatOnuDevice_status_idx" ON "StatOnuDevice"("status");

-- AddForeignKey
ALTER TABLE "StatOnuDevice" ADD CONSTRAINT "StatOnuDevice_networkDeviceId_fkey" FOREIGN KEY ("networkDeviceId") REFERENCES "NetworkDevice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
