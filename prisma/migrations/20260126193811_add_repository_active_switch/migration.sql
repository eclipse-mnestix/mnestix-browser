-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MnestixConnection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "aasSearcher" TEXT,
    "image" TEXT,
    "name" TEXT,
    "commercialData" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "MnestixConnection_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ConnectionType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MnestixConnection" ("aasSearcher", "commercialData", "id", "image", "name", "typeId", "url") SELECT "aasSearcher", "commercialData", "id", "image", "name", "typeId", "url" FROM "MnestixConnection";
DROP TABLE "MnestixConnection";
ALTER TABLE "new_MnestixConnection" RENAME TO "MnestixConnection";
CREATE UNIQUE INDEX "MnestixConnection_name_key" ON "MnestixConnection"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
