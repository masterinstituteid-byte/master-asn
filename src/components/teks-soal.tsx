// ============================================================
// Render teks soal / pembahasan dengan dukungan:
//  - baris baru dipertahankan (whitespace-pre-line)
//  - TABEL pipe-delimited (mis. "No | Nama | Nilai")
// Komponen ini murni (tanpa hook) agar bisa dipakai di server
// maupun client component.
// ============================================================

/** Pecah satu baris tabel menjadi sel-sel, buang pipe di ujung. */
function splitRow(line: string): string[] {
  let s = line.trim();
  if (s.startsWith("|")) s = s.slice(1);
  if (s.endsWith("|")) s = s.slice(0, -1);
  return s.split("|").map((c) => c.trim());
}

/** Baris pemisah header markdown, mis. "|---|:--:|" — diabaikan saat render. */
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
  return <p className="whitespace-pre-line">{teks}</p>;
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
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((r, ri) => (
            <tr key={ri}>
              {pad(r).map((c, ci) => (
                <td key={ci} className="border border-line px-3 py-2 text-slate">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
