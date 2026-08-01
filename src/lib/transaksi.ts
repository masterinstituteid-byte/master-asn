import "server-only";
import { prisma } from "@/lib/db";

export type StatusTransaksi = "pending" | "lunas" | "ditolak";

export interface TransaksiRingkas {
  id: string;
  userId: string;
  userNama: string;
  userEmail: string;
  paketId: string | null;
  paketNama: string;
  jumlah: number;
  status: StatusTransaksi;
  catatan: string;
  createdAt: string;
  confirmedAt: string | null;
}

export async function getAllTransaksi(): Promise<TransaksiRingkas[]> {
  const rows = await prisma.transaksi.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { nama: true, email: true } } },
  });
  return rows.map((t) => ({
    id: t.id,
    userId: t.userId,
    userNama: t.user?.nama ?? "—",
    userEmail: t.user?.email ?? "—",
    paketId: t.paketId,
    paketNama: t.paketNama,
    jumlah: t.jumlah,
    status: t.status as StatusTransaksi,
    catatan: t.catatan,
    createdAt: t.createdAt.toISOString(),
    confirmedAt: t.confirmedAt ? t.confirmedAt.toISOString() : null,
  }));
}

export async function countTransaksiPending(): Promise<number> {
  return prisma.transaksi.count({ where: { status: "pending" } });
}

/**
 * Buat permintaan pembayaran (status pending) untuk sebuah paket. Bila peserta
 * sudah punya akses, atau sudah punya transaksi pending untuk paket yang sama,
 * transaksi baru tidak dibuat.
 */
export async function buatTransaksi(
  userId: string,
  paketId: string,
  paketNama: string,
  jumlah: number,
): Promise<{ id: string; status: "baru" | "sudah_pending" | "sudah_punya" }> {
  if (await punyaAkses(userId, paketId)) {
    return { id: "", status: "sudah_punya" };
  }
  const pending = await prisma.transaksi.findFirst({
    where: { userId, paketId, status: "pending" },
  });
  if (pending) return { id: pending.id, status: "sudah_pending" };

  const t = await prisma.transaksi.create({
    data: { userId, paketId, paketNama, jumlah, status: "pending" },
  });
  return { id: t.id, status: "baru" };
}

/** Ubah status transaksi. Bila "lunas", akses paket otomatis diberikan. */
export async function setStatusTransaksi(
  id: string,
  status: StatusTransaksi,
): Promise<void> {
  const t = await prisma.transaksi.update({
    where: { id },
    data: {
      status,
      confirmedAt: status === "lunas" ? new Date() : null,
    },
  });
  if (status === "lunas" && t.paketId) {
    await grantAkses(t.userId, t.paketId, "pembayaran");
  }
}

// ---- Akses paket ----
export async function punyaAkses(userId: string, paketId: string): Promise<boolean> {
  const a = await prisma.aksesPaket.findUnique({
    where: { userId_paketId: { userId, paketId } },
  });
  return Boolean(a);
}

export async function grantAkses(
  userId: string,
  paketId: string,
  sumber: "pembayaran" | "admin" | "gratis" = "pembayaran",
): Promise<void> {
  await prisma.aksesPaket.upsert({
    where: { userId_paketId: { userId, paketId } },
    update: {},
    create: { userId, paketId, sumber },
  });
}

/** Kumpulan id paket yang bisa diakses seorang pengguna. */
export async function getAksesUser(userId: string): Promise<Set<string>> {
  const rows = await prisma.aksesPaket.findMany({
    where: { userId },
    select: { paketId: true },
  });
  return new Set(rows.map((r) => r.paketId));
}

/** Kumpulan id paket yang punya transaksi menunggu konfirmasi untuk pengguna. */
export async function getPendingPaketUser(userId: string): Promise<Set<string>> {
  const rows = await prisma.transaksi.findMany({
    where: { userId, status: "pending", paketId: { not: null } },
    select: { paketId: true },
  });
  return new Set(rows.map((r) => r.paketId as string));
}
