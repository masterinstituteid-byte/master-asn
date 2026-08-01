import { NextResponse } from "next/server";
import { createUser } from "@/lib/users";
import { signSession, setSessionCookie } from "@/lib/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const nama = String(body.nama ?? "").trim();
  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");

  if (!nama || !email || !password) {
    return NextResponse.json({ error: "Lengkapi semua kolom." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Format email tidak valid." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Kata sandi minimal 6 karakter." },
      { status: 400 },
    );
  }

  try {
    const user = await createUser(nama, email, password);
    const token = await signSession({
      sub: user.id,
      nama: user.nama,
      email: user.email,
    });
    const res = NextResponse.json({ nama: user.nama, email: user.email });
    setSessionCookie(res, token);
    return res;
  } catch (e) {
    if (e instanceof Error && e.message === "EMAIL_EXISTS") {
      return NextResponse.json(
        { error: "Email sudah terdaftar. Silakan masuk." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "Gagal mendaftar." }, { status: 500 });
  }
}
