import type {
  AnalyticsSummary,
  AnalyticsBySubject,
  AnalyticsByExamType,
  AnalyticsByClass,
  AnalyticsTimeline,
  TopPerformer,
  StudentNeedingAttention,
  AnalyticsInsight,
} from "../types/analitik"

export const DUMMY_ANALYTICS_SUMMARY: AnalyticsSummary = {
  total_ujian: 16,
  total_peserta: 12,
  rata_rata_nilai: 75.3,
  persentase_lulus: 68.75,
  nilai_tertinggi: 100,
  nilai_terendah: 33,
  total_lulus: 11,
  total_tidak_lulus: 4,
  total_menunggu: 1,
}

export const DUMMY_ANALYTICS_BY_SUBJECT: AnalyticsBySubject[] = [
  {
    mata_pelajaran: "Dasar Jaringan",
    jumlah_ujian: 5,
    rata_rata_nilai: 78.6,
    persentase_lulus: 80.0,
    jumlah_peserta: 5,
  },
  {
    mata_pelajaran: "Administrasi Sistem Jaringan",
    jumlah_ujian: 3,
    rata_rata_nilai: 68.3,
    persentase_lulus: 66.7,
    jumlah_peserta: 3,
  },
  {
    mata_pelajaran: "Pemrograman Web",
    jumlah_ujian: 2,
    rata_rata_nilai: 76.5,
    persentase_lulus: 100.0,
    jumlah_peserta: 2,
  },
  {
    mata_pelajaran: "Basis Data",
    jumlah_ujian: 3,
    rata_rata_nilai: 75.0,
    persentase_lulus: 50.0,
    jumlah_peserta: 2,
  },
  {
    mata_pelajaran: "Sistem Operasi",
    jumlah_ujian: 3,
    rata_rata_nilai: 63.3,
    persentase_lulus: 66.7,
    jumlah_peserta: 2,
  },
]

export const DUMMY_ANALYTICS_BY_EXAM_TYPE: AnalyticsByExamType[] = [
  {
    jenis_ujian: "Quiz",
    jumlah_ujian: 5,
    rata_rata_nilai: 75.0,
    persentase_lulus: 80.0,
    jumlah_peserta: 5,
  },
  {
    jenis_ujian: "CBT",
    jumlah_ujian: 3,
    rata_rata_nilai: 71.7,
    persentase_lulus: 66.7,
    jumlah_peserta: 3,
  },
  {
    jenis_ujian: "Ulangan Harian",
    jumlah_ujian: 3,
    rata_rata_nilai: 75.0,
    persentase_lulus: 66.7,
    jumlah_peserta: 2,
  },
  {
    jenis_ujian: "PTS",
    jumlah_ujian: 2,
    rata_rata_nilai: 65.0,
    persentase_lulus: 100.0,
    jumlah_peserta: 2,
  },
  {
    jenis_ujian: "PAS",
    jumlah_ujian: 2,
    rata_rata_nilai: 70.0,
    persentase_lulus: 50.0,
    jumlah_peserta: 2,
  },
  {
    jenis_ujian: "Try Out",
    jumlah_ujian: 1,
    rata_rata_nilai: 90.0,
    persentase_lulus: 100.0,
    jumlah_peserta: 1,
  },
]

export const DUMMY_ANALYTICS_BY_CLASS: AnalyticsByClass[] = [
  {
    kelas: "XI TKJ 1",
    jumlah_peserta: 3,
    rata_rata_nilai: 68.3,
    persentase_lulus: 60.0,
    jumlah_ujian: 6,
  },
  {
    kelas: "XI TBSM 1",
    jumlah_peserta: 2,
    rata_rata_nilai: 82.5,
    persentase_lulus: 100.0,
    jumlah_ujian: 4,
  },
  {
    kelas: "XII TKJ 1",
    jumlah_peserta: 1,
    rata_rata_nilai: 83.5,
    persentase_lulus: 100.0,
    jumlah_ujian: 2,
  },
  {
    kelas: "X TKJ 2",
    jumlah_peserta: 1,
    rata_rata_nilai: 66.5,
    persentase_lulus: 50.0,
    jumlah_ujian: 2,
  },
]

export const DUMMY_ANALYTICS_TIMELINE: AnalyticsTimeline[] = [
  {
    tanggal: "2026-07-20",
    rata_rata_nilai: 70.0,
    jumlah_ujian: 5,
    persentase_lulus: 80.0,
  },
  {
    tanggal: "2026-07-21",
    rata_rata_nilai: 75.0,
    jumlah_ujian: 2,
    persentase_lulus: 50.0,
  },
  {
    tanggal: "2026-07-22",
    rata_rata_nilai: 71.0,
    jumlah_ujian: 3,
    persentase_lulus: 66.7,
  },
  {
    tanggal: "2026-07-23",
    rata_rata_nilai: 70.0,
    jumlah_ujian: 2,
    persentase_lulus: 50.0,
  },
  {
    tanggal: "2026-07-24",
    rata_rata_nilai: 65.0,
    jumlah_ujian: 2,
    persentase_lulus: 100.0,
  },
  {
    tanggal: "2026-07-25",
    rata_rata_nilai: 90.0,
    jumlah_ujian: 1,
    persentase_lulus: 100.0,
  },
  {
    tanggal: "2026-07-26",
    rata_rata_nilai: 0,
    jumlah_ujian: 1,
    persentase_lulus: 0,
  },
]

export const DUMMY_TOP_PERFORMERS: TopPerformer[] = [
  {
    siswa_nama: "Fajar Nugroho",
    siswa_kelas: "XII TKJ 1",
    rata_rata_nilai: 83.5,
    jumlah_ujian: 2,
    jumlah_lulus: 2,
  },
  {
    siswa_nama: "Putri Wulandari",
    siswa_kelas: "XI TBSM 1",
    rata_rata_nilai: 86.5,
    jumlah_ujian: 2,
    jumlah_lulus: 2,
  },
  {
    siswa_nama: "Rizki Pratama",
    siswa_kelas: "XI TKJ 1",
    rata_rata_nilai: 76.8,
    jumlah_ujian: 5,
    jumlah_lulus: 4,
  },
  {
    siswa_nama: "Dewi Lestari",
    siswa_kelas: "XI TBSM 1",
    rata_rata_nilai: 77.5,
    jumlah_ujian: 4,
    jumlah_lulus: 4,
  },
  {
    siswa_nama: "Budi Santoso",
    siswa_kelas: "X TKJ 2",
    rata_rata_nilai: 66.5,
    jumlah_ujian: 2,
    jumlah_lulus: 1,
  },
]

export const DUMMY_STUDENTS_NEEDING_ATTENTION: StudentNeedingAttention[] = [
  {
    siswa_nama: "Ahmad Rizky",
    siswa_kelas: "XI TKJ 1",
    rata_rata_nilai: 41.5,
    jumlah_tidak_lulus: 2,
    jumlah_ujian: 2,
    mata_pelajaran_terlemah: "Sistem Operasi",
  },
  {
    siswa_nama: "Fajar Nugroho",
    siswa_kelas: "XII TKJ 1",
    rata_rata_nilai: 67.0,
    jumlah_tidak_lulus: 1,
    jumlah_ujian: 2,
    mata_pelajaran_terlemah: "Dasar Jaringan",
  },
  {
    siswa_nama: "Budi Santoso",
    siswa_kelas: "X TKJ 2",
    rata_rata_nilai: 60.0,
    jumlah_tidak_lulus: 1,
    jumlah_ujian: 2,
    mata_pelajaran_terlemah: "Basis Data",
  },
  {
    siswa_nama: "Rizki Pratama",
    siswa_kelas: "XI TKJ 1",
    rata_rata_nilai: 60.0,
    jumlah_tidak_lulus: 1,
    jumlah_ujian: 5,
    mata_pelajaran_terlemah: "Pemrograman Web",
  },
]

export const DUMMY_ANALYTICS_INSIGHTS: AnalyticsInsight[] = [
  {
    id: 1,
    tipe: "peringatan",
    judul: "Ahmad Rizky Membutuhkan Perhatian Khusus",
    deskripsi:
      "Nilai rata-rata 41.5 dengan 2 kali tidak lulus dari 2 ujian. Materi Sistem Operasi dan Administrasi Jaringan perlu dibimbing secara intensif.",
  },
  {
    id: 2,
    tipe: "peringatan",
    judul: "Mata Pelajaran Basis Data Perlu Perhatian",
    deskripsi:
      "Hanya 50% peserta lulus untuk mata pelajaran Basis Data. Pertimbangkan untuk melakukan review materi dan remedial.",
  },
  {
    id: 3,
    tipe: "informasi",
    judul: "Putri Wulandari & Fajar Nugroho Berprestasi",
    deskripsi:
      "Kedua siswa ini memiliki rata-rata nilai di atas 83 dengan tingkat kelulusan 100%. Pertimbangkan untuk memberikan penghargaan atau tantangan lebih.",
  },
  {
    id: 4,
    tipe: "rekomendasi",
    judul: "Tingkatkan Variasi Soal untuk PTS",
    deskripsi:
      "Rata-rata nilai PTS lebih rendah (65) dibandingkan Quiz (75). Pertimbangkan untuk menyesuaikan tingkat kesulitan soal PTS.",
  },
  {
    id: 5,
    tipe: "rekomendasi",
    judul: "Manfaatkan Hasil Try Out untuk Remidi",
    deskripsi:
      "Try Out menunjukkan hasil terbaik (rata-rata 90). Gunakan pendekatan serupa untuk ujian reguler guna meningkatkan pemahaman siswa.",
  },
]
