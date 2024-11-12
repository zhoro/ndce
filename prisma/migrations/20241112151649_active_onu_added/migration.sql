-- CreateTable
CREATE TABLE "StatActiveOnu" (
    "id" SERIAL NOT NULL,
    "xponBoard" INTEGER NOT NULL,
    "xponPort" INTEGER NOT NULL,
    "xponInterface" INTEGER NOT NULL,
    "macAddressOnu" TEXT NOT NULL,
    "serialNumberOnu" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL,
    "lastRegister" TIMESTAMP(3) NOT NULL,
    "lastDeregister" TIMESTAMP(3) NOT NULL,
    "dereason" TEXT NOT NULL,
    "alivetime" INTEGER NOT NULL,
    "networkDeviceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "newest" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "StatActiveOnu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StatActiveOnu_macAddressOnu_idx" ON "StatActiveOnu"("macAddressOnu");

-- CreateIndex
CREATE INDEX "StatActiveOnu_serialNumberOnu_idx" ON "StatActiveOnu"("serialNumberOnu");

-- CreateIndex
CREATE INDEX "StatActiveOnu_createdAt_idx" ON "StatActiveOnu"("createdAt");

-- CreateIndex
CREATE INDEX "StatActiveOnu_xponBoard_idx" ON "StatActiveOnu"("xponBoard");

-- CreateIndex
CREATE INDEX "StatActiveOnu_xponInterface_idx" ON "StatActiveOnu"("xponInterface");

-- CreateIndex
CREATE INDEX "StatActiveOnu_xponPort_idx" ON "StatActiveOnu"("xponPort");

-- AddForeignKey
ALTER TABLE "StatActiveOnu" ADD CONSTRAINT "StatActiveOnu_networkDeviceId_fkey" FOREIGN KEY ("networkDeviceId") REFERENCES "NetworkDevice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
