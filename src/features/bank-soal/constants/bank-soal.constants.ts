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
  Mudah: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300",
  MUDAH: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300",
  Sedang: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300",
  SEDANG: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300",
  Sulit: "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300",
  SULIT: "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300",
}

export const STATUS_BANK_SOAL_COLORS: Record<string, string> = {
  Draft: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300",
  DRAFT: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300",
  Aktif: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300",
  AKTIF: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300",
  Publish: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300",
  PUBLISH: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300",
  Arsip: "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200",
  ARSIP: "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200",
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
  guru_id: null,
  kesulitan: "Sedang",
  status: "Draft",
}
