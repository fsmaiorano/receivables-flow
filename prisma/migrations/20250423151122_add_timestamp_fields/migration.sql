/*
  Warnings:

  - You are about to alter the column `value` on the `Payable` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.
  - Added the required column `updatedAt` to the `Assignor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Payable` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Assignor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "document" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Assignor" ("document", "email", "id", "name", "phone") SELECT "document", "email", "id", "name", "phone" FROM "Assignor";
DROP TABLE "Assignor";
ALTER TABLE "new_Assignor" RENAME TO "Assignor";
CREATE UNIQUE INDEX "Assignor_document_key" ON "Assignor"("document");
CREATE TABLE "new_Payable" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" DECIMAL NOT NULL,
    "emissionDate" DATETIME NOT NULL,
    "assignorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Payable_assignorId_fkey" FOREIGN KEY ("assignorId") REFERENCES "Assignor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Payable" ("assignorId", "emissionDate", "id", "value") SELECT "assignorId", "emissionDate", "id", "value" FROM "Payable";
DROP TABLE "Payable";
ALTER TABLE "new_Payable" RENAME TO "Payable";
CREATE UNIQUE INDEX "Payable_value_key" ON "Payable"("value");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
