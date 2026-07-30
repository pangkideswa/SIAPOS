import type { SiswaFormData } from "../types/siswa"

export const JENIS_KELAMIN_OPTIONS = ["Laki-laki", "Perempuan"] as const

export const AGAMA_OPTIONS = [
  "Islam",
  "Kristen",
  "Katolik",
  "Hindu",
  "Buddha",
  "Konghucu",
] as const

export const STATUS_SISWA_OPTIONS = ["Aktif", "Alumni", "Pindah", "Keluar"] as const

export const STATUS_SISWA_COLORS: Record<string, string> = {
  Aktif: "bg-green-100 text-green-800",
  Alumni: "bg-blue-100 text-blue-800",
  Pindah: "bg-orange-100 text-orange-800",
  Keluar: "bg-red-100 text-red-800",
}

export const KELAS_OPTIONS = [
  "X TKJ 1",
  "X TKJ 2",
  "X TBSM 1",
  "X TBSM 2",
  "X BDP 1",
  "X BDP 2",
  "XI TKJ 1",
  "XI TKJ 2",
  "XI TBSM 1",
  "XI TBSM 2",
  "XI BDP 1",
  "XI BDP 2",
  "XII TKJ 1",
  "XII TKJ 2",
  "XII TBSM 1",
  "XII TBSM 2",
  "XII BDP 1",
  "XII BDP 2",
] as const

export const TAHUN_AJARAN_OPTIONS = [
  "2024/2025",
  "2025/2026",
  "2026/2027",
] as const

export const JURUSAN_OPTIONS = [
  { id: 1, name: "Teknik Komputer dan Jaringan", code: "TKJ" },
  { id: 2, name: "Teknik Bisnis Sepeda Motor", code: "TBSM" },
  { id: 3, name: "Bisnis Daring dan Pemasaran", code: "BDP" },
] as const

export const EMPTY_SISWA_FORM: SiswaFormData = {
  foto: null,
  nis: "",
  nisn: "",
  nama_lengkap: "",
  jenis_kelamin: "Laki-laki",
  tempat_lahir: "",
  tanggal_lahir: "",
  agama: "Islam",
  alamat: "",
  jurusan_id: 1,
  kelas: "X TKJ 1",
  tahun_masuk: "2024",
  tahun_ajaran: "2025/2026",
  status: "Aktif",
  nama_ayah: "",
  nama_ibu: "",
  no_hp_ortu: "",
  alamat_ortu: "",
}
