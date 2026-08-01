import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getPaketSimulasi, resolvePaketAktif } from "@/lib/soal";
import { currentSession } from "@/lib/session-server";
import { isAdminEmail } from "@/lib/session";
import { punyaAkses } from "@/lib/transaksi";
import { SimulasiRunner } from "@/components/simulasi-runner";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Simulasi SKD" };

export default async function SimulasiPage({
  searchParams,
}: {
  searchParams: Promise<{ paket?: string }>;
}) {
  const { paket } = await searchParams;
  const meta = await resolvePaketAktif(paket);

  // Paket berbayar hanya boleh dikerjakan bila sudah punya akses (atau admin).
  if (meta.id && meta.harga > 0) {
    const session = await currentSession();
    const admin = isAdminEmail(session?.email);
    const boleh =
      admin || (session ? await punyaAkses(session.sub, meta.id) : false);
    if (!boleh) redirect("/tryout");
  }

  const soal = await getPaketSimulasi(meta.id ?? undefined);
  return <SimulasiRunner soal={soal} paketId={meta.id} paketNama={meta.nama} />;
}
