export interface PengumpulanFile {
  nama: string
  ukuran: string
  tipe: string
}

export interface PengumpulanRiwayat {
  id: number
  file_jawaban: PengumpulanFile | null
  catatan: string
  waktu_pengumpulan: string | null
}

export interface PengumpulanTugas {
  id: number
  tugas_id: number
  siswa_id: number
  siswa_nama: string
  siswa_kelas: string
  file_jawaban: PengumpulanFile | null
  catatan: string
  waktu_pengumpulan: string | null
  status: "Belum Mengumpulkan" | "Sudah Mengumpulkan" | "Terlambat"
  nilai: number | null
  feedback?: string | null
  riwayat_pengumpulan?: PengumpulanRiwayat[]
  created_at: string
  updated_at: string
}

export type PengumpulanTugasFormData = Pick<
  PengumpulanTugas,
  "file_jawaban" | "catatan"
>
