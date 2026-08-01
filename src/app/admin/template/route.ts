import { currentSession } from "@/lib/session-server";
import { isAdminEmail } from "@/lib/session";
import { buatTemplate } from "@/lib/excel";

export async function GET() {
  const session = await currentSession();
  if (!session || !isAdminEmail(session.email)) {
    return new Response("Tidak diizinkan.", { status: 403 });
  }

  const buffer = await buatTemplate();
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="template-soal-master-asn.xlsx"',
      "Cache-Control": "no-store",
    },
  });
}
