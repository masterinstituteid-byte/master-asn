import type { Metadata } from "next";
import { Container, Eyebrow, Card } from "@/components/ui";
import { BelajarTabs } from "@/components/belajar-tabs";
import { IconBook, IconDownload } from "@/components/icons";
import { getModulAktif } from "@/lib/modul";

export const metadata: Metadata = {
  title: "Belajar Materi SKD",
  description:
    "Modul belajar terstruktur TWK, TIU, dan TKP — dari dasar hingga soal HOTS, lengkap dengan poin kunci tiap topik.",
};

export const dynamic = "force-dynamic";

function fmtUkuran(bytes: number): string {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  if (bytes >= 1024) return Math.round(bytes / 1024) + " KB";
  return bytes + " B";
}

export default async function BelajarPage() {
  const modul = await getModulAktif();

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0 bg-grid mask-fade-b opacity-60" />
        <div className="pointer-events-none absolute -top-32 left-10 h-96 w-96 rounded-full bg-brand-200/40 blur-[110px]" />
        <Container wide className="relative py-16 lg:py-20">
          <div className="max-w-2xl">
            <Eyebrow>Pusat Belajar</Eyebrow>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-heading sm:text-5xl text-balance">
              Materi terstruktur untuk <span className="text-brand-600">tiga subtes</span> SKD
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate">
              Pilih subtes, pelajari modul dari dasar hingga HOTS, lalu langsung uji
              pemahamanmu lewat bank soal dan simulasi.
            </p>
          </div>
        </Container>
      </section>

      <Container wide className="py-14 lg:py-16">
        <BelajarTabs />
      </Container>

      {/* Modul PDF yang diunggah admin */}
      {modul.length > 0 && (
        <section className="border-t border-line bg-surface py-14 lg:py-16">
          <Container wide>
            <Eyebrow>Modul PDF</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-heading">
              Materi untuk diunduh
            </h2>
            <p className="mt-2 max-w-2xl text-slate">
              Modul PDF pilihan untuk memperdalam pemahamanmu. Klik untuk membuka atau
              mengunduh.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {modul.map((m) => (
                <a
                  key={m.id}
                  href={`/materi/${m.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="flex h-full flex-col p-5 transition-all hover:border-brand-600/40 hover:shadow-[var(--shadow-lift)]">
                    <div className="flex items-start justify-between gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                        <IconBook width={20} height={20} />
                      </span>
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-slate">
                        {m.kategori}
                      </span>
                    </div>
                    <p className="mt-3 font-bold text-heading">{m.judul}</p>
                    {m.deskripsi && (
                      <p className="mt-1 line-clamp-2 flex-1 text-sm text-slate">{m.deskripsi}</p>
                    )}
                    <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                      <IconDownload width={16} height={16} /> Buka PDF
                      <span className="text-xs font-normal text-slate-400">· {fmtUkuran(m.ukuran)}</span>
                    </p>
                  </Card>
                </a>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
