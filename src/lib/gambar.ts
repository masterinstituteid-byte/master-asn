import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { prisma } from "@/lib/db";

// Gambar soal disimpan di luar folder public (akses lewat route bergerbang login).
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const IMG_DIR = path.join(DATA_DIR, "uploads", "gambar");

export const MIME_GAMBAR = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export function gambarPath(id: string): string {
  return path.join(IMG_DIR, id);
}

export async function simpanGambar(bytes: ArrayBuffer, mime: string): Promise<string> {
  const buffer = Buffer.from(bytes);
  const g = await prisma.gambar.create({ data: { mime, ukuran: buffer.length } });
  await fs.mkdir(IMG_DIR, { recursive: true });
  await fs.writeFile(gambarPath(g.id), buffer);
  return g.id;
}

export async function getGambarMeta(id: string): Promise<{ mime: string } | null> {
  const g = await prisma.gambar.findUnique({ where: { id } });
  return g ? { mime: g.mime } : null;
}
