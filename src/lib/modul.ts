import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { prisma } from "@/lib/db";

// PDF disimpan di luar folder public (akses lewat route bergerbang login).
// DATA_DIR bisa diarahkan ke volume permanen saat deploy (mis. /app/data).
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads", "materi");

export interface ModulRingkas {
  id: string;
  judul: string;
  deskripsi: string;
  kategori: string;
  namaFile: string;
  ukuran: number;
  aktif: boolean;
  urutan: number;
  createdAt: string;
}

interface ModulRow {
  id: string;
  judul: string;
  deskripsi: string;
  kategori: string;
  namaFile: string;
  ukuran: number;
  aktif: boolean;
  urutan: number;
  createdAt: Date;
}

function toRingkas(m: ModulRow): ModulRingkas {
  return {
    id: m.id,
    judul: m.judul,
    deskripsi: m.deskripsi,
    kategori: m.kategori,
    namaFile: m.namaFile,
    ukuran: m.ukuran,
    aktif: m.aktif,
    urutan: m.urutan,
    createdAt: m.createdAt.toISOString(),
  };
}

export function modulFilePath(id: string): string {
  return path.join(UPLOAD_DIR, `${id}.pdf`);
}

export async function getAllModul(): Promise<ModulRingkas[]> {
  const rows = await prisma.modul.findMany({
    orderBy: [{ urutan: "asc" }, { createdAt: "desc" }],
  });
  return rows.map(toRingkas);
}

export async function getModulAktif(): Promise<ModulRingkas[]> {
  const rows = await prisma.modul.findMany({
    where: { aktif: true },
    orderBy: [{ urutan: "asc" }, { createdAt: "desc" }],
  });
  return rows.map(toRingkas);
}

export async function getModulById(id: string): Promise<ModulRingkas | null> {
  const m = await prisma.modul.findUnique({ where: { id } });
  return m ? toRingkas(m) : null;
}

export async function createModul(input: {
  judul: string;
  deskripsi: string;
  kategori: string;
  namaFile: string;
  bytes: ArrayBuffer;
}): Promise<string> {
  const buffer = Buffer.from(input.bytes);
  const m = await prisma.modul.create({
    data: {
      judul: input.judul.trim() || "Modul Tanpa Judul",
      deskripsi: input.deskripsi.trim(),
      kategori: input.kategori.trim() || "Umum",
      namaFile: input.namaFile,
      ukuran: buffer.length,
    },
  });
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(modulFilePath(m.id), buffer);
  return m.id;
}

export async function deleteModul(id: string): Promise<void> {
  await prisma.modul.delete({ where: { id } });
  try {
    await fs.unlink(modulFilePath(id));
  } catch {
    /* file mungkin sudah tidak ada */
  }
}
