export interface Guru {
  id: number
  foto: string | null
  nama_lengkap: string
  nip: string
  nuptk: string | null
  jenis_kelamin: "Laki-laki" | "Perempuan"
  tempat_lahir: string
  tanggal_lahir: string
  no_hp: string | null
  email: string
  alamat: string | null
  pendidikan_terakhir: string
  status_kepegawaian: "PNS" | "PPPK" | "Honorer"
  mata_pelajaran: string[]
  created_at: string
  updated_at: string
}

export type GuruFormData = Omit<Guru, "id" | "created_at" | "updated_at">
