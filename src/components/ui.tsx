import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

// ---------- Container ----------
export function Container({
  children,
  className = "",
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`mx-auto w-full ${wide ? "max-w-7xl" : "max-w-6xl"} px-5 sm:px-8 ${className}`}
    >
      {children}
    </div>
  );
}

// ---------- Button ----------
type Variant = "primary" | "navy" | "outline" | "ghost" | "gold" | "danger";
type Size = "sm" | "md" | "lg";

const variantCls: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white shadow-[0_10px_28px_-12px_rgba(41,71,201,0.65)] hover:bg-brand-700",
  navy: "bg-navy text-white shadow-[0_10px_24px_-12px_rgba(26,36,80,0.8)] hover:bg-navy-800",
  outline:
    "border border-line-strong bg-surface text-heading hover:border-brand-400 hover:bg-muted/60",
  ghost: "text-slate hover:bg-muted hover:text-heading",
  gold: "bg-gold-500 text-white shadow-[0_10px_28px_-12px_rgba(192,138,46,0.55)] hover:bg-gold-600",
  danger: "bg-danger text-white hover:brightness-95",
};

const sizeCls: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-[0.95rem] gap-2",
  lg: "h-13 px-7 text-base gap-2.5",
};

const baseBtn =
  "inline-flex items-center justify-center rounded-xl font-medium tracking-tight transition-all duration-200 cursor-pointer select-none disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]";

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={`${baseBtn} ${variantCls[variant]} ${sizeCls[size]} ${className}`}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  href,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size; href: string }) {
  return (
    <Link
      href={href}
      className={`${baseBtn} ${variantCls[variant]} ${sizeCls[size]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}

// ---------- Badge / Pill ----------
type BadgeTone = "brand" | "gold" | "success" | "danger" | "neutral" | "navy";
const badgeTone: Record<BadgeTone, string> = {
  brand: "bg-brand-50 text-brand-700 ring-brand-100",
  gold: "bg-gold-50 text-gold-600 ring-gold-100",
  success: "bg-success-50 text-success ring-success-100",
  danger: "bg-danger-50 text-danger ring-danger-100",
  neutral: "bg-muted text-slate ring-line",
  navy: "bg-navy/5 text-heading ring-navy/10",
};

export function Badge({
  children,
  tone = "brand",
  className = "",
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${badgeTone[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

// ---------- Eyebrow ----------
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
      <span className="h-px w-6 bg-brand-600/50" />
      {children}
    </span>
  );
}

// ---------- Section heading ----------
export function SectionHeading({
  eyebrow,
  title,
  desc,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  desc?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={`${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-4 text-3xl font-bold leading-tight text-heading sm:text-4xl text-balance">
        {title}
      </h2>
      {desc && <p className="mt-4 text-lg leading-relaxed text-slate">{desc}</p>}
    </div>
  );
}

// ---------- Card ----------
export function Card({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  return (
    <Tag
      className={`rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)] ${className}`}
    >
      {children}
    </Tag>
  );
}

// ---------- Progress bar ----------
export function Progress({
  value,
  max = 100,
  tone = "brand",
  className = "",
}: {
  value: number;
  max?: number;
  tone?: "brand" | "gold" | "success" | "danger";
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const toneCls =
    tone === "success"
      ? "bg-success"
      : tone === "danger"
        ? "bg-danger"
        : tone === "gold"
          ? "bg-gold-500"
          : "bg-brand-600";
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-muted ${className}`}>
      <div
        className={`h-full rounded-full ${toneCls} transition-[width] duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
