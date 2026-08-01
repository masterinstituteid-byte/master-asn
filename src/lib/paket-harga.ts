import "server-only";
import { prisma } from "@/lib/db";

export interface PaketHargaRingkas {
  id: string;
  nama: string;
  harga: number;
  deskripsi: string;
  jumlahPaketSoal: number;
  fasilitas: string[];
  populer: boolean;
  aktif: boolean;
  urutan: number;
}

export interface PaketHargaInput {
  nama: string;
  harga: number;
  deskripsi: string;
  jumlahPaketSoal: number;
  fasilitas: string[];
  populer: boolean;
  aktif: boolean;
}

interface Row {
  id: string;
  nama: string;
  harga: number;
  deskripsi: string;
  jumlahPaketSoal: number;
  fasilitas: string;
  populer: boolean;
  aktif: boolean;
  urutan: number;
}

function toRingkas(p: Row): PaketHargaRingkas {
  let fasilitas: string[] = [];
  try {
    fasilitas = (JSON.parse(p.fasilitas) as string[]).filter(Boolean);
  } catch {
    /* abaikan */
  }
  return {
    id: p.id,
    nama: p.nama,
    harga: p.harga,
    deskripsi: p.deskripsi,
    jumlahPaketSoal: p.jumlahPaketSoal,
    fasilitas,
    populer: p.populer,
    aktif: p.aktif,
    urutan: p.urutan,
  };
}

function bersihkan(input: PaketHargaInput) {
  return {
    nama: input.nama.trim() || "Paket Tanpa Nama",
    harga: Math.max(0, Math.round(input.harga || 0)),
    deskripsi: input.deskripsi.trim(),
    jumlahPaketSoal: Math.max(0, Math.round(input.jumlahPaketSoal || 0)),
    fasilitas: JSON.stringify(input.fasilitas.map((f) => f.trim()).filter(Boolean)),
    populer: input.populer,
    aktif: input.aktif,
  };
}

export async function getAllPaketHarga(): Promise<PaketHargaRingkas[]> {
  const rows = await prisma.paketHarga.findMany({
    orderBy: [{ urutan: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(toRingkas);
}

export async function getPaketHargaAktif(): Promise<PaketHargaRingkas[]> {
  const rows = await prisma.paketHarga.findMany({
    where: { aktif: true },
    orderBy: [{ urutan: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(toRingkas);
}

export async function createPaketHarga(input: PaketHargaInput): Promise<string> {
  const max = await prisma.paketHarga.aggregate({ _max: { urutan: true } });
  const p = await prisma.paketHarga.create({
    data: { ...bersihkan(input), urutan: (max._max.urutan ?? 0) + 1 },
  });
  return p.id;
}

export async function updatePaketHarga(id: string, input: PaketHargaInput): Promise<void> {
  await prisma.paketHarga.update({ where: { id }, data: bersihkan(input) });
}

export async function deletePaketHarga(id: string): Promise<void> {
  await prisma.paketHarga.delete({ where: { id } });
}
