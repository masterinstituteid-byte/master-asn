// ============================================================
// Perhitungan RANKING hasil ujian per paket.
// File ini murni (tanpa server-only) agar bisa dipakai baik di
// komponen admin (klien) maupun di route ekspor Excel (server).
// ============================================================
import type { HasilRingkas } from "@/lib/hasil";

export type ModeRanking = "terbaik" | "semua";

export interface BarisRanking extends HasilRingkas {
  peringkat: number;
}

/** Kunci paket yang stabil (paketId bila ada, jika tidak pakai nama). */
export function kunciPaket(h: Pick<HasilRingkas, "paketId" | "paketNama">): string {
  return h.paketId ?? `nama:${h.paketNama}`;
}

/** Daftar paket unik (punya hasil), untuk dropdown pemilih. */
export function daftarPaketDariHasil(
  hasil: HasilRingkas[],
): { key: string; paketId: string | null; paketNama: string; jumlah: number }[] {
  const peta = new Map<string, { paketId: string | null; paketNama: string; jumlah: number }>();
  for (const h of hasil) {
    const k = kunciPaket(h);
    const ada = peta.get(k);
    if (ada) ada.jumlah += 1;
    else peta.set(k, { paketId: h.paketId, paketNama: h.paketNama, jumlah: 1 });
  }
  return [...peta.entries()]
    .map(([key, v]) => ({ key, ...v }))
    .sort((a, b) => b.jumlah - a.jumlah || a.paketNama.localeCompare(b.paketNama));
}

/**
 * Bangun ranking satu paket, diurut nilai tertinggi lebih dulu
 * (seri → waktu lebih cepat → lebih awal mengerjakan).
 * mode "terbaik": satu baris per peserta (percobaan nilai tertinggi).
 * mode "semua": semua percobaan ditampilkan.
 */
export function buatRanking(
  hasil: HasilRingkas[],
  paketKey: string,
  mode: ModeRanking = "terbaik",
): BarisRanking[] {
  let rows = hasil.filter((h) => kunciPaket(h) === paketKey);

  if (mode === "terbaik") {
    const terbaik = new Map<string, HasilRingkas>();
    for (const h of rows) {
      const ada = terbaik.get(h.userId);
      if (!ada || lebihUnggul(h, ada)) terbaik.set(h.userId, h);
    }
    rows = [...terbaik.values()];
  }

  rows = [...rows].sort((a, b) =>
    b.nilaiTotal - a.nilaiTotal ||
    a.waktuTerpakaiDetik - b.waktuTerpakaiDetik ||
    a.createdAt.localeCompare(b.createdAt),
  );

  return rows.map((h, i) => ({ ...h, peringkat: i + 1 }));
}

/** Apakah a lebih unggul dari b (nilai lebih tinggi; seri → waktu lebih cepat). */
function lebihUnggul(a: HasilRingkas, b: HasilRingkas): boolean {
  if (a.nilaiTotal !== b.nilaiTotal) return a.nilaiTotal > b.nilaiTotal;
  return a.waktuTerpakaiDetik < b.waktuTerpakaiDetik;
}
