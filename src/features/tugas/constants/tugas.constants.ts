import type { TugasFormData } from "../types/tugas"

export const STATUS_TUGAS_OPTIONS = ["Draft", "Dipublikasikan", "Ditutup"] as const

export const STATUS_TUGAS_COLORS: Record<string, string> = {
  Draft: "bg-yellow-100 text-yellow-800",
  Dipublikasikan: "bg-green-100 text-green-800",
  Ditutup: "bg-red-100 text-red-800",
}

export const ALLOWED_TUGAS_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
  "application/x-zip-compressed",
]

export const ALLOWED_TUGAS_FILE_EXTENSIONS =
  ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip"

export const EMPTY_TUGAS_FORM: TugasFormData = {
  judul: "",
  deskripsi: "",
  kelas_mengajar_id: 0,
  guru_nama: "",
  mata_pelajaran: "",
  kelas: "",
  lampiran: [],
  tanggal_dibuka: "",
  tenggat_waktu: "",
  tenggat_jam: null,
  nilai_maksimal: 100,
  status: "Draft",
}
