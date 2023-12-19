/*
  Warnings:

  - You are about to drop the column `eponBoard` on the `StatInactiveOnu` table. All the data in the column will be lost.
  - You are about to drop the column `eponInterface` on the `StatInactiveOnu` table. All the data in the column will be lost.
  - You are about to drop the column `eponPort` on the `StatInactiveOnu` table. All the data in the column will be lost.
  - You are about to drop the column `eponBoard` on the `StatOnuDevice` table. All the data in the column will be lost.
  - You are about to drop the column `eponInterface` on the `StatOnuDevice` table. All the data in the column will be lost.
  - You are about to drop the column `eponPort` on the `StatOnuDevice` table. All the data in the column will be lost.
  - You are about to drop the column `eponBoard` on the `StatOnuOpticalSignal` table. All the data in the column will be lost.
  - You are about to drop the column `eponInterface` on the `StatOnuOpticalSignal` table. All the data in the column will be lost.
  - You are about to drop the column `eponPort` on the `StatOnuOpticalSignal` table. All the data in the column will be lost.
  - Added the required column `xponBoard` to the `StatInactiveOnu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `xponInterface` to the `StatInactiveOnu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `xponPort` to the `StatInactiveOnu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `xponBoard` to the `StatOnuDevice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `xponInterface` to the `StatOnuDevice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `xponPort` to the `StatOnuDevice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `xponBoard` to the `StatOnuOpticalSignal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `xponInterface` to the `StatOnuOpticalSignal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `xponPort` to the `StatOnuOpticalSignal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StatInactiveOnu" DROP COLUMN "eponBoard",
DROP COLUMN "eponInterface",
DROP COLUMN "eponPort",
ADD COLUMN     "xponBoard" INTEGER NOT NULL,
ADD COLUMN     "xponInterface" INTEGER NOT NULL,
ADD COLUMN     "xponPort" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "StatOnuDevice" DROP COLUMN "eponBoard",
DROP COLUMN "eponInterface",
DROP COLUMN "eponPort",
ADD COLUMN     "xponBoard" INTEGER NOT NULL,
ADD COLUMN     "xponInterface" INTEGER NOT NULL,
ADD COLUMN     "xponPort" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "StatOnuOpticalSignal" DROP COLUMN "eponBoard",
DROP COLUMN "eponInterface",
DROP COLUMN "eponPort",
ADD COLUMN     "xponBoard" INTEGER NOT NULL,
ADD COLUMN     "xponInterface" INTEGER NOT NULL,
ADD COLUMN     "xponPort" INTEGER NOT NULL;
