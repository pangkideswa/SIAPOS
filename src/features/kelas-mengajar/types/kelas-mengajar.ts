export interface KelasMengajar {
  id: number
  classroom_id?: number | null
  subject_id?: number | null
  teacher_id?: number | null
  guru_nama: string
  mata_pelajaran: string
  kelas: string
  tahun_ajaran: string
  semester: "Ganjil" | "Genap"
  status: "Aktif" | "Tidak Aktif"
  created_at: string
  updated_at: string
}

export interface KelasMengajarFormData {
  teacher_id?: number | null
  subject_id?: number | null
  classroom_id?: number | null
  guru_nama: string
  mata_pelajaran: string
  kelas: string
  tahun_ajaran: string
  semester: "Ganjil" | "Genap"
  status: "Aktif" | "Tidak Aktif"
}
