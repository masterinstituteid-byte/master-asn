import { promises as fs } from "fs";
import { currentSession } from "@/lib/session-server";
import { getModulById, modulFilePath } from "@/lib/modul";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await currentSession();
  if (!session) return new Response("Silakan login terlebih dahulu.", { status: 401 });

  const { id } = await params;
  const modul = await getModulById(id);
  if (!modul || !modul.aktif) return new Response("Materi tidak ditemukan.", { status: 404 });

  try {
    const buf = await fs.readFile(modulFilePath(id));
    return new Response(new Uint8Array(buf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${encodeURIComponent(modul.namaFile)}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new Response("Berkas materi tidak tersedia.", { status: 404 });
  }
}
