"use client";

import { useState } from "react";
import { IconChevronDown } from "@/components/icons";

const ITEMS = [
  {
    q: "Apakah simulasinya mirip CAT BKN yang asli?",
    a: "Ya. Sistem simulasi kami meniru pengalaman CAT: timer mundur, navigasi antar soal, auto-submit saat waktu habis, hingga penilaian per subtes berbasis passing grade resmi.",
  },
  {
    q: "Apa saja subtes yang tersedia?",
    a: "Tiga subtes SKD lengkap: TWK (Wawasan Kebangsaan), TIU (Intelegensia Umum), dan TKP (Karakteristik Pribadi), masing-masing dengan materi, bank soal, dan pembahasan.",
  },
  {
    q: "Apakah bisa dicoba tanpa membuat akun?",
    a: "Bisa. Kamu dapat langsung mencoba satu paket simulasi tanpa login untuk merasakan pengalaman ujiannya, lalu mendaftar bila ingin menyimpan riwayat dan analitik nilai.",
  },
  {
    q: "Bagaimana cara mengetahui kelemahan saya?",
    a: "Setelah simulasi, kamu mendapat rincian nilai per subtes vs passing grade dan penguasaan per materi, sehingga tahu persis topik mana yang perlu diperkuat.",
  },
  {
    q: "Apakah soalnya diperbarui mengikuti kisi-kisi terbaru?",
    a: "Struktur soal mengikuti pola SKD terbaru (jumlah soal, passing grade, dan skema penilaian). Bank soal terus dilengkapi, termasuk soal tipe HOTS yang menuntut penalaran.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto mt-12 max-w-3xl space-y-3">
      {ITEMS.map((it, i) => {
        const isOpen = open === i;
        return (
          <div
            key={it.q}
            className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)]"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-heading">{it.q}</span>
              <IconChevronDown
                width={20}
                height={20}
                className={`shrink-0 text-slate-400 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-[0.95rem] leading-relaxed text-slate">
                  {it.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
