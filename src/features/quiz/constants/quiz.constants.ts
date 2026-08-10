import type { QuizFormData } from "../types/quiz"

export const STATUS_QUIZ_OPTIONS = ["Draft", "Publish", "Ditutup"] as const

export const STATUS_QUIZ_COLORS: Record<string, string> = {
  Draft: "bg-yellow-100 text-yellow-800",
  Publish: "bg-green-100 text-green-800",
  Ditutup: "bg-red-100 text-red-800",
}

export const MATA_PELAJARAN_OPTIONS = [
  "Matematika",
  "Bahasa Indonesia",
  "Bahasa Inggris",
  "Fisika",
  "Kimia",
  "Biologi",
  "Ekonomi",
  "Sosiologi",
  "Sejarah",
  "Geografi",
] as const

export const GURU_QUIZ_OPTIONS = [
  "Pak Ahmad Hidayat",
  "Bu Siti Nurhaliza",
  "Pak Budi Santoso",
  "Bu Dewi Lestari",
  "Pak Eko Prasetyo",
] as const

export const KELAS_OPTIONS = [
  "X RPL 1",
  "X RPL 2",
  "XI RPL 1",
  "XI RPL 2",
  "XII RPL 1",
  "XII RPL 2",
] as const

export const STATUS_PARTISIPAN_COLORS: Record<string, string> = {
  "Belum Mengerjakan": "bg-muted text-foreground",
  "Sedang Mengerjakan": "bg-blue-100 text-blue-800",
  Selesai: "bg-green-100 text-green-800",
}

export const EMPTY_QUIZ_FORM: QuizFormData = {
  judul: "",
  deskripsi: "",
  paket_soal_id: 0,
  kelas: "",
  tanggal_mulai: "",
  tanggal_berakhir: "",
  durasi: 60,
  percobaan_maksimal: 1,
  acak_urutan_soal: false,
  acak_urutan_jawaban: false,
  tampilkan_nilai: true,
  status: "Draft",
}
