// Util kecil bersama untuk alur login.

/** Hanya izinkan path internal untuk redirect (cegah open-redirect). */
export function safeNext(next: string | null | undefined): string {
  if (!next) return "/dashboard";
  if (!next.startsWith("/") || next.startsWith("//")) return "/dashboard";
  return next;
}
