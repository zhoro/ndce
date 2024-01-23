npx prisma migrate dev --name-- DropIndex
DROP INDEX "StatInterfaces_portType_idx";

-- AlterTable
ALTER TABLE "StatInterfaces" DROP COLUMN "portType";

