/*
  Warnings:

  - Added the required column `deviceCredentialId` to the `NetworkDevice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NetworkDevice" ADD COLUMN     "deviceCredentialId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "DeviceCredential" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL DEFAULT 'admin',
    "password" TEXT NOT NULL DEFAULT 'admin',

    CONSTRAINT "DeviceCredential_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NetworkDevice" ADD CONSTRAINT "NetworkDevice_deviceCredentialId_fkey" FOREIGN KEY ("deviceCredentialId") REFERENCES "DeviceCredential"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
