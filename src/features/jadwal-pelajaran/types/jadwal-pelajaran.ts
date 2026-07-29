export interface JadwalPelajaran {
  id: number
  hari: string
  jam_mulai: string
  jam_selesai: string
  mata_pelajaran: string
  guru_nama: string
  kelas: string
  tahun_ajaran: string
  semester: string
  ruang: string
  status: "Aktif" | "Tidak Aktif"
  created_at: string
  updated_at: string
}

export interface HariOption {
  label: string
  value: string
}
