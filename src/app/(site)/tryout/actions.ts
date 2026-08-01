"use server";

import { revalidatePath } from "next/cache";
import { currentSession } from "@/lib/session-server";
import { buatTransaksi } from "@/lib/transaksi";
import { getPaketRingkas } from "@/lib/paket";

/** Peserta mengajukan pembelian sebuah paket (membuat transaksi pending). */
export async function beliPaketAction(
  paketId: string,
): Promise<{ ok: boolean; status?: "baru" | "sudah_pending" | "sudah_punya"; error?: string }> {
  const s = await currentSession();
  if (!s?.sub) return { ok: false, error: "Silakan login terlebih dahulu." };

  const paket = await getPaketRingkas(paketId);
  if (!paket) return { ok: false, error: "Paket tidak ditemukan." };
  if (paket.harga <= 0) return { ok: false, error: "Paket ini gratis." };

  const res = await buatTransaksi(s.sub, paketId, paket.nama, paket.harga);
  revalidatePath("/tryout");
  revalidatePath("/admin");
  return { ok: true, status: res.status };
}
