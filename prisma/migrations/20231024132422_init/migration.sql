-- CreateTable
CREATE TABLE "DeviceType" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'olt',

    CONSTRAINT "DeviceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceVendor" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DeviceVendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceModel" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "deviceTypeId" INTEGER NOT NULL,

    CONSTRAINT "DeviceModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NetworkDevice" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accessIpAddressV4" TEXT NOT NULL,
    "accessType" TEXT NOT NULL DEFAULT 'telnet',
    "accessPort" TEXT NOT NULL DEFAULT '23',
    "deviceModelId" INTEGER NOT NULL,

    CONSTRAINT "NetworkDevice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeviceType_type_key" ON "DeviceType"("type");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceVendor_name_key" ON "DeviceVendor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceModel_name_key" ON "DeviceModel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "NetworkDevice_accessIpAddressV4_key" ON "NetworkDevice"("accessIpAddressV4");

-- AddForeignKey
ALTER TABLE "DeviceModel" ADD CONSTRAINT "DeviceModel_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "DeviceVendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceModel" ADD CONSTRAINT "DeviceModel_deviceTypeId_fkey" FOREIGN KEY ("deviceTypeId") REFERENCES "DeviceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkDevice" ADD CONSTRAINT "NetworkDevice_deviceModelId_fkey" FOREIGN KEY ("deviceModelId") REFERENCES "DeviceModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
