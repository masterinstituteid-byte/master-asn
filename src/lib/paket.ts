import "server-only";
import { prisma } from "@/lib/db";
import { SUBTES_ORDER, type Subtes } from "@/lib/skd";

export interface PaketRingkas {
  id: string;
  nama: string;
  deskripsi: string;
  harga: number;
  aktif: boolean;
  tampilLanding: boolean;
  populer: boolean;
  urutan: number;
  /** Jumlah soal per subtes, mis. { TWK: 30, TIU: 35, TKP: 45 }. */
  jumlah: Record<Subtes, number>;
  total: number;
}

/** Target soal per subtes untuk satu paket lengkap (TWK 30 · TIU 35 · TKP 45). */
export const TARGET_PER_SUBTES: Record<Subtes, number> = { TWK: 30, TIU: 35, TKP: 45 };
export const TARGET_TOTAL = 110;

/** Daftar semua paket beserta rekap jumlah soal per subtes. */
export async function getAllPaket(): Promise<PaketRingkas[]> {
  const paket = await prisma.paket.findMany({
    orderBy: [{ urutan: "asc" }, { createdAt: "asc" }],
  });

  const grup = await prisma.soal.groupBy({
    by: ["paketId", "subtes"],
    where: { aktif: true },
    _count: { _all: true },
  });

  return paket.map((p) => {
    const jumlah: Record<Subtes, number> = { TWK: 0, TIU: 0, TKP: 0 };
    for (const g of grup) {
      if (g.paketId === p.id && (SUBTES_ORDER as string[]).includes(g.subtes)) {
        jumlah[g.subtes as Subtes] = g._count._all;
      }
    }
    return {
      id: p.id,
      nama: p.nama,
      deskripsi: p.deskripsi,
      harga: p.harga,
      aktif: p.aktif,
      tampilLanding: p.tampilLanding,
      populer: p.populer,
      urutan: p.urutan,
      jumlah,
      total: jumlah.TWK + jumlah.TIU + jumlah.TKP,
    };
  });
}

/** Paket yang ditampilkan pada daftar harga di landing page. */
export async function getPaketLanding(): Promise<PaketRingkas[]> {
  const all = await getAllPaket();
  return all.filter((p) => p.aktif && p.tampilLanding && p.total > 0);
}

export async function getPaketRingkas(id: string): Promise<PaketRingkas | null> {
  const all = await getAllPaket();
  return all.find((p) => p.id === id) ?? null;
}

export async function createPaket(nama: string, deskripsi = ""): Promise<string> {
  const max = await prisma.paket.aggregate({ _max: { urutan: true } });
  const p = await prisma.paket.create({
    data: {
      nama: nama.trim() || "Paket Tanpa Nama",
      deskripsi: deskripsi.trim(),
      urutan: (max._max.urutan ?? 0) + 1,
    },
  });
  return p.id;
}

export async function updatePaket(
  id: string,
  data: {
    nama?: string;
    deskripsi?: string;
    aktif?: boolean;
    harga?: number;
    tampilLanding?: boolean;
    populer?: boolean;
  },
): Promise<void> {
  await prisma.paket.update({
    where: { id },
    data: {
      ...(data.nama !== undefined ? { nama: data.nama.trim() || "Paket Tanpa Nama" } : {}),
      ...(data.deskripsi !== undefined ? { deskripsi: data.deskripsi.trim() } : {}),
      ...(data.aktif !== undefined ? { aktif: data.aktif } : {}),
      ...(data.harga !== undefined ? { harga: Math.max(0, Math.round(data.harga)) } : {}),
      ...(data.tampilLanding !== undefined ? { tampilLanding: data.tampilLanding } : {}),
      ...(data.populer !== undefined ? { populer: data.populer } : {}),
    },
  });
}

/** Hapus paket beserta seluruh soalnya (cascade di schema). */
export async function deletePaket(id: string): Promise<void> {
  await prisma.paket.delete({ where: { id } });
}
