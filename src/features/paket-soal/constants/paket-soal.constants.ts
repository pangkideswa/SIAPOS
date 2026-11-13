import type { PaketSoalFormData } from "../types/paket-soal"

export const STATUS_PAKET_SOAL_OPTIONS = ["Draft", "Aktif", "Arsip"] as const

export const STATUS_PAKET_SOAL_COLORS: Record<string, string> = {
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
  guru_id: null,
  durasi: 90,
  nilai_maksimal: 100,
  soal_ids: [],
  status: "Draft",
}
