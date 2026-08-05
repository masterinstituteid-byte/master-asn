import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Container, Card, Badge, ButtonLink, Eyebrow } from "@/components/ui";
import {
  IconClock,
  IconCheckCircle,
  IconXCircle,
  IconArrowRight,
  IconTrophy,
  IconLayers,
} from "@/components/icons";
import { currentSession } from "@/lib/session-server";
import { getRiwayatUser } from "@/lib/hasil";
import { formatWaktu } from "@/lib/skd";

export const metadata: Metadata = {
  title: "Riwayat Simulasi",
  description:
    "Lihat kembali seluruh simulasi yang pernah kamu kerjakan, beserta nilai dan pembahasan soalnya.",
};

export const dynamic = "force-dynamic";

function formatTanggal(iso: string): string {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function RiwayatPage() {
  const session = await currentSession();
  if (!session) redirect("/login?next=/riwayat");

  const riwayat = await getRiwayatUser(session.sub);

  return (
    <Container wide className="py-14">
      <Eyebrow>Riwayat</Eyebrow>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-heading">
        Riwayat Simulasi
      </h1>
      <p className="mt-2 max-w-2xl text-slate">
        Semua simulasi yang pernah kamu kerjakan tersimpan di sini. Buka salah satu untuk
        meninjau nilai dan pembahasan soalnya kapan saja.
      </p>

      {riwayat.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-line bg-surface p-10 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-muted text-slate-400">
            <IconTrophy width={28} height={28} />
          </span>
          <h2 className="mt-6 text-xl font-bold text-heading">Belum ada riwayat</h2>
          <p className="mx-auto mt-2 max-w-md text-slate">
            Kamu belum menyelesaikan simulasi apa pun. Kerjakan satu paket, hasil dan
            pembahasannya akan muncul di sini.
          </p>
          <ButtonLink href="/tryout" size="lg" className="mt-8">
            Mulai Simulasi
            <IconArrowRight width={18} height={18} />
          </ButtonLink>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {riwayat.map((r) => {
            const persen = Math.round((r.nilaiTotal / r.nilaiMaksTotal) * 100);
            const isi = (
              <Card className="p-5 transition-colors sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={r.lulusSemua ? "success" : "danger"}>
                        {r.lulusSemua ? (
                          <IconCheckCircle width={13} height={13} />
                        ) : (
                          <IconXCircle width={13} height={13} />
                        )}
                        {r.lulusSemua ? "Lulus" : "Belum lulus"}
                      </Badge>
                      <span className="truncate font-bold text-heading">{r.paketNama}</span>
                    </div>
                    <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate">
                      <span>{formatTanggal(r.createdAt)}</span>
                      <span className="inline-flex items-center gap-1">
                        <IconLayers width={13} height={13} />
                        {r.jumlahSoal} soal
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <IconClock width={13} height={13} />
                        {formatWaktu(r.waktuTerpakaiDetik)}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-5 sm:gap-6">
                    <div className="text-right">
                      <p className="tnum text-2xl font-extrabold text-heading">
                        {r.nilaiTotal}
                        <span className="text-sm font-semibold text-slate-400">
                          /{r.nilaiMaksTotal}
                        </span>
                      </p>
                      <p className="tnum text-xs text-brand-600">{persen}%</p>
                    </div>
                    {r.adaReview ? (
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white">
                        Lihat pembahasan
                        <IconArrowRight width={16} height={16} />
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-xl bg-muted px-4 py-2.5 text-xs font-medium text-slate-400">
                        Pembahasan tidak tersimpan
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );

            return (
              <li key={r.id}>
                {r.adaReview ? (
                  <Link href={`/riwayat/${r.id}`} className="block">
                    {isi}
                  </Link>
                ) : (
                  isi
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Container>
  );
}
