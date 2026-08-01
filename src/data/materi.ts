import type { Subtes } from "@/lib/skd";

export interface Modul {
  id: string;
  judul: string;
  ringkasan: string;
  poin: string[];
  durasiMenit: number;
  level: "Dasar" | "Menengah" | "Lanjut";
}

export interface MateriSubtes {
  subtes: Subtes;
  intro: string;
  modul: Modul[];
}

export const MATERI: MateriSubtes[] = [
  {
    subtes: "TWK",
    intro:
      "Bangun fondasi wawasan kebangsaan: dari empat pilar negara hingga penerapan nilai integritas dalam kasus nyata.",
    modul: [
      {
        id: "twk-pancasila",
        judul: "Pancasila & Penerapannya",
        ringkasan:
          "Makna tiap sila dan cara mengenali pengamalannya dalam soal studi kasus.",
        poin: [
          "Butir-butir pengamalan sila 1–5",
          "Membedakan sila ke-4 (musyawarah) vs sila ke-5 (keadilan sosial)",
          "Pola jebakan soal HOTS Pancasila",
        ],
        durasiMenit: 25,
        level: "Dasar",
      },
      {
        id: "twk-uud",
        judul: "UUD 1945 & Amandemen",
        ringkasan:
          "Sistematika UUD, hasil empat amandemen, dan pasal-pasal yang paling sering diujikan.",
        poin: [
          "Pembukaan & alinea keempat",
          "Pasal 27, 28, 30, 31, 33 yang sering keluar",
          "Lembaga negara pasca-amandemen",
        ],
        durasiMenit: 30,
        level: "Menengah",
      },
      {
        id: "twk-bela-negara",
        judul: "Bela Negara & NKRI",
        ringkasan:
          "Konsep bela negara, dasar hukum, dan wujud sikapnya bagi ASN.",
        poin: ["Dasar hukum bela negara", "Ancaman militer & non-militer", "Wawasan Nusantara"],
        durasiMenit: 20,
        level: "Menengah",
      },
      {
        id: "twk-integritas",
        judul: "Integritas & Anti-Korupsi",
        ringkasan:
          "Mengenali gratifikasi, konflik kepentingan, dan nilai integritas dalam kasus pelayanan.",
        poin: ["9 nilai anti-korupsi", "Gratifikasi vs suap", "Studi kasus ASN"],
        durasiMenit: 22,
        level: "Lanjut",
      },
    ],
  },
  {
    subtes: "TIU",
    intro:
      "Latih kecepatan dan ketepatan berpikir: verbal, numerik, dan figural dengan teknik pengerjaan cepat.",
    modul: [
      {
        id: "tiu-verbal",
        judul: "Kemampuan Verbal",
        ringkasan: "Analogi, sinonim–antonim, dan silogisme dengan pola hubungan kata.",
        poin: ["Peta hubungan analogi", "Kaidah silogisme", "Jebakan sinonim–antonim"],
        durasiMenit: 28,
        level: "Dasar",
      },
      {
        id: "tiu-numerik",
        judul: "Kemampuan Numerik",
        ringkasan: "Deret angka, aritmatika sosial, dan soal cerita perbandingan.",
        poin: ["Pola deret (aritmatika, geometri, Fibonacci)", "Diskon bertingkat & persentase", "Kecepatan, jarak, waktu"],
        durasiMenit: 35,
        level: "Menengah",
      },
      {
        id: "tiu-figural",
        judul: "Kemampuan Figural",
        ringkasan: "Analogi gambar, ketidaksamaan, dan serial figural.",
        poin: ["Rotasi & pencerminan", "Pola penambahan elemen", "Manajemen waktu figural"],
        durasiMenit: 24,
        level: "Lanjut",
      },
    ],
  },
  {
    subtes: "TKP",
    intro:
      "Kuasai pola berpikir 'poin tertinggi': proaktif, jujur, kolaboratif, dan berorientasi pelayanan.",
    modul: [
      {
        id: "tkp-pelayanan",
        judul: "Pelayanan Publik",
        ringkasan: "Prinsip empati, solutif, dan tetap tenang menghadapi masyarakat.",
        poin: ["Skala poin 1–5", "Kata kunci jawaban ideal", "Menghindari opsi menyalahkan"],
        durasiMenit: 18,
        level: "Dasar",
      },
      {
        id: "tkp-jejaring",
        judul: "Jejaring Kerja & Tim",
        ringkasan: "Kolaborasi, menghargai perbedaan pendapat, dan menghormati keputusan bersama.",
        poin: ["Argumentasi berbasis data", "Kooperatif vs egois", "Peran dalam tim"],
        durasiMenit: 16,
        level: "Menengah",
      },
      {
        id: "tkp-profesionalisme",
        judul: "Profesionalisme & Adaptasi",
        ringkasan: "Inisiatif, semangat berprestasi, dan menerima perubahan/teknologi baru.",
        poin: ["Skala prioritas kerja", "Menjadi agen perubahan", "Manajemen beban kerja"],
        durasiMenit: 20,
        level: "Lanjut",
      },
    ],
  },
];
