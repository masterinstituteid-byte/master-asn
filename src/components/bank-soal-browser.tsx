"use client";

import { useMemo, useState } from "react";
import { SUBTES_ORDER, type Subtes, type Soal } from "@/lib/skd";
import { Card, Badge } from "@/components/ui";
import { TeksSoal } from "@/components/teks-soal";
import { IconEye, IconCheck, IconFilter } from "@/components/icons";

type SubtesFilter = "ALL" | Subtes;
type LevelFilter = "ALL" | "Mudah" | "Sedang" | "HOTS";

export function BankSoalBrowser({ soal }: { soal: Soal[] }) {
  const [subtes, setSubtes] = useState<SubtesFilter>("ALL");
  const [level, setLevel] = useState<LevelFilter>("ALL");
  const [q, setQ] = useState("");

  const hasil = useMemo(() => {
    const key = q.trim().toLowerCase();
    return soal.filter((s) => {
      if (subtes !== "ALL" && s.subtes !== subtes) return false;
      if (level !== "ALL" && s.tingkat !== level) return false;
      if (key && !(`${s.pertanyaan} ${s.materi}`.toLowerCase().includes(key))) return false;
      return true;
    });
  }, [soal, subtes, level, q]);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 shadow-[var(--shadow-card)] lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <FilterGroup
            label="Subtes"
            value={subtes}
            onChange={(v) => setSubtes(v as SubtesFilter)}
            options={[["ALL", "Semua"], ...SUBTES_ORDER.map((s) => [s, s] as [string, string])]}
          />
          <span className="hidden h-6 w-px bg-line sm:block" />
          <FilterGroup
            label="Tingkat"
            value={level}
            onChange={(v) => setLevel(v as LevelFilter)}
            options={[
              ["ALL", "Semua"],
              ["Mudah", "Mudah"],
              ["Sedang", "Sedang"],
              ["HOTS", "HOTS"],
            ]}
          />
        </div>
        <div className="relative lg:w-72">
          <IconFilter
            width={16}
            height={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari materi atau kata kunci…"
            aria-label="Cari soal"
            className="h-11 w-full rounded-xl border border-line bg-bg pl-10 pr-4 text-sm text-heading outline-none transition-colors placeholder:text-slate-400 focus:border-brand-600"
          />
        </div>
      </div>

      <p className="mt-5 text-sm text-slate">
        Menampilkan <span className="tnum font-semibold text-heading">{hasil.length}</span> soal
      </p>

      {/* List */}
      <div className="mt-4 space-y-4">
        {hasil.map((s, i) => (
          <SoalCard key={s.id} soal={s} nomor={i + 1} />
        ))}
        {hasil.length === 0 && (
          <Card className="p-10 text-center">
            <p className="font-semibold text-heading">Tidak ada soal yang cocok</p>
            <p className="mt-1 text-sm text-slate">Coba ubah filter atau kata kunci pencarianmu.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-xs font-semibold uppercase tracking-wide text-slate-400 sm:inline">
        {label}
      </span>
      <div className="flex gap-1">
        {options.map(([val, lbl]) => (
          <button
            key={val}
            type="button"
            onClick={() => onChange(val)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              value === val ? "bg-navy text-white" : "text-slate hover:bg-muted"
            }`}
          >
            {lbl}
          </button>
        ))}
      </div>
    </div>
  );
}

function SoalCard({ soal, nomor }: { soal: Soal; nomor: number }) {
  const [reveal, setReveal] = useState(false);
  const isTKP = soal.subtes === "TKP";

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="navy">{soal.subtes}</Badge>
        <Badge tone="neutral">{soal.materi}</Badge>
        <Badge tone={soal.tingkat === "HOTS" ? "gold" : "neutral"}>{soal.tingkat}</Badge>
        <span className="tnum ml-auto text-xs text-slate-400">#{String(nomor).padStart(2, "0")}</span>
      </div>

      <TeksSoal
        text={soal.pertanyaan}
        className="mt-4 text-[0.95rem] font-medium leading-relaxed text-heading"
      />
      {soal.gambar && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/gambar/${soal.gambar}`}
          alt="Gambar soal"
          className="mt-4 max-h-72 w-auto max-w-full rounded-xl border border-line bg-white object-contain"
        />
      )}

      <div className="mt-4 space-y-2">
        {soal.opsi.map((o) => {
          const kunci = reveal && !isTKP && soal.kunci === o.id;
          return (
            <div
              key={o.id}
              className={`flex items-start gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition-colors ${
                kunci ? "border-success/40 bg-success-50/60" : "border-line"
              }`}
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line-strong text-xs font-bold text-slate-400">
                {o.id}
              </span>
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
              {reveal && isTKP && (
                <span className="tnum text-xs font-semibold text-slate-400">{o.poin} poin</span>
              )}
              {kunci && <IconCheck width={16} height={16} className="text-success" />}
            </div>
          );
        })}
      </div>

      <div className="mt-5 border-t border-line pt-4">
        <button
          type="button"
          onClick={() => setReveal((v) => !v)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600"
          aria-expanded={reveal}
        >
          <IconEye width={16} height={16} />
          {reveal ? "Sembunyikan pembahasan" : "Lihat kunci & pembahasan"}
        </button>
        {reveal && (
          <div className="mt-3 rounded-xl bg-brand-50/50 p-4">
            {!isTKP && (
              <p className="mb-2 text-sm">
                <span className="font-semibold text-heading">Kunci: </span>
                <span className="font-bold text-success">{soal.kunci}</span>
              </p>
            )}
            <TeksSoal text={soal.pembahasan} className="text-sm leading-relaxed text-slate" />
          </div>
        )}
      </div>
    </Card>
  );
}
