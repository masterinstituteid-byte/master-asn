import "server-only";
import { prisma } from "@/lib/db";

export interface TestimoniRingkas {
  id: string;
  nama: string;
  peran: string;
  pesan: string;
  rating: number;
  aktif: boolean;
  urutan: number;
}

export interface TestimoniInput {
  nama: string;
  peran: string;
  pesan: string;
  rating: number;
  aktif: boolean;
}

interface Row {
  id: string;
  nama: string;
  peran: string;
  pesan: string;
  rating: number;
  aktif: boolean;
  urutan: number;
}

function toRingkas(t: Row): TestimoniRingkas {
  return {
    id: t.id,
    nama: t.nama,
    peran: t.peran,
    pesan: t.pesan,
    rating: t.rating,
    aktif: t.aktif,
    urutan: t.urutan,
  };
}

export async function getAllTestimoni(): Promise<TestimoniRingkas[]> {
  const rows = await prisma.testimoni.findMany({
    orderBy: [{ urutan: "asc" }, { createdAt: "desc" }],
  });
  return rows.map(toRingkas);
}

export async function getTestimoniAktif(): Promise<TestimoniRingkas[]> {
  const rows = await prisma.testimoni.findMany({
    where: { aktif: true },
    orderBy: [{ urutan: "asc" }, { createdAt: "desc" }],
  });
  return rows.map(toRingkas);
}

function clampRating(r: number): number {
  return Math.min(5, Math.max(1, Math.round(r || 5)));
}

export async function createTestimoni(input: TestimoniInput): Promise<string> {
  const max = await prisma.testimoni.aggregate({ _max: { urutan: true } });
  const t = await prisma.testimoni.create({
    data: {
      nama: input.nama.trim() || "Anonim",
      peran: input.peran.trim(),
      pesan: input.pesan.trim(),
      rating: clampRating(input.rating),
      aktif: input.aktif,
      urutan: (max._max.urutan ?? 0) + 1,
    },
  });
  return t.id;
}

export async function updateTestimoni(id: string, input: TestimoniInput): Promise<void> {
  await prisma.testimoni.update({
    where: { id },
    data: {
      nama: input.nama.trim() || "Anonim",
      peran: input.peran.trim(),
      pesan: input.pesan.trim(),
      rating: clampRating(input.rating),
      aktif: input.aktif,
    },
  });
}

export async function deleteTestimoni(id: string): Promise<void> {
  await prisma.testimoni.delete({ where: { id } });
}
