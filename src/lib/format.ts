/** Format angka rupiah, mis. 50000 → "Rp50.000". 0 → "Gratis". */
export function formatRupiah(n: number, gratisLabel = "Gratis"): string {
  if (!n || n <= 0) return gratisLabel;
  return "Rp" + n.toLocaleString("id-ID");
}
