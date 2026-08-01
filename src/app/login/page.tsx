"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo, IconArrowRight, IconArrowLeft, IconEye, IconCheck, IconInfo, IconWarning } from "@/components/icons";
import { Button } from "@/components/ui";
import { safeNext } from "@/lib/auth";

type Mode = "masuk" | "daftar";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("masuk");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [next, setNext] = useState("/dashboard");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNext(safeNext(params.get("next")));
    if (params.get("daftar") === "1" || params.get("tab") === "daftar") {
      setMode("daftar");
    }
    const err = params.get("error");
    if (err === "google_unconfigured") {
      setError(
        "Login Google belum dikonfigurasi. Isi GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET di .env lalu jalankan ulang server.",
      );
    } else if (err === "google_failed") {
      setError("Login Google gagal. Silakan coba lagi.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const endpoint = mode === "masuk" ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Terjadi kesalahan. Coba lagi.");
        setLoading(false);
        return;
      }
      // sesi ter-set via httpOnly cookie; navigasi penuh agar proxy membacanya
      window.location.href = next;
    } catch {
      setError("Tidak dapat terhubung ke server. Coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Brand panel (desktop) */}
      <aside className="relative hidden overflow-hidden bg-navy p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-[0.12]" />
        <div className="pointer-events-none absolute -left-20 -top-16 h-72 w-72 rounded-full bg-brand-600/30 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-gold-500/20 blur-[90px]" />

        <div className="relative">
          <span className="font-display text-2xl font-extrabold uppercase tracking-tight">
            Master<span className="text-brand-400"> ASN</span>
          </span>
          <p className="mt-1 text-xs font-semibold tracking-wide text-slate-400">
            by Master Institute
          </p>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-3xl font-extrabold leading-tight text-white">
            Satu akun untuk seluruh persiapan SKD-mu.
          </h2>
          <p className="mt-4 leading-relaxed text-slate-400">
            Masuk untuk membuka materi, bank soal, simulasi CAT, dan analitik nilai —
            tersimpan rapi dalam satu progres.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              "Simulasi CAT dengan penilaian passing grade",
              "Riwayat & analitik kelemahan per materi",
              "Bank soal + pembahasan lengkap",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3 text-sm text-white/90">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 text-brand-400">
                  <IconCheck width={14} height={14} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-slate-400">
          © {new Date().getFullYear()} Master Institute. Untuk persiapan CPNS &amp; PPPK.
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex flex-col justify-center px-5 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" aria-label="Beranda" className="inline-flex">
            <Logo />
          </Link>

          <div className="mt-10">
            <h1 className="text-3xl font-extrabold tracking-tight text-heading">
              {mode === "masuk" ? "Masuk ke akun" : "Buat akun baru"}
            </h1>
            <p className="mt-2 text-slate">
              {mode === "masuk"
                ? "Lanjutkan persiapan SKD-mu."
                : "Mulai perjalanan lulus SKD-mu hari ini."}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="mt-7 grid grid-cols-2 gap-1 rounded-xl border border-line bg-muted p-1">
            {(["masuk", "daftar"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`rounded-lg py-2 text-sm font-semibold capitalize transition-colors ${
                  mode === m ? "bg-surface text-heading shadow-sm" : "text-slate hover:text-heading"
                }`}
              >
                {m === "masuk" ? "Masuk" : "Daftar"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "daftar" && (
              <Field label="Nama lengkap" htmlFor="nama">
                <input
                  id="nama"
                  type="text"
                  required
                  autoComplete="name"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama Anda"
                  className={inputCls}
                />
              </Field>
            )}

            <Field label="Email" htmlFor="email">
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className={inputCls}
              />
            </Field>

            <Field
              label="Kata sandi"
              htmlFor="password"
              right={
                mode === "masuk" ? (
                  <button type="button" className="text-xs font-semibold text-brand-600 hover:underline">
                    Lupa sandi?
                  </button>
                ) : undefined
              }
            >
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  required
                  minLength={4}
                  autoComplete={mode === "masuk" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputCls} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:text-heading"
                  aria-label={showPw ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  <IconEye width={18} height={18} />
                </button>
              </div>
            </Field>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-danger-100 bg-danger-50 p-3.5 text-sm text-danger"
              >
                <IconWarning width={17} height={17} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Memproses…" : mode === "masuk" ? "Masuk" : "Daftar & Masuk"}
              {!loading && <IconArrowRight width={18} height={18} />}
            </Button>
          </form>

          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-line bg-muted/50 p-3.5">
            <IconInfo width={17} height={17} className="mt-0.5 shrink-0 text-slate-400" />
            <p className="text-xs leading-relaxed text-slate">
              Kata sandi diamankan dengan hash bcrypt &amp; sesi bertanda-tangan.
              {mode === "daftar"
                ? " Gunakan kata sandi minimal 6 karakter."
                : " Belum punya akun? Daftar dulu."}
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-slate">
            {mode === "masuk" ? "Belum punya akun? " : "Sudah punya akun? "}
            <button
              type="button"
              onClick={() => setMode(mode === "masuk" ? "daftar" : "masuk")}
              className="font-semibold text-brand-600 hover:underline"
            >
              {mode === "masuk" ? "Daftar sekarang" : "Masuk di sini"}
            </button>
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-slate transition-colors hover:text-heading"
          >
            <IconArrowLeft width={16} height={16} />
            Kembali ke beranda
          </Link>
        </div>
      </main>
    </div>
  );
}

const inputCls =
  "h-12 w-full rounded-xl border border-line bg-surface px-4 text-[0.95rem] text-heading outline-none transition-colors placeholder:text-slate-400 focus:border-brand-600";

function Field({
  label,
  htmlFor,
  right,
  children,
}: {
  label: string;
  htmlFor: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={htmlFor} className="text-sm font-semibold text-heading">
          {label}
        </label>
        {right}
      </div>
      {children}
    </div>
  );
}
