/*
  Warnings:

  - You are about to drop the column `iv` on the `SecuritySettingsHeader` table. All the data in the column will be lost.
  - You are about to drop the column `iv` on the `SecuritySettingsProxy` table. All the data in the column will be lost.
  - Added the required column `initVector` to the `SecuritySettingsHeader` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initVector` to the `SecuritySettingsProxy` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SecuritySettingsHeader" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "headerName" TEXT NOT NULL,
    "headerValue" TEXT NOT NULL,
    "initVector" TEXT NOT NULL,
    "authTag" TEXT NOT NULL,
    "infrastructureId" TEXT NOT NULL,
    CONSTRAINT "SecuritySettingsHeader_infrastructureId_fkey" FOREIGN KEY ("infrastructureId") REFERENCES "MnestixInfrastructure" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SecuritySettingsHeader" ("authTag", "headerName", "headerValue", "id", "infrastructureId") SELECT "authTag", "headerName", "headerValue", "id", "infrastructureId" FROM "SecuritySettingsHeader";
DROP TABLE "SecuritySettingsHeader";
ALTER TABLE "new_SecuritySettingsHeader" RENAME TO "SecuritySettingsHeader";
CREATE UNIQUE INDEX "SecuritySettingsHeader_infrastructureId_key" ON "SecuritySettingsHeader"("infrastructureId");
CREATE TABLE "new_SecuritySettingsProxy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "headerValue" TEXT NOT NULL,
    "initVector" TEXT NOT NULL,
    "authTag" TEXT NOT NULL,
    "infrastructureId" TEXT NOT NULL,
    CONSTRAINT "SecuritySettingsProxy_infrastructureId_fkey" FOREIGN KEY ("infrastructureId") REFERENCES "MnestixInfrastructure" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SecuritySettingsProxy" ("authTag", "headerValue", "id", "infrastructureId") SELECT "authTag", "headerValue", "id", "infrastructureId" FROM "SecuritySettingsProxy";
DROP TABLE "SecuritySettingsProxy";
ALTER TABLE "new_SecuritySettingsProxy" RENAME TO "SecuritySettingsProxy";
CREATE UNIQUE INDEX "SecuritySettingsProxy_infrastructureId_key" ON "SecuritySettingsProxy"("infrastructureId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
