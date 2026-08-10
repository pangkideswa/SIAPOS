import type { PengumpulanTugasFormData } from "../types/pengumpulan"

export const STATUS_PENGUMPULAN_OPTIONS = [
  "Belum Mengumpulkan",
  "Sudah Mengumpulkan",
  "Terlambat",
] as const

export const STATUS_PENGUMPULAN_COLORS: Record<string, string> = {
  "Belum Mengumpulkan": "bg-muted text-foreground",
  "Sudah Mengumpulkan": "bg-green-100 text-green-800",
  Terlambat: "bg-red-100 text-red-800",
}

export const ALLOWED_PENGUMPULAN_EXTENSIONS = ".pdf,.doc,.docx,.ppt,.pptx,.zip"

export const MAX_PENGUMPULAN_FILE_SIZE_MB = 20

export const EMPTY_PENGUMPULAN_FORM: PengumpulanTugasFormData = {
  file_jawaban: null,
  catatan: "",
}
