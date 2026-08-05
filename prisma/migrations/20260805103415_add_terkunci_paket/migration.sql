-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Paket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL DEFAULT '',
    "harga" INTEGER NOT NULL DEFAULT 0,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "terkunci" BOOLEAN NOT NULL DEFAULT false,
    "tampilLanding" BOOLEAN NOT NULL DEFAULT true,
    "populer" BOOLEAN NOT NULL DEFAULT false,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Paket" ("aktif", "createdAt", "deskripsi", "harga", "id", "nama", "populer", "tampilLanding", "updatedAt", "urutan") SELECT "aktif", "createdAt", "deskripsi", "harga", "id", "nama", "populer", "tampilLanding", "updatedAt", "urutan" FROM "Paket";
DROP TABLE "Paket";
ALTER TABLE "new_Paket" RENAME TO "Paket";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
