/*
  Warnings:

  - Added the required column `serialNumberOnu` to the `StatInactiveOnu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serialNumberOnu` to the `StatOnuDevice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `xponType` to the `StatOnuDevice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StatInactiveOnu" ADD COLUMN     "serialNumberOnu" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StatOnuDevice" ADD COLUMN     "serialNumberOnu" TEXT NOT NULL,
ADD COLUMN     "xponType" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "StatInactiveOnu_serialNumberOnu_idx" ON "StatInactiveOnu"("serialNumberOnu");

-- CreateIndex
CREATE INDEX "StatOnuDevice_serialNumberOnu_idx" ON "StatOnuDevice"("serialNumberOnu");
