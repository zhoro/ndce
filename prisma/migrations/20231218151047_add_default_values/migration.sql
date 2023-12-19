-- AlterTable
ALTER TABLE "StatInactiveOnu" ALTER COLUMN "serialNumberOnu" SET DEFAULT '';

-- AlterTable
ALTER TABLE "StatOnuDevice" ALTER COLUMN "macAddressOnu" SET DEFAULT '',
ALTER COLUMN "serialNumberOnu" SET DEFAULT '',
ALTER COLUMN "xponType" SET DEFAULT 'pon';
