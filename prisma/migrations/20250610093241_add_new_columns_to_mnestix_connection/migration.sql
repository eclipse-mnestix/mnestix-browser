/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `MnestixConnection` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MnestixConnection" ADD COLUMN "aasSearcher" TEXT;
ALTER TABLE "MnestixConnection" ADD COLUMN "image" TEXT;
ALTER TABLE "MnestixConnection" ADD COLUMN "name" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "MnestixConnection_name_key" ON "MnestixConnection"("name");
