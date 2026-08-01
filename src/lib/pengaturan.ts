import "server-only";
import { prisma } from "@/lib/db";

// Info pembayaran yang ditampilkan ke peserta saat membeli paket.
export interface InfoPembayaran {
  bankNama: string;
  bankRekening: string;
  bankAtasNama: string;
  instruksi: string;
}

const DEFAULT: InfoPembayaran = {
  bankNama: "",
  bankRekening: "",
  bankAtasNama: "",
  instruksi:
    "Transfer sesuai nominal, lalu klik “Saya sudah transfer”. Admin akan memverifikasi dan membuka akses paket Anda.",
};

const KEYS: (keyof InfoPembayaran)[] = [
  "bankNama",
  "bankRekening",
  "bankAtasNama",
  "instruksi",
];

export async function getInfoPembayaran(): Promise<InfoPembayaran> {
  const rows = await prisma.setting.findMany({
    where: { key: { in: KEYS.map((k) => `bayar_${k}`) } },
  });
  const map = new Map(rows.map((r) => [r.key, r.value]));
  return {
    bankNama: map.get("bayar_bankNama") ?? DEFAULT.bankNama,
    bankRekening: map.get("bayar_bankRekening") ?? DEFAULT.bankRekening,
    bankAtasNama: map.get("bayar_bankAtasNama") ?? DEFAULT.bankAtasNama,
    instruksi: map.get("bayar_instruksi") ?? DEFAULT.instruksi,
  };
}

export async function setInfoPembayaran(info: InfoPembayaran): Promise<void> {
  for (const k of KEYS) {
    const key = `bayar_${k}`;
    const value = info[k] ?? "";
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
}
