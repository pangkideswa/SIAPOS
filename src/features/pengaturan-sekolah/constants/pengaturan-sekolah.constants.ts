import type { SekolahFormData } from "../types/pengaturan-sekolah"

export const JENJANG_OPTIONS = [
  "SD",
  "SMP",
  "SMA",
  "SMK",
  "SLB",
] as const

export const STATUS_SEKOLAH_OPTIONS = [
  "Negeri",
  "Swasta",
] as const

export const AKREDITASI_OPTIONS = [
  "A",
  "B",
  "C",
  "Belum Akreditasi",
] as const

export const SEMESTER_OPTIONS = [
  "Ganjil",
  "Genap",
] as const

export const BAHASA_OPTIONS = [
  "Indonesia",
  "English",
] as const

export const ZONA_WAKTU_OPTIONS = [
  "Asia/Jakarta",
  "Asia/Makassar",
  "Asia/Jayapura",
] as const

export const TAHUN_AJARAN_OPTIONS = [
  "2024/2025",
  "2025/2026",
  "2026/2027",
] as const

export const EMPTY_SEKOLAH_FORM: SekolahFormData = {
  informasi_sekolah: {
    nama_sekolah: "",
    npsn: "",
    nss: "",
    jenjang: "SMK",
    status_sekolah: "Swasta",
    akreditasi: "B",
  },
  kontak: {
    email: "",
    no_telepon: "",
    website: "",
    alamat_lengkap: "",
  },
  logo: {
    logo_sekolah: "",
    logo_siapos: "",
    favicon: "",
  },
  tahun_akademik: {
    tahun_ajaran_aktif: "2025/2026",
    semester_aktif: "Ganjil",
  },
  pengaturan_sistem: {
    nama_aplikasi: "SIAPOS",
    bahasa: "Indonesia",
    zona_waktu: "Asia/Jakarta",
  },
  sosial_media: {
    facebook: "",
    instagram: "",
    youtube: "",
  },
}
