export type StatusCBT = "Draft" | "Publish" | "Selesai"

export interface CBTExam {
  id: number
  nama_ujian: string
  deskripsi: string
  paket_soal_id: number
  kelas: string
  durasi: number
  tanggal_mulai: string
  tanggal_berakhir: string
  nilai_minimum_lulus: number
  acak_soal: boolean
  acak_jawaban: boolean
  tampilkan_nilai: boolean
  izinkan_kembali: boolean
  auto_submit: boolean
  status: StatusCBT
  created_at: string
  updated_at: string
}

export type CBTExamFormData = Omit<CBTExam, "id" | "created_at" | "updated_at">

export interface CBTAnswer {
  soal_id: number
  jawaban: string
  ditandai: boolean
}

export interface CBTResult {
  id: number
  cbt_id: number
  siswa_nama: string
  siswa_kelas: string
  nilai: number | null
  benar: number
  salah: number
  tidak_dijawab: number
  waktu_pengerjaan: number
  status: "Belum Mengerjakan" | "Sedang Mengerjakan" | "Selesai"
  selesai_at: string | null
}
