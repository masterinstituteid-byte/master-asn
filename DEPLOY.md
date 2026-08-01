# Panduan Deploy — MASTER ASN (GitHub + Hostinger VPS + Coolify)

Dokumen ini memandu memublikasikan website secara online. Database memakai
**SQLite** yang disimpan di **volume permanen** server (data tidak hilang saat
deploy ulang) + backup.

---

## 0. Yang perlu disiapkan (dibeli/dibuat oleh pemilik)

| Item | Keterangan | Biaya |
|------|-----------|-------|
| Akun **GitHub** | Menyimpan kode | Gratis |
| **Hostinger VPS** | Server. Pilih **KVM 2 (2 vCPU, 8GB RAM)** atau lebih | Bulanan |
| Template **Coolify** | Dipasang 1-klik saat beli VPS Hostinger | Termasuk VPS |
| **Domain** | mis. `masterasn.com` — bisa beli di Hostinger | Tahunan |

> Catatan: pemilik yang membuat akun & membayar. Semua langkah teknis di bawah
> bisa didampingi.

---

## 1. Unggah kode ke GitHub

1. Buat repository baru (private) di GitHub, mis. `master-asn`.
2. Di folder proyek, jalankan:
   ```bash
   git add .
   git commit -m "Siap deploy"
   git branch -M main
   git remote add origin https://github.com/USERNAME/master-asn.git
   git push -u origin main
   ```
   > File rahasia (`.env`, database `.db`, `node_modules`) otomatis TIDAK ikur
   > ter-upload karena sudah diatur di `.gitignore`.

---

## 2. Siapkan Hostinger VPS + Coolify

1. Beli **VPS Hostinger** (KVM 2+). Saat setup OS, pilih template **Coolify**
   (Hostinger menyediakannya 1-klik). Tunggu hingga Coolify aktif.
2. Buka dashboard Coolify (alamatnya diberikan Hostinger), buat akun admin Coolify.

---

## 3. Hubungkan Coolify ke GitHub

1. Di Coolify: **Sources → GitHub → Connect** (izinkan akses ke repo `master-asn`).
2. **Projects → New → Application → Public/Private Repository** → pilih repo.
3. **Build Pack: Dockerfile** (proyek ini sudah punya `Dockerfile`).
4. **Port: 3000**.

---

## 4. Isi Environment Variables

Di aplikasi Coolify → tab **Environment Variables**, isi (lihat `.env.example`):

| Nama | Nilai |
|------|-------|
| `AUTH_SECRET` | string acak — buat dengan `openssl rand -base64 32` |
| `DATABASE_URL` | `file:/app/data/prod.db` |
| `DATA_DIR` | `/app/data` |
| `ADMIN_EMAIL` | email Anda (akan jadi admin) |

---

## 5. Pasang Volume Permanen (PENTING — agar data tidak hilang)

Di aplikasi Coolify → **Storages / Persistent Volume**:

- **Mount Path:** `/app/data`

Semua database & file PDF tersimpan di sini dan **tetap ada** setiap deploy ulang.

---

## 6. Deploy pertama

1. Klik **Deploy**. Coolify akan build dari `Dockerfile`, menjalankan migrasi
   database otomatis, lalu menyalakan server.
2. Setelah "running", buka URL sementara dari Coolify untuk mengecek.

---

## 7. Pasang Domain + HTTPS

1. Arahkan domain ke IP VPS (buat **A record** `@` → IP VPS di pengaturan DNS
   domain). Jika domain dibeli di Hostinger, atur di hPanel.
2. Di Coolify → **Domains**, isi `https://namadomain.com`. Coolify otomatis
   membuat sertifikat **HTTPS gratis** (Let's Encrypt).

---

## 8. Jadikan diri Anda admin

1. Buka website → **Daftar** akun memakai email yang sama dengan `ADMIN_EMAIL`.
2. Login → buka `/admin`. Panel admin siap dipakai (soal, paket, harga, modul,
   transaksi, testimoni, pengguna, hasil ujian).

---

## 9. Revisi & deploy ulang (kapan saja)

```bash
git add .
git commit -m "perubahan ..."
git push
```
Coolify mendeteksi push dan **deploy ulang otomatis**. Data di volume tetap aman.

---

## 10. Backup (disarankan)

Database ada di volume pada `/app/data/prod.db`. Backup berkala:
- Coolify punya fitur **Scheduled Backups**, atau
- Cron menyalin `/app/data` ke penyimpanan lain secara berkala.

---

## Naik ke PostgreSQL nanti (opsional)

Saat peserta sudah sangat ramai (mis. Tryout Akbar ribuan orang serentak),
kita bisa pindah ke PostgreSQL (Coolify bisa menyediakannya) tanpa kehilangan
data. Cukup minta bantuan untuk migrasi.
