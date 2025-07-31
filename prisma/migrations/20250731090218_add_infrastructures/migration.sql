/*
  Warnings:

  - You are about to drop the column `typeId` on the `MnestixConnection` table. All the data in the column will be lost.
  - Added the required column `infrastructureId` to the `MnestixConnection` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "MnestixConnectionTypeRelation" (
    "connectionId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,

    PRIMARY KEY ("connectionId", "typeId"),
    CONSTRAINT "MnestixConnectionTypeRelation_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "MnestixConnection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MnestixConnectionTypeRelation_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ConnectionType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MnestixInfrastructure" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "securityTypeId" TEXT NOT NULL,
    CONSTRAINT "MnestixInfrastructure_securityTypeId_fkey" FOREIGN KEY ("securityTypeId") REFERENCES "SecurityType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SecurityType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "typeName" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SecuritySettingsHeader" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "headerName" TEXT NOT NULL,
    "headerValue" TEXT NOT NULL,
    "infrastructureId" TEXT NOT NULL,
    CONSTRAINT "SecuritySettingsHeader_infrastructureId_fkey" FOREIGN KEY ("infrastructureId") REFERENCES "MnestixInfrastructure" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SecuritySettingsProxy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "headerValue" TEXT NOT NULL,
    "infrastructureId" TEXT NOT NULL,
    CONSTRAINT "SecuritySettingsProxy_infrastructureId_fkey" FOREIGN KEY ("infrastructureId") REFERENCES "MnestixInfrastructure" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- DATA MIGRATION: Move existing connection types to the new MnestixConnectionTypeRelation table
INSERT INTO "MnestixConnectionTypeRelation" ("connectionId", "typeId")
SELECT "id", "typeId" FROM "MnestixConnection" WHERE "typeId" IS NOT NULL;

-- Create SecurityTypes
INSERT INTO "SecurityType" ("id", "typeName")
VALUES
    ('0', 'NONE'),
    ('1', 'HEADER'),
    ('2', 'PROXY');

-- DATA MIGRATION: Migrate existing connections to a new default infrastructure, if connections exist
INSERT INTO "MnestixInfrastructure" ("id", "name", "logo", "securityTypeId")
SELECT 'infrastructure1', 'Infrastructure', NULL, '0'
WHERE EXISTS (SELECT 1 FROM "MnestixConnection");

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MnestixConnection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "infrastructureId" TEXT NOT NULL,
    CONSTRAINT "MnestixConnection_infrastructureId_fkey" FOREIGN KEY ("infrastructureId") REFERENCES "MnestixInfrastructure" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MnestixConnection" ("id", "url", "infrastructureId") SELECT "id", "url", "infrastructure1" FROM "MnestixConnection";
DROP TABLE "MnestixConnection";
ALTER TABLE "new_MnestixConnection" RENAME TO "MnestixConnection";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "MnestixInfrastructure_name_key" ON "MnestixInfrastructure"("name");
