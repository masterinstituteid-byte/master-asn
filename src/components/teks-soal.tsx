// ============================================================
// Render teks soal / pembahasan dengan dukungan:
//  - RUMUS (KaTeX): $...$ inline, $$...$$ display (pecahan, pangkat, akar, dll.)
//  - TABEL pipe-delimited (mis. "No | Nama | Nilai")
//  - baris baru dipertahankan (whitespace-pre-line)
// Komponen ini murni (tanpa hook) agar bisa dipakai di server
// maupun client component.
// ============================================================
import type { ReactNode } from "react";
import katex from "katex";

// -------- Rumus (KaTeX) --------
function mathHtml(latex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(latex, {
      throwOnError: false,
      displayMode,
      output: "htmlAndMathml",
    });
  } catch {
    return latex;
  }
}

/** Ubah string jadi node; bagian $$...$$ / $...$ dirender sebagai rumus. */
function withMath(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const display = m[1] != null;
    const latex = (m[1] ?? m[2] ?? "").trim();
    out.push(
      <span
        key={`m${i++}`}
        className={display ? "my-1 block overflow-x-auto" : ""}
        dangerouslySetInnerHTML={{ __html: mathHtml(latex, display) }}
      />,
    );
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Render teks satu baris (inline) dengan rumus — untuk opsi jawaban. */
export function TeksInline({ text }: { text?: string | null }) {
  if (!text) return null;
  return <>{withMath(text)}</>;
}

/**
 * Versi teks polos (tanpa kode LaTeX) untuk pratinjau/cuplikan satu baris.
 * Mengubah $...$ jadi teks biasa: \frac{a}{b} -> a/b, dll. — tidak dirender KaTeX.
 */
export function teksPolos(text?: string | null): string {
  if (!text) return "";
  return text
    .replace(/\$\$?([\s\S]*?)\$\$?/g, (_, inner) => inner) // buang delimiter $ / $$
    .replace(/\\d?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, "$1/$2")
    .replace(/\\sqrt\s*\{([^{}]*)\}/g, "√$1")
    .replace(/\^\s*\{([^{}]*)\}/g, "^$1")
    .replace(/\\times/g, "×")
    .replace(/\\div/g, "÷")
    .replace(/\\le\b/g, "≤")
    .replace(/\\ge\b/g, "≥")
    .replace(/\\pi\b/g, "π")
    .replace(/\\[a-zA-Z]+/g, "") // sisa perintah LaTeX
    .replace(/[{}\\]/g, "") // sisa kurung/backslash
    .replace(/\|/g, " ") // pipe tabel -> spasi (untuk cuplikan)
    .replace(/\s+/g, " ")
    .trim();
}

// -------- Tabel pipe-delimited --------
function splitRow(line: string): string[] {
  let s = line.trim();
  if (s.startsWith("|")) s = s.slice(1);
  if (s.endsWith("|")) s = s.slice(0, -1);
  return s.split("|").map((c) => c.trim());
}

function isSeparator(line: string): boolean {
  const cells = splitRow(line);
  return cells.length > 0 && cells.every((c) => /^:?-{2,}:?$/.test(c.replace(/\s+/g, "")));
}

type Blok = { kind: "teks"; lines: string[] } | { kind: "tabel"; lines: string[] };

export function TeksSoal({
  text,
  className,
}: {
  text?: string | null;
  className?: string;
}) {
  if (!text) return null;

  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blok: Blok[] = [];
  for (const line of lines) {
    const tabelLike = line.includes("|");
    const last = blok[blok.length - 1];
    if (tabelLike && last?.kind === "tabel") last.lines.push(line);
    else if (!tabelLike && last?.kind === "teks") last.lines.push(line);
    else blok.push({ kind: tabelLike ? "tabel" : "teks", lines: [line] });
  }

  const anak = blok
    .map((b, i) => {
      // Butuh >=2 baris agar dianggap tabel (hindari pipe tunggal dalam kalimat).
      if (b.kind === "tabel" && b.lines.length >= 2) return <Tabel key={i} lines={b.lines} />;
      return <Teks key={i} lines={b.lines} />;
    })
    .filter(Boolean);

  return <div className={className}>{anak}</div>;
}

function Teks({ lines }: { lines: string[] }) {
  const teks = lines.join("\n").trim();
  if (!teks) return null;
  return <p className="whitespace-pre-line">{withMath(teks)}</p>;
}

function Tabel({ lines }: { lines: string[] }) {
  const rows = lines.filter((l) => !isSeparator(l)).map(splitRow);
  if (rows.length === 0) return null;

  const kolom = Math.max(...rows.map((r) => r.length));
  const pad = (r: string[]) => Array.from({ length: kolom }, (_, i) => r[i] ?? "");

  const [header, ...body] = rows;

  return (
    <div className="my-3 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {pad(header).map((c, i) => (
              <th
                key={i}
                className="border border-line bg-muted px-3 py-2 text-left font-semibold text-heading"
              >
                {withMath(c)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((r, ri) => (
            <tr key={ri}>
              {pad(r).map((c, ci) => (
                <td key={ci} className="border border-line px-3 py-2 text-slate">
                  {withMath(c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
