import { Card, Badge, ButtonLink, Progress } from "@/components/ui";
import {
  IconTrophy,
  IconChart,
  IconTarget,
  IconArrowRight,
  IconCheckCircle,
  IconXCircle,
  IconBook,
  IconPlay,
} from "@/components/icons";
import { SUBTES_ORDER, SUBTES } from "@/lib/skd";
import type { StatistikUser, Peringkat } from "@/lib/hasil";

const PASSING_TOTAL = SUBTES_ORDER.reduce((a, k) => a + SUBTES[k].passingGrade, 0);

function fmtTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export function DashboardCerdas({
  stats,
  peringkat,
  peringkatPaket,
}: {
  stats: StatistikUser;
  peringkat: Peringkat | null;
  peringkatPaket: string | null;
}) {
  if (stats.totalUjian === 0) {
    return (
      <Card className="flex flex-col items-center gap-4 p-12 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <IconChart width={28} height={28} />
        </span>
        <div>
          <h2 className="text-xl font-bold text-heading">Belum ada data</h2>
          <p className="mt-1 text-slate">
            Selesaikan satu paket simulasi untuk melihat perkembangan nilai, analisis
            kelemahan, dan peringkatmu di sini.
          </p>
        </div>
        <ButtonLink href="/tryout" size="lg">
          <IconPlay width={18} height={18} />
          Mulai Simulasi
        </ButtonLink>
      </Card>
    );
  }

  const persenTertinggi = Math.round((stats.nilaiTertinggi / stats.nilaiMaksTotal) * 100);
  const trenData = stats.riwayat.slice(-10);

  return (
    <div className="space-y-8">
      {/* Ringkasan */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total ujian" nilai={String(stats.totalUjian)} sub="paket dikerjakan" icon={<IconChart width={18} height={18} />} />
        <StatCard label="Nilai tertinggi" nilai={String(stats.nilaiTertinggi)} sub={`dari ${stats.nilaiMaksTotal} · ${persenTertinggi}%`} icon={<IconTrophy width={18} height={18} />} tone="gold" />
        <StatCard label="Rata-rata" nilai={String(stats.rataRata)} sub={`dari ${stats.nilaiMaksTotal}`} icon={<IconTarget width={18} height={18} />} />
        <StatCard label="Lulus semua" nilai={`${stats.jumlahLulus}/${stats.totalUjian}`} sub="ujian lolos 3 subtes" icon={<IconCheckCircle width={18} height={18} />} tone="success" />
      </div>

      {/* Peringkat */}
      {peringkat && peringkat.totalPeserta > 1 && (
        <Card className="flex flex-col items-start justify-between gap-4 border-brand-100 bg-brand-50/50 p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-600 text-white">
              <IconTrophy width={22} height={22} />
            </span>
            <div>
              <p className="text-sm text-slate">Peringkat ujian terakhirmu{peringkatPaket ? ` · ${peringkatPaket}` : ""}</p>
              <p className="text-lg font-bold text-heading">
                Mengungguli <span className="tnum text-brand-700">{peringkat.persentil}%</span> peserta
              </p>
            </div>
          </div>
          <div className="rounded-xl bg-surface px-4 py-2 text-center shadow-[var(--shadow-card)]">
            <p className="tnum text-2xl font-extrabold text-heading">#{peringkat.peringkat}</p>
            <p className="text-xs text-slate-400">dari {peringkat.totalPeserta}</p>
          </div>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Tren nilai */}
        <Card className="p-6">
          <h2 className="font-bold text-heading">Tren nilai</h2>
          <p className="mt-0.5 text-sm text-slate">{trenData.length} ujian terakhir. Garis putus = total passing grade ({PASSING_TOTAL}).</p>
          <div className="relative mt-6 h-44">
            {/* garis passing grade */}
            <div
              className="absolute inset-x-0 border-t-2 border-dashed border-gold-400/70"
              style={{ bottom: `${(PASSING_TOTAL / stats.nilaiMaksTotal) * 100}%` }}
            >
              <span className="absolute -top-4 right-0 text-[10px] font-semibold text-gold-600">
                passing {PASSING_TOTAL}
              </span>
            </div>
            <div className="flex h-full items-end gap-2">
              {trenData.map((r) => {
                const tinggi = Math.max(3, (r.nilaiTotal / stats.nilaiMaksTotal) * 100);
                return (
                  <div key={r.id} className="group flex h-full flex-1 flex-col items-center justify-end gap-1">
                    <span className="tnum text-[10px] font-semibold text-slate-400 opacity-0 group-hover:opacity-100">
                      {r.nilaiTotal}
                    </span>
                    <div
                      className={`w-full rounded-t-md transition-all ${r.lulusSemua ? "bg-success" : "bg-brand-500"}`}
                      style={{ height: `${tinggi}%` }}
                      title={`${r.paketNama}: ${r.nilaiTotal} (${fmtTanggal(r.createdAt)})`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Analisis per subtes */}
        <Card className="p-6">
          <h2 className="font-bold text-heading">Penguasaan per subtes</h2>
          <p className="mt-0.5 text-sm text-slate">Rata-rata nilai dari semua ujianmu.</p>
          <div className="mt-5 space-y-4">
            {stats.perSubtes.map((s) => (
              <div key={s.subtes}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-semibold text-heading">
                    {s.subtes} · {s.nama}
                  </span>
                  <span className="tnum text-slate">
                    {s.rataNilai}/{s.nilaiMaks}
                  </span>
                </div>
                <div className="relative">
                  <Progress value={s.rataNilai} max={s.nilaiMaks} tone={s.lulus ? "success" : "danger"} />
                  <div
                    className="absolute -top-1 h-4 w-0.5 bg-heading"
                    style={{ left: `${(s.passingGrade / s.nilaiMaks) * 100}%` }}
                    title={`Passing grade ${s.passingGrade}`}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                  <span className="tnum">Passing grade {s.passingGrade}</span>
                  <span className={s.lulus ? "text-success" : "text-danger"}>
                    {s.lulus ? "Di atas passing" : "Perlu ditingkatkan"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Rekomendasi fokus */}
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <IconTarget width={20} height={20} className="text-brand-600" />
          <h2 className="font-bold text-heading">Rekomendasi fokus belajar</h2>
        </div>
        {stats.fokus.length === 0 ? (
          <p className="mt-2 flex items-center gap-2 text-slate">
            <IconCheckCircle width={18} height={18} className="text-success" />
            Semua subtes sudah di atas passing grade. Pertahankan & perdalam!
          </p>
        ) : (
          <>
            <p className="mt-1 text-sm text-slate">
              Subtes berikut rata-ratanya masih di bawah passing grade — prioritaskan.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {stats.fokus.map((s) => (
                <div key={s.subtes} className="flex items-center justify-between gap-3 rounded-xl border border-danger-100 bg-danger-50/40 p-4">
                  <div>
                    <p className="font-semibold text-heading">{s.subtes} · {s.nama}</p>
                    <p className="tnum text-xs text-slate">
                      Rata-rata {s.rataNilai} · kurang {Math.max(0, s.passingGrade - s.rataNilai)} dari passing
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <ButtonLink href="/belajar" size="sm" variant="outline">
                      <IconBook width={15} height={15} /> Materi
                    </ButtonLink>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* Riwayat */}
      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-bold text-heading">Riwayat ujian</h2>
          <ButtonLink href="/tryout" size="sm" variant="ghost">
            Ujian lagi <IconArrowRight width={15} height={15} />
          </ButtonLink>
        </div>
        <div className="divide-y divide-line">
          {[...stats.riwayat].reverse().slice(0, 10).map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-4 px-6 py-3.5">
              <div className="min-w-0">
                <p className="truncate font-medium text-heading">{r.paketNama}</p>
                <p className="text-xs text-slate-400">{fmtTanggal(r.createdAt)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="tnum text-sm font-bold text-heading">
                  {r.nilaiTotal}
                  <span className="font-normal text-slate-400">/{r.nilaiMaksTotal}</span>
                </span>
                <Badge tone={r.lulusSemua ? "success" : "danger"}>
                  {r.lulusSemua ? <IconCheckCircle width={13} height={13} /> : <IconXCircle width={13} height={13} />}
                  {r.lulusSemua ? "Lulus" : "Belum"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  nilai,
  sub,
  icon,
  tone = "brand",
}: {
  label: string;
  nilai: string;
  sub: string;
  icon: React.ReactNode;
  tone?: "brand" | "gold" | "success";
}) {
  const toneCls =
    tone === "gold"
      ? "bg-gold-100 text-gold-700"
      : tone === "success"
        ? "bg-success-50 text-success"
        : "bg-brand-50 text-brand-600";
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
        <span className={`grid h-8 w-8 place-items-center rounded-lg ${toneCls}`}>{icon}</span>
      </div>
      <p className="tnum mt-2 text-3xl font-extrabold text-heading">{nilai}</p>
      <p className="mt-0.5 text-xs text-slate-400">{sub}</p>
    </Card>
  );
}
