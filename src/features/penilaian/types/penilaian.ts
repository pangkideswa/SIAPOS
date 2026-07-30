export interface Penilaian {
  id: number
  pengumpulan_id: number
  tugas_id: number
  siswa_nama: string
  siswa_kelas: string
  mata_pelajaran: string
  guru_nama: string
  tugas_judul: string
  tenggat_waktu: string
  nilai: number | null
  feedback_guru: string
  status_penilaian: "Belum Dinilai" | "Sudah Dinilai" | "Revisi"
  created_at: string
  updated_at: string
}

export type PenilaianFormData = Pick<
  Penilaian,
  "nilai" | "feedback_guru" | "status_penilaian"
>
