import type { BankSoalFormData } from "../types/bank-soal"

export const TIPE_SOAL_OPTIONS = ["Pilihan Ganda", "Benar / Salah", "Isian Singkat", "Essay"] as const
export const KESULITAN_OPTIONS = ["Mudah", "Sedang", "Sulit"] as const
export const STATUS_BANK_SOAL_OPTIONS = ["Draft", "Aktif", "Arsip"] as const

export const TIPE_SOAL_COLORS: Record<string, string> = {
  "Pilihan Ganda": "bg-blue-100 text-blue-800",
  "Benar / Salah": "bg-purple-100 text-purple-800",
  "Isian Singkat": "bg-orange-100 text-orange-800",
  Essay: "bg-teal-100 text-teal-800",
}

export const KESULITAN_COLORS: Record<string, string> = {
  Mudah: "bg-green-100 text-green-800",
  Sedang: "bg-yellow-100 text-yellow-800",
  Sulit: "bg-red-100 text-red-800",
}

export const STATUS_BANK_SOAL_COLORS: Record<string, string> = {
  Draft: "bg-yellow-100 text-yellow-800",
  Aktif: "bg-green-100 text-green-800",
  Arsip: "bg-muted text-foreground",
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

export const KELAS_OPTIONS = [
  "X RPL 1",
  "X RPL 2",
  "XI RPL 1",
  "XI RPL 2",
  "XII RPL 1",
  "XII RPL 2",
] as const

export const GURU_BANK_SOAL_OPTIONS = [
  "Pak Ahmad Hidayat",
  "Bu Siti Nurhaliza",
  "Pak Budi Santoso",
  "Bu Dewi Lestari",
  "Pak Eko Prasetyo",
] as const

export function generateKodeSoal(tipe: string, mapel: string): string {
  const tipeCode = tipe === "Pilihan Ganda" ? "PG" : tipe === "Benar / Salah" ? "BS" : tipe === "Isian Singkat" ? "IS" : "ES"
  const mapelCode = mapel.slice(0, 3).toUpperCase()
  const num = String(Math.floor(Math.random() * 900) + 100)
  return `${tipeCode}-${mapelCode}-${num}`
}

export const EMPTY_BANK_SOAL_FORM: BankSoalFormData = {
  kode_soal: "",
  pertanyaan: "",
  gambar_url: null,
  tipe_soal: "Pilihan Ganda",
  pilihan: { A: "", B: "", C: "", D: "", E: "" },
  jawaban_benar: "A",
  mata_pelajaran: "",
  guru_nama: "",
  kelas: "",
  kesulitan: "Sedang",
  status: "Draft",
}
