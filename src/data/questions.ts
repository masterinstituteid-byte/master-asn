import type { Soal, Subtes } from "@/lib/skd";

// Bank soal contoh (subset demo dari struktur SKD 110 soal).
// TWK & TIU: satu kunci benar (poin 5). TKP: setiap opsi berpoin 1–5.

export const BANK_SOAL: Soal[] = [
  // ================= TWK =================
  {
    id: "TWK-01",
    subtes: "TWK",
    materi: "Pancasila",
    tingkat: "HOTS",
    pertanyaan:
      "Sebuah desa mengadakan rapat untuk menentukan lokasi pembangunan posyandu. Setelah perdebatan panjang, kepala desa mengajak seluruh warga berdiskusi hingga tercapai keputusan yang diterima bersama tanpa pemungutan suara paksa. Sikap kepala desa tersebut paling mencerminkan pengamalan sila ke-…",
    opsi: [
      { id: "A", teks: "Sila ke-1" },
      { id: "B", teks: "Sila ke-2" },
      { id: "C", teks: "Sila ke-3" },
      { id: "D", teks: "Sila ke-4" },
      { id: "E", teks: "Sila ke-5" },
    ],
    kunci: "D",
    pembahasan:
      "Musyawarah untuk mufakat merupakan pengamalan sila ke-4: 'Kerakyatan yang dipimpin oleh hikmat kebijaksanaan dalam permusyawaratan/perwakilan'. Kata kunci: mengutamakan diskusi bersama untuk mencapai keputusan.",
  },
  {
    id: "TWK-02",
    subtes: "TWK",
    materi: "UUD 1945",
    tingkat: "Sedang",
    pertanyaan:
      "UUD 1945 telah mengalami amandemen pada era Reformasi. Berapa kali amandemen dilakukan dan pada rentang tahun berapa?",
    opsi: [
      { id: "A", teks: "3 kali, 1998–2000" },
      { id: "B", teks: "4 kali, 1999–2002" },
      { id: "C", teks: "5 kali, 1999–2004" },
      { id: "D", teks: "2 kali, 2000–2002" },
      { id: "E", teks: "4 kali, 1998–2001" },
    ],
    kunci: "B",
    pembahasan:
      "UUD 1945 diamandemen sebanyak 4 kali oleh MPR: Amandemen I (1999), II (2000), III (2001), dan IV (2002).",
  },
  {
    id: "TWK-03",
    subtes: "TWK",
    materi: "Bhinneka Tunggal Ika",
    tingkat: "Mudah",
    pertanyaan:
      "Semboyan 'Bhinneka Tunggal Ika' dikutip dari sebuah kitab karya Mpu Tantular. Kitab yang dimaksud adalah…",
    opsi: [
      { id: "A", teks: "Negarakertagama" },
      { id: "B", teks: "Arjunawiwaha" },
      { id: "C", teks: "Sutasoma" },
      { id: "D", teks: "Pararaton" },
      { id: "E", teks: "Smaradahana" },
    ],
    kunci: "C",
    pembahasan:
      "Semboyan Bhinneka Tunggal Ika berasal dari Kakawin Sutasoma karya Mpu Tantular pada masa Kerajaan Majapahit.",
  },
  {
    id: "TWK-04",
    subtes: "TWK",
    materi: "Bela Negara",
    tingkat: "Sedang",
    pertanyaan:
      "Hak dan kewajiban setiap warga negara untuk ikut serta dalam usaha pertahanan dan keamanan negara diatur secara tegas dalam UUD 1945 pada…",
    opsi: [
      { id: "A", teks: "Pasal 27 ayat (3)" },
      { id: "B", teks: "Pasal 28 ayat (1)" },
      { id: "C", teks: "Pasal 30 ayat (2)" },
      { id: "D", teks: "Pasal 31 ayat (1)" },
      { id: "E", teks: "Pasal 33 ayat (1)" },
    ],
    kunci: "A",
    pembahasan:
      "Pasal 27 ayat (3): 'Setiap warga negara berhak dan wajib ikut serta dalam upaya pembelaan negara.' Pasal 30 mengatur usaha pertahanan & keamanan negara secara umum.",
  },
  {
    id: "TWK-05",
    subtes: "TWK",
    materi: "Integritas",
    tingkat: "HOTS",
    pertanyaan:
      "Seorang ASN menolak pemberian 'ucapan terima kasih' berupa uang dari masyarakat yang urusannya baru saja ia layani, meski pelayanan sudah selesai sesuai prosedur. Nilai yang paling menonjol dari tindakan ASN tersebut adalah…",
    opsi: [
      { id: "A", teks: "Nasionalisme" },
      { id: "B", teks: "Integritas" },
      { id: "C", teks: "Toleransi" },
      { id: "D", teks: "Gotong royong" },
      { id: "E", teks: "Patriotisme" },
    ],
    kunci: "B",
    pembahasan:
      "Menolak gratifikasi demi menjaga kejujuran dan kesesuaian antara nilai dan tindakan adalah cerminan integritas. Gratifikasi berpotensi menjadi konflik kepentingan meski diberikan setelah layanan selesai.",
  },
  {
    id: "TWK-06",
    subtes: "TWK",
    materi: "Sejarah Nasional",
    tingkat: "Sedang",
    pertanyaan:
      "Salah satu hasil Kongres Pemuda II tahun 1928 yang berpengaruh besar terhadap persatuan bangsa adalah…",
    opsi: [
      { id: "A", teks: "Pembentukan Budi Utomo" },
      { id: "B", teks: "Ikrar Sumpah Pemuda" },
      { id: "C", teks: "Proklamasi Kemerdekaan" },
      { id: "D", teks: "Pembentukan BPUPKI" },
      { id: "E", teks: "Dekrit Presiden" },
    ],
    kunci: "B",
    pembahasan:
      "Kongres Pemuda II (27–28 Oktober 1928) menghasilkan Sumpah Pemuda: satu tanah air, satu bangsa, dan satu bahasa — Indonesia. Pada kongres ini pula lagu Indonesia Raya pertama kali diperdengarkan.",
  },

  // ================= TIU =================
  {
    id: "TIU-01",
    subtes: "TIU",
    materi: "Verbal — Analogi",
    tingkat: "Mudah",
    pertanyaan: "HAUS : MINUM = LAPAR : …",
    opsi: [
      { id: "A", teks: "Perut" },
      { id: "B", teks: "Nasi" },
      { id: "C", teks: "Makan" },
      { id: "D", teks: "Kenyang" },
      { id: "E", teks: "Sakit" },
    ],
    kunci: "C",
    pembahasan:
      "Hubungan sebab–solusi: rasa HAUS diatasi dengan MINUM (kata kerja), maka rasa LAPAR diatasi dengan MAKAN. 'Nasi' adalah objek, bukan tindakan, sehingga kurang tepat.",
  },
  {
    id: "TIU-02",
    subtes: "TIU",
    materi: "Verbal — Silogisme",
    tingkat: "Sedang",
    pertanyaan:
      "Semua pegawai wajib mengikuti apel pagi. Sebagian pegawai adalah lulusan sarjana. Kesimpulan yang paling tepat adalah…",
    opsi: [
      { id: "A", teks: "Semua lulusan sarjana wajib apel pagi" },
      { id: "B", teks: "Sebagian lulusan sarjana wajib mengikuti apel pagi" },
      { id: "C", teks: "Semua peserta apel pagi adalah sarjana" },
      { id: "D", teks: "Tidak ada sarjana yang mengikuti apel pagi" },
      { id: "E", teks: "Sebagian pegawai tidak wajib apel pagi" },
    ],
    kunci: "B",
    pembahasan:
      "Karena SEMUA pegawai wajib apel dan SEBAGIAN pegawai adalah sarjana, maka sebagian sarjana (yang merupakan pegawai) pasti wajib apel. Pilihan A salah karena tidak semua sarjana tentu pegawai.",
  },
  {
    id: "TIU-03",
    subtes: "TIU",
    materi: "Numerik — Deret",
    tingkat: "Sedang",
    pertanyaan: "Lanjutkan deret berikut: 2, 3, 5, 8, 13, …",
    opsi: [
      { id: "A", teks: "18" },
      { id: "B", teks: "20" },
      { id: "C", teks: "21" },
      { id: "D", teks: "24" },
      { id: "E", teks: "26" },
    ],
    kunci: "C",
    pembahasan:
      "Pola Fibonacci: setiap suku adalah jumlah dua suku sebelumnya (2+3=5, 3+5=8, 5+8=13, 8+13=21).",
  },
  {
    id: "TIU-04",
    subtes: "TIU",
    materi: "Numerik — Aritmatika Sosial",
    tingkat: "HOTS",
    pertanyaan:
      "Sebuah tas seharga Rp150.000 mendapat diskon bertingkat 20% lalu 10% dari harga setelah diskon pertama. Berapa harga yang harus dibayar?",
    opsi: [
      { id: "A", teks: "Rp97.500" },
      { id: "B", teks: "Rp105.000" },
      { id: "C", teks: "Rp108.000" },
      { id: "D", teks: "Rp112.500" },
      { id: "E", teks: "Rp120.000" },
    ],
    kunci: "C",
    pembahasan:
      "Diskon bertingkat dihitung berurutan. 150.000 × 80% = 120.000, lalu 120.000 × 90% = 108.000. (Bukan dijumlah 30% menjadi 105.000.)",
  },
  {
    id: "TIU-05",
    subtes: "TIU",
    materi: "Numerik — Kecepatan",
    tingkat: "HOTS",
    pertanyaan:
      "Mobil A berangkat pukul 07.00 dengan kecepatan 60 km/jam. Mobil B menyusul dari titik yang sama pukul 08.00 dengan kecepatan 80 km/jam pada rute yang sama. Pukul berapa B menyusul A?",
    opsi: [
      { id: "A", teks: "10.00" },
      { id: "B", teks: "11.00" },
      { id: "C", teks: "11.30" },
      { id: "D", teks: "12.00" },
      { id: "E", teks: "13.00" },
    ],
    kunci: "B",
    pembahasan:
      "Saat B berangkat (08.00), A sudah 60 km di depan. Selisih kecepatan 80−60 = 20 km/jam. Waktu menyusul = 60 ÷ 20 = 3 jam sejak 08.00, yaitu pukul 11.00.",
  },
  {
    id: "TIU-06",
    subtes: "TIU",
    materi: "Verbal — Antonim",
    tingkat: "Mudah",
    pertanyaan: "Antonim (lawan kata) yang tepat dari kata 'ABSTRAK' adalah…",
    opsi: [
      { id: "A", teks: "Konkret" },
      { id: "B", teks: "Ideal" },
      { id: "C", teks: "Semu" },
      { id: "D", teks: "Maya" },
      { id: "E", teks: "Rumit" },
    ],
    kunci: "A",
    pembahasan:
      "Abstrak berarti tidak berwujud/mujarad. Lawannya adalah konkret, yaitu nyata dan berwujud. 'Semu' dan 'maya' justru bersinonim dengan abstrak.",
  },

  // ================= TKP =================
  {
    id: "TKP-01",
    subtes: "TKP",
    materi: "Profesionalisme",
    tingkat: "HOTS",
    pertanyaan:
      "Menjelang tenggat laporan penting, seorang rekan tiba-tiba melimpahkan sebagian tugasnya kepada Anda dengan alasan ada urusan keluarga. Beban kerja Anda sendiri sudah padat. Sikap Anda…",
    opsi: [
      { id: "A", teks: "Menerima semua tanpa berkata apa pun agar tidak terjadi konflik", poin: 2 },
      { id: "B", teks: "Menolak tegas karena itu bukan tanggung jawab saya", poin: 1 },
      { id: "C", teks: "Menilai kembali prioritas kedua tugas, lalu menyanggupi bagian yang realistis sambil menjelaskan keterbatasan waktu saya", poin: 5 },
      { id: "D", teks: "Menerima, tetapi mengerjakannya seadanya", poin: 3 },
      { id: "E", teks: "Menyuruh rekan lain yang lebih senggang untuk mengerjakannya", poin: 4 },
    ],
    pembahasan:
      "Jawaban terbaik menunjukkan profesionalisme sekaligus komunikasi yang jujur: memprioritaskan pekerjaan secara realistis dan membantu sebatas kemampuan tanpa mengorbankan tugas utama. (Poin tertinggi: C = 5.)",
  },
  {
    id: "TKP-02",
    subtes: "TKP",
    materi: "Orientasi pada Pelayanan",
    tingkat: "HOTS",
    pertanyaan:
      "Seorang warga datang dengan emosi tinggi karena merasa dokumennya lama tidak selesai, padahal keterlambatan berasal dari kelengkapan berkas yang kurang. Tindakan Anda…",
    opsi: [
      { id: "A", teks: "Menjelaskan dengan tenang penyebabnya dan langsung memandu langkah melengkapi berkas", poin: 5 },
      { id: "B", teks: "Membiarkannya tenang dulu, baru dilayani belakangan", poin: 2 },
      { id: "C", teks: "Menegur balik karena ia tidak melengkapi berkas", poin: 1 },
      { id: "D", teks: "Meminta ia bersabar dan menunggu antrean seperti biasa", poin: 3 },
      { id: "E", teks: "Memanggil atasan untuk menanganinya", poin: 4 },
    ],
    pembahasan:
      "Orientasi pelayanan terbaik: tetap tenang, empatik, dan solutif — menjelaskan akar masalah sambil membantu jalan keluar. Melempar ke atasan (E) bukan solusi utama meski lebih baik daripada menyalahkan.",
  },
  {
    id: "TKP-03",
    subtes: "TKP",
    materi: "Kemampuan Beradaptasi",
    tingkat: "Sedang",
    pertanyaan:
      "Kantor Anda mengganti sistem kerja manual menjadi aplikasi digital yang sama sekali baru. Banyak rekan mengeluh. Sikap Anda…",
    opsi: [
      { id: "A", teks: "Segera mempelajari aplikasi baru dan menawarkan diri membantu rekan yang kesulitan", poin: 5 },
      { id: "B", teks: "Mempelajarinya sendiri sebatas kebutuhan tugas saya", poin: 4 },
      { id: "C", teks: "Menunggu pelatihan resmi sebelum mencobanya", poin: 3 },
      { id: "D", teks: "Ikut mengeluh karena sistem lama lebih mudah", poin: 2 },
      { id: "E", teks: "Tetap memakai cara manual selama masih bisa", poin: 1 },
    ],
    pembahasan:
      "Kemampuan beradaptasi tertinggi ditunjukkan dengan proaktif belajar hal baru sekaligus menjadi agen perubahan yang membantu tim beradaptasi.",
  },
  {
    id: "TKP-04",
    subtes: "TKP",
    materi: "Integritas Diri",
    tingkat: "HOTS",
    pertanyaan:
      "Anda mengetahui rekan dekat memanipulasi data kehadiran agar terlihat selalu tepat waktu. Ia meminta Anda merahasiakannya. Sikap Anda…",
    opsi: [
      { id: "A", teks: "Merahasiakannya demi menjaga pertemanan", poin: 1 },
      { id: "B", teks: "Mengingatkannya secara pribadi dan mendorong ia memperbaiki serta melaporkan sendiri", poin: 5 },
      { id: "C", teks: "Pura-pura tidak tahu", poin: 2 },
      { id: "D", teks: "Langsung menyebarkannya ke rekan-rekan lain", poin: 3 },
      { id: "E", teks: "Melaporkan ke atasan tanpa berbicara dulu dengannya", poin: 4 },
    ],
    pembahasan:
      "Integritas menuntut kejujuran, tetapi cara terbaik adalah menegur secara pribadi lebih dulu dan mendorong perbaikan sukarela. Menyebarkan ke rekan lain (D) tidak menyelesaikan masalah dan merusak nama baik.",
  },
  {
    id: "TKP-05",
    subtes: "TKP",
    materi: "Bekerja dalam Tim",
    tingkat: "Sedang",
    pertanyaan:
      "Dalam sebuah proyek tim, pendapat Anda berbeda tajam dengan mayoritas anggota. Anda yakin pendekatan Anda lebih efisien. Sikap Anda…",
    opsi: [
      { id: "A", teks: "Menyampaikan argumen dengan data, lalu menghormati keputusan bersama jika mayoritas tetap memilih pendekatan lain", poin: 5 },
      { id: "B", teks: "Mengikuti mayoritas tanpa menyampaikan pendapat", poin: 3 },
      { id: "C", teks: "Bersikeras memakai cara saya karena paling efisien", poin: 2 },
      { id: "D", teks: "Diam dan mengerjakan bagian saya sendiri secara terpisah", poin: 1 },
      { id: "E", teks: "Menyampaikan pendapat sekali, jika ditolak langsung menyerah", poin: 4 },
    ],
    pembahasan:
      "Kerja tim yang sehat: menyampaikan gagasan secara argumentatif berbasis data, namun tetap kooperatif menghormati keputusan kolektif. Efisiensi tidak boleh mengorbankan kekompakan tim.",
  },
  {
    id: "TKP-06",
    subtes: "TKP",
    materi: "Semangat Berprestasi",
    tingkat: "Sedang",
    pertanyaan:
      "Anda menyelesaikan seluruh target pekerjaan hari ini lebih cepat dari perkiraan. Waktu kerja masih tersisa cukup banyak. Sikap Anda…",
    opsi: [
      { id: "A", teks: "Mengambil pekerjaan berikutnya atau membantu unit lain yang membutuhkan", poin: 5 },
      { id: "B", teks: "Mengevaluasi hasil kerja tadi agar lebih baik, lalu menyiapkan tugas esok", poin: 4 },
      { id: "C", teks: "Beristirahat karena target sudah tercapai", poin: 2 },
      { id: "D", teks: "Menggunakan sisa waktu untuk urusan pribadi", poin: 1 },
      { id: "E", teks: "Menunggu instruksi atasan tanpa inisiatif", poin: 3 },
    ],
    pembahasan:
      "Semangat berprestasi tinggi ditandai inisiatif memanfaatkan waktu secara produktif — mengambil tugas baru atau membantu tim. Evaluasi diri (B) juga baik namun sedikit di bawah kontribusi langsung.",
  },
];

// Paket simulasi penuh: 110 soal (TWK 30 · TIU 35 · TKP 45, sesuai CAT BKN).
// Sementara dibentuk dengan mengulang contoh per subtes (id unik) sampai bank
// soal asli tersedia lewat database.
const PAKET_COUNTS: Record<Subtes, number> = { TWK: 30, TIU: 35, TKP: 45 };

// Label materi per rentang nomor soal (1–110), sesuai kisi-kisi.
const MATERI_RANGES: { label: string; from: number; to: number }[] = [
  { label: "Nasionalisme", from: 1, to: 6 },
  { label: "Integritas", from: 7, to: 12 },
  { label: "Bela Negara", from: 13, to: 18 },
  { label: "Pilar Negara", from: 19, to: 24 },
  { label: "Bahasa Indonesia", from: 25, to: 30 },
  { label: "Verbal", from: 31, to: 43 },
  { label: "Numerik", from: 44, to: 56 },
  { label: "Figural", from: 57, to: 65 },
  { label: "Hospitality", from: 66, to: 72 },
  { label: "Jejaring Kerja", from: 73, to: 79 },
  { label: "Sosial Kultural", from: 80, to: 86 },
  { label: "Teknologi Informasi", from: 87, to: 95 },
  { label: "Profesionalisme", from: 96, to: 102 },
  { label: "Anti Radikalisme", from: 103, to: 110 },
];

function materiForNomor(n: number): string {
  return MATERI_RANGES.find((r) => n >= r.from && n <= r.to)?.label ?? "";
}

function buildPaket(): Soal[] {
  const order: Subtes[] = ["TWK", "TIU", "TKP"];
  const paket: Soal[] = [];
  for (const sub of order) {
    const pool = BANK_SOAL.filter((s) => s.subtes === sub);
    for (let i = 0; i < PAKET_COUNTS[sub]; i++) {
      const base = pool[i % pool.length];
      const nomor = paket.length + 1;
      paket.push({
        ...base,
        id: `${sub}-${String(i + 1).padStart(3, "0")}`,
        materi: materiForNomor(nomor),
      });
    }
  }
  return paket;
}

export const SOAL_TRYOUT = buildPaket();
