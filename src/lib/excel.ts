import "server-only";
import ExcelJS from "exceljs";
import { SUBTES_ORDER, SUBTES, formatWaktu, type Subtes, type Opsi } from "@/lib/skd";
import type { SoalInput } from "@/lib/soal";
import type { BarisRanking } from "@/lib/ranking";

const HURUF = ["A", "B", "C", "D", "E"] as const;
const SUBTES_VALID: Subtes[] = ["TWK", "TIU", "TKP"];
const TINGKAT_VALID = ["Mudah", "Sedang", "HOTS"] as const;

// Urutan & nama kolom pada sheet "Soal".
const KOLOM = [
  "subtes",
  "materi",
  "tingkat",
  "pertanyaan",
  "opsiA",
  "opsiB",
  "opsiC",
  "opsiD",
  "opsiE",
  "kunci",
  "poinA",
  "poinB",
  "poinC",
  "poinD",
  "poinE",
  "pembahasan",
] as const;

const SHEET_SOAL = "Soal";

// ---------------------------------------------------------------------------
// Template
// ---------------------------------------------------------------------------

/** Bangun file Excel template kosong (+ sheet petunjuk & contoh). */
export async function buatTemplate(): Promise<Uint8Array> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "MASTER ASN";

  // --- Sheet "Soal": tempat input ---
  const ws = wb.addWorksheet(SHEET_SOAL, {
    views: [{ state: "frozen", ySplit: 1 }],
  });
  ws.columns = [
    { header: "subtes", key: "subtes", width: 10 },
    { header: "materi", key: "materi", width: 18 },
    { header: "tingkat", key: "tingkat", width: 12 },
    { header: "pertanyaan", key: "pertanyaan", width: 50 },
    { header: "opsiA", key: "opsiA", width: 26 },
    { header: "opsiB", key: "opsiB", width: 26 },
    { header: "opsiC", key: "opsiC", width: 26 },
    { header: "opsiD", key: "opsiD", width: 26 },
    { header: "opsiE", key: "opsiE", width: 26 },
    { header: "kunci", key: "kunci", width: 8 },
    { header: "poinA", key: "poinA", width: 8 },
    { header: "poinB", key: "poinB", width: 8 },
    { header: "poinC", key: "poinC", width: 8 },
    { header: "poinD", key: "poinD", width: 8 },
    { header: "poinE", key: "poinE", width: 8 },
    { header: "pembahasan", key: "pembahasan", width: 50 },
  ];
  const head = ws.getRow(1);
  head.font = { bold: true, color: { argb: "FFFFFFFF" } };
  head.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2947C9" } };
  head.alignment = { vertical: "middle" };
  head.height = 22;

  // --- Sheet "Petunjuk": panduan + contoh terisi ---
  const wp = wb.addWorksheet("Petunjuk");
  wp.getColumn(1).width = 100;
  const petunjuk = [
    "CARA MENGISI TEMPLATE SOAL — MASTER ASN",
    "",
    "1. Isi soal pada sheet \"Soal\" (satu baris = satu soal). Jangan mengubah baris judul kolom.",
    "2. Kolom subtes: isi TWK, TIU, atau TKP (huruf besar).",
    "3. Kolom tingkat: isi Mudah, Sedang, atau HOTS.",
    "4. Kolom opsiA–opsiE: teks pilihan jawaban. Minimal 2 opsi terisi.",
    "",
    "UNTUK TWK & TIU (satu jawaban benar):",
    "   • Isi kolom kunci dengan huruf opsi yang benar (A/B/C/D/E).",
    "   • Kosongkan kolom poinA–poinE.",
    "",
    "UNTUK TKP (setiap opsi punya nilai):",
    "   • Isi poinA–poinE dengan angka 1 sampai 5 sesuai bobot tiap opsi.",
    "   • Kosongkan kolom kunci.",
    "",
    "5. Kolom pembahasan boleh dikosongkan, tapi disarankan diisi.",
    "6. Satu paket ideal berisi 110 soal: 30 TWK, 35 TIU, 45 TKP.",
    "7. Simpan file, lalu unggah di panel admin → paket terkait → Unggah Excel.",
    "",
    "Lihat contoh baris terisi di sheet \"Contoh\".",
  ];
  petunjuk.forEach((t, i) => {
    const cell = wp.getCell(i + 1, 1);
    cell.value = t;
    if (i === 0) cell.font = { bold: true, size: 14, color: { argb: "FF1B2559" } };
    if (/^(UNTUK|CARA)/.test(t)) cell.font = { bold: true };
    cell.alignment = { wrapText: true, vertical: "top" };
  });

  // --- Sheet "Contoh": dua baris contoh (TWK + TKP) ---
  const wc = wb.addWorksheet("Contoh");
  wc.columns = ws.columns.map((c) => ({ ...c }));
  const hc = wc.getRow(1);
  hc.font = { bold: true, color: { argb: "FFFFFFFF" } };
  hc.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF64748B" } };
  wc.addRow({
    subtes: "TWK",
    materi: "Pancasila",
    tingkat: "HOTS",
    pertanyaan: "Musyawarah mufakat mencerminkan pengamalan sila ke-…",
    opsiA: "Sila ke-1",
    opsiB: "Sila ke-2",
    opsiC: "Sila ke-3",
    opsiD: "Sila ke-4",
    opsiE: "Sila ke-5",
    kunci: "D",
    pembahasan: "Musyawarah untuk mufakat adalah pengamalan sila ke-4.",
  });
  wc.addRow({
    subtes: "TKP",
    materi: "Pelayanan Publik",
    tingkat: "Sedang",
    pertanyaan: "Warga datang dengan emosi karena dokumennya belum selesai. Sikap Anda…",
    opsiA: "Menjelaskan dengan tenang dan memandu melengkapi berkas",
    opsiB: "Meminta ia menunggu antrean seperti biasa",
    opsiC: "Menegur balik karena berkasnya kurang",
    opsiD: "Memanggil atasan untuk menanganinya",
    opsiE: "Membiarkannya tenang dulu",
    poinA: 5,
    poinB: 3,
    poinC: 1,
    poinD: 4,
    poinE: 2,
    pembahasan: "Orientasi pelayanan terbaik: tenang, empatik, dan solutif.",
  });

  const buf = await wb.xlsx.writeBuffer();
  return new Uint8Array(buf as ArrayBuffer);
}

// ---------------------------------------------------------------------------
// Parsing unggahan
// ---------------------------------------------------------------------------

export interface HasilParse {
  soal: SoalInput[];
  errors: string[];
  ringkas: Record<Subtes, number>;
}

function teks(v: ExcelJS.CellValue): string {
  if (v == null) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "number" || typeof v === "boolean") return String(v).trim();
  if (typeof v === "object") {
    const o = v as { richText?: { text: string }[]; text?: string; result?: unknown };
    if (Array.isArray(o.richText)) return o.richText.map((r) => r.text).join("").trim();
    if (typeof o.text === "string") return o.text.trim();
    if (o.result != null) return String(o.result).trim();
  }
  return "";
}

/** Parse buffer Excel → daftar SoalInput + daftar error per baris. */
export async function parseSoalExcel(data: ArrayBuffer): Promise<HasilParse> {
  const wb = new ExcelJS.Workbook();
  // @ts-expect-error selisih tipe Buffer @types/node 24 vs exceljs; runtime aman.
  await wb.xlsx.load(Buffer.from(data));
  const ws = wb.getWorksheet(SHEET_SOAL) ?? wb.worksheets[0];

  const errors: string[] = [];
  const soal: SoalInput[] = [];
  const ringkas: Record<Subtes, number> = { TWK: 0, TIU: 0, TKP: 0 };

  if (!ws) {
    return { soal, errors: ["File Excel kosong atau tidak terbaca."], ringkas };
  }

  // Petakan nama kolom (baris 1) → indeks, agar tahan bila urutan sedikit berubah.
  const idx: Record<string, number> = {};
  const headRow = ws.getRow(1);
  headRow.eachCell((cell, col) => {
    const key = teks(cell.value).toLowerCase();
    if (key) idx[key] = col;
  });
  const kolomAda = KOLOM.every((k) => idx[k.toLowerCase()]);
  if (!kolomAda) {
    return {
      soal,
      errors: [
        "Kolom template tidak lengkap/berubah. Gunakan template resmi (kolom: " +
          KOLOM.join(", ") + ").",
      ],
      ringkas,
    };
  }

  const get = (row: ExcelJS.Row, key: string) => teks(row.getCell(idx[key.toLowerCase()]).value);

  const lastRow = ws.rowCount;
  for (let r = 2; r <= lastRow; r++) {
    const row = ws.getRow(r);
    const subtesRaw = get(row, "subtes").toUpperCase();
    const pertanyaan = get(row, "pertanyaan");

    // Lewati baris yang benar-benar kosong.
    if (!subtesRaw && !pertanyaan && HURUF.every((h) => !get(row, `opsi${h}`))) continue;

    const nomorBaris = `Baris ${r}`;
    if (!SUBTES_VALID.includes(subtesRaw as Subtes)) {
      errors.push(`${nomorBaris}: subtes "${subtesRaw || "(kosong)"}" tidak valid (harus TWK/TIU/TKP).`);
      continue;
    }
    const subtes = subtesRaw as Subtes;
    if (!pertanyaan) {
      errors.push(`${nomorBaris}: pertanyaan kosong.`);
      continue;
    }

    const isTKP = subtes === "TKP";
    const opsi: Opsi[] = [];
    let opsiError = false;
    for (const h of HURUF) {
      const t = get(row, `opsi${h}`);
      if (!t) continue;
      if (isTKP) {
        const poin = Number(get(row, `poin${h}`));
        if (!Number.isInteger(poin) || poin < 1 || poin > 5) {
          errors.push(`${nomorBaris}: poin${h} harus angka 1–5 (untuk soal TKP).`);
          opsiError = true;
          break;
        }
        opsi.push({ id: h, teks: t, poin });
      } else {
        opsi.push({ id: h, teks: t });
      }
    }
    if (opsiError) continue;
    if (opsi.length < 2) {
      errors.push(`${nomorBaris}: minimal 2 opsi jawaban harus terisi.`);
      continue;
    }

    let kunci: string | null = null;
    if (!isTKP) {
      const k = get(row, "kunci").toUpperCase();
      if (!opsi.some((o) => o.id === k)) {
        errors.push(`${nomorBaris}: kunci "${k || "(kosong)"}" harus salah satu opsi terisi (A–E).`);
        continue;
      }
      kunci = k;
    }

    const tingkatRaw = get(row, "tingkat");
    const tingkat =
      (TINGKAT_VALID.find((t) => t.toLowerCase() === tingkatRaw.toLowerCase()) as
        | SoalInput["tingkat"]
        | undefined) ?? "HOTS";

    soal.push({
      subtes,
      materi: get(row, "materi") || "Umum",
      tingkat,
      pertanyaan,
      opsi,
      kunci,
      pembahasan: get(row, "pembahasan"),
    });
    ringkas[subtes] += 1;
  }

  return { soal, errors, ringkas };
}

// ---------------------------------------------------------------------------
// Ekspor RANKING hasil ujian per paket
// ---------------------------------------------------------------------------

/** Bangun file Excel berisi ranking hasil satu paket (untuk diunduh admin). */
export async function buatRankingExcel(
  ranking: BarisRanking[],
  paketNama: string,
): Promise<Uint8Array> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "MASTER ASN";

  const ws = wb.addWorksheet("Ranking", { views: [{ state: "frozen", ySplit: 1 }] });
  ws.columns = [
    { header: "Peringkat", key: "peringkat", width: 10 },
    { header: "Nama", key: "nama", width: 24 },
    { header: "Email", key: "email", width: 28 },
    { header: "Nilai Total", key: "nilai", width: 12 },
    { header: "Nilai Maks", key: "maks", width: 12 },
    { header: "Persen", key: "persen", width: 9 },
    ...SUBTES_ORDER.map((s) => ({ header: s, key: s, width: 8 })),
    { header: "Status", key: "status", width: 10 },
    { header: "Jumlah Soal", key: "jumlahSoal", width: 12 },
    { header: "Waktu", key: "waktu", width: 12 },
    { header: "Tanggal", key: "tanggal", width: 20 },
  ];
  ws.getRow(1).font = { bold: true };

  for (const r of ranking) {
    const perSub: Record<string, number> = {};
    for (const s of SUBTES_ORDER) {
      perSub[s] = r.perSubtes.find((x) => x.subtes === s)?.nilai ?? 0;
    }
    ws.addRow({
      peringkat: r.peringkat,
      nama: r.userNama,
      email: r.userEmail,
      nilai: r.nilaiTotal,
      maks: r.nilaiMaksTotal,
      persen:
        r.nilaiMaksTotal > 0 ? `${Math.round((r.nilaiTotal / r.nilaiMaksTotal) * 100)}%` : "—",
      ...perSub,
      status: r.lulusSemua ? "Lulus" : "Belum",
      jumlahSoal: r.jumlahSoal,
      waktu: formatWaktu(r.waktuTerpakaiDetik),
      tanggal: new Date(r.createdAt).toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  }

  // Judul info di sheet kedua (paket + tgl ekspor + passing grade acuan).
  const info = wb.addWorksheet("Info");
  info.columns = [
    { header: "Keterangan", key: "k", width: 24 },
    { header: "Nilai", key: "v", width: 40 },
  ];
  info.getRow(1).font = { bold: true };
  info.addRow({ k: "Paket", v: paketNama });
  info.addRow({ k: "Jumlah peserta", v: ranking.length });
  info.addRow({ k: "Diekspor pada", v: new Date().toLocaleString("id-ID") });
  for (const s of SUBTES_ORDER) {
    info.addRow({ k: `Passing grade ${s}`, v: SUBTES[s].passingGrade });
  }

  const buf = await wb.xlsx.writeBuffer();
  return new Uint8Array(buf);
}
