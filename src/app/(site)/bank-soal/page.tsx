import type { Metadata } from "next";
import { Container, Eyebrow, Card, ButtonLink } from "@/components/ui";
import { BankSoalBrowser } from "@/components/bank-soal-browser";
import { IconBook, IconArrowRight } from "@/components/icons";
import { getBankSoal } from "@/lib/soal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bank Soal",
  description:
    "Jelajahi bank soal SKD CPNS — filter berdasarkan subtes dan tingkat kesulitan, lengkap dengan kunci dan pembahasan.",
};

export default async function BankSoalPage() {
  // Bank soal terpisah dari soal simulasi — hanya soal mandiri (tanpa paket).
  const soal = await getBankSoal();

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0 bg-grid mask-fade-b opacity-60" />
        <div className="pointer-events-none absolute -top-32 right-10 h-96 w-96 rounded-full bg-gold-100/60 blur-[110px]" />
        <Container wide className="relative py-16 lg:py-20">
          <div className="max-w-2xl">
            <Eyebrow>Bank Soal</Eyebrow>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-heading sm:text-5xl text-balance">
              Latihan soal dengan <span className="text-brand-600">pembahasan</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate">
              Saring soal sesuai kebutuhanmu, kerjakan, lalu buka kunci dan pembahasannya
              untuk memahami logika di baliknya.
            </p>
          </div>
        </Container>
      </section>

      <Container wide className="py-14 lg:py-16">
        {soal.length === 0 ? (
          <Card className="mx-auto flex max-w-lg flex-col items-center gap-4 p-10 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <IconBook width={28} height={28} />
            </span>
            <div>
              <h2 className="text-xl font-bold text-heading">Bank soal segera hadir</h2>
              <p className="mt-2 text-slate">
                Soal latihan mandiri sedang kami siapkan dan akan segera ditambahkan.
                Sementara itu, kamu sudah bisa berlatih penuh lewat Simulasi CAT.
              </p>
            </div>
            <ButtonLink href="/tryout" size="lg">
              Coba Simulasi
              <IconArrowRight width={18} height={18} />
            </ButtonLink>
          </Card>
        ) : (
          <BankSoalBrowser soal={soal} />
        )}
      </Container>
    </>
  );
}
