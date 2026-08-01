import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/session";

export async function proxy(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  if (session) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

// Halaman yang membutuhkan login. Landing (/), /login, /api/auth/* publik.
export const config = {
  matcher: [
    "/belajar/:path*",
    "/bank-soal/:path*",
    "/tryout/:path*",
    "/simulasi/:path*",
    "/dashboard/:path*",
    "/hasil/:path*",
    "/admin/:path*",
  ],
};
