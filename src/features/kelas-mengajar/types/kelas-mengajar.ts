export interface KelasMengajar {
  id: number
  guru_nama: string
  mata_pelajaran: string
  kelas: string
  tahun_ajaran: string
  semester: "Ganjil" | "Genap"
  status: "Aktif" | "Tidak Aktif"
  created_at: string
  updated_at: string
}

export type KelasMengajarFormData = Omit<KelasMengajar, "id" | "created_at" | "updated_at">
