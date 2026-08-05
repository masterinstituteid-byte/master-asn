import type { SVGProps } from "react";
import Image from "next/image";

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={20}
      height={20}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const IconMenu = (p: IconProps) => (
  <Base {...p}><path d="M4 6h16M4 12h16M4 18h16" /></Base>
);
export const IconClose = (p: IconProps) => (
  <Base {...p}><path d="M6 6l12 12M18 6L6 18" /></Base>
);
export const IconArrowRight = (p: IconProps) => (
  <Base {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Base>
);
export const IconArrowUpRight = (p: IconProps) => (
  <Base {...p}><path d="M7 17L17 7M8 7h9v9" /></Base>
);
export const IconChevronRight = (p: IconProps) => (
  <Base {...p}><path d="M9 6l6 6-6 6" /></Base>
);
export const IconChevronDown = (p: IconProps) => (
  <Base {...p}><path d="M6 9l6 6 6-6" /></Base>
);
export const IconBook = (p: IconProps) => (
  <Base {...p}><path d="M4 5a2 2 0 0 1 2-2h5v16H6a2 2 0 0 0-2 2zM20 5a2 2 0 0 0-2-2h-5v16h5a2 2 0 0 1 2 2z" /></Base>
);
export const IconClock = (p: IconProps) => (
  <Base {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></Base>
);
export const IconChart = (p: IconProps) => (
  <Base {...p}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></Base>
);
export const IconTarget = (p: IconProps) => (
  <Base {...p}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="0.6" fill="currentColor" /></Base>
);
export const IconShield = (p: IconProps) => (
  <Base {...p}><path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6z" /><path d="M9 12l2 2 4-4" /></Base>
);
export const IconUsers = (p: IconProps) => (
  <Base {...p}><circle cx="9" cy="8" r="3.2" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><path d="M16 6.2a3 3 0 0 1 0 5.6M17 19a5.5 5.5 0 0 0-2.5-4.6" /></Base>
);
export const IconTrophy = (p: IconProps) => (
  <Base {...p}><path d="M7 4h10v4a5 5 0 0 1-10 0z" /><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 20h6M12 13v3" /></Base>
);
export const IconBrain = (p: IconProps) => (
  <Base {...p}><path d="M9.5 4a2.5 2.5 0 0 0-2.5 2.5A2.5 2.5 0 0 0 5 9a2.5 2.5 0 0 0 1 4 2.5 2.5 0 0 0 3.5 3V4zM14.5 4a2.5 2.5 0 0 1 2.5 2.5A2.5 2.5 0 0 1 19 9a2.5 2.5 0 0 1-1 4 2.5 2.5 0 0 1-3.5 3V4z" /></Base>
);
export const IconScale = (p: IconProps) => (
  <Base {...p}><path d="M12 4v16M7 20h10M4 8l3-3 3 3M4 8a3 3 0 0 0 6 0M14 8l3-3 3 3M14 8a3 3 0 0 0 6 0M6 5h12" /></Base>
);
export const IconFlag = (p: IconProps) => (
  <Base {...p}><path d="M5 21V4M5 4h11l-1.5 3L16 10H5" /></Base>
);
export const IconCheckCircle = (p: IconProps) => (
  <Base {...p}><circle cx="12" cy="12" r="8.5" /><path d="M8.5 12l2.5 2.5 4.5-5" /></Base>
);
export const IconXCircle = (p: IconProps) => (
  <Base {...p}><circle cx="12" cy="12" r="8.5" /><path d="M9 9l6 6M15 9l-6 6" /></Base>
);
export const IconCheck = (p: IconProps) => (
  <Base {...p}><path d="M5 12.5l4 4 10-10" /></Base>
);
export const IconPlay = (p: IconProps) => (
  <Base {...p}><path d="M8 5.5v13l11-6.5z" /></Base>
);
export const IconLock = (p: IconProps) => (
  <Base {...p}><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></Base>
);
export const IconLockOpen = (p: IconProps) => (
  <Base {...p}><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 7.5-1.8" /></Base>
);
export const IconGrid = (p: IconProps) => (
  <Base {...p}><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></Base>
);
export const IconSparkle = (p: IconProps) => (
  <Base {...p}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8z" /></Base>
);
export const IconStar = (p: IconProps) => (
  <Base {...p} fill="currentColor" stroke="none"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 17l-5.2 2.7 1-5.9L3.5 9.7l5.9-.9z" /></Base>
);
export const IconQuote = (p: IconProps) => (
  <Base {...p} fill="currentColor" stroke="none"><path d="M7 7c-2.2 0-4 1.8-4 4v6h6v-6H5c0-1.1.9-2 2-2zM18 7c-2.2 0-4 1.8-4 4v6h6v-6h-4c0-1.1.9-2 2-2z" /></Base>
);
export const IconFilter = (p: IconProps) => (
  <Base {...p}><path d="M4 5h16l-6 7v5l-4 2v-7z" /></Base>
);
export const IconLayers = (p: IconProps) => (
  <Base {...p}><path d="M12 4l8 4-8 4-8-4zM4 12l8 4 8-4M4 16l8 4 8-4" /></Base>
);
export const IconBolt = (p: IconProps) => (
  <Base {...p}><path d="M13 3L5 13h5l-1 8 8-11h-5z" /></Base>
);
export const IconEye = (p: IconProps) => (
  <Base {...p}><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></Base>
);
export const IconRefresh = (p: IconProps) => (
  <Base {...p}><path d="M20 11a8 8 0 0 0-14-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14 4.5L20 16M20 20v-4h-4" /></Base>
);
export const IconArrowLeft = (p: IconProps) => (
  <Base {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></Base>
);
export const IconDownload = (p: IconProps) => (
  <Base {...p}><path d="M12 4v10M8 11l4 4 4-4M5 19h14" /></Base>
);
export const IconInfo = (p: IconProps) => (
  <Base {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5M12 8h.01" /></Base>
);
export const IconWarning = (p: IconProps) => (
  <Base {...p}><path d="M12 4l9 15H3zM12 10v4M12 17h.01" /></Base>
);

/** Google "G" (multicolor brand mark). */
export const IconGoogle = (p: IconProps) => (
  <svg viewBox="0 0 48 48" width={20} height={20} aria-hidden="true" {...p}>
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
  </svg>
);

/** Wordmark logo — Master Institute emblem + product name. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src="/logo-mark.png"
        alt="Master Institute"
        width={56}
        height={56}
        className="h-14 w-14 object-contain"
        priority
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.6rem] font-extrabold uppercase tracking-tight text-heading">
          Master<span className="text-brand-600"> ASN</span>
        </span>
        <span className="mt-1 text-[0.72rem] font-semibold tracking-wide text-slate-400">
          by Master Institute
        </span>
      </span>
    </span>
  );
}
