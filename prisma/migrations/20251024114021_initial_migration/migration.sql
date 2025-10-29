-- CreateTable
CREATE TABLE "ProductMasculino" (
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

-- CreateTable
CREATE TABLE "ProductKids" (
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

-- CreateTable
CREATE TABLE "ProductFeminino" (
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

-- CreateTable
CREATE TABLE "Marca" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Marca_slug_key" ON "Marca"("slug");
