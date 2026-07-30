export type StatusNilai = "Lengkap" | "Belum Lengkap"

export interface NilaiAkademik {
  id: number
  siswa_nama: string
  siswa_kelas: string
  mata_pelajaran: string
  guru_nama: string
  tugas: number | null
  praktik: number | null
  uts: number | null
  uas: number | null
  status: StatusNilai
  tahun_ajaran: string
  semester: string
  created_at: string
  updated_at: string
}

export interface NilaiAkademikFormData {
  tugas: string
  praktik: string
  uts: string
  uas: string
}
