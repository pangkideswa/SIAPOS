export interface SekolahSettings {
  informasi_sekolah: {
    nama_sekolah: string
    npsn: string
    nss: string
    jenjang: string
    status_sekolah: string
    akreditasi: string
  }
  kontak: {
    email: string
    no_telepon: string
    website: string
    alamat_lengkap: string
  }
  logo: {
    logo_sekolah: string
    logo_siapos: string
    favicon: string
  }
  tahun_akademik: {
    tahun_ajaran_aktif: string
    semester_aktif: string
  }
  pengaturan_sistem: {
    nama_aplikasi: string
    bahasa: string
    zona_waktu: string
  }
  sosial_media: {
    facebook: string
    instagram: string
    youtube: string
  }
}

export type SekolahFormData = SekolahSettings
