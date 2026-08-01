import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { IconSparkle } from "@/components/icons";
import Link from "next/link";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Announcement bar */}
      <Link
        href="/tryout"
        className="group block bg-navy text-white"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-5 py-2.5 text-center text-xs font-medium sm:text-sm">
          <IconSparkle width={15} height={15} className="text-gold-400" />
          <span>
            Simulasi CAT presisi ala BKN — coba paket pertama{" "}
            <span className="font-bold text-gold-400">gratis</span>
          </span>
          <span className="hidden text-white/70 transition-transform group-hover:translate-x-0.5 sm:inline">
            →
          </span>
        </div>
      </Link>
      <Navbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
