export type KategoriEvent =
  | "Awal Semester"
  | "Akhir Semester"
  | "Libur Nasional"
  | "Libur Sekolah"
  | "UTS"
  | "UAS"
  | "Asesmen"
  | "PKL"
  | "Pengumuman"
  | "Kegiatan Sekolah"
  | "Rapat Guru"
  | "Hari Besar Nasional"
  | "Lainnya"

export type StatusEvent = "Aktif" | "Selesai" | "Akan Datang"

export interface KalenderEvent {
  id: number
  nama_event: string
  deskripsi: string
  kategori: KategoriEvent
  tanggal_mulai: string
  tanggal_selesai: string
  tahun_ajaran: string
  semester: string
  status: StatusEvent
  created_at: string
  updated_at: string
}
