import "server-only";
import { prisma } from "@/lib/db";
import { SUBTES, SUBTES_ORDER, type Soal, type Opsi, type Subtes } from "@/lib/skd";
import { BANK_SOAL } from "@/data/questions";

// ---- Konversi baris DB <-> tipe aplikasi ----
interface SoalRow {
  id: string;
  nomor: number;
  subtes: string;
  materi: string;
  pertanyaan: string;
  gambar: string | null;
  opsi: string;
  kunci: string | null;
  pembahasan: string;
  tingkat: string;
  paketId: string | null;
}

function toApp(row: SoalRow): Soal {
  return {
    id: row.id,
    subtes: row.subtes as Subtes,
    materi: row.materi,
    pertanyaan: row.pertanyaan,
    gambar: row.gambar,
    opsi: JSON.parse(row.opsi) as Opsi[],
    kunci: row.kunci ?? undefined,
    pembahasan: row.pembahasan,
    tingkat: row.tingkat as Soal["tingkat"],
    paketId: row.paketId,
  };
}

export interface SoalInput {
  subtes: Subtes;
  materi: string;
  pertanyaan: string;
  gambar?: string | null;
  opsi: Opsi[];
  kunci?: string | null;
  pembahasan: string;
  tingkat: Soal["tingkat"];
  nomor?: number;
  paketId?: string | null;
}

// ---- Query ----
export async function getAllSoal(): Promise<Soal[]> {
  const rows = await prisma.soal.findMany({
    where: { aktif: true },
    orderBy: [{ subtes: "asc" }, { nomor: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(toApp);
}

/**
 * Soal untuk halaman Bank Soal — HANYA soal mandiri (tidak terikat paket
 * simulasi). Dengan begitu bank soal & soal simulasi terpisah total.
 */
export async function getBankSoal(): Promise<Soal[]> {
  const rows = await prisma.soal.findMany({
    where: { aktif: true, paketId: null },
    orderBy: [{ subtes: "asc" }, { nomor: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(toApp);
}

/** Soal milik satu paket, terurut nomor. */
export async function getSoalByPaket(paketId: string): Promise<Soal[]> {
  const rows = await prisma.soal.findMany({
    where: { aktif: true, paketId },
    orderBy: [{ nomor: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(toApp);
}

export async function getSoalById(id: string): Promise<Soal | null> {
  const row = await prisma.soal.findUnique({ where: { id } });
  return row ? toApp(row) : null;
}

export async function countSoal(): Promise<number> {
  return prisma.soal.count({ where: { aktif: true } });
}

/**
 * Tentukan paket yang akan dipakai simulasi: id yang diminta (bila ada &
 * valid), atau paket aktif pertama, atau null (pakai semua soal). Dipakai
 * halaman /simulasi untuk mencatat nama paket pada hasil.
 */
export async function resolvePaketAktif(
  paketId?: string,
): Promise<{ id: string | null; nama: string; harga: number }> {
  if (paketId) {
    const p = await prisma.paket.findUnique({ where: { id: paketId } });
    if (p) return { id: p.id, nama: p.nama, harga: p.harga };
  }
  const pertama = await prisma.paket.findFirst({
    where: { aktif: true },
    orderBy: [{ urutan: "asc" }, { createdAt: "asc" }],
  });
  if (pertama) return { id: pertama.id, nama: pertama.nama, harga: pertama.harga };
  return { id: null, nama: "Semua Soal", harga: 0 };
}

/**
 * Susun satu paket simulasi SKD (110 soal: TWK 30 · TIU 35 · TKP 45).
 * Bila `paketId` diberikan, soal diambil dari paket itu; jika tidak, dari
 * paket aktif pertama (atau seluruh soal sebagai cadangan). Bila soal pada
 * suatu subtes belum cukup, soal diulang untuk memenuhi kuota — setiap slot
 * memakai id unik agar jawaban tidak saling tertukar. Dipanggil dari server.
 */
export async function getPaketSimulasi(paketId?: string): Promise<Soal[]> {
  await seedSoalIfEmpty();

  let pool: Soal[];
  if (paketId) {
    pool = await getSoalByPaket(paketId);
  } else {
    // cadangan: paket aktif pertama, atau semua soal bila belum ada paket.
    const pertama = await prisma.paket.findFirst({
      where: { aktif: true },
      orderBy: [{ urutan: "asc" }, { createdAt: "asc" }],
    });
    pool = pertama ? await getSoalByPaket(pertama.id) : await getAllSoal();
  }

  const paket: Soal[] = [];
  for (const sub of SUBTES_ORDER) {
    const sub_pool = pool.filter((s) => s.subtes === sub);
    if (sub_pool.length === 0) continue;
    const target = SUBTES[sub].jumlahSoal;
    for (let i = 0; i < target; i++) {
      const base = sub_pool[i % sub_pool.length];
      paket.push({
        ...base,
        // id unik per slot: penting agar tiap nomor punya jawaban terpisah,
        // meski soal sumbernya diulang untuk mengisi kuota paket.
        id: `${sub}-${String(i + 1).padStart(3, "0")}`,
      });
    }
  }

  return paket;
}

// ---- Mutasi ----
export async function createSoal(input: SoalInput): Promise<Soal> {
  const row = await prisma.soal.create({
    data: {
      subtes: input.subtes,
      materi: input.materi,
      pertanyaan: input.pertanyaan,
      gambar: input.gambar ?? null,
      opsi: JSON.stringify(input.opsi),
      kunci: input.kunci ?? null,
      pembahasan: input.pembahasan,
      tingkat: input.tingkat,
      nomor: input.nomor ?? 0,
      paketId: input.paketId ?? null,
    },
  });
  return toApp(row);
}

export async function updateSoal(id: string, input: SoalInput): Promise<Soal> {
  const row = await prisma.soal.update({
    where: { id },
    data: {
      subtes: input.subtes,
      materi: input.materi,
      pertanyaan: input.pertanyaan,
      gambar: input.gambar ?? null,
      opsi: JSON.stringify(input.opsi),
      kunci: input.kunci ?? null,
      pembahasan: input.pembahasan,
      tingkat: input.tingkat,
      // nomor & paketId hanya diubah bila disertakan (edit manual tak memindah paket).
      ...(input.nomor !== undefined ? { nomor: input.nomor } : {}),
      ...(input.paketId !== undefined ? { paketId: input.paketId } : {}),
    },
  });
  return toApp(row);
}

/**
 * Impor massal soal ke sebuah paket (dari unggahan Excel).
 * mode "ganti" menghapus soal lama paket lebih dulu; "tambah" menambah di
 * belakang nomor terakhir. Mengembalikan jumlah soal yang tersimpan.
 */
export async function importSoalToPaket(
  paketId: string,
  inputs: SoalInput[],
  mode: "ganti" | "tambah" = "ganti",
): Promise<number> {
  if (mode === "ganti") {
    await prisma.soal.deleteMany({ where: { paketId } });
  }
  const mulai =
    mode === "tambah"
      ? await prisma.soal.count({ where: { paketId } })
      : 0;

  const data = inputs.map((input, i) => ({
    subtes: input.subtes,
    materi: input.materi,
    pertanyaan: input.pertanyaan,
    gambar: input.gambar ?? null,
    opsi: JSON.stringify(input.opsi),
    kunci: input.kunci ?? null,
    pembahasan: input.pembahasan,
    tingkat: input.tingkat,
    nomor: mulai + i + 1,
    paketId,
  }));

  await prisma.soal.createMany({ data });
  return data.length;
}

export async function deleteSoal(id: string): Promise<void> {
  await prisma.soal.delete({ where: { id } });
}

/**
 * Isi database dengan satu paket contoh (18 soal dari BANK_SOAL) bila masih
 * kosong. Idempotent — hanya berjalan saat belum ada soal sama sekali.
 */
export async function seedSoalIfEmpty(): Promise<number> {
  const existing = await prisma.soal.count();
  if (existing > 0) return existing;

  const paket = await prisma.paket.create({
    data: { nama: "Paket Contoh", deskripsi: "Contoh soal bawaan — bisa diedit atau dihapus.", urutan: 0 },
  });

  let n = 0;
  for (const s of BANK_SOAL) {
    await prisma.soal.create({
      data: {
        nomor: ++n,
        subtes: s.subtes,
        materi: s.materi,
        pertanyaan: s.pertanyaan,
        opsi: JSON.stringify(s.opsi),
        kunci: s.kunci ?? null,
        pembahasan: s.pembahasan,
        tingkat: s.tingkat,
        paketId: paket.id,
      },
    });
  }
  return n;
}
