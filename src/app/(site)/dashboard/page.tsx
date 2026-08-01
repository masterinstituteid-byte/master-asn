import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container, Eyebrow, Badge } from "@/components/ui";
import { DashboardCerdas } from "@/components/dashboard-cerdas";
import { IconTarget } from "@/components/icons";
import { currentSession } from "@/lib/session-server";
import { getStatistikUser, getPeringkat } from "@/lib/hasil";

export const metadata: Metadata = {
  title: "Dashboard Nilai",
  description:
    "Pantau perkembangan nilai, penguasaan per materi, peringkat, dan rekomendasi fokus belajar SKD CPNS-mu.",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await currentSession();
  if (!session) redirect("/login?next=/dashboard");

  const stats = await getStatistikUser(session.sub);

  // Peringkat untuk ujian terakhir yang punya paket.
  const terakhir = [...stats.riwayat].reverse().find((r) => r.paketId);
  const peringkat = terakhir?.paketId
    ? await getPeringkat(terakhir.paketId, terakhir.nilaiTotal)
    : null;

  const namaPertama = session.nama?.split(" ")[0] || "calon ASN";

  return (
    <>
      <section className="border-b border-line bg-surface">
        <Container wide className="py-12 lg:py-14">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <Eyebrow>Dashboard</Eyebrow>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">
                Halo, {namaPertama}
              </h1>
              <p className="mt-2 text-slate">Ini ringkasan perkembangan persiapan SKD-mu.</p>
            </div>
            <Badge tone="gold" className="text-sm">
              <IconTarget width={15} height={15} />
              Target: Lulus 3 subtes
            </Badge>
          </div>
        </Container>
      </section>

      <Container wide className="py-10 lg:py-12">
        <DashboardCerdas
          stats={stats}
          peringkat={peringkat}
          peringkatPaket={terakhir?.paketNama ?? null}
        />
      </Container>
    </>
  );
}
