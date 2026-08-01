-- CreateTable
CREATE TABLE "PaketHarga" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "harga" INTEGER NOT NULL DEFAULT 0,
    "deskripsi" TEXT NOT NULL DEFAULT '',
    "jumlahPaketSoal" INTEGER NOT NULL DEFAULT 0,
    "fasilitas" TEXT NOT NULL DEFAULT '[]',
    "populer" BOOLEAN NOT NULL DEFAULT false,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
