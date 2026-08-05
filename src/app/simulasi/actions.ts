"use server";

import { currentSession } from "@/lib/session-server";
import { simpanHasil, getPeringkat, type Peringkat } from "@/lib/hasil";
import type { HasilSubtes } from "@/lib/skd";

export interface HasilPayload {
  paketId: string | null;
  paketNama: string;
  nilaiTotal: number;
  nilaiMaksTotal: number;
  lulusSemua: boolean;
  perSubtes: HasilSubtes[];
  jumlahSoal: number;
  waktuTerpakaiDetik: number;
  /** Snapshot lengkap (JSON HasilTersimpan) agar pembahasan bisa dibuka lagi di Riwayat. */
  review?: string | null;
}

/**
 * Simpan hasil ujian ke database, tertaut ke akun pengguna yang sedang login.
 * Bila sesi tidak valid, dilewati diam-diam (hasil tetap tersimpan di localStorage
 * peserta melalui halaman /hasil).
 */
export async function simpanHasilAction(payload: HasilPayload): Promise<boolean> {
  const s = await currentSession();
  if (!s?.sub) return false;
  try {
    await simpanHasil({ userId: s.sub, ...payload });
    return true;
  } catch {
    return false;
  }
}

/** Peringkat/persentil sebuah nilai pada satu paket (untuk halaman hasil). */
export async function getPeringkatAction(
  paketId: string,
  nilaiTotal: number,
): Promise<Peringkat | null> {
  const s = await currentSession();
  if (!s?.sub) return null;
  try {
    return await getPeringkat(paketId, nilaiTotal);
  } catch {
    return null;
  }
}
