"use client";

import { useState } from "react";
import Link from "next/link";
import { MATERI } from "@/data/materi";
import { SUBTES, SUBTES_ORDER, type Subtes } from "@/lib/skd";
import { Card, Badge, ButtonLink } from "@/components/ui";
import { IconClock, IconArrowRight, IconCheck, IconShield, IconBrain, IconUsers } from "@/components/icons";

const ICONS: Record<Subtes, typeof IconShield> = {
  TWK: IconShield,
  TIU: IconBrain,
  TKP: IconUsers,
};

const levelTone = {
  Dasar: "success",
  Menengah: "brand",
  Lanjut: "gold",
} as const;

export function BelajarTabs() {
  const [active, setActive] = useState<Subtes>("TWK");
  const materi = MATERI.find((m) => m.subtes === active)!;
  const cfg = SUBTES[active];
  const Icon = ICONS[active];

  return (
    <div>
      {/* Tabs */}
      <div
        className="flex flex-wrap gap-2 rounded-2xl border border-line bg-surface p-1.5 shadow-[var(--shadow-card)] sm:inline-flex"
        role="tablist"
        aria-label="Pilih subtes"
      >
        {SUBTES_ORDER.map((key) => {
          const s = SUBTES[key];
          const on = key === active;
          return (
            <button
              key={key}
              role="tab"
              aria-selected={on}
              onClick={() => setActive(key)}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all sm:flex-none ${
                on ? "bg-navy text-white shadow-sm" : "text-slate hover:bg-muted"
              }`}
            >
              {key}
              <span className={`ml-2 hidden text-xs font-normal sm:inline ${on ? "text-slate-400" : "text-slate-400"}`}>
                {s.nama}
              </span>
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[300px_1fr]" role="tabpanel">
        {/* Sidebar summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="p-6">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <Icon width={24} height={24} />
            </span>
            <h2 className="mt-4 text-xl font-bold text-heading">
              {active} · {cfg.nama}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate">{materi.intro}</p>

            <dl className="mt-5 space-y-3 border-t border-line pt-5">
              {[
                { l: "Jumlah soal ujian", v: `${cfg.jumlahSoal} soal` },
                { l: "Passing grade", v: `${cfg.passingGrade}` },
                { l: "Nilai maksimum", v: `${cfg.nilaiMaks}` },
                { l: "Skema", v: cfg.skema === "poin-1-5" ? "Poin 1–5" : "Benar +5" },
              ].map((row) => (
                <div key={row.l} className="flex items-center justify-between text-sm">
                  <dt className="text-slate">{row.l}</dt>
                  <dd className="tnum font-semibold text-heading">{row.v}</dd>
                </div>
              ))}
            </dl>

            <ButtonLink href="/tryout" size="md" className="mt-6 w-full">
              Uji lewat Simulasi
              <IconArrowRight width={16} height={16} />
            </ButtonLink>
          </Card>
        </aside>

        {/* Modul list */}
        <div className="space-y-4">
          {materi.modul.map((m, i) => (
            <Card
              key={m.id}
              className="group p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="tnum grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-muted text-sm font-bold text-heading">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-heading">{m.judul}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate">{m.ringkasan}</p>
                  </div>
                </div>
                <Badge tone={levelTone[m.level]}>{m.level}</Badge>
              </div>

              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {m.poin.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-slate">
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
                      <IconCheck width={11} height={11} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <IconClock width={14} height={14} />
                  {m.durasiMenit} menit
                </span>
                <Link
                  href="/bank-soal"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600"
                >
                  Latihan soal materi ini
                  <IconArrowRight width={15} height={15} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
