"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Logo,
  IconArrowLeft,
  IconCheck,
  IconWarning,
  IconInfo,
  IconLayers,
  IconDownload,
  IconClose,
  IconChevronDown,
  IconCheckCircle,
  IconXCircle,
  IconBook,
  IconStar,
  IconQuote,
} from "@/components/icons";
import { Button, Badge } from "@/components/ui";
import {
  SUBTES,
  SUBTES_ORDER,
  SKD_TOTAL_SOAL,
  formatWaktu,
  type Soal,
  type Subtes,
} from "@/lib/skd";
import type { SoalInput } from "@/lib/soal";
import type { PaketRingkas } from "@/lib/paket";
import type { UserRingkas } from "@/lib/users";
import type { HasilRingkas } from "@/lib/hasil";
import type { HasilParse } from "@/lib/excel";
import type { ModulRingkas } from "@/lib/modul";
import type { TransaksiRingkas, StatusTransaksi } from "@/lib/transaksi";
import type { InfoPembayaran } from "@/lib/pengaturan";
import type { TestimoniRingkas, TestimoniInput } from "@/lib/testimoni";
import type { PaketHargaRingkas, PaketHargaInput } from "@/lib/paket-harga";
import { formatRupiah } from "@/lib/format";
import {
  createSoalAction,
  updateSoalAction,
  deleteSoalAction,
  seedAction,
  createPaketAction,
  updatePaketAction,
  deletePaketAction,
  parseExcelAction,
  importSoalAction,
  createModulAction,
  deleteModulAction,
  setStatusTransaksiAction,
  setInfoPembayaranAction,
  createTestimoniAction,
  updateTestimoniAction,
  deleteTestimoniAction,
  createPaketHargaAction,
  updatePaketHargaAction,
  deletePaketHargaAction,
} from "@/app/admin/actions";

const HURUF = ["A", "B", "C", "D", "E"];

type View = "paket" | "detail" | "form";

type Section =
  | "bank"
  | "paketHarga"
  | "modul"
  | "transaksi"
  | "testimoni"
  | "pengguna"
  | "hasil";

export function AdminPanel({
  paket,
  soal,
  users,
  hasil,
  modul,
  transaksi,
  infoBayar,
  testimoni,
  paketHarga,
  adminEmail,
}: {
  paket: PaketRingkas[];
  soal: Soal[];
  users: UserRingkas[];
  hasil: HasilRingkas[];
  modul: ModulRingkas[];
  transaksi: TransaksiRingkas[];
  infoBayar: InfoPembayaran;
  testimoni: TestimoniRingkas[];
  paketHarga: PaketHargaRingkas[];
  adminEmail: string;
}) {
  const router = useRouter();
  const [section, setSection] = useState<Section>("bank");
  const pendingTx = transaksi.filter((t) => t.status === "pending").length;
  const [view, setView] = useState<View>("paket");
  const [activePaketId, setActivePaketId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const activePaket = paket.find((p) => p.id === activePaketId) ?? null;
  const soalPaket = activePaketId ? soal.filter((s) => s.paketId === activePaketId) : [];
  const editingSoal = editingId ? soal.find((s) => s.id === editingId) ?? null : null;

  return (
    <div className="min-h-dvh bg-bg">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100 sm:inline">
              Panel Admin
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-slate sm:inline">{adminEmail}</span>
            <Link href="/dashboard" className="font-medium text-slate hover:text-heading">
              Keluar panel
            </Link>
          </div>
        </div>
      </header>

      {/* Tab bagian */}
      <div className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 sm:px-8">
          {([
            ["bank", "Soal & Paket", null],
            ["paketHarga", "Paket Harga", paketHarga.length],
            ["modul", "Modul", modul.length],
            ["transaksi", "Transaksi", pendingTx > 0 ? pendingTx : null],
            ["testimoni", "Testimoni", testimoni.length],
            ["pengguna", "Pengguna", users.length],
            ["hasil", "Hasil Ujian", hasil.length],
          ] as const).map(([key, label, count]) => (
            <button
              key={key}
              onClick={() => setSection(key)}
              className={`-mb-px whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                section === key
                  ? "border-brand-600 text-brand-700"
                  : "border-transparent text-slate hover:text-heading"
              }`}
            >
              {label}
              {count !== null && (
                <span
                  className={`tnum ml-2 rounded-full px-2 py-0.5 text-xs ${
                    key === "transaksi" ? "bg-gold-100 text-gold-700" : "bg-muted text-slate"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        {section === "paketHarga" && <PaketHargaSection paketHarga={paketHarga} />}

        {section === "modul" && <ModulSection modul={modul} />}

        {section === "transaksi" && (
          <TransaksiSection transaksi={transaksi} infoBayar={infoBayar} />
        )}

        {section === "testimoni" && <TestimoniSection testimoni={testimoni} />}

        {section === "pengguna" && <UserList users={users} adminEmail={adminEmail} />}

        {section === "hasil" && <HasilList hasil={hasil} />}

        {section === "bank" && view === "paket" && (
          <PaketList
            paket={paket}
            totalSoal={soal.length}
            pending={pending}
            onOpen={(id) => { setActivePaketId(id); setView("detail"); }}
            onCreate={(nama, deskripsi) =>
              startTransition(async () => {
                const id = await createPaketAction(nama, deskripsi);
                setActivePaketId(id);
                setView("detail");
                router.refresh();
              })
            }
            onSeed={() => startTransition(async () => { await seedAction(); router.refresh(); })}
          />
        )}

        {section === "bank" && view === "detail" && activePaket && (
          <PaketDetail
            paket={activePaket}
            soal={soalPaket}
            pending={pending}
            onBack={() => setView("paket")}
            onAddSoal={() => { setEditingId(null); setView("form"); }}
            onEditSoal={(id) => { setEditingId(id); setView("form"); }}
            onDeleteSoal={(id) =>
              startTransition(async () => { await deleteSoalAction(id); router.refresh(); })
            }
            onDeletePaket={() =>
              startTransition(async () => {
                await deletePaketAction(activePaket.id);
                setActivePaketId(null);
                setView("paket");
                router.refresh();
              })
            }
            onRename={(nama, deskripsi, harga) =>
              startTransition(async () => {
                await updatePaketAction(activePaket.id, { nama, deskripsi, harga });
                router.refresh();
              })
            }
            onImported={() => router.refresh()}
          />
        )}

        {section === "bank" && view === "form" && activePaket && (
          <SoalFormView
            paketId={activePaket.id}
            paketNama={activePaket.nama}
            editing={editingSoal}
            onDone={() => { setEditingId(null); setView("detail"); router.refresh(); }}
            onCancel={() => { setEditingId(null); setView("detail"); }}
          />
        )}
      </main>
    </div>
  );
}

/* ===================== Daftar Paket ===================== */
function PaketList({
  paket,
  totalSoal,
  pending,
  onOpen,
  onCreate,
  onSeed,
}: {
  paket: PaketRingkas[];
  totalSoal: number;
  pending: boolean;
  onOpen: (id: string) => void;
  onCreate: (nama: string, deskripsi: string) => void;
  onSeed: () => void;
}) {
  const [creating, setCreating] = useState(false);
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");

  const submit = () => {
    if (!nama.trim()) return;
    onCreate(nama, deskripsi);
    setNama("");
    setDeskripsi("");
    setCreating(false);
  };

  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-heading">Paket Simulasi</h1>
          <p className="mt-1 text-slate">
            Kelola paket try out. Setiap paket idealnya berisi{" "}
            <span className="font-semibold text-heading">{SKD_TOTAL_SOAL} soal</span>{" "}
            (TWK 30 · TIU 35 · TKP 45). Total {paket.length} paket, {totalSoal} soal.
          </p>
        </div>
        {!creating && <Button onClick={() => setCreating(true)}>+ Buat Paket</Button>}
      </div>

      {creating && (
        <div className="mt-6 space-y-3 rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
          <Field label="Nama paket">
            <input
              autoFocus
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="mis. Simulasi 1 — Batch Juli"
              className={inputCls}
            />
          </Field>
          <Field label="Deskripsi (opsional)">
            <input
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="mis. Paket latihan pekan pertama"
              className={inputCls}
            />
          </Field>
          <div className="flex justify-end gap-3 pt-1">
            <Button variant="outline" onClick={() => setCreating(false)} disabled={pending}>
              Batal
            </Button>
            <Button onClick={submit} disabled={pending || !nama.trim()}>
              {pending ? "Membuat…" : "Buat Paket"}
            </Button>
          </div>
        </div>
      )}

      {paket.length === 0 && !creating && (
        <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl border border-dashed border-line-strong bg-surface p-6">
          <p className="flex items-center gap-2 text-sm text-slate">
            <IconInfo width={16} height={16} /> Belum ada paket. Buat paket baru, atau isi contoh bawaan.
          </p>
          <Button variant="outline" onClick={onSeed} disabled={pending}>
            {pending ? "Mengisi…" : "Isi contoh (18 soal)"}
          </Button>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {paket.map((p) => (
          <button
            key={p.id}
            onClick={() => onOpen(p.id)}
            className="group flex flex-col rounded-2xl border border-line bg-surface p-5 text-left shadow-[var(--shadow-card)] transition-all hover:border-brand-600/40 hover:shadow-[var(--shadow-lift)]"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <IconLayers width={20} height={20} />
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  p.total >= SKD_TOTAL_SOAL
                    ? "bg-success-50 text-success"
                    : "bg-muted text-slate"
                }`}
              >
                {p.total}/{SKD_TOTAL_SOAL} soal
              </span>
            </div>
            <p className="mt-3 flex items-center gap-2 font-bold text-heading">
              {p.nama}
              <span
                className={`rounded-md px-1.5 py-0.5 text-xs font-semibold ${
                  p.harga > 0 ? "bg-gold-100 text-gold-700" : "bg-success-50 text-success"
                }`}
              >
                {formatRupiah(p.harga)}
              </span>
            </p>
            {p.deskripsi && <p className="mt-0.5 line-clamp-1 text-sm text-slate">{p.deskripsi}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              {SUBTES_ORDER.map((k) => (
                <span key={k} className="tnum rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-slate">
                  {k} {p.jumlah[k]}/{SUBTES[k].jumlahSoal}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

/* ===================== Detail satu Paket ===================== */
function PaketDetail({
  paket,
  soal,
  pending,
  onBack,
  onAddSoal,
  onEditSoal,
  onDeleteSoal,
  onDeletePaket,
  onRename,
  onImported,
}: {
  paket: PaketRingkas;
  soal: Soal[];
  pending: boolean;
  onBack: () => void;
  onAddSoal: () => void;
  onEditSoal: (id: string) => void;
  onDeleteSoal: (id: string) => void;
  onDeletePaket: () => void;
  onRename: (nama: string, deskripsi: string, harga: number) => void;
  onImported: () => void;
}) {
  const [filter, setFilter] = useState<"ALL" | Subtes>("ALL");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editHead, setEditHead] = useState(false);
  const [nama, setNama] = useState(paket.nama);
  const [deskripsi, setDeskripsi] = useState(paket.deskripsi);
  const [harga, setHarga] = useState(String(paket.harga));

  const list = soal.filter((s) => filter === "ALL" || s.subtes === filter);

  return (
    <>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate hover:text-heading"
      >
        <IconArrowLeft width={16} height={16} /> Semua paket
      </button>

      {/* Head */}
      <div className="mt-4 flex flex-col justify-between gap-4 rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:flex-row sm:items-center">
        {editHead ? (
          <div className="flex-1 space-y-2">
            <input value={nama} onChange={(e) => setNama(e.target.value)} className={inputCls} />
            <input
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Deskripsi"
              className={inputCls}
            />
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate">
                Harga (Rupiah) — isi 0 untuk gratis
              </span>
              <input
                type="number"
                min={0}
                step={1000}
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
                placeholder="0"
                className={inputCls}
              />
            </label>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  onRename(nama, deskripsi, Math.max(0, Number(harga) || 0));
                  setEditHead(false);
                }}
              >
                Simpan
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setNama(paket.nama);
                  setDeskripsi(paket.deskripsi);
                  setHarga(String(paket.harga));
                  setEditHead(false);
                }}
              >
                Batal
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-heading">{paket.nama}</h1>
              <span
                className={`rounded-md px-2 py-0.5 text-sm font-semibold ${
                  paket.harga > 0 ? "bg-gold-100 text-gold-700" : "bg-success-50 text-success"
                }`}
              >
                {formatRupiah(paket.harga)}
              </span>
              <button onClick={() => setEditHead(true)} className="text-sm font-medium text-brand-600 hover:underline">
                ubah
              </button>
            </div>
            <p className="mt-1 text-sm text-slate">
              {paket.deskripsi || "Tanpa deskripsi."}{" "}
              <span className="font-semibold text-heading">
                {paket.total}/{SKD_TOTAL_SOAL} soal
              </span>{" "}
              — {SUBTES_ORDER.map((k) => `${k} ${paket.jumlah[k]}/${SUBTES[k].jumlahSoal}`).join(" · ")}
            </p>
          </div>
        )}
      </div>

      {/* Aksi input */}
      <div className="mt-5 flex flex-wrap gap-3">
        <Button onClick={onAddSoal}>+ Tambah Soal Manual</Button>
        <Button variant="outline" onClick={() => setUploadOpen(true)}>
          Unggah Excel
        </Button>
        <a
          href="/admin/template"
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-line bg-surface px-4 text-sm font-semibold text-slate transition-colors hover:bg-muted hover:text-heading"
        >
          <IconDownload width={18} height={18} /> Unduh Template
        </a>
        <button
          onClick={() => { if (confirm(`Hapus paket "${paket.nama}" beserta semua soalnya?`)) onDeletePaket(); }}
          disabled={pending}
          className="ml-auto inline-flex h-11 items-center rounded-xl border border-danger-100 bg-danger-50 px-4 text-sm font-semibold text-danger hover:brightness-95"
        >
          Hapus Paket
        </button>
      </div>

      {/* Filter */}
      <div className="mt-6 flex flex-wrap gap-1 rounded-xl border border-line bg-surface p-1.5">
        {(["ALL", ...SUBTES_ORDER] as const).map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-colors ${
              filter === k ? "bg-navy text-white" : "text-slate hover:bg-muted"
            }`}
          >
            {k === "ALL" ? "Semua" : k}
          </button>
        ))}
      </div>

      {/* Daftar soal */}
      <div className="mt-4 space-y-3">
        {list.map((s, i) => (
          <div
            key={s.id}
            className="flex items-start gap-4 rounded-2xl border border-line bg-surface p-4 shadow-[var(--shadow-card)]"
          >
            <span className="tnum grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted text-xs font-bold text-slate">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="navy">{s.subtes}</Badge>
                <Badge tone="neutral">{s.materi}</Badge>
                <Badge tone={s.tingkat === "HOTS" ? "gold" : "neutral"}>{s.tingkat}</Badge>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-heading">{s.pertanyaan}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => onEditSoal(s.id)}
                className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-slate hover:bg-muted hover:text-heading"
              >
                Edit
              </button>
              <button
                onClick={() => { if (confirm("Hapus soal ini?")) onDeleteSoal(s.id); }}
                disabled={pending}
                className="rounded-lg border border-danger-100 bg-danger-50 px-3 py-1.5 text-sm font-medium text-danger hover:brightness-95"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line-strong bg-surface p-8 text-center">
            <p className="text-sm text-slate">
              {soal.length === 0
                ? "Paket ini masih kosong. Unggah Excel atau tambah soal manual."
                : "Tidak ada soal untuk filter ini."}
            </p>
          </div>
        )}
      </div>

      {uploadOpen && (
        <UploadModal
          paketId={paket.id}
          onClose={() => setUploadOpen(false)}
          onImported={() => { setUploadOpen(false); onImported(); }}
        />
      )}
    </>
  );
}

/* ===================== Modal Unggah Excel ===================== */
function UploadModal({
  paketId,
  onClose,
  onImported,
}: {
  paketId: string;
  onClose: () => void;
  onImported: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState<HasilParse | null>(null);
  const [mode, setMode] = useState<"ganti" | "tambah">("ganti");
  const [importing, setImporting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onPick = async (file: File) => {
    setErr(null);
    setParsed(null);
    setFileName(file.name);
    setParsing(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const hasil = await parseExcelAction(fd);
      setParsed(hasil);
    } catch {
      setErr("Gagal membaca file. Pastikan format .xlsx dari template.");
    } finally {
      setParsing(false);
    }
  };

  const simpan = async () => {
    if (!parsed || parsed.soal.length === 0) return;
    setImporting(true);
    try {
      await importSoalAction(paketId, parsed.soal, mode);
      onImported();
    } catch {
      setErr("Gagal menyimpan soal. Coba lagi.");
      setImporting(false);
    }
  };

  const valid = parsed?.soal.length ?? 0;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4">
      <div className="absolute inset-0 bg-navy/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg rounded-3xl border border-line bg-surface p-6 shadow-[var(--shadow-lift)]"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-heading">Unggah Soal dari Excel</h2>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-heading" aria-label="Tutup">
            <IconClose width={18} height={18} />
          </button>
        </div>

        <p className="mt-2 text-sm text-slate">
          Gunakan file dari <a href="/admin/template" className="font-semibold text-brand-600 hover:underline">template resmi</a>.
          Isi sheet <b>Soal</b>, lalu unggah di sini.
        </p>

        <input
          ref={fileRef}
          type="file"
          accept=".xlsx"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onPick(f); }}
        />

        <button
          onClick={() => fileRef.current?.click()}
          className="mt-4 flex w-full flex-col items-center gap-1 rounded-2xl border-2 border-dashed border-line-strong bg-bg px-4 py-8 text-center transition-colors hover:border-brand-600/50 hover:bg-brand-50/30"
        >
          <IconDownload width={22} height={22} className="rotate-180 text-brand-600" />
          <span className="text-sm font-semibold text-heading">
            {fileName ?? "Pilih file .xlsx"}
          </span>
          <span className="text-xs text-slate-400">Klik untuk memilih file</span>
        </button>

        {parsing && <p className="mt-4 text-sm text-slate">Membaca file…</p>}

        {err && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-danger-100 bg-danger-50 p-3 text-sm text-danger">
            <IconWarning width={16} height={16} className="mt-0.5 shrink-0" /> {err}
          </div>
        )}

        {parsed && (
          <div className="mt-4 space-y-4">
            {/* Ringkas */}
            <div className="grid grid-cols-4 gap-2 rounded-2xl bg-muted/50 p-3 text-center">
              <div>
                <p className="tnum text-lg font-bold text-heading">{valid}</p>
                <p className="text-xs text-slate">valid</p>
              </div>
              {SUBTES_ORDER.map((k) => (
                <div key={k}>
                  <p className="tnum text-lg font-bold text-brand-600">{parsed.ringkas[k]}</p>
                  <p className="text-xs text-slate">{k}</p>
                </div>
              ))}
            </div>

            {parsed.errors.length > 0 && (
              <div className="rounded-xl border border-gold-200 bg-gold-50/60 p-3">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-heading">
                  <IconWarning width={15} height={15} /> {parsed.errors.length} baris dilewati
                </p>
                <ul className="mt-2 max-h-32 space-y-1 overflow-y-auto text-xs text-slate">
                  {parsed.errors.map((e, i) => <li key={i}>• {e}</li>)}
                </ul>
              </div>
            )}

            {valid > 0 && (
              <div>
                <p className="mb-2 text-sm font-semibold text-heading">Cara simpan</p>
                <div className="flex gap-2">
                  {([["ganti", "Ganti semua soal paket"], ["tambah", "Tambahkan ke yang ada"]] as const).map(([m, label]) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                        mode === m ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line text-slate hover:bg-muted"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-line pt-4">
              <Button variant="outline" onClick={onClose} disabled={importing}>Batal</Button>
              <Button onClick={simpan} disabled={importing || valid === 0}>
                {importing ? "Menyimpan…" : `Simpan ${valid} soal`}
                {!importing && <IconCheck width={18} height={18} />}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===================== Form Soal (tambah/edit) ===================== */
type FormState = {
  subtes: Subtes;
  materi: string;
  tingkat: Soal["tingkat"];
  pertanyaan: string;
  pembahasan: string;
  opsiTeks: string[];
  opsiPoin: number[];
  kunci: string;
};

function emptyForm(): FormState {
  return {
    subtes: "TWK",
    materi: "",
    tingkat: "HOTS",
    pertanyaan: "",
    pembahasan: "",
    opsiTeks: ["", "", "", "", ""],
    opsiPoin: [5, 4, 3, 2, 1],
    kunci: "A",
  };
}

function formFromSoal(s: Soal): FormState {
  const teks = HURUF.map((h) => s.opsi.find((o) => o.id === h)?.teks ?? "");
  const poin = HURUF.map((h) => s.opsi.find((o) => o.id === h)?.poin ?? 0);
  return {
    subtes: s.subtes,
    materi: s.materi,
    tingkat: s.tingkat,
    pertanyaan: s.pertanyaan,
    pembahasan: s.pembahasan,
    opsiTeks: teks,
    opsiPoin: poin.map((p) => p || 1),
    kunci: s.kunci ?? "A",
  };
}

function SoalFormView({
  paketId,
  paketNama,
  editing,
  onDone,
  onCancel,
}: {
  paketId: string;
  paketNama: string;
  editing: Soal | null;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormState>(editing ? formFromSoal(editing) : emptyForm());
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const isTKP = form.subtes === "TKP";

  const set = (patch: Partial<FormState>) => setForm({ ...form, ...patch });
  const setOpsi = (i: number, teks: string) => {
    const arr = [...form.opsiTeks];
    arr[i] = teks;
    set({ opsiTeks: arr });
  };
  const setPoin = (i: number, poin: number) => {
    const arr = [...form.opsiPoin];
    arr[i] = poin;
    set({ opsiPoin: arr });
  };

  const buildInput = (): SoalInput | null => {
    if (!form.pertanyaan.trim()) return null;
    const opsi = HURUF.map((id, i) => ({
      id,
      teks: form.opsiTeks[i].trim(),
      ...(isTKP ? { poin: form.opsiPoin[i] } : {}),
    })).filter((o) => o.teks);
    if (opsi.length < 2) return null;
    return {
      subtes: form.subtes,
      materi: form.materi.trim() || "Umum",
      pertanyaan: form.pertanyaan.trim(),
      opsi,
      kunci: isTKP ? null : form.kunci,
      pembahasan: form.pembahasan.trim(),
      tingkat: form.tingkat,
      paketId,
    };
  };

  const submit = () => {
    const input = buildInput();
    if (!input) {
      setError("Lengkapi pertanyaan dan minimal 2 opsi jawaban.");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        if (editing) await updateSoalAction(editing.id, input);
        else await createSoalAction(input);
        onDone();
      } catch {
        setError("Gagal menyimpan. Coba lagi.");
      }
    });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={onCancel}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate hover:text-heading"
      >
        <IconArrowLeft width={16} height={16} /> Kembali ke {paketNama}
      </button>
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-heading">
        {editing ? "Edit Soal" : "Tambah Soal"}
      </h1>

      <div className="mt-6 space-y-5 rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)]">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Subtes">
            <select value={form.subtes} onChange={(e) => set({ subtes: e.target.value as Subtes })} className={inputCls}>
              {SUBTES_ORDER.map((k) => (
                <option key={k} value={k}>{k} · {SUBTES[k].nama}</option>
              ))}
            </select>
          </Field>
          <Field label="Materi">
            <input value={form.materi} onChange={(e) => set({ materi: e.target.value })} placeholder="mis. Nasionalisme" className={inputCls} />
          </Field>
        </div>

        <Field label="Pertanyaan">
          <textarea value={form.pertanyaan} onChange={(e) => set({ pertanyaan: e.target.value })} rows={4} placeholder="Tulis pertanyaan…" className={inputCls} />
        </Field>

        <div>
          <p className="mb-2 text-sm font-semibold text-heading">
            Pilihan jawaban{" "}
            <span className="font-normal text-slate-400">
              {isTKP ? "(isi poin 1–5 tiap opsi)" : "(pilih satu kunci yang benar)"}
            </span>
          </p>
          <div className="space-y-2">
            {HURUF.map((h, i) => (
              <div key={h} className="flex items-center gap-2">
                {!isTKP && (
                  <input
                    type="radio"
                    name="kunci"
                    checked={form.kunci === h}
                    onChange={() => set({ kunci: h })}
                    aria-label={`Jadikan ${h} kunci`}
                    className="h-4 w-4 accent-[var(--color-brand-600)]"
                  />
                )}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line-strong text-xs font-bold text-slate">{h}</span>
                <input value={form.opsiTeks[i]} onChange={(e) => setOpsi(i, e.target.value)} placeholder={`Opsi ${h}`} className={inputCls} />
                {isTKP && (
                  <select
                    value={form.opsiPoin[i]}
                    onChange={(e) => setPoin(i, Number(e.target.value))}
                    className="w-20 shrink-0 rounded-xl border border-line bg-surface px-2 py-2.5 text-sm text-heading outline-none focus:border-brand-600"
                    aria-label={`Poin opsi ${h}`}
                  >
                    {[1, 2, 3, 4, 5].map((p) => <option key={p} value={p}>{p} poin</option>)}
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>

        <Field label="Pembahasan">
          <textarea value={form.pembahasan} onChange={(e) => set({ pembahasan: e.target.value })} rows={3} placeholder="Penjelasan jawaban…" className={inputCls} />
        </Field>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-danger-100 bg-danger-50 p-3 text-sm text-danger">
            <IconWarning width={16} height={16} className="mt-0.5 shrink-0" /> {error}
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-line pt-5">
          <Button variant="outline" onClick={onCancel} disabled={pending}>Batal</Button>
          <Button onClick={submit} disabled={pending}>
            {pending ? "Menyimpan…" : editing ? "Simpan Perubahan" : "Tambah Soal"}
            {!pending && <IconCheck width={18} height={18} />}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ===================== Daftar Pengguna ===================== */
function UserList({ users, adminEmail }: { users: UserRingkas[]; adminEmail: string }) {
  const [q, setQ] = useState("");

  const key = q.trim().toLowerCase();
  const list = key
    ? users.filter((u) => `${u.nama} ${u.email}`.toLowerCase().includes(key))
    : users;

  const fmtTanggal = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-heading">Pengguna Terdaftar</h1>
          <p className="mt-1 text-slate">
            Daftar akun yang mendaftar di platform. Total{" "}
            <span className="font-semibold text-heading">{users.length}</span> pengguna.
          </p>
        </div>
        <div className="relative sm:w-72">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari nama atau email…"
            aria-label="Cari pengguna"
            className={inputCls}
          />
        </div>
      </div>

      {users.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line-strong bg-surface p-8 text-center">
          <p className="text-sm text-slate">Belum ada pengguna yang mendaftar.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)]">
          {/* Header (desktop) */}
          <div className="hidden grid-cols-[1.4fr_1.6fr_0.8fr_0.8fr] gap-4 border-b border-line bg-muted/40 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 sm:grid">
            <span>Nama</span>
            <span>Email</span>
            <span>Metode</span>
            <span>Terdaftar</span>
          </div>
          <div className="divide-y divide-line">
            {list.map((u) => {
              const isAdmin = u.email.toLowerCase() === adminEmail.trim().toLowerCase();
              return (
                <div
                  key={u.id}
                  className="grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-[1.4fr_1.6fr_0.8fr_0.8fr] sm:items-center sm:gap-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                      {u.nama.charAt(0).toUpperCase()}
                    </span>
                    <span className="font-semibold text-heading">{u.nama}</span>
                    {isAdmin && <Badge tone="gold">Admin</Badge>}
                  </div>
                  <span className="truncate text-sm text-slate">{u.email}</span>
                  <span className="text-sm">
                    <Badge tone={u.provider === "google" ? "navy" : "neutral"}>
                      {u.provider === "google" ? "Google" : "Email"}
                    </Badge>
                  </span>
                  <span className="tnum text-sm text-slate">{fmtTanggal(u.createdAt)}</span>
                </div>
              );
            })}
          </div>
          {list.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-slate">
              Tidak ada pengguna yang cocok dengan pencarian.
            </p>
          )}
        </div>
      )}
    </>
  );
}

/* ===================== Hasil Ujian ===================== */
function HasilList({ hasil }: { hasil: HasilRingkas[] }) {
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const key = q.trim().toLowerCase();
  const list = key
    ? hasil.filter((h) =>
        `${h.userNama} ${h.userEmail} ${h.paketNama}`.toLowerCase().includes(key),
      )
    : hasil;

  const fmtTanggal = (iso: string) =>
    new Date(iso).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const lulusCount = hasil.filter((h) => h.lulusSemua).length;

  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-heading">Hasil Ujian</h1>
          <p className="mt-1 text-slate">
            Riwayat simulasi yang dikerjakan pengguna. Total{" "}
            <span className="font-semibold text-heading">{hasil.length}</span> ujian
            {hasil.length > 0 && (
              <>
                {" "}·{" "}
                <span className="font-semibold text-success">{lulusCount} lulus</span>
              </>
            )}
            .
          </p>
        </div>
        <div className="relative sm:w-72">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari nama, email, atau paket…"
            aria-label="Cari hasil ujian"
            className={inputCls}
          />
        </div>
      </div>

      {hasil.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line-strong bg-surface p-8 text-center">
          <p className="text-sm text-slate">
            Belum ada hasil ujian. Hasil akan muncul di sini setiap kali pengguna
            menyelesaikan satu paket simulasi.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)]">
          <div className="hidden grid-cols-[1.6fr_1.4fr_1fr_0.9fr_1.1fr_auto] gap-4 border-b border-line bg-muted/40 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 sm:grid">
            <span>Pengguna</span>
            <span>Paket</span>
            <span>Nilai</span>
            <span>Status</span>
            <span>Waktu</span>
            <span />
          </div>
          <div className="divide-y divide-line">
            {list.map((h) => {
              const open = openId === h.id;
              const persen = Math.round((h.nilaiTotal / h.nilaiMaksTotal) * 100);
              return (
                <div key={h.id}>
                  <button
                    onClick={() => setOpenId(open ? null : h.id)}
                    className="grid w-full grid-cols-1 gap-1.5 px-5 py-4 text-left transition-colors hover:bg-muted/30 sm:grid-cols-[1.6fr_1.4fr_1fr_0.9fr_1.1fr_auto] sm:items-center sm:gap-4"
                    aria-expanded={open}
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-heading">{h.userNama}</p>
                      <p className="truncate text-xs text-slate-400">{h.userEmail}</p>
                    </div>
                    <span className="truncate text-sm text-slate">{h.paketNama}</span>
                    <span className="text-sm">
                      <span className="tnum font-bold text-heading">{h.nilaiTotal}</span>
                      <span className="tnum text-slate-400">/{h.nilaiMaksTotal}</span>
                      <span className="tnum ml-1 text-xs text-slate-400">({persen}%)</span>
                    </span>
                    <span>
                      <Badge tone={h.lulusSemua ? "success" : "danger"}>
                        {h.lulusSemua ? (
                          <IconCheckCircle width={13} height={13} />
                        ) : (
                          <IconXCircle width={13} height={13} />
                        )}
                        {h.lulusSemua ? "Lulus" : "Belum"}
                      </Badge>
                    </span>
                    <span className="tnum text-xs text-slate">{fmtTanggal(h.createdAt)}</span>
                    <IconChevronDown
                      width={18}
                      height={18}
                      className={`hidden shrink-0 text-slate-400 transition-transform sm:block ${open ? "rotate-180" : ""}`}
                    />
                  </button>

                  {open && (
                    <div className="border-t border-line bg-muted/20 px-5 py-4">
                      <div className="grid gap-3 sm:grid-cols-3">
                        {h.perSubtes.map((r) => (
                          <div key={r.subtes} className="rounded-xl border border-line bg-surface p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-400">
                                {r.subtes} · {SUBTES[r.subtes].nama}
                              </span>
                              <Badge tone={r.lulus ? "success" : "danger"}>
                                {r.lulus ? "Lulus" : "Belum"}
                              </Badge>
                            </div>
                            <p className="mt-1.5">
                              <span className="tnum text-xl font-bold text-heading">{r.nilai}</span>
                              <span className="tnum text-sm text-slate-400">/{r.nilaiMaks}</span>
                            </p>
                            <p className="tnum text-xs text-slate-400">Passing grade {r.passingGrade}</p>
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 text-xs text-slate-400">
                        {h.jumlahSoal} soal · waktu terpakai {formatWaktu(h.waktuTerpakaiDetik)}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {list.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-slate">
              Tidak ada hasil yang cocok dengan pencarian.
            </p>
          )}
        </div>
      )}
    </>
  );
}

/* ===================== Modul / Materi ===================== */
const KATEGORI_MODUL = ["Umum", "TWK", "TIU", "TKP"];

function fmtUkuran(bytes: number): string {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  if (bytes >= 1024) return Math.round(bytes / 1024) + " KB";
  return bytes + " B";
}

function ModulSection({ modul }: { modul: ModulRingkas[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kategori, setKategori] = useState("Umum");
  const [fileName, setFileName] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const simpan = async () => {
    setError(null);
    const file = fileRef.current?.files?.[0];
    if (!judul.trim()) return setError("Judul wajib diisi.");
    if (!file) return setError("Pilih file PDF terlebih dahulu.");
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("judul", judul);
      fd.append("deskripsi", deskripsi);
      fd.append("kategori", kategori);
      fd.append("file", file);
      const res = await createModulAction(fd);
      if (!res.ok) {
        setError(res.error ?? "Gagal mengunggah.");
        setBusy(false);
        return;
      }
      setJudul("");
      setDeskripsi("");
      setKategori("Umum");
      setFileName(null);
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    } catch {
      setError("Gagal mengunggah modul.");
    } finally {
      setBusy(false);
    }
  };

  const hapus = (id: string) =>
    startTransition(async () => {
      await deleteModulAction(id);
      router.refresh();
    });

  return (
    <>
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-heading">Modul & Materi Belajar</h1>
        <p className="mt-1 text-slate">
          Unggah materi PDF untuk bahan belajar peserta. Tampil di halaman{" "}
          <span className="font-semibold text-heading">Belajar</span>. Total{" "}
          <span className="font-semibold text-heading">{modul.length}</span> modul.
        </p>
      </div>

      {/* Form unggah */}
      <div className="mt-6 grid gap-4 rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:grid-cols-2">
        <Field label="Judul modul">
          <input value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="mis. Rangkuman Pancasila" className={inputCls} />
        </Field>
        <Field label="Kategori">
          <select value={kategori} onChange={(e) => setKategori(e.target.value)} className={inputCls}>
            {KATEGORI_MODUL.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Deskripsi (opsional)">
            <input value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} placeholder="Ringkasan isi materi" className={inputCls} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line-strong bg-bg px-4 py-4 text-sm font-semibold text-heading transition-colors hover:border-brand-600/50 hover:bg-brand-50/30"
          >
            <IconDownload width={18} height={18} className="rotate-180 text-brand-600" />
            {fileName ?? "Pilih file PDF"}
          </button>
        </div>
        {error && (
          <div className="sm:col-span-2 flex items-start gap-2.5 rounded-xl border border-danger-100 bg-danger-50 p-3 text-sm text-danger">
            <IconWarning width={16} height={16} className="mt-0.5 shrink-0" /> {error}
          </div>
        )}
        <div className="sm:col-span-2 flex justify-end">
          <Button onClick={simpan} disabled={busy}>
            {busy ? "Mengunggah…" : "Unggah Modul"}
            {!busy && <IconCheck width={18} height={18} />}
          </Button>
        </div>
      </div>

      {/* Daftar modul */}
      <div className="mt-6 space-y-3">
        {modul.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line-strong bg-surface p-8 text-center">
            <p className="text-sm text-slate">Belum ada modul. Unggah PDF pertama Anda di atas.</p>
          </div>
        )}
        {modul.map((m) => (
          <div
            key={m.id}
            className="flex items-start gap-4 rounded-2xl border border-line bg-surface p-4 shadow-[var(--shadow-card)]"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <IconBook width={20} height={20} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="navy">{m.kategori}</Badge>
                <span className="font-semibold text-heading">{m.judul}</span>
              </div>
              {m.deskripsi && <p className="mt-1 line-clamp-1 text-sm text-slate">{m.deskripsi}</p>}
              <p className="mt-1 text-xs text-slate-400">
                {m.namaFile} · {fmtUkuran(m.ukuran)}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <a
                href={`/materi/${m.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-slate hover:bg-muted hover:text-heading"
              >
                Lihat
              </a>
              <button
                onClick={() => { if (confirm("Hapus modul ini?")) hapus(m.id); }}
                disabled={pending}
                className="rounded-lg border border-danger-100 bg-danger-50 px-3 py-1.5 text-sm font-medium text-danger hover:brightness-95"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ===================== Transaksi / Pembayaran ===================== */
function TransaksiSection({
  transaksi,
  infoBayar,
}: {
  transaksi: TransaksiRingkas[];
  infoBayar: InfoPembayaran;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [filter, setFilter] = useState<"ALL" | StatusTransaksi>("ALL");

  const list = transaksi.filter((t) => filter === "ALL" || t.status === filter);
  const totalLunas = transaksi
    .filter((t) => t.status === "lunas")
    .reduce((a, b) => a + b.jumlah, 0);

  const ubah = (id: string, status: StatusTransaksi) =>
    startTransition(async () => {
      await setStatusTransaksiAction(id, status);
      router.refresh();
    });

  const fmtTanggal = (iso: string) =>
    new Date(iso).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  const statusTone = (s: StatusTransaksi) =>
    s === "lunas" ? "success" : s === "ditolak" ? "danger" : "gold";
  const statusLabel = (s: StatusTransaksi) =>
    s === "lunas" ? "Lunas" : s === "ditolak" ? "Ditolak" : "Menunggu";

  return (
    <>
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-heading">Transaksi & Pembayaran</h1>
        <p className="mt-1 text-slate">
          Verifikasi pembayaran peserta. Menandai <b>Lunas</b> otomatis membuka akses paket.
          Total pemasukan terverifikasi:{" "}
          <span className="font-semibold text-success">{formatRupiah(totalLunas, "Rp0")}</span>.
        </p>
      </div>

      <PengaturanBayar info={infoBayar} />

      {/* Filter */}
      <div className="mt-6 flex flex-wrap gap-1 rounded-xl border border-line bg-surface p-1.5">
        {(["ALL", "pending", "lunas", "ditolak"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold capitalize transition-colors ${
              filter === k ? "bg-navy text-white" : "text-slate hover:bg-muted"
            }`}
          >
            {k === "ALL" ? "Semua" : k === "pending" ? "Menunggu" : k === "lunas" ? "Lunas" : "Ditolak"}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {list.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line-strong bg-surface p-8 text-center">
            <p className="text-sm text-slate">
              {transaksi.length === 0
                ? "Belum ada transaksi. Muncul saat peserta membeli paket berbayar."
                : "Tidak ada transaksi untuk filter ini."}
            </p>
          </div>
        )}
        {list.map((t) => (
          <div
            key={t.id}
            className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={statusTone(t.status)}>{statusLabel(t.status)}</Badge>
                <span className="font-semibold text-heading">{t.paketNama}</span>
                <span className="tnum font-bold text-heading">{formatRupiah(t.jumlah)}</span>
              </div>
              <p className="mt-1 truncate text-sm text-slate">
                {t.userNama} · {t.userEmail}
              </p>
              <p className="text-xs text-slate-400">
                Diajukan {fmtTanggal(t.createdAt)}
                {t.confirmedAt && ` · dikonfirmasi ${fmtTanggal(t.confirmedAt)}`}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              {t.status !== "lunas" && (
                <button
                  onClick={() => ubah(t.id, "lunas")}
                  disabled={pending}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-success px-3 py-1.5 text-sm font-semibold text-white hover:brightness-110"
                >
                  <IconCheck width={15} height={15} /> Tandai Lunas
                </button>
              )}
              {t.status !== "ditolak" && (
                <button
                  onClick={() => ubah(t.id, "ditolak")}
                  disabled={pending}
                  className="rounded-lg border border-danger-100 bg-danger-50 px-3 py-1.5 text-sm font-medium text-danger hover:brightness-95"
                >
                  Tolak
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function PengaturanBayar({ info }: { info: InfoPembayaran }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(info);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (patch: Partial<InfoPembayaran>) => setForm({ ...form, ...patch });

  const simpan = async () => {
    setBusy(true);
    setSaved(false);
    try {
      await setInfoPembayaranAction(form);
      setSaved(true);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between"
        aria-expanded={open}
      >
        <div className="text-left">
          <p className="font-semibold text-heading">Info Rekening Pembayaran</p>
          <p className="text-sm text-slate">
            {info.bankNama && info.bankRekening
              ? `${info.bankNama} · ${info.bankRekening} · a.n. ${info.bankAtasNama}`
              : "Belum diatur — peserta belum bisa melihat tujuan transfer."}
          </p>
        </div>
        <IconChevronDown width={18} height={18} className={`shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="mt-4 grid gap-4 border-t border-line pt-4 sm:grid-cols-3">
          <Field label="Nama bank">
            <input value={form.bankNama} onChange={(e) => set({ bankNama: e.target.value })} placeholder="mis. BCA" className={inputCls} />
          </Field>
          <Field label="No. rekening">
            <input value={form.bankRekening} onChange={(e) => set({ bankRekening: e.target.value })} placeholder="mis. 1234567890" className={inputCls} />
          </Field>
          <Field label="Atas nama">
            <input value={form.bankAtasNama} onChange={(e) => set({ bankAtasNama: e.target.value })} placeholder="mis. Affandi" className={inputCls} />
          </Field>
          <div className="sm:col-span-3">
            <Field label="Instruksi tambahan">
              <textarea value={form.instruksi} onChange={(e) => set({ instruksi: e.target.value })} rows={2} className={inputCls} />
            </Field>
          </div>
          <div className="sm:col-span-3 flex items-center justify-end gap-3">
            {saved && <span className="text-sm text-success">Tersimpan ✓</span>}
            <Button onClick={simpan} disabled={busy}>{busy ? "Menyimpan…" : "Simpan Info"}</Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== Testimoni ===================== */
function emptyTestimoni(): TestimoniInput {
  return { nama: "", peran: "", pesan: "", rating: 5, aktif: true };
}

function TestimoniSection({ testimoni }: { testimoni: TestimoniRingkas[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<TestimoniInput>(emptyTestimoni());
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (patch: Partial<TestimoniInput>) => setForm({ ...form, ...patch });

  const mulaiTambah = () => {
    setForm(emptyTestimoni());
    setEditId(null);
    setError(null);
    setOpen(true);
  };
  const mulaiEdit = (t: TestimoniRingkas) => {
    setForm({ nama: t.nama, peran: t.peran, pesan: t.pesan, rating: t.rating, aktif: t.aktif });
    setEditId(t.id);
    setError(null);
    setOpen(true);
  };

  const simpan = () => {
    if (!form.nama.trim() || !form.pesan.trim()) {
      setError("Nama dan isi testimoni wajib diisi.");
      return;
    }
    setError(null);
    startTransition(async () => {
      if (editId) await updateTestimoniAction(editId, form);
      else await createTestimoniAction(form);
      setOpen(false);
      setEditId(null);
      router.refresh();
    });
  };

  const hapus = (id: string) =>
    startTransition(async () => {
      await deleteTestimoniAction(id);
      router.refresh();
    });

  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-heading">Testimoni</h1>
          <p className="mt-1 text-slate">
            Kelola testimoni yang tampil di <span className="font-semibold text-heading">landing page</span>.
            Hanya yang berstatus aktif yang ditampilkan. Total{" "}
            <span className="font-semibold text-heading">{testimoni.length}</span>.
          </p>
        </div>
        {!open && <Button onClick={mulaiTambah}>+ Tambah Testimoni</Button>}
      </div>

      {open && (
        <div className="mt-6 space-y-4 rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama">
              <input value={form.nama} onChange={(e) => set({ nama: e.target.value })} placeholder="mis. Rani Puspitasari" className={inputCls} />
            </Field>
            <Field label="Peran / keterangan">
              <input value={form.peran} onChange={(e) => set({ peran: e.target.value })} placeholder="mis. Peserta SKD 2025" className={inputCls} />
            </Field>
          </div>
          <Field label="Isi testimoni">
            <textarea value={form.pesan} onChange={(e) => set({ pesan: e.target.value })} rows={3} placeholder="Tulis testimoni…" className={inputCls} />
          </Field>
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-heading">
              Rating
              <select
                value={form.rating}
                onChange={(e) => set({ rating: Number(e.target.value) })}
                className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-heading outline-none focus:border-brand-600"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{r} bintang</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-heading">
              <input type="checkbox" checked={form.aktif} onChange={(e) => set({ aktif: e.target.checked })} className="h-4 w-4 accent-[var(--color-brand-600)]" />
              Tampilkan di landing
            </label>
          </div>
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-danger-100 bg-danger-50 p-3 text-sm text-danger">
              <IconWarning width={16} height={16} className="mt-0.5 shrink-0" /> {error}
            </div>
          )}
          <div className="flex justify-end gap-3 border-t border-line pt-4">
            <Button variant="outline" onClick={() => { setOpen(false); setEditId(null); }} disabled={pending}>Batal</Button>
            <Button onClick={simpan} disabled={pending}>
              {pending ? "Menyimpan…" : editId ? "Simpan Perubahan" : "Tambah"}
            </Button>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {testimoni.length === 0 && !open && (
          <div className="rounded-2xl border border-dashed border-line-strong bg-surface p-8 text-center">
            <p className="text-sm text-slate">Belum ada testimoni. Landing akan memakai contoh bawaan sampai kamu menambah.</p>
          </div>
        )}
        {testimoni.map((t) => (
          <div key={t.id} className="flex items-start gap-4 rounded-2xl border border-line bg-surface p-4 shadow-[var(--shadow-card)]">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy text-sm font-bold text-white">
              {t.nama.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-heading">{t.nama}</span>
                <span className="inline-flex items-center gap-0.5 text-gold-500">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <IconStar key={i} width={12} height={12} />
                  ))}
                </span>
                {!t.aktif && <Badge tone="neutral">Nonaktif</Badge>}
              </div>
              {t.peran && <p className="text-xs text-slate-400">{t.peran}</p>}
              <p className="mt-1 flex items-start gap-1.5 text-sm text-slate">
                <IconQuote width={14} height={14} className="mt-0.5 shrink-0 text-brand-200" />
                <span className="line-clamp-2">{t.pesan}</span>
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => mulaiEdit(t)} className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-slate hover:bg-muted hover:text-heading">Edit</button>
              <button onClick={() => { if (confirm("Hapus testimoni ini?")) hapus(t.id); }} disabled={pending} className="rounded-lg border border-danger-100 bg-danger-50 px-3 py-1.5 text-sm font-medium text-danger hover:brightness-95">Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ===================== Paket Harga (paket jual) ===================== */
function emptyPaketHarga(): PaketHargaInput {
  return {
    nama: "",
    harga: 0,
    deskripsi: "",
    jumlahPaketSoal: 1,
    fasilitas: ["Pembahasan lengkap tiap soal", "Penilaian passing grade otomatis"],
    populer: false,
    aktif: true,
  };
}

function PaketHargaSection({ paketHarga }: { paketHarga: PaketHargaRingkas[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<PaketHargaInput>(emptyPaketHarga());
  const [error, setError] = useState<string | null>(null);

  const set = (patch: Partial<PaketHargaInput>) => setForm({ ...form, ...patch });
  const setFasil = (i: number, v: string) => {
    const arr = [...form.fasilitas];
    arr[i] = v;
    set({ fasilitas: arr });
  };
  const addFasil = () => set({ fasilitas: [...form.fasilitas, ""] });
  const rmFasil = (i: number) => set({ fasilitas: form.fasilitas.filter((_, j) => j !== i) });

  const mulaiTambah = () => {
    setForm(emptyPaketHarga());
    setEditId(null);
    setError(null);
    setOpen(true);
  };
  const mulaiEdit = (p: PaketHargaRingkas) => {
    setForm({
      nama: p.nama,
      harga: p.harga,
      deskripsi: p.deskripsi,
      jumlahPaketSoal: p.jumlahPaketSoal,
      fasilitas: p.fasilitas.length ? p.fasilitas : [""],
      populer: p.populer,
      aktif: p.aktif,
    });
    setEditId(p.id);
    setError(null);
    setOpen(true);
  };

  const simpan = () => {
    if (!form.nama.trim()) {
      setError("Nama paket wajib diisi.");
      return;
    }
    setError(null);
    startTransition(async () => {
      if (editId) await updatePaketHargaAction(editId, form);
      else await createPaketHargaAction(form);
      setOpen(false);
      setEditId(null);
      router.refresh();
    });
  };

  const hapus = (id: string) =>
    startTransition(async () => {
      await deletePaketHargaAction(id);
      router.refresh();
    });

  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-heading">Paket Harga (yang dijual)</h1>
          <p className="mt-1 text-slate">
            Atur paket berbayar yang tampil di <span className="font-semibold text-heading">landing page</span> —
            nama, harga, jumlah paket soal, dan daftar fasilitas berbeda tiap paket. Total{" "}
            <span className="font-semibold text-heading">{paketHarga.length}</span> paket.
          </p>
        </div>
        {!open && <Button onClick={mulaiTambah}>+ Tambah Paket Harga</Button>}
      </div>

      {open && (
        <div className="mt-6 space-y-4 rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama paket">
              <input value={form.nama} onChange={(e) => set({ nama: e.target.value })} placeholder="mis. Paket Premium" className={inputCls} />
            </Field>
            <Field label="Harga (Rupiah) — 0 = gratis">
              <input type="number" min={0} step={1000} value={form.harga} onChange={(e) => set({ harga: Number(e.target.value) })} className={inputCls} />
            </Field>
            <Field label="Jumlah paket soal">
              <input type="number" min={0} value={form.jumlahPaketSoal} onChange={(e) => set({ jumlahPaketSoal: Number(e.target.value) })} className={inputCls} />
            </Field>
            <Field label="Deskripsi singkat (opsional)">
              <input value={form.deskripsi} onChange={(e) => set({ deskripsi: e.target.value })} placeholder="mis. Untuk persiapan serius" className={inputCls} />
            </Field>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-heading">Fasilitas paket</p>
            <div className="space-y-2">
              {form.fasilitas.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
                    <IconCheck width={12} height={12} />
                  </span>
                  <input value={f} onChange={(e) => setFasil(i, e.target.value)} placeholder="mis. Analitik nilai per materi" className={inputCls} />
                  <button
                    onClick={() => rmFasil(i)}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line text-slate hover:bg-danger-50 hover:text-danger"
                    aria-label="Hapus fasilitas"
                  >
                    <IconClose width={15} height={15} />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addFasil} className="mt-2 text-sm font-semibold text-brand-600 hover:underline">
              + Tambah fasilitas
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-heading">
              <input type="checkbox" checked={form.populer} onChange={(e) => set({ populer: e.target.checked })} className="h-4 w-4 accent-[var(--color-brand-600)]" />
              Tandai “Paling populer”
            </label>
            <label className="flex items-center gap-2 text-sm text-heading">
              <input type="checkbox" checked={form.aktif} onChange={(e) => set({ aktif: e.target.checked })} className="h-4 w-4 accent-[var(--color-brand-600)]" />
              Tampilkan di landing
            </label>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-danger-100 bg-danger-50 p-3 text-sm text-danger">
              <IconWarning width={16} height={16} className="mt-0.5 shrink-0" /> {error}
            </div>
          )}
          <div className="flex justify-end gap-3 border-t border-line pt-4">
            <Button variant="outline" onClick={() => { setOpen(false); setEditId(null); }} disabled={pending}>Batal</Button>
            <Button onClick={simpan} disabled={pending}>
              {pending ? "Menyimpan…" : editId ? "Simpan Perubahan" : "Tambah Paket"}
            </Button>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paketHarga.length === 0 && !open && (
          <div className="sm:col-span-2 lg:col-span-3 rounded-2xl border border-dashed border-line-strong bg-surface p-8 text-center">
            <p className="text-sm text-slate">
              Belum ada paket harga. Tambah paket pertama — akan tampil di bagian Harga landing page.
            </p>
          </div>
        )}
        {paketHarga.map((p) => (
          <div key={p.id} className="flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-heading">{p.nama}</p>
                <p className="tnum text-lg font-extrabold text-brand-600">{formatRupiah(p.harga)}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {p.populer && <Badge tone="gold">Populer</Badge>}
                {!p.aktif && <Badge tone="neutral">Nonaktif</Badge>}
              </div>
            </div>
            <p className="tnum mt-1 text-xs text-slate">{p.jumlahPaketSoal} paket soal · {p.fasilitas.length} fasilitas</p>
            {p.deskripsi && <p className="mt-1 line-clamp-2 text-sm text-slate">{p.deskripsi}</p>}
            <div className="mt-4 flex gap-2 border-t border-line pt-4">
              <button onClick={() => mulaiEdit(p)} className="flex-1 rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-slate hover:bg-muted hover:text-heading">Edit</button>
              <button onClick={() => { if (confirm("Hapus paket harga ini?")) hapus(p.id); }} disabled={pending} className="rounded-lg border border-danger-100 bg-danger-50 px-3 py-1.5 text-sm font-medium text-danger hover:brightness-95">Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ===================== util ===================== */
const inputCls =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-heading outline-none transition-colors placeholder:text-slate-400 focus:border-brand-600";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-heading">{label}</span>
      {children}
    </label>
  );
}
