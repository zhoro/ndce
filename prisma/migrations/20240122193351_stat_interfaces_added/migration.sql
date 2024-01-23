-- CreateTable
CREATE TABLE "StatInterfaces" (
    "id" SERIAL NOT NULL,
    "ifState" TEXT NOT NULL DEFAULT '',
    "ifLineProtocolState" TEXT NOT NULL DEFAULT '',
    "ifSpeedMb" INTEGER NOT NULL,
    "bandwidth" INTEGER NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "hardwareType" TEXT NOT NULL DEFAULT '',
    "fiveMinutesInRate" BIGINT NOT NULL DEFAULT 0,
    "fiveMinutesOutRate" BIGINT NOT NULL DEFAULT 0,
    "realtimeInRates" BIGINT NOT NULL DEFAULT 0,
    "realtimeOutRates" BIGINT NOT NULL DEFAULT 0,
    "peakInRates" BIGINT NOT NULL DEFAULT 0,
    "peakOutRates" BIGINT NOT NULL DEFAULT 0,
    "rxErrorCount" INTEGER NOT NULL DEFAULT 0,
    "board" INTEGER NOT NULL,
    "port" INTEGER NOT NULL,
    "xponInterfaceNum" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "networkDeviceId" INTEGER NOT NULL,

    CONSTRAINT "StatInterfaces_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StatInterfaces_networkDeviceId_idx" ON "StatInterfaces"("networkDeviceId");

-- CreateIndex
CREATE INDEX "StatInterfaces_board_idx" ON "StatInterfaces"("board");

-- CreateIndex
CREATE INDEX "StatInterfaces_port_idx" ON "StatInterfaces"("port");

-- CreateIndex
CREATE INDEX "StatInterfaces_xponInterfaceNum_idx" ON "StatInterfaces"("xponInterfaceNum");

-- AddForeignKey
ALTER TABLE "StatInterfaces" ADD CONSTRAINT "StatInterfaces_networkDeviceId_fkey" FOREIGN KEY ("networkDeviceId") REFERENCES "NetworkDevice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
