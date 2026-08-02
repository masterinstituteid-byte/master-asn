// ============================================================
// Struktur & aturan SKD CPNS (mengikuti pola CAT BKN)
// ============================================================

export type Subtes = "TWK" | "TIU" | "TKP";

export interface SubtesConfig {
  key: Subtes;
  nama: string;
  deskripsi: string;
  jumlahSoal: number;
  passingGrade: number;
  nilaiMaks: number;
  /** TWK & TIU: benar bernilai 5, salah/kosong 0. TKP: setiap opsi bernilai 1–5. */
  skema: "benar-salah" | "poin-1-5";
  accent: "brand" | "gold" | "success";
}

export const SUBTES: Record<Subtes, SubtesConfig> = {
  TWK: {
    key: "TWK",
    nama: "Wawasan Kebangsaan",
    deskripsi:
      "Nasionalisme, integritas, bela negara, pilar negara, dan bahasa Indonesia.",
    jumlahSoal: 30,
    passingGrade: 65,
    nilaiMaks: 150,
    skema: "benar-salah",
    accent: "brand",
  },
  TIU: {
    key: "TIU",
    nama: "Intelegensia Umum",
    deskripsi:
      "Kemampuan verbal, numerik, dan figural — analogi, silogisme, deret, dan aritmatika.",
    jumlahSoal: 35,
    passingGrade: 80,
    nilaiMaks: 175,
    skema: "benar-salah",
    accent: "success",
  },
  TKP: {
    key: "TKP",
    nama: "Karakteristik Pribadi",
    deskripsi:
      "Pelayanan publik, jejaring kerja, sosial budaya, teknologi informasi, dan profesionalisme.",
    jumlahSoal: 45,
    passingGrade: 166,
    nilaiMaks: 225,
    skema: "poin-1-5",
    accent: "gold",
  },
};

export const SUBTES_ORDER: Subtes[] = ["TWK", "TIU", "TKP"];

export const SKD_TOTAL_SOAL = 110;
export const SKD_DURASI_MENIT = 100;
export const SKD_NILAI_MAKS = 550;

/** Nilai kumulatif per opsi jawaban. */
export interface Opsi {
  id: string; // "A" | "B" | ...
  teks: string;
  /** TKP: poin 1–5. Untuk TWK/TIU dikosongkan (pakai `benar`). */
  poin?: number;
  /** id Gambar untuk pilihan bergambar (soal figural). */
  gambar?: string;
}

export interface Soal {
  id: string;
  subtes: Subtes;
  materi: string;
  pertanyaan: string;
  opsi: Opsi[];
  /** TWK & TIU: id opsi yang benar. */
  kunci?: string;
  pembahasan: string;
  tingkat: "Mudah" | "Sedang" | "HOTS";
  /** id Gambar untuk pertanyaan (soal figural). */
  gambar?: string | null;
  /** Paket pemilik soal (null untuk soal lepas / contoh statis). */
  paketId?: string | null;
}

// ------------------------------------------------------------
// Utilitas skoring
// ------------------------------------------------------------

/** Skor satu soal berdasarkan jawaban terpilih. */
export function skorSoal(soal: Soal, jawabanId: string | null): number {
  if (!jawabanId) return 0;
  if (soal.subtes === "TKP") {
    const opsi = soal.opsi.find((o) => o.id === jawabanId);
    return opsi?.poin ?? 0;
  }
  return jawabanId === soal.kunci ? 5 : 0;
}

export interface HasilSubtes {
  subtes: Subtes;
  nilai: number;
  nilaiMaks: number;
  passingGrade: number;
  lulus: boolean;
  benar: number;
  total: number;
}

export interface HasilTryout {
  perSubtes: HasilSubtes[];
  nilaiTotal: number;
  nilaiMaksTotal: number;
  lulusSemua: boolean;
  jawaban: Record<string, string | null>;
  waktuTerpakaiDetik: number;
  selesaiPada: number; // epoch ms
}

/**
 * Hasil yang disimpan di localStorage setelah simulasi — memuat snapshot soal
 * yang benar-benar dikerjakan, agar halaman /hasil menampilkan pembahasan yang
 * cocok meski bank soal di database berubah setelahnya.
 */
export interface HasilTersimpan extends HasilTryout {
  soal: Soal[];
  paketId?: string | null;
  paketNama?: string;
}

export function hitungHasil(
  soalList: Soal[],
  jawaban: Record<string, string | null>,
  waktuTerpakaiDetik: number,
): HasilTryout {
  const perSubtes: HasilSubtes[] = SUBTES_ORDER.map((key) => {
    const cfg = SUBTES[key];
    const soalSubtes = soalList.filter((s) => s.subtes === key);
    let nilai = 0;
    let benar = 0;
    for (const s of soalSubtes) {
      const j = jawaban[s.id] ?? null;
      const skor = skorSoal(s, j);
      nilai += skor;
      if (s.subtes === "TKP" ? skor >= 4 : skor === 5) benar += 1;
    }
    return {
      subtes: key,
      nilai,
      nilaiMaks: cfg.nilaiMaks,
      passingGrade: cfg.passingGrade,
      lulus: nilai >= cfg.passingGrade,
      benar,
      total: soalSubtes.length,
    };
  });

  const nilaiTotal = perSubtes.reduce((a, b) => a + b.nilai, 0);
  const nilaiMaksTotal = perSubtes.reduce((a, b) => a + b.nilaiMaks, 0);

  return {
    perSubtes,
    nilaiTotal,
    nilaiMaksTotal,
    lulusSemua: perSubtes.every((s) => s.lulus),
    jawaban,
    waktuTerpakaiDetik,
    selesaiPada: Date.now(),
  };
}

export function formatWaktu(totalDetik: number): string {
  const j = Math.floor(totalDetik / 3600);
  const m = Math.floor((totalDetik % 3600) / 60);
  const d = totalDetik % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return j > 0 ? `${pad(j)}:${pad(m)}:${pad(d)}` : `${pad(m)}:${pad(d)}`;
}

export const HASIL_STORAGE_KEY = "nusantara-cat:hasil-terakhir";
