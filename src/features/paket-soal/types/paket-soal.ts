export type StatusPaketSoal = "Draft" | "Aktif" | "Arsip"

export interface PaketSoal {
  id: number
  kode_paket: string
  nama_paket: string
  deskripsi: string
  mata_pelajaran: string
  guru_nama: string
  guru_id: number | null
  durasi: number
  nilai_maksimal: number
  soal_ids: number[]
  status: StatusPaketSoal
  created_at: string
  updated_at: string
}

export type PaketSoalFormData = Omit<PaketSoal, "id" | "kode_paket" | "created_at" | "updated_at" | "guru_nama">
