import { promises as fs } from "fs";
import { currentSession } from "@/lib/session-server";
import { getGambarMeta, gambarPath } from "@/lib/gambar";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await currentSession();
  if (!session) return new Response("Silakan login terlebih dahulu.", { status: 401 });

  const { id } = await params;
  const meta = await getGambarMeta(id);
  if (!meta) return new Response("Gambar tidak ditemukan.", { status: 404 });

  try {
    const buf = await fs.readFile(gambarPath(id));
    return new Response(new Uint8Array(buf), {
      headers: {
        "Content-Type": meta.mime,
        "Cache-Control": "private, max-age=86400",
      },
    });
  } catch {
    return new Response("Berkas gambar tidak tersedia.", { status: 404 });
  }
}
