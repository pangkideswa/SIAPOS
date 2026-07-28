import type { JenisUjian, StatusHasil } from "../types/hasil-ujian"

export const JENIS_UJIAN_OPTIONS: readonly JenisUjian[] = [
  "Quiz",
  "CBT",
  "Ulangan Harian",
  "PTS",
  "PAS",
  "Try Out",
]

export const STATUS_HASIL_OPTIONS: readonly StatusHasil[] = [
  "Lulus",
  "Tidak Lulus",
  "Menunggu Penilaian",
]

export const STATUS_HASIL_COLORS: Record<string, string> = {
  Lulus: "bg-green-100 text-green-800",
  "Tidak Lulus": "bg-red-100 text-red-800",
  "Menunggu Penilaian": "bg-yellow-100 text-yellow-800",
}

export const JENIS_UJIAN_COLORS: Record<string, string> = {
  Quiz: "bg-blue-100 text-blue-800",
  CBT: "bg-purple-100 text-purple-800",
  "Ulangan Harian": "bg-orange-100 text-orange-800",
  PTS: "bg-teal-100 text-teal-800",
  PAS: "bg-rose-100 text-rose-800",
  "Try Out": "bg-indigo-100 text-indigo-800",
}

export const MATA_PELAJARAN_OPTIONS = [
  "Dasar Jaringan",
  "Administrasi Sistem Jaringan",
  "Pemrograman Web",
  "Basis Data",
  "Sistem Operasi",
] as const

export const KELAS_HASIL_OPTIONS = [
  "X TKJ 2",
  "XI TKJ 1",
  "XI TBSM 1",
  "XII TKJ 1",
] as const
