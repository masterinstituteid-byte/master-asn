import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container, ButtonLink } from "@/components/ui";
import { IconArrowLeft, IconInfo } from "@/components/icons";
import { currentSession } from "@/lib/session-server";
import { getHasilReview } from "@/lib/hasil";
import { HasilView } from "@/components/hasil-view";

export const metadata: Metadata = {
  title: "Detail Riwayat",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function RiwayatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await currentSession();
  if (!session) redirect(`/login?next=/riwayat/${id}`);

  // getHasilReview memverifikasi kepemilikan — hasil peserta lain → null.
  const hasil = await getHasilReview(id, session.sub);
  if (!hasil) redirect("/riwayat");

  // Ujian lama (dibuat sebelum fitur riwayat) tak punya snapshot pembahasan.
  if (!hasil.snapshot) {
    return (
      <Container wide className="py-20">
        <div className="mx-auto max-w-md text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-muted text-slate-400">
            <IconInfo width={28} height={28} />
          </span>
          <h1 className="mt-6 text-2xl font-bold text-heading">
            Pembahasan tidak tersedia
          </h1>
          <p className="mt-2 text-slate">
            Simulasi ini dikerjakan sebelum fitur riwayat pembahasan aktif, sehingga
            detail soalnya tidak tersimpan. Simulasi berikutnya akan tersimpan lengkap.
          </p>
          <ButtonLink href="/riwayat" size="lg" className="mt-8">
            <IconArrowLeft width={18} height={18} />
            Kembali ke Riwayat
          </ButtonLink>
        </div>
      </Container>
    );
  }

  return <HasilView hasil={hasil.snapshot} variant="riwayat" tanggal={hasil.createdAt} />;
}
