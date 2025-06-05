/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `MnestixConnection` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MnestixConnection_name_key" ON "MnestixConnection"("name");
