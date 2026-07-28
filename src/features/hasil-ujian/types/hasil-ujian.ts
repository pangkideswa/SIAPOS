export type JenisUjian = "Quiz" | "CBT" | "Ulangan Harian" | "PTS" | "PAS" | "Try Out"

export type StatusHasil = "Lulus" | "Tidak Lulus" | "Menunggu Penilaian"

export interface SoalReview {
  nomor: number
  pertanyaan: string
  jawaban_peserta: string | null
  jawaban_benar: string
  status: "Benar" | "Salah" | "Tidak Dijawab"
}

export interface HasilUjian {
  id: number
  siswa_id: number
  siswa_nama: string
  siswa_nis: string
  siswa_kelas: string
  mata_pelajaran: string
  guru_nama: string
  nama_ujian: string
  jenis_ujian: JenisUjian
  durasi: number
  waktu_mulai: string
  waktu_selesai: string
  tanggal: string
  nilai: number | null
  jumlah_soal: number
  jumlah_benar: number
  jumlah_salah: number
  jumlah_kosong: number
  status: StatusHasil
  catatan_evaluasi: string
  feedback_guru: string
  soal_review: SoalReview[]
  created_at: string
  updated_at: string
}
