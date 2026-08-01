# MASTER ASN — Platform Belajar & Simulasi CPNS

Platform belajar dan simulasi **SKD CPNS** (TWK, TIU, TKP) dengan pengalaman
**CAT** yang meniru sistem BKN: timer presisi, navigasi soal, tanda ragu-ragu,
auto-submit, dan penilaian otomatis berbasis **passing grade** resmi.

Dibangun dengan **Next.js 16 (App Router)** + **Tailwind CSS v4** + **TypeScript**.
Arah visual: *terang, resmi, dan meyakinkan (education) — royal blue + navy (selaras logo) + trim emas, tipografi Sora + Inter. Logo emblem Master Institute (navy) di `public/logo-master.png`.*

## Menjalankan

```bash
npm run dev
```

Buka http://localhost:3000. Perintah lain: `npm run build` (build produksi),
`npm run start` (jalankan hasil build), `npm run lint`.

> Node.js dipasang lewat nvm. Jika `node`/`npm` tidak dikenali di terminal baru,
> jalankan dulu: `source ~/.zshrc` (atau buka terminal baru).

## Halaman

| Rute | Isi |
|------|-----|
| `/` | Landing premium: hero + preview antarmuka CAT, subtes, fitur, harga |
| `/belajar` | Modul materi TWK/TIU/TKP (tab), dasar → HOTS |
| `/bank-soal` | Bank soal dengan filter subtes/tingkat + pencarian + pembahasan |
| `/tryout` | Intro paket simulasi, aturan, skema penilaian |
| `/simulasi` | **Ruang ujian CAT** — timer, navigator, ragu-ragu, auto-submit |
| `/hasil` | Nilai per subtes vs passing grade, verdict lulus, pembahasan tiap soal |
| `/dashboard` | Analitik nilai, penguasaan per materi, rekomendasi fokus |

## Struktur

```
src/
  app/
    (site)/            # Halaman ber-navbar/footer
      page.tsx         # Landing
      belajar/  bank-soal/  tryout/  dashboard/  hasil/
    simulasi/          # Layar ujian penuh (tanpa chrome)
    layout.tsx  globals.css   # Root + design tokens (Tailwind v4 @theme)
  components/          # navbar, footer, ui, icons, *-view, *-tabs, *-browser
  data/                # questions.ts (bank soal contoh), materi.ts
  lib/                 # skd.ts (aturan & skoring), tryout-config.ts
```

## Data & skoring (SKD)

- **TWK** 30 soal · PG 65 · maks 150 — benar +5, salah/kosong 0
- **TIU** 35 soal · PG 80 · maks 175 — benar +5, salah/kosong 0
- **TKP** 45 soal · PG 166 · maks 225 — tiap opsi bernilai 1–5 poin
- Lulus bila **setiap** subtes ≥ passing grade-nya.

Bank soal saat ini berisi **18 soal contoh** (6 per subtes) sebagai placeholder —
struktur data (`src/data/questions.ts`) siap diisi soal sungguhan tanpa mengubah UI.
Hasil try out tersimpan di `localStorage` perangkat.

## Catatan

Simulasi independen untuk latihan; tidak berafiliasi dengan BKN. Passing grade
mengikuti pola SKD yang umum dipakai — sesuaikan bila regulasi berubah.
