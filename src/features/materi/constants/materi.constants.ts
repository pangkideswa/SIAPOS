import type { MateriFormData } from "../types/materi"

export const STATUS_MATERI_OPTIONS = ["Draft", "Publish"] as const

export const STATUS_MATERI_COLORS: Record<string, string> = {
  Draft: "bg-yellow-100 text-yellow-800",
  Publish: "bg-green-100 text-green-800",
}

export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg",
  "image/png",
]

export const ALLOWED_FILE_EXTENSIONS = ".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"

export const EMPTY_MATERI_FORM: MateriFormData = {
  judul: "",
  deskripsi: "",
  kelas_mengajar_id: 0,
  guru_nama: "",
  mata_pelajaran: "",
  kelas: "",
  thumbnail_url: null,
  lampiran: [],
  video_url: null,
  isi_materi: "",
  status: "Draft",
}
