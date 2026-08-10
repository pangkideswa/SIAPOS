import type { KelasMengajarFormData } from "../types/kelas-mengajar"

// GURU_OPTIONS, MATA_PELAJARAN_OPTIONS, KELAS_OPTIONS sengaja tidak hardcoded.
// Data guru, mata pelajaran, dan kelas harus diambil dari API/database.

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
  teacher_id: null,
  subject_id: null,
  classroom_id: null,
  guru_nama: "",
  mata_pelajaran: "",
  kelas: "",
  tahun_ajaran: "2026/2027",
  semester: "Ganjil",
  status: "Aktif",
}
