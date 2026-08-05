"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ButtonLink, Button, Card } from "@/components/ui";
import { IconLayers, IconPlay, IconClock, IconClose, IconCheckCircle, IconLock } from "@/components/icons";
import { SUBTES_ORDER } from "@/lib/skd";
import { formatRupiah } from "@/lib/format";
import type { InfoPembayaran } from "@/lib/pengaturan";
import { beliPaketAction } from "@/app/(site)/tryout/actions";

export interface PaketKartu {
  id: string;
  nama: string;
  deskripsi: string;
  harga: number;
  jumlah: Record<string, number>;
  total: number;
  /** true = boleh langsung mengerjakan (gratis / sudah bayar / admin). */
  bisaAkses: boolean;
  /** true = paket gratis (bimbel) yang sedang dikunci pengajar — belum bisa dimulai. */
  terkunci?: boolean;
  /** true = ada pembayaran menunggu konfirmasi. */
  menunggu: boolean;
}

export function PaketPicker({
  paket,
  infoBayar,
  totalTarget,
}: {
  paket: PaketKartu[];
  infoBayar: InfoPembayaran;
  totalTarget: number;
}) {
  const [beli, setBeli] = useState<PaketKartu | null>(null);

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {paket.map((p) => (
        <Card key={p.id} className="flex flex-col p-6">
          <div className="flex items-start justify-between gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <IconLayers width={20} height={20} />
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                p.harga > 0 ? "bg-gold-100 text-gold-700" : "bg-success-50 text-success"
              }`}
            >
              {formatRupiah(p.harga)}
            </span>
          </div>
          <p className="mt-3 font-bold text-heading">{p.nama}</p>
          {p.deskripsi && <p className="mt-0.5 line-clamp-2 flex-1 text-sm text-slate">{p.deskripsi}</p>}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {SUBTES_ORDER.map((k) => (
              <span key={k} className="tnum rounded-lg bg-muted px-2 py-0.5 text-xs font-medium text-slate">
                {k} {p.jumlah[k] ?? 0}
              </span>
            ))}
          </div>

          {p.terkunci ? (
            <div className="mt-5 flex w-full flex-col items-center gap-1 rounded-xl border border-line bg-muted/50 px-4 py-2.5 text-center">
              <span className="flex items-center gap-2 text-sm font-semibold text-slate">
                <IconLock width={16} height={16} />
                Menunggu dibuka pengajar
              </span>
              <span className="text-xs text-slate-400">Paket akan aktif saat sesi kelas dimulai.</span>
            </div>
          ) : p.bisaAkses ? (
            <ButtonLink href={`/simulasi?paket=${p.id}`} size="md" className="mt-5 w-full">
              <IconPlay width={16} height={16} />
              Mulai
            </ButtonLink>
          ) : p.menunggu ? (
            <div className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gold-200 bg-gold-50/60 px-4 py-2.5 text-sm font-semibold text-gold-700">
              <IconClock width={16} height={16} />
              Menunggu konfirmasi
            </div>
          ) : (
            <Button size="md" className="mt-5 w-full" onClick={() => setBeli(p)}>
              <IconLock width={16} height={16} />
              Beli akses
            </Button>
          )}
        </Card>
      ))}

      {beli && (
        <BeliModal paket={beli} infoBayar={infoBayar} onClose={() => setBeli(null)} />
      )}

      {/* penanda agar totalTarget dipakai (jumlah soal ideal) */}
      <span className="sr-only">{totalTarget}</span>
    </div>
  );
}

function BeliModal({
  paket,
  infoBayar,
  onClose,
}: {
  paket: PaketKartu;
  infoBayar: InfoPembayaran;
  onClose: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState<null | "baru" | "sudah_pending" | "sudah_punya">(null);
  const [error, setError] = useState<string | null>(null);

  const ajukan = () =>
    startTransition(async () => {
      setError(null);
      const res = await beliPaketAction(paket.id);
      if (!res.ok) {
        setError(res.error ?? "Gagal mengajukan pembayaran.");
        return;
      }
      setDone(res.status ?? "baru");
      if (res.status === "sudah_punya") {
        router.refresh();
      }
    });

  const belumAdaRekening = !infoBayar.bankNama || !infoBayar.bankRekening;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4">
      <div className="absolute inset-0 bg-navy/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md rounded-3xl border border-line bg-surface p-6 shadow-[var(--shadow-lift)]"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-heading">Beli Paket</h2>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-heading" aria-label="Tutup">
            <IconClose width={18} height={18} />
          </button>
        </div>

        {done ? (
          <div className="mt-4 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-success-50 text-success">
              <IconCheckCircle width={28} height={28} />
            </span>
            <p className="mt-4 font-bold text-heading">
              {done === "sudah_punya"
                ? "Kamu sudah punya akses paket ini!"
                : done === "sudah_pending"
                  ? "Pembayaran sedang menunggu konfirmasi"
                  : "Permintaan terkirim!"}
            </p>
            <p className="mt-1 text-sm text-slate">
              {done === "sudah_punya"
                ? "Silakan mulai mengerjakan."
                : "Setelah transfer diverifikasi admin, akses paket akan otomatis terbuka. Cek kembali sebentar lagi."}
            </p>
            <Button className="mt-5 w-full" onClick={() => { onClose(); router.refresh(); }}>
              Mengerti
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-3 rounded-2xl bg-muted/50 p-4">
              <p className="text-sm text-slate">{paket.nama}</p>
              <p className="tnum text-2xl font-extrabold text-heading">{formatRupiah(paket.harga)}</p>
            </div>

            <div className="mt-4">
              <p className="text-sm font-semibold text-heading">Cara pembayaran</p>
              {belumAdaRekening ? (
                <p className="mt-2 rounded-xl border border-gold-200 bg-gold-50/60 p-3 text-sm text-slate">
                  Info rekening belum diatur admin. Kamu tetap bisa mengajukan, lalu hubungi admin
                  untuk instruksi transfer.
                </p>
              ) : (
                <div className="mt-2 space-y-1 rounded-xl border border-line bg-bg p-3 text-sm">
                  <p className="flex justify-between"><span className="text-slate">Bank</span><span className="font-semibold text-heading">{infoBayar.bankNama}</span></p>
                  <p className="flex justify-between"><span className="text-slate">No. Rekening</span><span className="tnum font-semibold text-heading">{infoBayar.bankRekening}</span></p>
                  <p className="flex justify-between"><span className="text-slate">Atas Nama</span><span className="font-semibold text-heading">{infoBayar.bankAtasNama}</span></p>
                </div>
              )}
              {infoBayar.instruksi && (
                <p className="mt-2 text-xs leading-relaxed text-slate">{infoBayar.instruksi}</p>
              )}
            </div>

            {error && (
              <p className="mt-3 rounded-xl border border-danger-100 bg-danger-50 p-3 text-sm text-danger">{error}</p>
            )}

            <div className="mt-5 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onClose} disabled={pending}>
                Batal
              </Button>
              <Button className="flex-1" onClick={ajukan} disabled={pending}>
                {pending ? "Mengirim…" : "Saya sudah transfer"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
