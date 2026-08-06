export interface Siswa {
  id: number
  user_id?: number | null
  foto: string | null
  nis: string
  nisn: string
  nama_lengkap: string
  jenis_kelamin: "Laki-laki" | "Perempuan"
  tempat_lahir: string
  tanggal_lahir: string
  agama: string
  alamat: string | null
  jurusan_id: number
  jurusan_nama?: string
  kelas: string
  tahun_masuk: string
  tahun_ajaran: string
  status: "Aktif" | "Alumni" | "Pindah" | "Keluar"
  nama_ayah: string
  nama_ibu: string
  no_hp_ortu: string | null
  alamat_ortu: string | null
  created_at: string
  updated_at: string
}

export type SiswaFormData = Omit<Siswa, "id" | "user_id" | "created_at" | "updated_at" | "jurusan_nama">
