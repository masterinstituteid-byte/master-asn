import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentSession } from "@/lib/session-server";
import { isAdminEmail } from "@/lib/session";
import { getAllSoal, seedSoalIfEmpty } from "@/lib/soal";
import { getAllPaket } from "@/lib/paket";
import { getAllUsers } from "@/lib/users";
import { getAllHasil } from "@/lib/hasil";
import { getAllModul } from "@/lib/modul";
import { getAllTransaksi } from "@/lib/transaksi";
import { getInfoPembayaran } from "@/lib/pengaturan";
import { getAllTestimoni } from "@/lib/testimoni";
import { getAllPaketHarga } from "@/lib/paket-harga";
import { AdminPanel } from "@/components/admin-panel";

export const metadata: Metadata = { title: "Panel Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await currentSession();
  if (!session) redirect("/login?next=/admin");
  if (!isAdminEmail(session.email)) redirect("/dashboard");

  await seedSoalIfEmpty();
  const [paket, soal, users, hasil, modul, transaksi, infoBayar, testimoni, paketHarga] =
    await Promise.all([
      getAllPaket(),
      getAllSoal(),
      getAllUsers(),
      getAllHasil(),
      getAllModul(),
      getAllTransaksi(),
      getInfoPembayaran(),
      getAllTestimoni(),
      getAllPaketHarga(),
    ]);

  return (
    <AdminPanel
      paket={paket}
      soal={soal}
      users={users}
      hasil={hasil}
      modul={modul}
      transaksi={transaksi}
      infoBayar={infoBayar}
      testimoni={testimoni}
      paketHarga={paketHarga}
      adminEmail={session.email}
    />
  );
}
