export const JENIS_KELAMIN_OPTIONS = ["Laki-laki", "Perempuan"] as const

export const STATUS_KEPEGAWAIAN_OPTIONS = ["PNS", "PPPK", "Honorer"] as const

export const PENDIDIKAN_OPTIONS = ["S1", "S2", "S3", "D3", " SMA/SMK"] as const

export const STATUS_KEPEGAWAIAN_COLORS: Record<string, string> = {
  PNS: "bg-blue-100 text-blue-800",
  PPPK: "bg-green-100 text-green-800",
  Honorer: "bg-orange-100 text-orange-800",
}

import type { GuruFormData } from "../types/guru"

export const MATA_PELAJARAN_OPTIONS = [
  "Jaringan Komputer",
  "Sistem Operasi",
  "Basis Data",
  "Pemrograman Web",
  "Komputer dan Jaringan Dasar",
  "Pekerjaan Dasar Permesinan",
  "Pemrograman Mobile",
  "Pendidikan Agama",
  "Bahasa Indonesia",
  "Bahasa Inggris",
  "Matematika",
  "PKK",
] as const

export const EMPTY_GURU_FORM: GuruFormData = {
  foto: null,
  nama_lengkap: "",
  nip: "",
  nuptk: "",
  jenis_kelamin: "Laki-laki",
  tempat_lahir: "",
  tanggal_lahir: "",
  no_hp: "",
  email: "",
  alamat: "",
  pendidikan_terakhir: "S1",
  status_kepegawaian: "PNS",
  mata_pelajaran: [],
}
