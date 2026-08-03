import "server-only";
import { resolveMx } from "node:dns/promises";

// ============================================================
// Validasi email 3 lapis (tanpa kirim kode/link):
//  1. Format email yang benar
//  2. Bukan email sekali-pakai (disposable/throwaway)
//  3. Domain-nya nyata & bisa menerima email (punya MX record)
// ============================================================

const FORMAT = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

// Domain email sekali-pakai yang umum — diblokir agar tak jadi akun buangan.
const DISPOSABLE = new Set([
  "mailinator.com", "yopmail.com", "guerrillamail.com", "guerrillamail.info",
  "sharklasers.com", "grr.la", "temp-mail.org", "tempmail.com", "temp-mail.io",
  "tempmailo.com", "tempmail.net", "10minutemail.com", "10minutemail.net",
  "20minutemail.com", "throwawaymail.com", "trashmail.com", "trashmail.net",
  "getnada.com", "maildrop.cc", "mailnesia.com", "mintemail.com", "mohmal.com",
  "emailondeck.com", "mailcatch.com", "spamgourmet.com", "33mail.com",
  "fakeinbox.com", "dispostable.com", "tempinbox.com", "0-mail.com",
  "emailfake.com", "email-fake.com", "moakt.com", "luxusmail.org",
  "inboxkitten.com", "tempr.email", "discard.email", "burnermail.io",
  "getairmail.com", "spam4.me", "mailexpire.com", "mytemp.email", "cs.email",
]);

export type CekEmail = { ok: true } | { ok: false; alasan: string };

/** Periksa apakah email layak (format valid, bukan sekali-pakai, domain bisa terima email). */
export async function cekEmailAktif(emailRaw: string): Promise<CekEmail> {
  const email = emailRaw.trim().toLowerCase();

  if (!FORMAT.test(email)) {
    return { ok: false, alasan: "Format email tidak valid." };
  }

  const domain = email.split("@")[1];
  if (!domain) return { ok: false, alasan: "Format email tidak valid." };

  if (DISPOSABLE.has(domain)) {
    return {
      ok: false,
      alasan: "Email sekali-pakai tidak diperbolehkan. Gunakan email pribadi Anda.",
    };
  }

  try {
    const mx = await resolveMx(domain);
    if (!mx || mx.length === 0) {
      return { ok: false, alasan: "Domain email tidak dapat menerima email. Periksa kembali." };
    }
  } catch (e) {
    const code = (e as NodeJS.ErrnoException).code;
    // Domain memang tidak ada (typo/palsu) → tolak.
    if (code === "ENOTFOUND" || code === "ENODATA") {
      return { ok: false, alasan: "Domain email tidak ditemukan. Periksa kembali penulisannya." };
    }
    // Gangguan DNS sementara (timeout, dll.) → jangan blokir pendaftar yang sah.
    return { ok: true };
  }

  return { ok: true };
}
