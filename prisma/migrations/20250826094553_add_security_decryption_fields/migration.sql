/*
  Warnings:

  - Added the required column `authTag` to the `SecuritySettingsHeader` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iv` to the `SecuritySettingsHeader` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authTag` to the `SecuritySettingsProxy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iv` to the `SecuritySettingsProxy` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SecuritySettingsHeader" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "headerName" TEXT NOT NULL,
    "headerValue" TEXT NOT NULL,
    "iv" TEXT NOT NULL,
    "authTag" TEXT NOT NULL,
    "infrastructureId" TEXT NOT NULL,
    CONSTRAINT "SecuritySettingsHeader_infrastructureId_fkey" FOREIGN KEY ("infrastructureId") REFERENCES "MnestixInfrastructure" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SecuritySettingsHeader" ("headerName", "headerValue", "id", "infrastructureId") SELECT "headerName", "headerValue", "id", "infrastructureId" FROM "SecuritySettingsHeader";
DROP TABLE "SecuritySettingsHeader";
ALTER TABLE "new_SecuritySettingsHeader" RENAME TO "SecuritySettingsHeader";
CREATE TABLE "new_SecuritySettingsProxy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "headerValue" TEXT NOT NULL,
    "iv" TEXT NOT NULL,
    "authTag" TEXT NOT NULL,
    "infrastructureId" TEXT NOT NULL,
    CONSTRAINT "SecuritySettingsProxy_infrastructureId_fkey" FOREIGN KEY ("infrastructureId") REFERENCES "MnestixInfrastructure" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SecuritySettingsProxy" ("headerValue", "id", "infrastructureId") SELECT "headerValue", "id", "infrastructureId" FROM "SecuritySettingsProxy";
DROP TABLE "SecuritySettingsProxy";
ALTER TABLE "new_SecuritySettingsProxy" RENAME TO "SecuritySettingsProxy";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
