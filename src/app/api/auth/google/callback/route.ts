import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { findOrCreateGoogleUser } from "@/lib/users";
import { signSession, setSessionCookie } from "@/lib/session";
import { safeNext } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;

  const fail = (reason: string) => {
    const u = new URL("/login", origin);
    u.searchParams.set("error", reason);
    const r = NextResponse.redirect(u);
    r.cookies.set("g_oauth", "", { path: "/", maxAge: 0 });
    return r;
  };

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const cookieRaw = req.cookies.get("g_oauth")?.value;
  if (!code || !state || !cookieRaw) return fail("google_failed");

  let saved: { state: string; next: string };
  try {
    saved = JSON.parse(cookieRaw);
  } catch {
    return fail("google_failed");
  }
  if (saved.state !== state) return fail("google_failed");

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return fail("google_unconfigured");

  const redirectUri = `${origin}/api/auth/google/callback`;

  // 1) Tukar authorization code dengan token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) return fail("google_failed");
  const tokens = (await tokenRes.json()) as { access_token?: string };
  if (!tokens.access_token) return fail("google_failed");

  // 2) Ambil profil pengguna
  const infoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  if (!infoRes.ok) return fail("google_failed");
  const info = (await infoRes.json()) as {
    email?: string;
    email_verified?: boolean;
    name?: string;
  };
  if (!info.email) return fail("google_failed");

  // 3) Buat/temukan user, buat sesi, set cookie
  const user = await findOrCreateGoogleUser(
    info.email,
    info.name || info.email.split("@")[0],
  );
  const token = await signSession({
    sub: user.id,
    nama: user.nama,
    email: user.email,
  });

  const dest = new URL(safeNext(saved.next), origin);
  const res = NextResponse.redirect(dest);
  setSessionCookie(res, token);
  res.cookies.set("g_oauth", "", { path: "/", maxAge: 0 });
  return res;
}
