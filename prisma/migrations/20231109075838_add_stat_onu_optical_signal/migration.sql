/*
  Warnings:

  - Changed the type of `eponBoard` on the `StatOnuDevice` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `eponPort` on the `StatOnuDevice` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `eponInterface` on the `StatOnuDevice` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "StatOnuDevice" DROP COLUMN "eponBoard",
ADD COLUMN     "eponBoard" INTEGER NOT NULL,
DROP COLUMN "eponPort",
ADD COLUMN     "eponPort" INTEGER NOT NULL,
DROP COLUMN "eponInterface",
ADD COLUMN     "eponInterface" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "StatOnuOpticalSignal" (
    "id" SERIAL NOT NULL,
    "eponBoard" INTEGER NOT NULL,
    "eponPort" INTEGER NOT NULL,
    "eponInterface" INTEGER NOT NULL,
    "rxPower" DOUBLE PRECISION NOT NULL,
    "txPower" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "networkDeviceId" INTEGER NOT NULL,

    CONSTRAINT "StatOnuOpticalSignal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StatOnuOpticalSignal" ADD CONSTRAINT "StatOnuOpticalSignal_networkDeviceId_fkey" FOREIGN KEY ("networkDeviceId") REFERENCES "NetworkDevice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
