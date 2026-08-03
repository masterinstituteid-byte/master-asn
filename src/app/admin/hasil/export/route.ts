import { currentSession } from "@/lib/session-server";
import { isAdminEmail } from "@/lib/session";
import { getAllHasil } from "@/lib/hasil";
import { buatRanking, kunciPaket, type ModeRanking } from "@/lib/ranking";
import { buatRankingExcel } from "@/lib/excel";

export async function GET(request: Request) {
  const session = await currentSession();
  if (!session || !isAdminEmail(session.email)) {
    return new Response("Tidak diizinkan.", { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const paketKey = searchParams.get("paket") ?? "";
  const mode: ModeRanking = searchParams.get("mode") === "semua" ? "semua" : "terbaik";

  const hasil = await getAllHasil();
  const ranking = buatRanking(hasil, paketKey, mode);

  if (ranking.length === 0) {
    return new Response("Tidak ada data untuk paket ini.", { status: 404 });
  }

  const paketNama =
    hasil.find((h) => kunciPaket(h) === paketKey)?.paketNama ?? "Paket";
  const buffer = await buatRankingExcel(ranking, paketNama);

  const namaFile =
    `ranking-${paketNama}-${mode}`.replace(/[^a-z0-9\-]+/gi, "_").toLowerCase() + ".xlsx";

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${namaFile}"`,
      "Cache-Control": "no-store",
    },
  });
}
