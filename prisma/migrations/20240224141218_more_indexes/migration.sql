-- CreateIndex
CREATE INDEX "StatInactiveOnu_createdAt_idx" ON "StatInactiveOnu"("createdAt");

-- CreateIndex
CREATE INDEX "StatInactiveOnu_xponBoard_idx" ON "StatInactiveOnu"("xponBoard");

-- CreateIndex
CREATE INDEX "StatInactiveOnu_xponInterface_idx" ON "StatInactiveOnu"("xponInterface");

-- CreateIndex
CREATE INDEX "StatInactiveOnu_xponPort_idx" ON "StatInactiveOnu"("xponPort");

-- CreateIndex
CREATE INDEX "StatOnuDevice_createdAt_idx" ON "StatOnuDevice"("createdAt");

-- CreateIndex
CREATE INDEX "StatOnuOpticalSignal_createdAt_idx" ON "StatOnuOpticalSignal"("createdAt");

-- CreateIndex
CREATE INDEX "StatOnuOpticalSignal_xponBoard_idx" ON "StatOnuOpticalSignal"("xponBoard");

-- CreateIndex
CREATE INDEX "StatOnuOpticalSignal_xponInterface_idx" ON "StatOnuOpticalSignal"("xponInterface");

-- CreateIndex
CREATE INDEX "StatOnuOpticalSignal_xponPort_idx" ON "StatOnuOpticalSignal"("xponPort");

-- CreateIndex
CREATE INDEX "StatOnuOpticalSignal_networkDeviceId_idx" ON "StatOnuOpticalSignal"("networkDeviceId");
