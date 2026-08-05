"use client";

import { useEffect, useState } from "react";
import { Container, ButtonLink } from "@/components/ui";
import { IconTrophy, IconArrowRight } from "@/components/icons";
import { HASIL_STORAGE_KEY, type HasilTersimpan } from "@/lib/skd";
import { HasilView } from "@/components/hasil-view";

export default function HasilPage() {
  const [hasil, setHasil] = useState<HasilTersimpan | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HASIL_STORAGE_KEY);
      if (raw) setHasil(JSON.parse(raw) as HasilTersimpan);
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <Container wide className="py-24">
        <div className="mx-auto h-64 max-w-2xl animate-pulse rounded-3xl bg-muted" />
      </Container>
    );
  }

  if (!hasil) return <EmptyHasil />;

  return <HasilView hasil={hasil} variant="hasil" />;
}

function EmptyHasil() {
  return (
    <Container wide className="py-24">
      <div className="mx-auto max-w-md text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-muted text-slate-400">
          <IconTrophy width={28} height={28} />
        </span>
        <h1 className="mt-6 text-2xl font-bold text-heading">Belum ada hasil</h1>
        <p className="mt-2 text-slate">
          Kamu belum menyelesaikan simulasi. Kerjakan satu paket untuk melihat
          nilai dan pembahasannya di sini.
        </p>
        <ButtonLink href="/tryout" size="lg" className="mt-8">
          Mulai Simulasi
          <IconArrowRight width={18} height={18} />
        </ButtonLink>
      </div>
    </Container>
  );
}
