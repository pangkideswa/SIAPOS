export interface TugasLampiran {
  id: number
  nama: string
  ukuran: string
  tipe: string
}

export interface Tugas {
  id: number
  judul: string
  deskripsi: string
  kelas_mengajar_id: number
  guru_nama: string
  mata_pelajaran: string
  kelas: string
  lampiran: TugasLampiran[]
  tanggal_dibuka: string
  tenggat_waktu: string
  tenggat_jam: string | null
  nilai_maksimal: number
  status: "Draft" | "Dipublikasikan" | "Ditutup"
  created_at: string
  updated_at: string
}

export type TugasFormData = Omit<Tugas, "id" | "created_at" | "updated_at">
