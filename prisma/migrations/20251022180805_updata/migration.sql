-- CreateTable
CREATE TABLE "Marca" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductFeminino" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT 'Sem título',
    "description" TEXT,
    "filename" TEXT NOT NULL,
    "category" TEXT,
    "url" TEXT,
    "path" TEXT,
    "mime" TEXT,
    "size" INTEGER,
    "price" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "marcaId" INTEGER,
    CONSTRAINT "ProductFeminino_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "Marca" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ProductFeminino" ("category", "createdAt", "description", "filename", "id", "mime", "path", "price", "size", "title", "updatedAt", "url") SELECT "category", "createdAt", "description", "filename", "id", "mime", "path", "price", "size", "title", "updatedAt", "url" FROM "ProductFeminino";
DROP TABLE "ProductFeminino";
ALTER TABLE "new_ProductFeminino" RENAME TO "ProductFeminino";
CREATE TABLE "new_ProductKids" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT 'Sem título',
    "description" TEXT,
    "filename" TEXT NOT NULL,
    "category" TEXT,
    "url" TEXT,
    "path" TEXT,
    "mime" TEXT,
    "size" INTEGER,
    "price" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "marcaId" INTEGER,
    CONSTRAINT "ProductKids_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "Marca" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ProductKids" ("category", "createdAt", "description", "filename", "id", "mime", "path", "price", "size", "title", "updatedAt", "url") SELECT "category", "createdAt", "description", "filename", "id", "mime", "path", "price", "size", "title", "updatedAt", "url" FROM "ProductKids";
DROP TABLE "ProductKids";
ALTER TABLE "new_ProductKids" RENAME TO "ProductKids";
CREATE TABLE "new_ProductMasculino" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT 'Sem título',
    "description" TEXT,
    "filename" TEXT NOT NULL,
    "category" TEXT,
    "url" TEXT,
    "path" TEXT,
    "mime" TEXT,
    "size" INTEGER,
    "price" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "marcaId" INTEGER,
    CONSTRAINT "ProductMasculino_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "Marca" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ProductMasculino" ("category", "createdAt", "description", "filename", "id", "mime", "path", "price", "size", "title", "updatedAt", "url") SELECT "category", "createdAt", "description", "filename", "id", "mime", "path", "price", "size", "title", "updatedAt", "url" FROM "ProductMasculino";
DROP TABLE "ProductMasculino";
ALTER TABLE "new_ProductMasculino" RENAME TO "ProductMasculino";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Marca_slug_key" ON "Marca"("slug");
