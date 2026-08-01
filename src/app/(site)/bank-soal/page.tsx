import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { BankSoalBrowser } from "@/components/bank-soal-browser";
import { getAllSoal, seedSoalIfEmpty } from "@/lib/soal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bank Soal",
  description:
    "Jelajahi bank soal SKD CPNS — filter berdasarkan subtes dan tingkat kesulitan, lengkap dengan kunci dan pembahasan.",
};

export default async function BankSoalPage() {
  await seedSoalIfEmpty();
  const soal = await getAllSoal();

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
        <BankSoalBrowser soal={soal} />
      </Container>
    </>
  );
}
