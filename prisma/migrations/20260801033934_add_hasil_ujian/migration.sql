-- CreateTable
CREATE TABLE "HasilUjian" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "paketId" TEXT,
    "paketNama" TEXT NOT NULL,
    "nilaiTotal" INTEGER NOT NULL,
    "nilaiMaksTotal" INTEGER NOT NULL,
    "lulusSemua" BOOLEAN NOT NULL,
    "rincian" TEXT NOT NULL,
    "jumlahSoal" INTEGER NOT NULL,
    "waktuTerpakaiDetik" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "HasilUjian_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
