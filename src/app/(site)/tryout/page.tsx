import type { Metadata } from "next";
import {
  Container,
  ButtonLink,
  Card,
  SectionHeading,
  Eyebrow,
} from "@/components/ui";
import {
  IconClock,
  IconLayers,
  IconFlag,
  IconTarget,
  IconPlay,
  IconInfo,
  IconCheckCircle,
  IconArrowRight,
} from "@/components/icons";
import { SUBTES, SUBTES_ORDER, SKD_TOTAL_SOAL } from "@/lib/skd";
import { TRYOUT_DURASI_DETIK } from "@/lib/tryout-config";
import { getAllPaket } from "@/lib/paket";
import { getAksesUser, getPendingPaketUser } from "@/lib/transaksi";
import { getInfoPembayaran } from "@/lib/pengaturan";
import { currentSession } from "@/lib/session-server";
import { isAdminEmail } from "@/lib/session";
import { PaketPicker, type PaketKartu } from "@/components/paket-picker";

export const metadata: Metadata = {
  title: "Simulasi CAT",
  description:
    "Mulai simulasi SKD CPNS dengan sistem CAT: timer, navigasi soal bebas, dan penilaian passing grade otomatis.",
};

export const dynamic = "force-dynamic";

export default async function TryoutPage() {
  const paketList = (await getAllPaket()).filter((p) => p.aktif && p.total > 0);
  const total = SKD_TOTAL_SOAL;
  const menit = Math.round(TRYOUT_DURASI_DETIK / 60);

  // Hak akses per paket untuk pengguna saat ini.
  const session = await currentSession();
  const admin = isAdminEmail(session?.email);
  const [aksesSet, pendingSet, infoBayar] = session
    ? await Promise.all([
        getAksesUser(session.sub),
        getPendingPaketUser(session.sub),
        getInfoPembayaran(),
      ])
    : [new Set<string>(), new Set<string>(), await getInfoPembayaran()];

  const kartu: PaketKartu[] = paketList.map((p) => {
    const bisaAkses = admin || p.harga <= 0 || aksesSet.has(p.id);
    // Kunci hanya berlaku untuk paket gratis (bimbel); admin selalu bisa mulai (untuk menguji).
    const terkunci = p.harga === 0 && p.terkunci && !admin;
    return {
      id: p.id,
      nama: p.nama,
      deskripsi: p.deskripsi,
      harga: p.harga,
      jumlah: p.jumlah,
      total: p.total,
      bisaAkses,
      terkunci,
      menunggu: !bisaAkses && pendingSet.has(p.id),
    };
  });

  const aturan = [
    { icon: IconClock, t: `Waktu ${menit} menit`, d: "Timer berjalan mundur otomatis dan tidak bisa dijeda." },
    { icon: IconLayers, t: "Navigasi bebas", d: "Lompat ke soal mana pun lewat panel navigator." },
    { icon: IconFlag, t: "Lewati atau kunci", d: "Lewati soal untuk dijawab nanti, atau simpan jawaban lalu lanjut." },
    { icon: IconTarget, t: "Auto-submit", d: "Saat waktu habis, semua jawaban tersimpan & dinilai otomatis." },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0 bg-grid mask-fade-b opacity-60" />
        <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-brand-200/40 blur-[110px]" />
        <Container wide className="relative py-16 lg:py-20">
          <div className="max-w-2xl">
            <Eyebrow>Simulasi CAT</Eyebrow>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-heading sm:text-5xl text-balance">
              Paket Simulasi SKD — <span className="text-brand-600">Ujian Penuh</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate">
              Pengalaman ruang ujian yang meniru CAT BKN. Kerjakan {total} soal
              contoh mencakup TWK, TIU, dan TKP, lalu terima penilaian per subtes
              berbasis passing grade resmi.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#pilih-paket" size="lg">
                <IconPlay width={18} height={18} />
                Pilih Paket & Mulai
              </ButtonLink>
              <ButtonLink href="/belajar" size="lg" variant="outline">
                Belum siap? Belajar dulu
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <Container wide className="py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          {/* Rules */}
          <div>
            <SectionHeading
              title="Sebelum mulai, pahami aturannya"
              desc="Kondisikan dirimu seperti sedang berada di ruang ujian sesungguhnya."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {aturan.map((a) => (
                <Card key={a.t} className="flex gap-4 p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                    <a.icon width={20} height={20} />
                  </span>
                  <div>
                    <p className="font-semibold text-heading">{a.t}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate">{a.d}</p>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="mt-6 flex gap-4 border-brand-100 bg-brand-50/50 p-5">
              <IconInfo width={22} height={22} className="mt-0.5 shrink-0 text-brand-600" />
              <p className="text-sm leading-relaxed text-slate">
                <strong className="text-heading">Skema penilaian.</strong> TWK &amp; TIU:
                jawaban benar bernilai 5, salah/kosong 0. TKP: setiap pilihan bernilai
                1–5 poin. Kamu dinyatakan lulus jika nilai <em>setiap</em> subtes
                mencapai passing grade-nya.
              </p>
            </Card>
          </div>

          {/* Skema penilaian ringkas */}
          <div>
            <Card className="overflow-hidden p-0">
              <div className="border-b border-line bg-navy px-6 py-5 text-white">
                <p className="text-xs uppercase tracking-wider text-slate-400">Struktur SKD</p>
                <p className="text-lg font-bold">{total} soal · {menit} menit</p>
              </div>
              <div className="divide-y divide-line">
                {SUBTES_ORDER.map((key) => {
                  const s = SUBTES[key];
                  return (
                    <div key={key} className="flex items-center justify-between px-6 py-4">
                      <div>
                        <p className="font-semibold text-heading">{key} · {s.nama}</p>
                        <p className="text-xs text-slate-400">Passing grade {s.passingGrade}</p>
                      </div>
                      <span className="tnum text-sm font-semibold text-slate">{s.jumlahSoal} soal</span>
                    </div>
                  );
                })}
              </div>
              <div className="p-6">
                <ul className="space-y-2.5">
                  {["Penilaian otomatis per subtes", "Pembahasan tiap soal", "Hasil tersimpan di perangkat"].map((t) => (
                    <li key={t} className="flex items-center gap-2.5 text-sm text-slate">
                      <IconCheckCircle width={16} height={16} className="text-success" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
            <ButtonLink href="/dashboard" variant="ghost" size="md" className="mt-4 w-full">
              Lihat riwayat nilai
              <IconArrowRight width={16} height={16} />
            </ButtonLink>
          </div>
        </div>

        {/* ===== Pilih Paket ===== */}
        <div id="pilih-paket" className="mt-16 scroll-mt-24 lg:mt-20">
          <SectionHeading
            title="Pilih paket simulasi"
            desc="Setiap paket berisi satu set soal lengkap. Pilih satu untuk masuk ruang ujian."
          />

          {kartu.length === 0 ? (
            <Card className="mt-8 flex items-center gap-4 p-6">
              <IconInfo width={22} height={22} className="shrink-0 text-brand-600" />
              <p className="text-sm text-slate">
                Belum ada paket yang siap dikerjakan. Admin dapat menambahkan paket &amp; soal
                dari panel admin.
              </p>
            </Card>
          ) : (
            <PaketPicker paket={kartu} infoBayar={infoBayar} totalTarget={total} />
          )}
        </div>
      </Container>
    </>
  );
}
