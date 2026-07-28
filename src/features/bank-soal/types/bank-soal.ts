export type TipeSoal = "Pilihan Ganda" | "Benar / Salah" | "Isian Singkat" | "Essay"
export type KesulitanSoal = "Mudah" | "Sedang" | "Sulit"
export type StatusBankSoal = "Draft" | "Aktif" | "Arsip"

export interface PilihanGanda {
  A: string
  B: string
  C: string
  D: string
  E: string
}

export interface BankSoal {
  id: number
  kode_soal: string
  pertanyaan: string
  gambar_url: string | null
  tipe_soal: TipeSoal
  pilihan: PilihanGanda | null
  jawaban_benar: string
  mata_pelajaran: string
  guru_nama: string
  kelas: string
  kesulitan: KesulitanSoal
  status: StatusBankSoal
  created_at: string
  updated_at: string
}

export type BankSoalFormData = Omit<BankSoal, "id" | "created_at" | "updated_at">
