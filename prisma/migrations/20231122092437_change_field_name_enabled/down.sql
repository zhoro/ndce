-- AlterTable
ALTER TABLE "NetworkDevice" DROP COLUMN "enabled",
ADD COLUMN     "Enabled" BOOLEAN NOT NULL DEFAULT true;

