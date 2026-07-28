import type { PaketSoalFormData } from "../types/paket-soal"

export const STATUS_PAKET_SOAL_OPTIONS = ["Draft", "Aktif", "Arsip"] as const

export const STATUS_PAKET_SOAL_COLORS: Record<string, string> = {
  Draft: "bg-yellow-100 text-yellow-800",
  Aktif: "bg-green-100 text-green-800",
  Arsip: "bg-gray-100 text-gray-800",
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

export const GURU_PAKET_SOAL_OPTIONS = [
  "Pak Ahmad Hidayat",
  "Bu Siti Nurhaliza",
  "Pak Budi Santoso",
  "Bu Dewi Lestari",
  "Pak Eko Prasetyo",
] as const

export const EMPTY_PAKET_SOAL_FORM: PaketSoalFormData = {
  nama_paket: "",
  deskripsi: "",
  mata_pelajaran: "",
  guru_nama: "",
  durasi: 60,
  nilai_maksimal: 100,
  soal_ids: [],
  status: "Draft",
}
