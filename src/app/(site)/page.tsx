import {
  Container,
  ButtonLink,
  Badge,
  SectionHeading,
  Card,
  Progress,
} from "@/components/ui";
import {
  IconArrowRight,
  IconPlay,
  IconShield,
  IconTarget,
  IconChart,
  IconBrain,
  IconCheckCircle,
  IconStar,
  IconQuote,
  IconSparkle,
  IconUsers,
  IconCheck,
} from "@/components/icons";
import { SUBTES, SUBTES_ORDER } from "@/lib/skd";
import { BANK_SOAL } from "@/data/questions";
import { RotatingWord } from "@/components/rotating-word";
import { Faq } from "@/components/faq";
import { formatRupiah } from "@/lib/format";
import { getTestimoniAktif, type TestimoniRingkas } from "@/lib/testimoni";
import { getPaketLanding, type PaketRingkas } from "@/lib/paket";
import Link from "next/link";
import type { CSSProperties, HTMLAttributes } from "react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [testimoni, paketLanding] = await Promise.all([
    getTestimoniAktif(),
    getPaketLanding(),
  ]);

  return (
    <>
      <Hero />
      <TrustStrip />
      <SubtesSection />
      <FeatureRows />
      <ExperienceSection />
      <TestimonialSection items={testimoni} />
      <PricingSection paket={paketLanding} />
      <FaqSection />
      <FinalCTA />
    </>
  );
}

/* ============================== HERO ============================== */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-grid mask-fade-b opacity-60" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-brand-200/40 blur-[120px]" />
      <div className="pointer-events-none absolute right-1/4 top-52 h-80 w-80 rounded-full bg-gold-100/50 blur-[110px]" />

      <Container wide className="relative py-14 lg:py-20">
        <div className="mx-auto max-w-3xl text-center animate-rise">
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-heading sm:text-5xl lg:text-[3.6rem] text-balance">
            Siap lulus seleksi{" "}
            <RotatingWord words={["CPNS", "PPPK", "BUMN"]} />
            <br className="hidden sm:block" /> tanpa kejutan di hari-H.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate">
            Belajar terstruktur TWK, TIU, dan TKP lalu uji dengan simulasi yang meniru
            sistem CAT BKN — timer presisi, navigasi soal, dan penilaian otomatis
            berbasis <strong className="text-heading">passing grade</strong> resmi.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/tryout" size="lg">
              <IconPlay width={18} height={18} />
              Mulai Simulasi Gratis
            </ButtonLink>
            <ButtonLink href="/login" size="lg" variant="outline">
              Masuk / Daftar
              <IconArrowRight width={18} height={18} />
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ============================== TRUST STRIP ============================== */
function TrustStrip() {
  const items = [
    { icon: IconShield, t: "Sesuai kisi-kisi", d: "Struktur SKD terbaru" },
    { icon: IconTarget, t: "Penilaian passing grade", d: "Per subtes, otomatis" },
    { icon: IconChart, t: "Analitik nilai", d: "Kelemahan per materi" },
    { icon: IconBrain, t: "Soal tipe HOTS", d: "Analisis, bukan hafalan" },
  ];
  return (
    <section className="border-y border-line bg-surface">
      <Container wide className="grid gap-px overflow-hidden rounded-none sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.t} className="flex items-center gap-3.5 py-6 pr-6">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <it.icon width={20} height={20} />
            </span>
            <div>
              <p className="text-sm font-semibold text-heading">{it.t}</p>
              <p className="text-xs text-slate">{it.d}</p>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}

/* ============================== SUBTES ============================== */
function SubtesSection() {
  return (
    <section className="py-14 lg:py-20">
      <Container wide>
        <SectionHeading
          eyebrow="Tiga Subtes SKD"
          title="Kuasai setiap subtes dengan target yang jelas"
          desc="Setiap subtes punya passing grade sendiri. Kamu harus lolos ketiganya — kami bantu petakan dari materi sampai simulasi."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {SUBTES_ORDER.map((key, i) => {
            const s = SUBTES[key];
            const jumlahBankSoal = BANK_SOAL.filter((q) => q.subtes === key).length;
            const accentText =
              s.accent === "gold"
                ? "text-gold-600"
                : s.accent === "success"
                  ? "text-success"
                  : "text-brand-600";
            const accentBg =
              s.accent === "gold"
                ? "bg-gold-50"
                : s.accent === "success"
                  ? "bg-success-50"
                  : "bg-brand-50";
            const Icon = [IconShield, IconBrain, IconUsers][i];
            return (
              <Card
                key={key}
                className="group relative flex flex-col overflow-hidden p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
              >
                <div className="flex items-center justify-between">
                  <span className={`grid h-12 w-12 place-items-center rounded-2xl ${accentBg} ${accentText}`}>
                    <Icon width={24} height={24} />
                  </span>
                  <span className="tnum text-5xl font-extrabold text-muted transition-colors group-hover:text-line-strong">
                    {key === "TWK" ? "01" : key === "TIU" ? "02" : "03"}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold text-heading">
                  {key} · {s.nama}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate">
                  {s.deskripsi}
                </p>
                <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5 text-center">
                  <div>
                    <dt className="tnum text-lg font-bold text-heading">{s.jumlahSoal}</dt>
                    <dd className="text-xs text-slate-400">soal</dd>
                  </div>
                  <div>
                    <dt className={`tnum text-lg font-bold ${accentText}`}>{s.passingGrade}</dt>
                    <dd className="text-xs text-slate-400">passing grade</dd>
                  </div>
                  <div>
                    <dt className="tnum text-lg font-bold text-heading">{s.nilaiMaks}</dt>
                    <dd className="text-xs text-slate-400">nilai maks</dd>
                  </div>
                </dl>
                <Link
                  href="/belajar"
                  className={`mt-6 inline-flex items-center gap-1.5 text-sm font-semibold ${accentText}`}
                >
                  Pelajari {key}
                  <IconArrowRight width={16} height={16} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <span className="text-[11px] text-slate-400">
                  {jumlahBankSoal} contoh soal tersedia
                </span>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

/* ============================== FEATURE ROWS (with mockups) ============================== */
function FeatureRows() {
  const rows = [
    {
      n: "01",
      eyebrow: "Hasil & Passing Grade",
      title: "Tahu lulus atau belum, seketika",
      desc: "Begitu selesai, nilai tiap subtes langsung dibandingkan dengan passing grade resmi, lengkap dengan pembahasan tiap soal.",
      checks: ["Nilai per subtes vs passing grade", "Verdict lulus otomatis", "Pembahasan langkah demi langkah"],
      cta: "Lihat contoh hasil",
      href: "/hasil",
      mock: <ResultMock />,
    },
  ];
  return (
    <section id="fitur" className="py-14 lg:py-20">
      <Container wide>
        <SectionHeading
          align="center"
          eyebrow="Semua dalam satu tempat"
          title="Semua kebutuhan lulus SKD, dibuat lebih mudah"
          desc="Dari materi, simulasi, sampai hasil berbasis passing grade — semua dirancang agar belajarmu lebih fokus."
          className="mx-auto"
        />
        <div className="mt-10 space-y-12 lg:space-y-16">
          {rows.map((r) => (
            <FeatureRow key={r.n} {...r} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function FeatureRow({
  n,
  eyebrow,
  title,
  desc,
  checks,
  cta,
  href,
  mock,
  reverse,
}: {
  n: string;
  eyebrow: string;
  title: string;
  desc: string;
  checks: string[];
  cta: string;
  href: string;
  mock: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
      <div className={reverse ? "lg:order-2" : ""}>
        <span className="tnum grid h-12 w-12 place-items-center rounded-2xl bg-brand-600 text-lg font-extrabold text-white shadow-[0_10px_24px_-12px_rgba(41,71,201,0.7)]">
          {n}
        </span>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
          {eyebrow}
        </p>
        <h3 className="mt-2 text-2xl font-bold text-heading sm:text-3xl text-balance">
          {title}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-slate">{desc}</p>
        <ul className="mt-6 space-y-3">
          {checks.map((c) => (
            <li key={c} className="flex items-center gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
                <IconCheck width={14} height={14} />
              </span>
              <span className="font-medium text-heading">{c}</span>
            </li>
          ))}
        </ul>
        <ButtonLink href={href} variant="navy" size="md" className="mt-7">
          {cta}
          <IconArrowRight width={16} height={16} />
        </ButtonLink>
      </div>
      <div className={`relative ${reverse ? "lg:order-1" : ""}`}>
        <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-brand-200/30 blur-3xl" />
        {mock}
      </div>
    </div>
  );
}

/* ---- Mockups (rendered inside landing feature rows) ---- */
function ResultMock() {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-[var(--shadow-lift)]">
      <div className="border-b border-line bg-muted/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-heading">Hasil Simulasi #12</p>
          <Badge tone="success">
            <IconCheckCircle width={14} height={14} />
            Lulus semua
          </Badge>
        </div>
      </div>
      <div className="space-y-5 p-6">
        {[
          { s: "TWK", nilai: 95, max: 150, pg: 65, tone: "brand" as const },
          { s: "TIU", nilai: 145, max: 175, pg: 80, tone: "success" as const },
          { s: "TKP", nilai: 188, max: 225, pg: 166, tone: "gold" as const },
        ].map((r) => (
          <div key={r.s}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-semibold text-heading">{r.s}</span>
              <span className="tnum text-slate">
                <span className="font-bold text-heading">{r.nilai}</span> / {r.max} · PG {r.pg}
              </span>
            </div>
            <Progress value={r.nilai} max={r.max} tone={r.tone} />
          </div>
        ))}
        <div className="flex items-center justify-between rounded-xl bg-navy px-5 py-4 text-white">
          <span className="text-sm text-slate-400">Total nilai</span>
          <span className="tnum text-2xl font-bold">428</span>
        </div>
      </div>
    </div>
  );
}

/* ============================== FAQ ============================== */
function FaqSection() {
  return (
    <section className="py-14 lg:py-20">
      <Container wide>
        <SectionHeading
          align="center"
          eyebrow="FAQ"
          title="Pertanyaan yang sering muncul"
          desc="Hal-hal yang biasa ditanyakan sebelum mulai berlatih."
          className="mx-auto"
        />
        <Faq />
      </Container>
    </section>
  );
}

/* ============================== EXPERIENCE / HOW ============================== */
function ExperienceSection() {
  const steps = [
    {
      n: "01",
      t: "Pelajari materi terstruktur",
      d: "Modul TWK, TIU, TKP dari dasar sampai HOTS, lengkap dengan poin kunci tiap topik.",
    },
    {
      n: "02",
      t: "Kerjakan simulasi CAT",
      d: "Masuk ruang ujian: timer berjalan, navigasi soal aktif, tandai yang ragu, lalu submit.",
    },
    {
      n: "03",
      t: "Baca pembahasan & analitik",
      d: "Lihat nilai per subtes vs passing grade, kelemahan per materi, dan pembahasan tiap soal.",
    },
  ];
  return (
    <section className="py-14 lg:py-20">
      <Container wide>
        <SectionHeading
          align="center"
          eyebrow="Alur Belajar"
          title="Tiga langkah dari nol menuju siap ujian"
          desc="Sistem yang mengulang siklus belajar–uji–evaluasi sampai nilaimu stabil di atas passing grade."
          className="mx-auto"
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <Card key={s.n} className="p-7">
              <span className="tnum grid h-12 w-12 place-items-center rounded-2xl bg-navy text-base font-bold text-white">
                {s.n}
              </span>
              <h3 className="mt-5 text-lg font-bold text-heading">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate">{s.d}</p>
            </Card>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/tryout" size="lg">
            Coba alurnya sekarang
            <IconArrowRight width={18} height={18} />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

/* ============================== TESTIMONIALS ============================== */
const TESTIMONI_CONTOH: TestimoniRingkas[] = [
  { id: "c1", nama: "Rani Puspitasari", peran: "Peserta SKD · ilustrasi", pesan: "Simulasinya benar-benar seperti CAT asli. Pas hari-H saya tidak kaget dengan timer dan navigasi soalnya.", rating: 5, aktif: true, urutan: 0 },
  { id: "c2", nama: "Bagas Hartono", peran: "Peserta SKD · ilustrasi", pesan: "Pembahasan per materi bikin saya sadar TIU deret angka saya lemah. Setelah fokus latihan, terasa jauh lebih siap.", rating: 5, aktif: true, urutan: 0 },
  { id: "c3", nama: "Siti Maulida", peran: "Peserta SKD · ilustrasi", pesan: "Pembahasan TKP-nya paling membantu. Akhirnya paham pola jawaban poin 5, bukan sekadar menghafal.", rating: 5, aktif: true, urutan: 0 },
];

function TestimonialSection({ items }: { items: TestimoniRingkas[] }) {
  const pakaiContoh = items.length === 0;
  const data = pakaiContoh ? TESTIMONI_CONTOH : items;
  // Bagi jadi 2 baris berselang-seling bila cukup banyak, agar dinding terasa penuh.
  const rows =
    data.length >= 6
      ? [data.filter((_, i) => i % 2 === 0), data.filter((_, i) => i % 2 === 1)]
      : [data];

  return (
    <section className="overflow-hidden py-14 lg:py-20">
      <Container wide>
        <SectionHeading
          align="center"
          eyebrow="Kata Mereka"
          title="Dipercaya para pejuang SKD"
          desc={
            pakaiContoh
              ? "Cuplikan di bawah hanya contoh ilustrasi — akan otomatis berganti begitu kamu menambah testimoni di panel admin."
              : "Cerita nyata dari peserta yang telah berlatih bersama kami."
          }
        />
        {pakaiContoh && (
          <div className="mt-5 flex justify-center">
            <Badge tone="neutral">Contoh ilustrasi</Badge>
          </div>
        )}
      </Container>

      <div className="mt-12 flex flex-col gap-6">
        {rows.map((row, i) => (
          <MarqueeRow key={i} items={row} reverse={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

function MarqueeRow({ items, reverse }: { items: TestimoniRingkas[]; reverse?: boolean }) {
  if (items.length === 0) return null;
  // Penuhi lebar minimal agar loop mulus, lalu gandakan (dua paruh identik).
  let base = items;
  while (base.length < 6) base = [...base, ...items];
  const seq = [...base, ...base];
  const durasi = Math.max(24, base.length * 5); // detik; makin banyak kartu makin lama (kecepatan tetap)

  return (
    <div className="marquee">
      <div
        className={`marquee-track${reverse ? " reverse" : ""}`}
        style={{ "--marquee-duration": `${durasi}s` } as CSSProperties}
      >
        {seq.map((t, i) => (
          <TestiCard key={i} t={t} aria-hidden={i >= base.length} />
        ))}
      </div>
    </div>
  );
}

function TestiCard({
  t,
  ...rest
}: { t: TestimoniRingkas } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className="mr-6 flex h-52 w-[19rem] shrink-0 flex-col rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:w-[22rem]"
    >
      <div className="flex items-center justify-between">
        <IconQuote width={26} height={26} className="text-brand-200" />
        <span className="flex items-center gap-0.5 text-gold-500">
          {Array.from({ length: t.rating }).map((_, i) => (
            <IconStar key={i} width={13} height={13} />
          ))}
        </span>
      </div>
      <p className="mt-3 line-clamp-3 text-[0.9rem] leading-relaxed text-heading">
        “{t.pesan}”
      </p>
      <div className="mt-auto flex items-center gap-3 border-t border-line pt-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy text-sm font-bold text-white">
          {t.nama.charAt(0)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-heading">{t.nama}</p>
          {t.peran && <p className="truncate text-xs text-slate-400">{t.peran}</p>}
        </div>
      </div>
    </div>
  );
}

/* ============================== PRICING ============================== */
function PricingSection({ paket }: { paket: PaketRingkas[] }) {
  const kosong = paket.length === 0;
  return (
    <section className="border-t border-line bg-surface py-14 lg:py-20">
      <Container wide>
        <SectionHeading
          align="center"
          eyebrow="Harga"
          title="Pilih paket, mulai berlatih"
          desc={
            kosong
              ? "Paket akan tampil di sini begitu kamu menambahkannya di panel admin."
              : "Setiap paket berisi soal setara CAT BKN, lengkap dengan pembahasan dan analitik nilai."
          }
        />

        {kosong ? (
          <div className="mx-auto mt-10 max-w-md">
            <Card className="p-8 text-center">
              <p className="text-slate">Belum ada paket yang ditampilkan.</p>
              <ButtonLink href="/tryout" size="md" className="mt-5">
                Lihat Simulasi
              </ButtonLink>
            </Card>
          </div>
        ) : (
          <div className="mx-auto mt-10 grid max-w-5xl items-start gap-6 lg:grid-cols-3">
            {paket.map((p) => {
              const gratis = p.harga <= 0;
              const features = [
                `${p.total} soal · TWK ${p.jumlah.TWK} · TIU ${p.jumlah.TIU} · TKP ${p.jumlah.TKP}`,
                "Pembahasan lengkap tiap soal",
                "Penilaian passing grade otomatis",
                "Peringkat & analitik di dashboard",
              ];
              return (
                <div
                  key={p.id}
                  className={`relative flex flex-col rounded-3xl border p-7 ${
                    p.populer
                      ? "border-brand-600 bg-surface shadow-[var(--shadow-lift)] lg:-mt-4 lg:mb-4"
                      : "border-line bg-surface shadow-[var(--shadow-card)]"
                  }`}
                >
                  {p.populer && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge tone="gold">
                        <IconStar width={12} height={12} />
                        Paling populer
                      </Badge>
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-heading">{p.nama}</h3>
                  {p.deskripsi && <p className="mt-1 text-sm text-slate">{p.deskripsi}</p>}
                  <div className="mt-5 flex items-end gap-1.5">
                    <span className="text-4xl font-extrabold tracking-tight text-heading">
                      {formatRupiah(p.harga)}
                    </span>
                    {!gratis && <span className="mb-1 text-sm text-slate-400">/ paket</span>}
                  </div>
                  <ButtonLink
                    href="/tryout"
                    variant={p.populer ? "primary" : "outline"}
                    size="md"
                    className="mt-6 w-full"
                  >
                    {gratis ? "Mulai Gratis" : "Beli Paket"}
                  </ButtonLink>
                  <ul className="mt-7 space-y-3 border-t border-line pt-6">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-slate">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
                          <IconCheck width={12} height={12} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}

/* ============================== FINAL CTA ============================== */
function FinalCTA() {
  return (
    <section className="py-14 lg:py-20">
      <Container wide>
        <div className="relative overflow-hidden rounded-3xl bg-navy px-8 py-16 text-center sm:px-16 lg:py-20">
          <div className="pointer-events-none absolute inset-0 bg-dots opacity-[0.15]" />
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-600/30 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-gold-500/20 blur-[90px]" />
          <div className="relative mx-auto max-w-2xl">
            <Badge tone="gold" className="mb-6">
              <IconSparkle width={14} height={14} />
              Gratis untuk paket pertama
            </Badge>
            <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl text-balance">
              Hari-H hanya sekali. Bersiaplah seolah kamu sudah pernah menjalaninya.
            </h2>
            <p className="mt-5 text-lg text-slate-400">
              Masuk ruang simulasi CAT sekarang dan lihat di mana posisimu terhadap
              passing grade.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/tryout" size="lg" variant="gold">
                <IconPlay width={18} height={18} />
                Mulai Simulasi Sekarang
              </ButtonLink>
              <ButtonLink
                href="/belajar"
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10"
              >
                Lihat Materi Dulu
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
