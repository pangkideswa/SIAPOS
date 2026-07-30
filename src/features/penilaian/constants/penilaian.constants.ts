import type { PenilaianFormData } from "../types/penilaian"

export const STATUS_PENILAIAN_OPTIONS = [
  "Belum Dinilai",
  "Sudah Dinilai",
  "Revisi",
] as const

export const STATUS_PENILAIAN_COLORS: Record<string, string> = {
  "Belum Dinilai": "bg-yellow-100 text-yellow-800",
  "Sudah Dinilai": "bg-green-100 text-green-800",
  Revisi: "bg-red-100 text-red-800",
}

export const EMPTY_PENILAIAN_FORM: PenilaianFormData = {
  nilai: null,
  feedback_guru: "",
  status_penilaian: "Belum Dinilai",
}
