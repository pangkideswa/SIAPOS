import type { NilaiAkademikFormData, StatusNilai } from "../types/nilai-akademik"

export const TAHUN_AJARAN_OPTIONS = [
  "2024/2025",
  "2025/2026",
  "2026/2027",
] as const

export const SEMESTER_OPTIONS = ["Ganjil", "Genap"] as const

export const MATA_PELAJARAN_OPTIONS = [
  "Informatika",
  "Dasar Jaringan",
  "Administrasi Sistem Jaringan",
  "Pemrograman Web",
  "Basis Data",
  "Sistem Operasi",
  "Komputer dan Jaringan Dasar",
  "Matematika",
  "Bahasa Inggris",
  "Pendidikan Agama",
] as const

export const GURU_OPTIONS = [
  "Asep Nugraha",
  "Rina Wulandari",
  "Budi Santoso",
  "Siti Rahayu",
  "Andi Wijaya",
  "Dewi Sartika",
] as const

export const KELAS_OPTIONS = [
  "X TKJ 1",
  "X TKJ 2",
  "X TBSM 1",
  "X TBSM 2",
  "XI TKJ 1",
  "XI TKJ 2",
  "XI TBSM 1",
  "XI TBSM 2",
  "XII TKJ 1",
  "XII TKJ 2",
] as const

export const STATUS_NILAI_COLORS: Record<StatusNilai, string> = {
  Lengkap: "bg-green-100 text-green-800",
  "Belum Lengkap": "bg-yellow-100 text-yellow-800",
}

export const EMPTY_NILAI_FORM: NilaiAkademikFormData = {
  tugas: "",
  praktik: "",
  uts: "",
  uas: "",
}
