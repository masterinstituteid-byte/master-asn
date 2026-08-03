import "server-only";
import { prisma } from "@/lib/db";
import { SUBTES, SUBTES_ORDER, type HasilSubtes, type Subtes } from "@/lib/skd";

export interface SimpanHasilInput {
  userId: string;
  paketId: string | null;
  paketNama: string;
  nilaiTotal: number;
  nilaiMaksTotal: number;
  lulusSemua: boolean;
  perSubtes: HasilSubtes[];
  jumlahSoal: number;
  waktuTerpakaiDetik: number;
}

/** Simpan satu hasil ujian yang tertaut ke akun pengguna. */
export async function simpanHasil(input: SimpanHasilInput): Promise<void> {
  await prisma.hasilUjian.create({
    data: {
      userId: input.userId,
      paketId: input.paketId,
      paketNama: input.paketNama,
      nilaiTotal: input.nilaiTotal,
      nilaiMaksTotal: input.nilaiMaksTotal,
      lulusSemua: input.lulusSemua,
      rincian: JSON.stringify(input.perSubtes),
      jumlahSoal: input.jumlahSoal,
      waktuTerpakaiDetik: input.waktuTerpakaiDetik,
    },
  });
}

export interface HasilRingkas {
  id: string;
  userId: string;
  userNama: string;
  userEmail: string;
  paketId: string | null;
  paketNama: string;
  nilaiTotal: number;
  nilaiMaksTotal: number;
  lulusSemua: boolean;
  perSubtes: HasilSubtes[];
  jumlahSoal: number;
  waktuTerpakaiDetik: number;
  createdAt: string;
}

/** Semua hasil ujian (terbaru dulu), lengkap dengan info pengguna. */
export async function getAllHasil(): Promise<HasilRingkas[]> {
  const rows = await prisma.hasilUjian.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { nama: true, email: true } } },
  });
  return rows.map((r) => ({
    id: r.id,
    userId: r.userId,
    userNama: r.user?.nama ?? "—",
    userEmail: r.user?.email ?? "—",
    paketId: r.paketId,
    paketNama: r.paketNama,
    nilaiTotal: r.nilaiTotal,
    nilaiMaksTotal: r.nilaiMaksTotal,
    lulusSemua: r.lulusSemua,
    perSubtes: JSON.parse(r.rincian) as HasilSubtes[],
    jumlahSoal: r.jumlahSoal,
    waktuTerpakaiDetik: r.waktuTerpakaiDetik,
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function countHasil(): Promise<number> {
  return prisma.hasilUjian.count();
}

/** Hapus satu hasil ujian. */
export async function deleteHasil(id: string): Promise<void> {
  await prisma.hasilUjian.delete({ where: { id } });
}

// =========================================================
// Analitik pengguna & peringkat
// =========================================================

export interface RiwayatItem {
  id: string;
  paketId: string | null;
  paketNama: string;
  nilaiTotal: number;
  nilaiMaksTotal: number;
  lulusSemua: boolean;
  createdAt: string;
}

export interface SubtesRata {
  subtes: Subtes;
  nama: string;
  rataNilai: number;
  nilaiMaks: number;
  passingGrade: number;
  lulus: boolean; // rata-rata >= passing grade
}

export interface StatistikUser {
  totalUjian: number;
  nilaiTertinggi: number;
  rataRata: number;
  jumlahLulus: number;
  nilaiMaksTotal: number;
  riwayat: RiwayatItem[]; // kronologis (lama → baru)
  perSubtes: SubtesRata[];
  /** subtes dengan capaian relatif terendah terhadap passing grade. */
  fokus: SubtesRata[];
}

const NILAI_MAKS_TOTAL = SUBTES_ORDER.reduce((a, k) => a + SUBTES[k].nilaiMaks, 0);

export async function getStatistikUser(userId: string): Promise<StatistikUser> {
  const rows = await prisma.hasilUjian.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  const riwayat: RiwayatItem[] = rows.map((r) => ({
    id: r.id,
    paketId: r.paketId,
    paketNama: r.paketNama,
    nilaiTotal: r.nilaiTotal,
    nilaiMaksTotal: r.nilaiMaksTotal,
    lulusSemua: r.lulusSemua,
    createdAt: r.createdAt.toISOString(),
  }));

  const total = rows.length;
  const nilaiTertinggi = rows.reduce((m, r) => Math.max(m, r.nilaiTotal), 0);
  const rataRata = total ? Math.round(rows.reduce((a, r) => a + r.nilaiTotal, 0) / total) : 0;
  const jumlahLulus = rows.filter((r) => r.lulusSemua).length;

  // Rata-rata nilai per subtes dari seluruh percobaan.
  const perSubtes: SubtesRata[] = SUBTES_ORDER.map((key) => {
    const cfg = SUBTES[key];
    let jumlah = 0;
    let n = 0;
    for (const r of rows) {
      try {
        const rincian = JSON.parse(r.rincian) as HasilSubtes[];
        const s = rincian.find((x) => x.subtes === key);
        if (s) {
          jumlah += s.nilai;
          n += 1;
        }
      } catch {
        /* abaikan baris rusak */
      }
    }
    const rataNilai = n ? Math.round(jumlah / n) : 0;
    return {
      subtes: key,
      nama: cfg.nama,
      rataNilai,
      nilaiMaks: cfg.nilaiMaks,
      passingGrade: cfg.passingGrade,
      lulus: rataNilai >= cfg.passingGrade,
    };
  });

  // Fokus = subtes yang rata-ratanya di bawah passing grade, diurut dari yang
  // rasionya paling rendah (paling lemah).
  const fokus = perSubtes
    .filter((s) => !s.lulus)
    .sort((a, b) => a.rataNilai / a.passingGrade - b.rataNilai / b.passingGrade);

  return {
    totalUjian: total,
    nilaiTertinggi,
    rataRata,
    jumlahLulus,
    nilaiMaksTotal: NILAI_MAKS_TOTAL,
    riwayat,
    perSubtes,
    fokus,
  };
}

export interface Peringkat {
  peringkat: number;
  totalPeserta: number;
  persentil: number; // % peserta yang nilainya di bawah nilai ini
}

/** Peringkat sebuah nilai di antara semua percobaan pada satu paket. */
export async function getPeringkat(
  paketId: string,
  nilaiTotal: number,
): Promise<Peringkat> {
  const [totalPeserta, lebihTinggi, lebihRendah] = await Promise.all([
    prisma.hasilUjian.count({ where: { paketId } }),
    prisma.hasilUjian.count({ where: { paketId, nilaiTotal: { gt: nilaiTotal } } }),
    prisma.hasilUjian.count({ where: { paketId, nilaiTotal: { lt: nilaiTotal } } }),
  ]);
  return {
    peringkat: lebihTinggi + 1,
    totalPeserta,
    persentil: totalPeserta > 0 ? Math.round((lebihRendah / totalPeserta) * 100) : 0,
  };
}
