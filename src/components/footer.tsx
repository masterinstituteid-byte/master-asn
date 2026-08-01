import Link from "next/link";
import { Container } from "./ui";
import { Logo } from "./icons";

const COLS = [
  {
    title: "Produk",
    links: [
      { label: "Belajar Materi", href: "/belajar" },
      { label: "Bank Soal", href: "/bank-soal" },
      { label: "Simulasi", href: "/tryout" },
      { label: "Dashboard Nilai", href: "/dashboard" },
    ],
  },
  {
    title: "Subtes SKD",
    links: [
      { label: "TWK — Wawasan Kebangsaan", href: "/belajar" },
      { label: "TIU — Intelegensia Umum", href: "/belajar" },
      { label: "TKP — Karakteristik Pribadi", href: "/belajar" },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { label: "Cara Kerja CAT", href: "/tryout" },
      { label: "Passing Grade", href: "/belajar" },
      { label: "Kebijakan Privasi", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <Container wide className="py-14">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-slate">
              Platform belajar dan simulasi SKD CPNS dengan pengalaman CAT
              yang presisi, pembahasan lengkap, dan analitik nilai berbasis passing
              grade resmi.
            </p>
            <p className="mt-5 text-xs text-slate-400">
              Simulasi independen untuk latihan. Tidak berafiliasi dengan BKN.
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-heading">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate transition-colors hover:text-brand-600"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} MASTER ASN. Dibuat untuk persiapan CPNS.
          </p>
          <div className="flex items-center gap-5 text-xs text-slate-400">
            <span>TWK · PG 65</span>
            <span>TIU · PG 80</span>
            <span>TKP · PG 166</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
