/*
  Warnings:

  - You are about to drop the column `altText` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `isMain` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `ProductImage` table. All the data in the column will be lost.
  - Added the required column `category` to the `ProductImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `ProductImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `ProductImage` table without a default value. This is not possible if the table is not empty.
  - Made the column `filename` on table `ProductImage` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT DEFAULT '',
    "price" REAL NOT NULL DEFAULT 0.0,
    "gender" TEXT NOT NULL DEFAULT 'MASCULINO',
    "productType" TEXT NOT NULL DEFAULT 'SAPATO',
    "filename" TEXT,
    "marcaId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "Marca" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("createdAt", "description", "filename", "gender", "id", "marcaId", "price", "productType", "title", "updatedAt") SELECT "createdAt", "description", "filename", "gender", "id", "marcaId", "price", "productType", "title", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE TABLE "new_ProductImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "mime" TEXT,
    "size" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" INTEGER,
    CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ProductImage" ("createdAt", "filename", "id", "productId", "url") SELECT "createdAt", "filename", "id", "productId", "url" FROM "ProductImage";
DROP TABLE "ProductImage";
ALTER TABLE "new_ProductImage" RENAME TO "ProductImage";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
