export type StatusQuiz = "Draft" | "Publish" | "Ditutup"

export interface Quiz {
  id: number
  judul: string
  deskripsi: string
  paket_soal_id: number
  kelas: string
  tanggal_mulai: string
  tanggal_berakhir: string
  durasi: number
  percobaan_maksimal: number
  acak_urutan_soal: boolean
  acak_urutan_jawaban: boolean
  tampilkan_nilai: boolean
  status: StatusQuiz
  created_at: string
  updated_at: string
}

export type QuizFormData = Omit<Quiz, "id" | "created_at" | "updated_at">

export interface QuizParticipant {
  id: number
  quiz_id: number
  siswa_nama: string
  siswa_kelas: string
  nilai: number | null
  benar: number
  salah: number
  waktu_pengerjaan: number
  status: "Belum Mengerjakan" | "Sedang Mengerjakan" | "Selesai"
  selesai_at: string | null
}

export interface QuizAnswer {
  soal_id: number
  jawaban: string
}
