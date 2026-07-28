export type StatusKehadiran = "Hadir" | "Izin" | "Sakit" | "Alpha" | "Terlambat"

export interface SesiAbsensi {
  id: number
  tanggal: string
  jam_mulai: string
  jam_selesai: string
  mata_pelajaran: string
  guru_nama: string
  kelas: string
  tahun_ajaran: string
  semester: string
  total_siswa: number
  hadir: number
  izin: number
  sakit: number
  alpha: number
  terlambat: number
  status: "Selesai" | "Berlangsung" | "Belum"
  created_at: string
  updated_at: string
}

export interface AbsensiSiswa {
  id: number
  sesi_id: number
  siswa_id: number
  siswa_nama: string
  siswa_kelas: string
  status: StatusKehadiran
  keterangan: string
  created_at: string
  updated_at: string
}

export interface RekapAbsensi {
  siswa_id: number
  siswa_nama: string
  siswa_kelas: string
  hadir: number
  izin: number
  sakit: number
  alpha: number
  terlambat: number
  total_pertemuan: number
  persentase: number
}
