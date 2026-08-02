"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Badge,
  ButtonLink,
  Progress,
} from "@/components/ui";
import {
  IconCheckCircle,
  IconXCircle,
  IconClock,
  IconRefresh,
  IconChevronDown,
  IconTrophy,
  IconArrowRight,
} from "@/components/icons";
import {
  SUBTES,
  formatWaktu,
  HASIL_STORAGE_KEY,
  skorSoal,
  type HasilTersimpan,
  type Soal,
} from "@/lib/skd";
import { TeksSoal } from "@/components/teks-soal";
import { getPeringkatAction } from "@/app/simulasi/actions";
import type { Peringkat } from "@/lib/hasil";

export default function HasilPage() {
  const [hasil, setHasil] = useState<HasilTersimpan | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [peringkat, setPeringkat] = useState<Peringkat | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HASIL_STORAGE_KEY);
      if (raw) setHasil(JSON.parse(raw) as HasilTersimpan);
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (hasil?.paketId) {
      getPeringkatAction(hasil.paketId, hasil.nilaiTotal)
        .then(setPeringkat)
        .catch(() => {});
    }
  }, [hasil]);

  if (!loaded) {
    return (
      <Container wide className="py-24">
        <div className="mx-auto h-64 max-w-2xl animate-pulse rounded-3xl bg-muted" />
      </Container>
    );
  }

  if (!hasil) return <EmptyHasil />;

  const persenTotal = Math.round((hasil.nilaiTotal / hasil.nilaiMaksTotal) * 100);

  return (
    <>
      {/* Verdict */}
      <section
        className={`relative overflow-hidden border-b border-line ${
          hasil.lulusSemua ? "bg-success-50/60" : "bg-danger-50/50"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 bg-grid mask-fade-b opacity-40" />
        <Container wide className="relative py-14 lg:py-16">
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Badge tone={hasil.lulusSemua ? "success" : "danger"} className="mb-4">
                {hasil.lulusSemua ? (
                  <IconCheckCircle width={14} height={14} />
                ) : (
                  <IconXCircle width={14} height={14} />
                )}
                {hasil.lulusSemua ? "Selamat, kamu lulus!" : "Belum lulus"}
              </Badge>
              <h1 className="text-3xl font-extrabold tracking-tight text-heading sm:text-4xl text-balance">
                {hasil.lulusSemua
                  ? "Semua subtes di atas passing grade"
                  : "Sebagian subtes belum mencapai passing grade"}
              </h1>
              <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate">
                <span className="inline-flex items-center gap-1.5">
                  <IconClock width={15} height={15} />
                  Waktu terpakai {formatWaktu(hasil.waktuTerpakaiDetik)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <IconTrophy width={15} height={15} />
                  {hasil.perSubtes.filter((s) => s.lulus).length}/3 subtes lolos
                </span>
              </p>
            </div>

            {/* score dial */}
            <div className="flex items-center gap-5 rounded-3xl border border-line bg-surface px-7 py-5 shadow-[var(--shadow-card)]">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400">Nilai total</p>
                <p className="tnum text-4xl font-extrabold text-heading">
                  {hasil.nilaiTotal}
                  <span className="text-lg font-semibold text-slate-400">
                    /{hasil.nilaiMaksTotal}
                  </span>
                </p>
              </div>
              <div className="h-14 w-px bg-line" />
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400">Persentase</p>
                <p className="tnum text-4xl font-extrabold text-brand-600">{persenTotal}%</p>
              </div>
            </div>
          </div>

          {peringkat && peringkat.totalPeserta > 1 && (
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-brand-100 bg-brand-50/60 px-5 py-4">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
                <IconTrophy width={18} height={18} />
                Kamu mengungguli{" "}
                <span className="tnum text-lg font-extrabold">{peringkat.persentil}%</span>{" "}
                peserta paket ini
              </span>
              <span className="text-sm text-slate">
                Peringkat{" "}
                <span className="tnum font-bold text-heading">{peringkat.peringkat}</span> dari{" "}
                <span className="tnum font-bold text-heading">{peringkat.totalPeserta}</span> peserta
              </span>
            </div>
          )}
        </Container>
      </section>

      {/* Per subtes */}
      <Container wide className="py-14">
        <div className="grid gap-5 md:grid-cols-3">
          {hasil.perSubtes.map((r) => {
            const cfg = SUBTES[r.subtes];
            const tone = r.lulus ? "success" : "danger";
            return (
              <Card key={r.subtes} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {r.subtes}
                    </p>
                    <p className="font-bold text-heading">{cfg.nama}</p>
                  </div>
                  <Badge tone={tone}>
                    {r.lulus ? (
                      <IconCheckCircle width={13} height={13} />
                    ) : (
                      <IconXCircle width={13} height={13} />
                    )}
                    {r.lulus ? "Lulus" : "Belum"}
                  </Badge>
                </div>

                <div className="mt-5 flex items-end gap-1.5">
                  <span className="tnum text-4xl font-extrabold text-heading">{r.nilai}</span>
                  <span className="mb-1 text-sm text-slate-400">/ {r.nilaiMaks}</span>
                </div>

                <div className="relative mt-4">
                  <Progress value={r.nilai} max={r.nilaiMaks} tone={r.lulus ? "success" : "danger"} />
                  {/* passing grade marker */}
                  <div
                    className="absolute -top-1 h-4 w-0.5 bg-heading"
                    style={{ left: `${(r.passingGrade / r.nilaiMaks) * 100}%` }}
                    title={`Passing grade ${r.passingGrade}`}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate">
                  <span className="tnum">Passing grade {r.passingGrade}</span>
                  <span className="tnum">
                    {r.benar}/{r.total} {cfg.skema === "poin-1-5" ? "poin tinggi" : "benar"}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/simulasi" size="lg">
            <IconRefresh width={18} height={18} />
            Ulangi Simulasi
          </ButtonLink>
          <ButtonLink href="/dashboard" size="lg" variant="outline">
            Lihat Dashboard
            <IconArrowRight width={18} height={18} />
          </ButtonLink>
        </div>
      </Container>

      {/* Pembahasan */}
      <section className="border-t border-line bg-surface py-14">
        <Container wide>
          <h2 className="text-2xl font-bold text-heading">Pembahasan</h2>
          <p className="mt-2 text-slate">Tinjau setiap soal, jawabanmu, dan penjelasannya.</p>
          <div className="mt-8 space-y-3">
            {(hasil.soal ?? []).map((s, i) => (
              <PembahasanItem
                key={s.id}
                soal={s}
                nomor={i + 1}
                jawaban={hasil.jawaban[s.id] ?? null}
              />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

function PembahasanItem({
  soal,
  nomor,
  jawaban,
}: {
  soal: Soal;
  nomor: number;
  jawaban: string | null;
}) {
  const [open, setOpen] = useState(false);
  const isTKP = soal.subtes === "TKP";
  const skor = skorSoal(soal, jawaban);
  const benar = isTKP ? skor >= 4 : skor === 5;
  const terjawab = jawaban !== null;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/40"
        aria-expanded={open}
      >
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold ${
            !terjawab
              ? "bg-muted text-slate-400"
              : benar
                ? "bg-success-50 text-success"
                : "bg-danger-50 text-danger"
          }`}
        >
          {!terjawab ? (
            nomor
          ) : benar ? (
            <IconCheckCircle width={18} height={18} />
          ) : (
            <IconXCircle width={18} height={18} />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate">Soal {nomor}</span>
            <span>·</span>
            <span>{soal.subtes} — {soal.materi}</span>
          </p>
          <p className="mt-0.5 truncate text-sm font-medium text-heading">{soal.pertanyaan}</p>
        </div>
        <span className="hidden shrink-0 sm:block">
          {isTKP ? (
            <span className="tnum rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-slate">
              {skor} poin
            </span>
          ) : (
            <span
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                benar ? "bg-success-50 text-success" : "bg-danger-50 text-danger"
              }`}
            >
              {benar ? "+5" : "0"}
            </span>
          )}
        </span>
        <IconChevronDown
          width={18}
          height={18}
          className={`shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="border-t border-line px-5 py-5 sm:pl-[4.75rem]">
          <TeksSoal
            text={soal.pertanyaan}
            className="text-[0.95rem] font-medium leading-relaxed text-heading"
          />
          {soal.gambar && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/gambar/${soal.gambar}`}
              alt="Gambar soal"
              className="mt-3 max-h-72 w-auto max-w-full rounded-xl border border-line bg-white object-contain"
            />
          )}
          <div className="mt-4 space-y-2">
            {soal.opsi.map((o) => {
              const dipilih = jawaban === o.id;
              const kunci = !isTKP && soal.kunci === o.id;
              return (
                <div
                  key={o.id}
                  className={`flex items-start gap-3 rounded-xl border px-3.5 py-2.5 text-sm ${
                    kunci
                      ? "border-success/40 bg-success-50/60"
                      : dipilih
                        ? "border-danger/40 bg-danger-50/60"
                        : "border-line"
                  }`}
                >
                  <span className="font-bold text-slate-400">{o.id}</span>
                  <span className="flex-1 text-slate">
                    {o.teks}
                    {o.gambar && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`/gambar/${o.gambar}`}
                        alt={`Pilihan ${o.id}`}
                        className={`${o.teks ? "mt-2" : ""} max-h-40 w-auto max-w-full rounded-lg border border-line bg-white object-contain`}
                      />
                    )}
                  </span>
                  {isTKP && (
                    <span className="tnum text-xs font-semibold text-slate-400">{o.poin} poin</span>
                  )}
                  {kunci && <Badge tone="success">Kunci</Badge>}
                  {dipilih && !kunci && <Badge tone="danger">Jawabanmu</Badge>}
                  {dipilih && kunci && <Badge tone="success">Jawabanmu</Badge>}
                </div>
              );
            })}
          </div>
          <div className="mt-4 rounded-xl bg-brand-50/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
              Pembahasan
            </p>
            <TeksSoal
              text={soal.pembahasan}
              className="mt-1.5 text-sm leading-relaxed text-slate"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyHasil() {
  return (
    <Container wide className="py-24">
      <div className="mx-auto max-w-md text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-muted text-slate-400">
          <IconTrophy width={28} height={28} />
        </span>
        <h1 className="mt-6 text-2xl font-bold text-heading">Belum ada hasil</h1>
        <p className="mt-2 text-slate">
          Kamu belum menyelesaikan simulasi. Kerjakan satu paket untuk melihat
          nilai dan pembahasannya di sini.
        </p>
        <ButtonLink href="/tryout" size="lg" className="mt-8">
          Mulai Simulasi
          <IconArrowRight width={18} height={18} />
        </ButtonLink>
      </div>
    </Container>
  );
}
