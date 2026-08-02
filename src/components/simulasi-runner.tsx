"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  SUBTES,
  hitungHasil,
  formatWaktu,
  HASIL_STORAGE_KEY,
  type Soal,
  type HasilTersimpan,
} from "@/lib/skd";
import { TRYOUT_DURASI_DETIK } from "@/lib/tryout-config";
import {
  Logo,
  IconClock,
  IconArrowRight,
  IconGrid,
  IconClose,
  IconCheck,
  IconWarning,
} from "@/components/icons";
import { Button, Container, ButtonLink } from "@/components/ui";
import { TeksSoal } from "@/components/teks-soal";
import { simpanHasilAction } from "@/app/simulasi/actions";

// Progres ujian yang disimpan agar bisa dilanjutkan setelah refresh / jaringan putus.
interface ProgresSim {
  deadline: number;
  index: number;
  answers: Record<string, string | null>;
}

function bacaProgres(key: string): ProgresSim | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const p = JSON.parse(raw) as ProgresSim;
    return typeof p.deadline === "number" ? p : null;
  } catch {
    return null;
  }
}

export function SimulasiRunner({
  soal: soalList,
  paketId,
  paketNama,
}: {
  soal: Soal[];
  paketId: string | null;
  paketNama: string;
}) {
  const router = useRouter();
  const total = soalList.length;
  const storageKey = `masterasn:sim:${paketId ?? "default"}`;

  // Nilai awal aman untuk SSR (localStorage tak ada di server). Progres dipulihkan
  // SETELAH mount agar server & klien cocok (tidak ada hydration mismatch).
  const [deadline, setDeadline] = useState(() => Date.now() + TRYOUT_DURASI_DETIK * 1000);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [timeLeft, setTimeLeft] = useState(TRYOUT_DURASI_DETIK);
  const [siapSimpan, setSiapSimpan] = useState(false);

  // Pulihkan progres dari localStorage sekali setelah mount (khusus klien).
  useEffect(() => {
    const r = bacaProgres(storageKey);
    if (r && r.deadline > Date.now()) {
      setDeadline(r.deadline);
      if (typeof r.index === "number") setIndex(Math.min(r.index, Math.max(0, total - 1)));
      if (r.answers) setAnswers(r.answers);
    }
    setSiapSimpan(true);
  }, [storageKey, total]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pending, setPending] = useState<string | null>(null); // pilihan sementara (belum tersimpan)

  const soal = soalList[index];
  const dijawab = soal ? !!answers[soal.id] : false;

  const terjawab = useMemo(
    () => soalList.filter((s) => answers[s.id]).length,
    [soalList, answers],
  );

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    const sisa = Math.max(0, Math.round((deadline - Date.now()) / 1000));
    const terpakai = TRYOUT_DURASI_DETIK - sisa;
    const hasil = hitungHasil(soalList, answers, terpakai);
    const tersimpan: HasilTersimpan = { ...hasil, soal: soalList, paketId, paketNama };
    try {
      localStorage.setItem(HASIL_STORAGE_KEY, JSON.stringify(tersimpan));
      localStorage.removeItem(storageKey); // progres selesai — bersihkan
    } catch {
      /* ignore */
    }
    // Simpan ke database, tertaut ke akun peserta (gagal ≠ menghalangi hasil).
    try {
      await simpanHasilAction({
        paketId,
        paketNama,
        nilaiTotal: hasil.nilaiTotal,
        nilaiMaksTotal: hasil.nilaiMaksTotal,
        lulusSemua: hasil.lulusSemua,
        perSubtes: hasil.perSubtes,
        jumlahSoal: soalList.length,
        waktuTerpakaiDetik: terpakai,
      });
    } catch {
      /* ignore */
    }
    router.push("/hasil");
  }, [soalList, answers, deadline, router, paketId, paketNama, storageKey]);

  // Simpan progres otomatis (jawaban, posisi, deadline) agar ujian bisa dilanjutkan
  // setelah refresh / jaringan putus / ganti koneksi.
  useEffect(() => {
    // Jangan menyimpan sebelum pemulihan progres selesai (agar tidak menimpa data lama).
    if (!siapSimpan || submitting || total === 0) return;
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ deadline, index, answers } satisfies ProgresSim),
      );
    } catch {
      /* ignore */
    }
  }, [answers, index, deadline, siapSimpan, submitting, total, storageKey]);

  // Countdown berbasis jam nyata — tetap akurat meski tab tidak aktif / di-background.
  useEffect(() => {
    if (submitting) return;
    const tick = () => {
      const sisa = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      setTimeLeft(sisa);
      if (sisa <= 0) handleSubmit();
    };
    tick(); // sinkronkan langsung
    const id = setInterval(tick, 1000);
    // Saat kembali ke tab, segera koreksi tampilan waktunya.
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [submitting, deadline, handleSubmit]);

  // Saat pindah soal, tampilkan kembali jawaban yang SUDAH tersimpan (jika ada).
  useEffect(() => {
    if (soal) setPending(answers[soal.id] ?? null);
  }, [index, answers, soal]);

  // Bila belum ada soal sama sekali (bank soal kosong).
  if (total === 0 || !soal) {
    return (
      <Container wide className="py-24">
        <div className="mx-auto max-w-md text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-muted text-slate-400">
            <IconWarning width={28} height={28} />
          </span>
          <h1 className="mt-6 text-2xl font-bold text-heading">Bank soal masih kosong</h1>
          <p className="mt-2 text-slate">
            Belum ada soal untuk dijadikan paket simulasi. Tambahkan soal melalui
            panel admin terlebih dahulu.
          </p>
          <ButtonLink href="/admin" size="lg" className="mt-8">
            Buka Panel Admin
            <IconArrowRight width={18} height={18} />
          </ButtonLink>
        </div>
      </Container>
    );
  }

  const cfg = SUBTES[soal.subtes];

  // Memilih opsi hanya menandai pilihan sementara — belum terkunci.
  const pilih = (optId: string) => setPending(optId);

  const goto = (i: number) => {
    setIndex(Math.max(0, Math.min(total - 1, i)));
    setNavOpen(false);
  };

  // Lewati tanpa mengunci jawaban.
  const lewatkan = () => {
    if (index === total - 1) setShowConfirm(true);
    else goto(index + 1);
  };

  // Kunci jawaban lalu lanjut.
  const simpanLanjut = () => {
    if (pending) setAnswers((a) => ({ ...a, [soal.id]: pending }));
    if (index === total - 1) setShowConfirm(true);
    else goto(index + 1);
  };

  const lowTime = timeLeft <= 300;

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="hidden sm:block">
            <Logo />
          </div>
          <span className="rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white sm:hidden">
            Simulasi SKD
          </span>

          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Timer — pojok kanan atas */}
            <div
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 tabular-nums ${
                lowTime ? "bg-danger-50 text-danger animate-pulse-ring" : "bg-muted text-heading"
              }`}
              role="timer"
              aria-live="off"
            >
              <IconClock width={18} height={18} />
              <span className="tnum text-base font-bold">{formatWaktu(timeLeft)}</span>
            </div>
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-heading lg:hidden"
              aria-label="Buka navigasi soal"
            >
              <IconGrid width={18} height={18} />
            </button>
            <Button size="sm" variant="navy" onClick={() => setShowConfirm(true)}>
              Selesai
            </Button>
          </div>
        </div>
        <div className="h-1 w-full bg-muted">
          <div
            className="h-full bg-brand-600 transition-[width] duration-300"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </header>

      {/* ===== Body: navigator KIRI, soal KANAN ===== */}
      <div className="mx-auto grid w-full max-w-7xl flex-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[200px_1fr] lg:py-8">
        {/* Navigator (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-line bg-surface p-3 shadow-[var(--shadow-card)]">
            <Navigator soalList={soalList} index={index} answers={answers} onGoto={goto} />
          </div>
        </aside>

        {/* Soal */}
        <section aria-label="Soal">
          <div className="rounded-3xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:p-7">
            <div className="flex gap-3 sm:gap-4">
              {/* Nomor soal — kiri, merah bila belum dijawab / hijau bila sudah */}
              <div className="shrink-0 text-center">
                <div
                  className={`grid h-7 w-7 place-items-center rounded-lg text-xs font-bold text-white shadow-sm sm:h-8 sm:w-8 sm:text-sm ${
                    dijawab ? "bg-success" : "bg-danger"
                  }`}
                  aria-label={`Soal nomor ${index + 1}, ${dijawab ? "sudah dijawab" : "belum dijawab"}`}
                >
                  {index + 1}
                </div>
              </div>

              {/* Konten soal */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100">
                    {soal.subtes} · {cfg.nama}
                  </span>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-slate">
                    {soal.materi}
                  </span>
                </div>

                <TeksSoal
                  text={soal.pertanyaan}
                  className="mt-4 text-lg font-medium leading-relaxed text-heading"
                />
                {soal.gambar && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`/gambar/${soal.gambar}`}
                    alt="Gambar soal"
                    className="mt-4 max-h-72 w-auto max-w-full rounded-xl border border-line bg-white object-contain"
                  />
                )}

                <div className="mt-6 space-y-3" role="radiogroup" aria-label="Pilihan jawaban">
                  {soal.opsi.map((o) => {
                    const selected = pending === o.id;
                    return (
                      <button
                        key={o.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => pilih(o.id)}
                        className={`flex w-full items-start gap-3.5 rounded-2xl border px-4 py-3.5 text-left text-[0.95rem] transition-all duration-150 ${
                          selected
                            ? "border-brand-600 bg-brand-50 font-semibold text-brand-700 shadow-[0_0_0_1px_var(--color-brand-600)]"
                            : "border-line bg-surface text-slate hover:border-line-strong hover:bg-muted/40"
                        }`}
                      >
                        <span
                          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-sm font-bold ${
                            selected
                              ? "border-brand-600 bg-brand-600 text-white"
                              : "border-line-strong text-slate-400"
                          }`}
                        >
                          {o.id}
                        </span>
                        <span className="flex-1">
                          {o.teks}
                          {o.gambar && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={`/gambar/${o.gambar}`}
                              alt={`Pilihan ${o.id}`}
                              className={`${o.teks ? "mt-2" : ""} max-h-40 w-auto max-w-full rounded-lg border border-line bg-white object-contain`}
                            />
                          )}
                        </span>
                        {selected && <IconCheck width={18} height={18} className="shrink-0 self-start text-brand-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Aksi: Lewatkan (kuning) · Simpan & lanjutkan (hijau) */}
          <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={lewatkan}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#eab308] px-5 text-[0.95rem] font-semibold text-[#3a2c05] transition-all hover:bg-[#d4a107] active:scale-[0.98]"
            >
              Lewatkan
              <IconArrowRight width={18} height={18} />
            </button>

            {pending && (
              <button
                type="button"
                onClick={simpanLanjut}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-success px-5 text-[0.95rem] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(4,120,87,0.8)] transition-all hover:brightness-110 active:scale-[0.98]"
              >
                {index === total - 1 ? "Simpan & Selesai" : "Simpan & lanjutkan"}
                <IconCheck width={18} height={18} />
              </button>
            )}
          </div>
        </section>
      </div>

      {/* Navigator (mobile sheet) */}
      {navOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-navy/50 backdrop-blur-sm"
            onClick={() => setNavOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-3xl border-t border-line bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold text-heading">Navigasi Soal</p>
              <button
                type="button"
                onClick={() => setNavOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-heading"
                aria-label="Tutup"
              >
                <IconClose width={18} height={18} />
              </button>
            </div>
            <Navigator soalList={soalList} index={index} answers={answers} onGoto={goto} />
          </div>
        </div>
      )}

      {/* Confirm submit modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] grid place-items-center p-4">
          <div
            className="absolute inset-0 bg-navy/50 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="konfirmasi-judul"
            className="relative w-full max-w-md rounded-3xl border border-line bg-surface p-7 shadow-[var(--shadow-lift)]"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <IconWarning width={24} height={24} />
            </span>
            <h2 id="konfirmasi-judul" className="mt-4 text-xl font-bold text-heading">
              Selesaikan simulasi?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate">
              Setelah dikumpulkan, jawaban tidak dapat diubah. Pastikan kamu sudah
              mengecek soal yang masih ditandai merah.
            </p>
            <dl className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-muted/50 p-4 text-center">
              <div>
                <dt className="tnum text-xl font-bold text-success">{terjawab}</dt>
                <dd className="text-xs text-slate">terjawab</dd>
              </div>
              <div>
                <dt className="tnum text-xl font-bold text-danger">{total - terjawab}</dt>
                <dd className="text-xs text-slate">belum dijawab</dd>
              </div>
            </dl>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowConfirm(false)}>
                Kembali
              </Button>
              <Button variant="primary" className="flex-1" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Menilai…" : "Kumpulkan & Nilai"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== Navigator ===================== */
function Navigator({
  soalList,
  index,
  answers,
  onGoto,
}: {
  soalList: Soal[];
  index: number;
  answers: Record<string, string | null>;
  onGoto: (i: number) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-1">
      {soalList.map((s, i) => {
        const current = i === index;
        const answered = !!answers[s.id];
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onGoto(i)}
            aria-label={`Soal ${i + 1}${answered ? ", sudah dijawab" : ", belum dijawab"}`}
            aria-current={current ? "true" : undefined}
            className={`tnum grid aspect-square place-items-center rounded-lg text-xs font-bold transition-all ${
              current
                ? "bg-navy text-white ring-2 ring-gold-400 ring-offset-1"
                : answered
                  ? "bg-success text-white hover:brightness-110"
                  : "bg-danger text-white hover:brightness-110"
            }`}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}
