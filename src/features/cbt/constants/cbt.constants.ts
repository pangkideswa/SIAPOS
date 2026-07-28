import type { CBTExamFormData } from "../types/cbt"

export const STATUS_CBT_OPTIONS = ["Draft", "Publish", "Selesai"] as const

export const STATUS_CBT_COLORS: Record<string, string> = {
  Draft: "bg-yellow-100 text-yellow-800",
  Publish: "bg-green-100 text-green-800",
  Selesai: "bg-gray-100 text-gray-800",
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

export const GURU_CBT_OPTIONS = [
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

export const STATUS_PARTISIPAN_CBT_COLORS: Record<string, string> = {
  "Belum Mengerjakan": "bg-gray-100 text-gray-800",
  "Sedang Mengerjakan": "bg-blue-100 text-blue-800",
  Selesai: "bg-green-100 text-green-800",
}

export const EMPTY_CBT_FORM: CBTExamFormData = {
  nama_ujian: "",
  deskripsi: "",
  paket_soal_id: 0,
  kelas: "",
  durasi: 60,
  tanggal_mulai: "",
  tanggal_berakhir: "",
  nilai_minimum_lulus: 70,
  acak_soal: false,
  acak_jawaban: false,
  tampilkan_nilai: true,
  izinkan_kembali: false,
  auto_submit: true,
  status: "Draft",
}
