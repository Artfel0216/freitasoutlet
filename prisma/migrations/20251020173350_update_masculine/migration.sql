-- CreateTable
CREATE TABLE "ProductMasculino" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
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
    "updatedAt" DATETIME NOT NULL
);
