import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Poppins } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";

// Poppins — font judul (display) untuk seluruh situs.
const display = Poppins({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const body = Plus_Jakarta_Sans({
  variable: "--font-body-face",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const JUDUL = "MASTER ASN — Belajar & Simulasi SKD CPNS";
const DESKRIPSI =
  "Platform belajar dan simulasi SKD CPNS (TWK, TIU, TKP) dengan pengalaman CAT BKN yang presisi, pembahasan lengkap, dan analitik nilai berbasis passing grade.";

export const metadata: Metadata = {
  metadataBase: new URL("https://masterasn.com"),
  title: {
    default: JUDUL,
    template: "%s · MASTER ASN",
  },
  description: DESKRIPSI,
  keywords: ["CPNS", "SKD", "Simulasi", "TWK", "TIU", "TKP", "CAT BKN", "ASN"],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://masterasn.com",
    siteName: "MASTER ASN",
    title: JUDUL,
    description: DESKRIPSI,
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "MASTER ASN — Belajar & Simulasi SKD CPNS" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: JUDUL,
    description: DESKRIPSI,
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
        >
          Lewati ke konten utama
        </a>
        {children}
      </body>
    </html>
  );
}
