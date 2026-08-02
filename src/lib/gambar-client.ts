// ============================================================
// Normalisasi gambar di sisi klien SEBELUM diunggah.
// Tujuan: resolusi seragam & ukuran file ringan agar saat tampil
// di simulasi tidak terlalu besar, dan aspek rasionya tetap presisi.
// ------------------------------------------------------------
// - Sisi terpanjang dibatasi MAKS_SISI px (hanya diperkecil,
//   tidak pernah diperbesar agar tidak pecah/buram).
// - Diekspor ke WebP berkualitas tinggi (file jauh lebih kecil).
// - GIF (animasi) dibiarkan apa adanya agar animasinya tak hilang.
// ============================================================

const MAKS_SISI = 1000; // px — cukup tajam untuk soal figural, tetap ringan
const KUALITAS = 0.9;

export async function siapkanGambar(file: File): Promise<File> {
  // GIF (kemungkinan animasi) — jangan diproses lewat canvas.
  if (file.type === "image/gif") return file;
  if (typeof createImageBitmap !== "function") return file;

  let bitmap: ImageBitmap;
  try {
    // imageOrientation: "from-image" → otomatis mengoreksi rotasi foto (EXIF).
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return file; // browser lama / format tak didukung → pakai file asli
  }

  const { width, height } = bitmap;
  const skala = Math.min(1, MAKS_SISI / Math.max(width, height));

  // Sudah cukup kecil → tak perlu diolah ulang.
  if (skala >= 1) {
    bitmap.close?.();
    return file;
  }

  const w = Math.round(width * skala);
  const h = Math.round(height * skala);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close?.();
    return file;
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", KUALITAS),
  );
  if (!blob) return file;

  const nama = file.name.replace(/\.[^.]+$/, "") + ".webp";
  return new File([blob], nama, { type: "image/webp" });
}
