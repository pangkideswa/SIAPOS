import type { UserRole } from "@/types/auth"

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
  target_roles: UserRole[]
  is_read: boolean
  created_at: string
}
