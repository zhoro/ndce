/*
  Warnings:
  - You are about to drop the column `Enabled` on the `NetworkDevice` table. All the data in the column will be lost.
 */
-- AlterTable
ALTER TABLE "NetworkDevice" DROP COLUMN "Enabled",
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true;
