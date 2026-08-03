export interface Lampiran {
  id: number
  nama: string
  ukuran: string
  tipe: string
}

export type JenisMateri =
  | "PDF"
  | "DOCX"
  | "PPTX"
  | "Gambar"
  | "Video"
  | "Drive"
  | "URL"
  | "Lainnya"

export interface Materi {
  id: number
  judul: string
  deskripsi: string
  kelas_mengajar_id: number
  guru_nama: string
  mata_pelajaran: string
  kelas: string
  pertemuan: number | null
  jenis_materi: JenisMateri
  thumbnail_url: string | null
  lampiran: Lampiran[]
  video_url: string | null
  link_drive: string | null
  link_eksternal: string | null
  isi_materi: string
  status: "Draft" | "Publish"
  created_at: string
  updated_at: string
}

export type MateriFormData = Omit<Materi, "id" | "created_at" | "updated_at">
