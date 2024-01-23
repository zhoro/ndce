-- AlterTable
ALTER TABLE "StatInterfaces" ADD COLUMN     "portType" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "StatInterfaces_portType_idx" ON "StatInterfaces"("portType");
