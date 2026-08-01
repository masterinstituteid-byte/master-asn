-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'password',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Soal" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
