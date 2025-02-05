-- CreateTable
CREATE TABLE "NetworkDeviceVersion" (
    "id" SERIAL NOT NULL,
    "networkDeviceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "model" TEXT NOT NULL,
    "softwareVersion" TEXT NOT NULL,
    "hardwareVersion" TEXT NOT NULL,
    "macAddress" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,

    CONSTRAINT "NetworkDeviceVersion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NetworkDeviceVersion" ADD CONSTRAINT "NetworkDeviceVersion_networkDeviceId_fkey" FOREIGN KEY ("networkDeviceId") REFERENCES "NetworkDevice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
