"use server";

import { revalidatePath } from "next/cache";
import { currentSession } from "@/lib/session-server";
import { isAdminEmail } from "@/lib/session";
import {
  createSoal,
  updateSoal,
  deleteSoal,
  seedSoalIfEmpty,
  importSoalToPaket,
  type SoalInput,
} from "@/lib/soal";
import {
  createPaket,
  updatePaket,
  deletePaket,
} from "@/lib/paket";
import { parseSoalExcel, type HasilParse } from "@/lib/excel";
import { simpanGambar, MIME_GAMBAR } from "@/lib/gambar";
import { createModul, deleteModul } from "@/lib/modul";
import { setStatusTransaksi, type StatusTransaksi } from "@/lib/transaksi";
import { setInfoPembayaran, type InfoPembayaran } from "@/lib/pengaturan";
import {
  createTestimoni,
  updateTestimoni,
  deleteTestimoni,
  type TestimoniInput,
} from "@/lib/testimoni";
import {
  createPaketHarga,
  updatePaketHarga,
  deletePaketHarga,
  type PaketHargaInput,
} from "@/lib/paket-harga";

async function assertAdmin() {
  const s = await currentSession();
  if (!s || !isAdminEmail(s.email)) {
    throw new Error("Tidak diizinkan.");
  }
}

function revalidate() {
  revalidatePath("/admin");
  revalidatePath("/bank-soal");
  revalidatePath("/tryout");
  revalidatePath("/belajar");
  revalidatePath("/"); // landing (testimoni & harga paket)
}

// ---- Soal ----
export async function createSoalAction(input: SoalInput) {
  await assertAdmin();
  await createSoal(input);
  revalidate();
}

export async function updateSoalAction(id: string, input: SoalInput) {
  await assertAdmin();
  await updateSoal(id, input);
  revalidate();
}

export async function deleteSoalAction(id: string) {
  await assertAdmin();
  await deleteSoal(id);
  revalidate();
}

export async function seedAction(): Promise<number> {
  await assertAdmin();
  const n = await seedSoalIfEmpty();
  revalidate();
  return n;
}

// ---- Paket ----
export async function createPaketAction(nama: string, deskripsi: string): Promise<string> {
  await assertAdmin();
  const id = await createPaket(nama, deskripsi);
  revalidate();
  return id;
}

export async function updatePaketAction(
  id: string,
  data: {
    nama?: string;
    deskripsi?: string;
    aktif?: boolean;
    harga?: number;
    tampilLanding?: boolean;
    populer?: boolean;
  },
) {
  await assertAdmin();
  await updatePaket(id, data);
  revalidate();
}

export async function deletePaketAction(id: string) {
  await assertAdmin();
  await deletePaket(id);
  revalidate();
}

// ---- Impor Excel ----
/** Parse file yang diunggah → pratinjau (soal + error), tanpa menyimpan. */
export async function parseExcelAction(formData: FormData): Promise<HasilParse> {
  await assertAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { soal: [], errors: ["Tidak ada file yang diunggah."], ringkas: { TWK: 0, TIU: 0, TKP: 0 } };
  }
  return parseSoalExcel(await file.arrayBuffer());
}

/** Simpan soal hasil parse ke paket. */
export async function importSoalAction(
  paketId: string,
  soal: SoalInput[],
  mode: "ganti" | "tambah",
): Promise<number> {
  await assertAdmin();
  const n = await importSoalToPaket(paketId, soal, mode);
  revalidate();
  return n;
}

// ---- Gambar soal (figural) ----
export async function uploadGambarAction(
  formData: FormData,
): Promise<{ ok: boolean; id?: string; error?: string }> {
  await assertAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "Tidak ada gambar." };
  if (!MIME_GAMBAR.includes(file.type)) {
    return { ok: false, error: "Format harus PNG, JPG, WebP, atau GIF." };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { ok: false, error: "Ukuran gambar maksimal 5 MB." };
  }
  const id = await simpanGambar(await file.arrayBuffer(), file.type);
  return { ok: true, id };
}

// ---- Modul / Materi ----
export async function createModulAction(
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  await assertAdmin();
  const file = formData.get("file");
  const judul = String(formData.get("judul") ?? "").trim();
  const deskripsi = String(formData.get("deskripsi") ?? "");
  const kategori = String(formData.get("kategori") ?? "Umum");

  if (!judul) return { ok: false, error: "Judul modul wajib diisi." };
  if (!(file instanceof File)) return { ok: false, error: "File PDF belum dipilih." };
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return { ok: false, error: "File harus berformat PDF." };
  }
  if (file.size > 25 * 1024 * 1024) {
    return { ok: false, error: "Ukuran file maksimal 25 MB." };
  }
  const bytes = await file.arrayBuffer();
  // Validasi magic bytes "%PDF"
  const head = new Uint8Array(bytes.slice(0, 4));
  if (!(head[0] === 0x25 && head[1] === 0x50 && head[2] === 0x44 && head[3] === 0x46)) {
    return { ok: false, error: "Berkas bukan PDF yang valid." };
  }
  await createModul({ judul, deskripsi, kategori, namaFile: file.name, bytes });
  revalidate();
  return { ok: true };
}

export async function deleteModulAction(id: string) {
  await assertAdmin();
  await deleteModul(id);
  revalidate();
}

// ---- Transaksi / Pembayaran ----
export async function setStatusTransaksiAction(id: string, status: StatusTransaksi) {
  await assertAdmin();
  await setStatusTransaksi(id, status);
  revalidate();
}

export async function setInfoPembayaranAction(info: InfoPembayaran) {
  await assertAdmin();
  await setInfoPembayaran(info);
  revalidate();
}

// ---- Testimoni ----
export async function createTestimoniAction(input: TestimoniInput) {
  await assertAdmin();
  await createTestimoni(input);
  revalidate();
}

export async function updateTestimoniAction(id: string, input: TestimoniInput) {
  await assertAdmin();
  await updateTestimoni(id, input);
  revalidate();
}

export async function deleteTestimoniAction(id: string) {
  await assertAdmin();
  await deleteTestimoni(id);
  revalidate();
}

// ---- Paket Harga (paket jual) ----
export async function createPaketHargaAction(input: PaketHargaInput) {
  await assertAdmin();
  await createPaketHarga(input);
  revalidate();
}

export async function updatePaketHargaAction(id: string, input: PaketHargaInput) {
  await assertAdmin();
  await updatePaketHarga(id, input);
  revalidate();
}

export async function deletePaketHargaAction(id: string) {
  await assertAdmin();
  await deletePaketHarga(id);
  revalidate();
}
