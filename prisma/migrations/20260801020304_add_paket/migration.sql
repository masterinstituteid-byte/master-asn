-- CreateTable
CREATE TABLE "Paket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL DEFAULT '',
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Soal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nomor" INTEGER NOT NULL DEFAULT 0,
    "subtes" TEXT NOT NULL,
    "materi" TEXT NOT NULL,
    "pertanyaan" TEXT NOT NULL,
    "opsi" TEXT NOT NULL,
    "kunci" TEXT,
    "pembahasan" TEXT NOT NULL,
    "tingkat" TEXT NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "paketId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Soal_paketId_fkey" FOREIGN KEY ("paketId") REFERENCES "Paket" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Soal" ("aktif", "createdAt", "id", "kunci", "materi", "nomor", "opsi", "pembahasan", "pertanyaan", "subtes", "tingkat", "updatedAt") SELECT "aktif", "createdAt", "id", "kunci", "materi", "nomor", "opsi", "pembahasan", "pertanyaan", "subtes", "tingkat", "updatedAt" FROM "Soal";
DROP TABLE "Soal";
ALTER TABLE "new_Soal" RENAME TO "Soal";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
