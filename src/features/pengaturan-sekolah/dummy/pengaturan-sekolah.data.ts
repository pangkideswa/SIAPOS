import type { SekolahSettings } from "../types/pengaturan-sekolah"

export const DUMMY_SEKOLAH_SETTINGS: SekolahSettings = {
  informasi_sekolah: {
    nama_sekolah: "Sekolah Anda",
    npsn: "20228917",
    nss: "5225615",
    jenjang: "SMK",
    status_sekolah: "Swasta",
    akreditasi: "B",
  },
  kontak: {
    email: "info@siapos.my.id",
    no_telepon: "021-56789012",
    website: "https://siapos.my.id",
    alamat_lengkap: "Jl. Raya Bogor Km. 23, No. 45, Kecamatan Ciracas, Jakarta Timur 13740, DKI Jakarta",
  },
  logo: {
    logo_sekolah: "",

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
    facebook: "https://facebook.com/siapos",
    instagram: "https://instagram.com/siapos",
    youtube: "https://youtube.com/@siapos",
  },
}
