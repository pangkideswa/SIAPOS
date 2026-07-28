export type StatusPaketSoal = "Draft" | "Aktif" | "Arsip"

export interface PaketSoal {
  id: number
  nama_paket: string
  deskripsi: string
  mata_pelajaran: string
  guru_nama: string
  durasi: number
  nilai_maksimal: number
  soal_ids: number[]
  status: StatusPaketSoal
  created_at: string
  updated_at: string
}

export type PaketSoalFormData = Omit<PaketSoal, "id" | "created_at" | "updated_at">
