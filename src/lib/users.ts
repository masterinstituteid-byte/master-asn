import "server-only";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

// Penyimpanan pengguna di database (Prisma / tabel User).

export interface UserRecord {
  id: string;
  nama: string;
  email: string;
  passwordHash: string; // kosong untuk akun OAuth (login sandi dinonaktifkan)
  provider?: "password" | "google";
  createdAt: string;
}

interface UserRow {
  id: string;
  nama: string;
  email: string;
  passwordHash: string;
  provider: string;
  createdAt: Date;
}

function toRecord(u: UserRow): UserRecord {
  return {
    id: u.id,
    nama: u.nama,
    email: u.email,
    passwordHash: u.passwordHash,
    provider: u.provider === "google" ? "google" : "password",
    createdAt: u.createdAt.toISOString(),
  };
}

export async function findByEmail(email: string): Promise<UserRecord | null> {
  const e = email.trim().toLowerCase();
  const u = await prisma.user.findUnique({ where: { email: e } });
  return u ? toRecord(u) : null;
}

export async function createUser(
  nama: string,
  email: string,
  password: string,
): Promise<UserRecord> {
  const e = email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: e } });
  if (existing) {
    throw new Error("EMAIL_EXISTS");
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const u = await prisma.user.create({
    data: { nama: nama.trim(), email: e, passwordHash, provider: "password" },
  });
  return toRecord(u);
}

export async function verifyCredentials(
  email: string,
  password: string,
): Promise<UserRecord | null> {
  const user = await findByEmail(email);
  if (!user || !user.passwordHash) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

/** Ambil user berdasarkan email Google, buat baru bila belum ada. */
export async function findOrCreateGoogleUser(
  email: string,
  nama: string,
): Promise<UserRecord> {
  const e = email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: e } });
  if (existing) return toRecord(existing);
  const u = await prisma.user.create({
    data: {
      nama: nama.trim() || e.split("@")[0],
      email: e,
      passwordHash: "",
      provider: "google",
    },
  });
  return toRecord(u);
}

// ---- Untuk panel admin (tanpa passwordHash) ----
export interface UserRingkas {
  id: string;
  nama: string;
  email: string;
  provider: "password" | "google";
  createdAt: string;
}

export async function getAllUsers(): Promise<UserRingkas[]> {
  const rows = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map((u) => ({
    id: u.id,
    nama: u.nama,
    email: u.email,
    provider: u.provider === "google" ? "google" : "password",
    createdAt: u.createdAt.toISOString(),
  }));
}

export async function countUsers(): Promise<number> {
  return prisma.user.count();
}

/** Email satu pengguna berdasarkan id (untuk pengecekan admin). */
export async function getUserEmail(id: string): Promise<string | null> {
  const u = await prisma.user.findUnique({ where: { id }, select: { email: true } });
  return u?.email ?? null;
}

/** Hapus pengguna beserta seluruh data terkait (hasil, transaksi, akses — cascade). */
export async function deleteUser(id: string): Promise<void> {
  await prisma.user.delete({ where: { id } });
}
