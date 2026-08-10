import type {
  KategoriPengumuman,
  StatusPengumuman,
  TargetPengumuman,
} from "../types/pengumuman"

export const KATEGORI_PENGUMUMAN_OPTIONS: KategoriPengumuman[] = [
  "Akademik",
  "Pembelajaran",
  "Assessment",
  "PKL",
  "Kegiatan Sekolah",
  "Libur",
  "Informasi Umum",
  "Lainnya",
]

export const STATUS_PENGUMUMAN_OPTIONS: StatusPengumuman[] = [
  "Draft",
  "Dipublikasikan",
  "Diarsipkan",
]

export const TARGET_OPTIONS: TargetPengumuman[] = [
  "Semua Pengguna",
  "Guru",
  "Siswa",
  "Kelas Tertentu",
  "Jurusan Tertentu",
  "TKJ",
  "TBSM",
  "BDP",
]

export const KELAS_PENGUMUMAN_OPTIONS = [
  "X TKJ 1",
  "X TKJ 2",
  "XI TKJ 1",
  "XI TKJ 2",
  "XII TKJ 1",
  "XII TKJ 2",
  "X TBSM 1",
  "X TBSM 2",
  "XI TBSM 1",
  "XI TBSM 2",
] as const

export const GURU_PENULIS = "Asep Nugraha"

export const ALLOWED_ATTACHMENT_TYPES =
  "application/pdf,.doc,.docx,image/jpeg,image/png,image/jpg,image/webp"

export const KATEGORI_PENGUMUMAN_COLORS: Record<KategoriPengumuman, string> = {
  Akademik: "bg-blue-100 text-blue-800",
  Pembelajaran: "bg-green-100 text-green-800",
  Assessment: "bg-purple-100 text-purple-800",
  PKL: "bg-cyan-100 text-cyan-800",
  "Kegiatan Sekolah": "bg-teal-100 text-teal-800",
  Libur: "bg-orange-100 text-orange-800",
  "Informasi Umum": "bg-muted text-foreground",
  Lainnya: "bg-muted text-foreground",
}

export const STATUS_PENGUMUMAN_COLORS: Record<StatusPengumuman, string> = {
  Draft: "bg-yellow-100 text-yellow-800",
  Dipublikasikan: "bg-green-100 text-green-800",
  Diarsipkan: "bg-muted text-foreground",
}

export const TARGET_COLORS: Record<TargetPengumuman, string> = {
  "Semua Pengguna": "bg-indigo-100 text-indigo-800",
  Guru: "bg-blue-100 text-blue-800",
  Siswa: "bg-green-100 text-green-800",
  "Kelas Tertentu": "bg-pink-100 text-pink-800",
  "Jurusan Tertentu": "bg-purple-100 text-purple-800",
  TKJ: "bg-cyan-100 text-cyan-800",
  TBSM: "bg-orange-100 text-orange-800",
  BDP: "bg-rose-100 text-rose-800",
}

export const EMPTY_PENGUMUMAN_FORM = {
  judul: "",
  ringkasan: "",
  isi: "",
  kategori: "Informasi Umum" as KategoriPengumuman,
  target: "Semua Pengguna" as TargetPengumuman,
  kelas: "",
  status: "Draft" as StatusPengumuman,
  penulis: "",
  pinned: false,
  lampiran: [] as {
    id: number
    nama: string
    ukuran: string
    tipe: string
  }[],
  tanggal_publish: new Date().toISOString().split("T")[0],
}

export type PengumumanFormData = typeof EMPTY_PENGUMUMAN_FORM
