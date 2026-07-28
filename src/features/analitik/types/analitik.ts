export interface AnalyticsSummary {
  total_ujian: number
  total_peserta: number
  rata_rata_nilai: number
  persentase_lulus: number
  nilai_tertinggi: number
  nilai_terendah: number
  total_lulus: number
  total_tidak_lulus: number
  total_menunggu: number
}

export interface AnalyticsBySubject {
  mata_pelajaran: string
  jumlah_ujian: number
  rata_rata_nilai: number
  persentase_lulus: number
  jumlah_peserta: number
}

export interface AnalyticsByExamType {
  jenis_ujian: string
  jumlah_ujian: number
  rata_rata_nilai: number
  persentase_lulus: number
  jumlah_peserta: number
}

export interface AnalyticsByClass {
  kelas: string
  jumlah_peserta: number
  rata_rata_nilai: number
  persentase_lulus: number
  jumlah_ujian: number
}

export interface AnalyticsTimeline {
  tanggal: string
  rata_rata_nilai: number
  jumlah_ujian: number
  persentase_lulus: number
}

export interface TopPerformer {
  siswa_nama: string
  siswa_kelas: string
  rata_rata_nilai: number
  jumlah_ujian: number
  jumlah_lulus: number
}

export interface StudentNeedingAttention {
  siswa_nama: string
  siswa_kelas: string
  rata_rata_nilai: number
  jumlah_tidak_lulus: number
  jumlah_ujian: number
  mata_pelajaran_terlemah: string
}

export interface AnalyticsInsight {
  id: number
  tipe: "peringatan" | "informasi" | "rekomendasi"
  judul: string
  deskripsi: string
}

export interface AnalyticsFilterState {
  kelas: string
  mata_pelajaran: string
  jenis_ujian: string
  tanggal_mulai: string
  tanggal_akhir: string
}
