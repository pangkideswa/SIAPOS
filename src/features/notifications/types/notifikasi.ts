export type NotifikasiTipe =
  | "materi"
  | "tugas"
  | "penilaian"
  | "pengumuman"
  | "sistem"

export interface Notifikasi {
  id: number
  tipe: NotifikasiTipe
  judul: string
  pesan: string
  href?: string
  is_read: boolean
  created_at: string
}
