export type KategoriPengumuman =
  | "Akademik"
  | "Pembelajaran"
  | "Assessment"
  | "PKL"
  | "Kegiatan Sekolah"
  | "Libur"
  | "Informasi Umum"
  | "Lainnya"

export type StatusPengumuman = "Draft" | "Dipublikasikan" | "Diarsipkan"

export type TargetPengumuman =
  | "Semua Pengguna"
  | "Guru"
  | "Siswa"
  | "Kelas Tertentu"
  | "Jurusan Tertentu"
  | "TKJ"
  | "TBSM"
  | "BDP"

export interface Pengumuman {
  id: number
  judul: string
  ringkasan: string
  isi: string
  kategori: KategoriPengumuman
  target: TargetPengumuman
  status: StatusPengumuman
  penulis: string
  pinned: boolean
  tanggal_publish: string
  created_at: string
  updated_at: string
}
