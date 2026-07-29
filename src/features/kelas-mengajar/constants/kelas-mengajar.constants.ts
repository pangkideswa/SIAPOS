import type { KelasMengajarFormData } from "../types/kelas-mengajar"

export const GURU_OPTIONS = [
  "Asep Nugraha",
  "Rina Wulandari",
  "Budi Santoso",
  "Siti Rahayu",
  "Andi Wijaya",
  "Dewi Sartika",
] as const

export const MATA_PELAJARAN_OPTIONS = [
  "Informatika",
  "Dasar Jaringan",
  "Administrasi Sistem Jaringan",
  "Pemrograman Web",
  "Basis Data",
  "Sistem Operasi",
  "Komputer dan Jaringan Dasar",
] as const

export const KELAS_OPTIONS = [
  "X TKJ 1",
  "X TKJ 2",
  "XI TKJ 1",
  "XI TKJ 2",
  "X TBSM 1",
  "X TBSM 2",
  "XI TBSM 1",
  "XI TBSM 2",
  "XII TKJ 1",
  "XII TKJ 2",
] as const

export const TAHUN_AJARAN_OPTIONS = [
  "2024/2025",
  "2025/2026",
  "2026/2027",
] as const

export const SEMESTER_OPTIONS = ["Ganjil", "Genap"] as const

export const STATUS_OPTIONS = ["Aktif", "Tidak Aktif"] as const

export const SEMESTER_COLORS: Record<string, string> = {
  Ganjil: "bg-blue-100 text-blue-800",
  Genap: "bg-purple-100 text-purple-800",
}

export const STATUS_COLORS: Record<string, string> = {
  Aktif: "bg-green-100 text-green-800",
  "Tidak Aktif": "bg-red-100 text-red-800",
}

export const EMPTY_KELAS_MENGAJAR_FORM: KelasMengajarFormData = {
  guru_nama: "",
  mata_pelajaran: "",
  kelas: "",
  tahun_ajaran: "2026/2027",
  semester: "Ganjil",
  status: "Aktif",
}
