import { NextResponse } from "next/server";
import { verifyCredentials } from "@/lib/users";
import { signSession, setSessionCookie } from "@/lib/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");

  if (!email || !password) {
    return NextResponse.json({ error: "Lengkapi email & kata sandi." }, { status: 400 });
  }

  const user = await verifyCredentials(email, password);
  if (!user) {
    return NextResponse.json(
      { error: "Email atau kata sandi salah." },
      { status: 401 },
    );
  }

  const token = await signSession({
    sub: user.id,
    nama: user.nama,
    email: user.email,
  });
  const res = NextResponse.json({ nama: user.nama, email: user.email });
  setSessionCookie(res, token);
  return res;
}
