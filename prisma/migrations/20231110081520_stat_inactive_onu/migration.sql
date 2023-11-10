-- CreateTable
CREATE TABLE "StatInactiveOnu" (
    "id" SERIAL NOT NULL,
    "eponBoard" INTEGER NOT NULL,
    "eponPort" INTEGER NOT NULL,
    "eponInterface" INTEGER NOT NULL,
    "macAddressOnu" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "deregReason" TEXT NOT NULL,
    "lastRegister" TIMESTAMP(3) NOT NULL,
    "lastDeregister" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "networkDeviceId" INTEGER NOT NULL,

    CONSTRAINT "StatInactiveOnu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StatInactiveOnu_macAddressOnu_idx" ON "StatInactiveOnu"("macAddressOnu");

-- CreateIndex
CREATE INDEX "StatInactiveOnu_status_idx" ON "StatInactiveOnu"("status");

-- AddForeignKey
ALTER TABLE "StatInactiveOnu" ADD CONSTRAINT "StatInactiveOnu_networkDeviceId_fkey" FOREIGN KEY ("networkDeviceId") REFERENCES "NetworkDevice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
