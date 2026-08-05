"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Container, ButtonLink, Button } from "./ui";
import { Logo, IconMenu, IconClose, IconArrowRight } from "./icons";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/belajar", label: "Belajar" },
  { href: "/bank-soal", label: "Bank Soal" },
  { href: "/tryout", label: "Simulasi" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/riwayat", label: "Riwayat" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [nama, setNama] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!active) return;
        setAuthed(Boolean(d?.authed));
        setNama(d?.nama ?? null);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    window.location.href = "/";
  };

  const firstName = nama?.split(" ")[0];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line bg-bg/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <Container wide className="flex h-16 items-center justify-between">
        <Link href="/" aria-label="MASTER ASN — Beranda">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                isActive(item.href) ? "text-heading" : "text-slate hover:text-heading"
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute inset-x-3.5 -bottom-px h-0.5 rounded-full bg-brand-600" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {authed ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate transition-colors hover:text-heading"
              >
                {firstName ? `Hai, ${firstName}` : "Dashboard"}
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Keluar
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-slate transition-colors hover:text-heading"
              >
                Masuk
              </Link>
              <ButtonLink href="/login?daftar=1" size="sm">
                Daftar
                <IconArrowRight width={16} height={16} />
              </ButtonLink>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-surface text-heading lg:hidden"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
        >
          {open ? <IconClose /> : <IconMenu />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-line bg-surface lg:hidden">
          <Container wide className="flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-3 text-base font-medium ${
                  isActive(item.href)
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {authed ? (
              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 rounded-xl px-4 py-3 text-left text-base font-medium text-danger hover:bg-danger-50"
              >
                Keluar
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl px-4 py-3 text-base font-medium text-slate hover:bg-muted"
                >
                  Masuk
                </Link>
                <ButtonLink href="/login?daftar=1" size="md" className="mt-2 w-full">
                  Daftar
                  <IconArrowRight width={16} height={16} />
                </ButtonLink>
              </>
            )}
          </Container>
        </div>
      )}
    </header>
  );
}
