import type { JadwalPelajaran } from "../types/jadwal-pelajaran"

export const DUMMY_JADWAL_PELAJARAN: JadwalPelajaran[] = [
  // ===== SENIN =====
  // X TKJ 1
  {
    id: 1, hari: "Senin", jam_mulai: "07:00", jam_selesai: "08:30",
    mata_pelajaran: "Dasar Jaringan", guru_nama: "Asep Nugraha", kelas: "X TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab TKJ 1", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  {
    id: 2, hari: "Senin", jam_mulai: "08:30", jam_selesai: "10:00",
    mata_pelajaran: "Informatika", guru_nama: "Budi Santoso", kelas: "X TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab Komputer 1", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  // XI TKJ 1
  {
    id: 3, hari: "Senin", jam_mulai: "07:00", jam_selesai: "08:30",
    mata_pelajaran: "Administrasi Sistem Jaringan", guru_nama: "Rina Wulandari", kelas: "XI TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab TKJ 2", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  {
    id: 4, hari: "Senin", jam_mulai: "08:30", jam_selesai: "10:00",
    mata_pelajaran: "Basis Data", guru_nama: "Siti Rahayu", kelas: "XI TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab TKJ 2", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  // X TBSM 1
  {
    id: 5, hari: "Senin", jam_mulai: "07:00", jam_selesai: "08:30",
    mata_pelajaran: "Pemrograman Web", guru_nama: "Andi Wijaya", kelas: "X TBSM 1",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab Komputer 2", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  {
    id: 6, hari: "Senin", jam_mulai: "10:15", jam_selesai: "11:45",
    mata_pelajaran: "Sistem Operasi", guru_nama: "Dewi Sartika", kelas: "X TBSM 1",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab Komputer 2", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  // X TBSM 2
  {
    id: 7, hari: "Senin", jam_mulai: "08:30", jam_selesai: "10:00",
    mata_pelajaran: "Komputer dan Jaringan Dasar", guru_nama: "Budi Santoso", kelas: "X TBSM 2",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab Komputer 1", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  {
    id: 8, hari: "Senin", jam_mulai: "12:30", jam_selesai: "14:00",
    mata_pelajaran: "Basis Data", guru_nama: "Siti Rahayu", kelas: "X TBSM 2",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab Komputer 1", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },

  // ===== SELASA =====
  // X TKJ 1
  {
    id: 9, hari: "Selasa", jam_mulai: "07:00", jam_selesai: "08:30",
    mata_pelajaran: "Sistem Operasi", guru_nama: "Asep Nugraha", kelas: "X TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab TKJ 1", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  {
    id: 10, hari: "Selasa", jam_mulai: "10:15", jam_selesai: "11:45",
    mata_pelajaran: "Komputer dan Jaringan Dasar", guru_nama: "Budi Santoso", kelas: "X TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab TKJ 1", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  // XI TKJ 1
  {
    id: 11, hari: "Selasa", jam_mulai: "08:30", jam_selesai: "10:00",
    mata_pelajaran: "Dasar Jaringan", guru_nama: "Asep Nugraha", kelas: "XI TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab TKJ 2", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  {
    id: 12, hari: "Selasa", jam_mulai: "10:15", jam_selesai: "11:45",
    mata_pelajaran: "Informatika", guru_nama: "Budi Santoso", kelas: "XI TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab Komputer 1", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  // X TBSM 1
  {
    id: 13, hari: "Selasa", jam_mulai: "08:30", jam_selesai: "10:00",
    mata_pelajaran: "Basis Data", guru_nama: "Siti Rahayu", kelas: "X TBSM 1",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab Komputer 2", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  {
    id: 14, hari: "Selasa", jam_mulai: "12:30", jam_selesai: "14:00",
    mata_pelajaran: "Pemrograman Web", guru_nama: "Andi Wijaya", kelas: "X TBSM 1",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab Komputer 2", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  // X TBSM 2
  {
    id: 15, hari: "Selasa", jam_mulai: "07:00", jam_selesai: "08:30",
    mata_pelajaran: "Dasar Jaringan", guru_nama: "Asep Nugraha", kelas: "X TBSM 2",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab Komputer 1", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  {
    id: 16, hari: "Selasa", jam_mulai: "10:15", jam_selesai: "11:45",
    mata_pelajaran: "Sistem Operasi", guru_nama: "Dewi Sartika", kelas: "X TBSM 2",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab Komputer 1", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },

  // ===== RABU =====
  // X TKJ 1
  {
    id: 17, hari: "Rabu", jam_mulai: "08:30", jam_selesai: "10:00",
    mata_pelajaran: "Administrasi Sistem Jaringan", guru_nama: "Rina Wulandari", kelas: "X TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab TKJ 1", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  {
    id: 18, hari: "Rabu", jam_mulai: "10:15", jam_selesai: "11:45",
    mata_pelajaran: "Pemrograman Web", guru_nama: "Andi Wijaya", kelas: "X TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab TKJ 1", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  // XI TKJ 1
  {
    id: 19, hari: "Rabu", jam_mulai: "07:00", jam_selesai: "08:30",
    mata_pelajaran: "Sistem Operasi", guru_nama: "Asep Nugraha", kelas: "XI TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab TKJ 2", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  {
    id: 20, hari: "Rabu", jam_mulai: "10:15", jam_selesai: "11:45",
    mata_pelajaran: "Administrasi Sistem Jaringan", guru_nama: "Rina Wulandari", kelas: "XI TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab TKJ 2", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  // X TBSM 1
  {
    id: 21, hari: "Rabu", jam_mulai: "07:00", jam_selesai: "08:30",
    mata_pelajaran: "Komputer dan Jaringan Dasar", guru_nama: "Budi Santoso", kelas: "X TBSM 1",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab Komputer 2", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  {
    id: 22, hari: "Rabu", jam_mulai: "12:30", jam_selesai: "14:00",
    mata_pelajaran: "Dasar Jaringan", guru_nama: "Asep Nugraha", kelas: "X TBSM 1",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab Komputer 2", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  // X TBSM 2
  {
    id: 23, hari: "Rabu", jam_mulai: "07:00", jam_selesai: "08:30",
    mata_pelajaran: "Pemrograman Web", guru_nama: "Andi Wijaya", kelas: "X TBSM 2",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab Komputer 1", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },

  // ===== KAMIS =====
  // X TKJ 1
  {
    id: 24, hari: "Kamis", jam_mulai: "07:00", jam_selesai: "08:30",
    mata_pelajaran: "Pemrograman Web", guru_nama: "Andi Wijaya", kelas: "X TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab TKJ 1", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  // XI TKJ 1
  {
    id: 25, hari: "Kamis", jam_mulai: "08:30", jam_selesai: "10:00",
    mata_pelajaran: "Komputer dan Jaringan Dasar", guru_nama: "Budi Santoso", kelas: "XI TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab Komputer 1", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  // X TBSM 1
  {
    id: 26, hari: "Kamis", jam_mulai: "10:15", jam_selesai: "11:45",
    mata_pelajaran: "Administrasi Sistem Jaringan", guru_nama: "Rina Wulandari", kelas: "X TBSM 1",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab Komputer 2", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  {
    id: 27, hari: "Kamis", jam_mulai: "12:30", jam_selesai: "14:00",
    mata_pelajaran: "Informatika", guru_nama: "Budi Santoso", kelas: "X TBSM 1",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab Komputer 2", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  // X TBSM 2
  {
    id: 28, hari: "Kamis", jam_mulai: "07:00", jam_selesai: "08:30",
    mata_pelajaran: "Administrasi Sistem Jaringan", guru_nama: "Rina Wulandari", kelas: "X TBSM 2",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab Komputer 1", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  {
    id: 29, hari: "Kamis", jam_mulai: "10:15", jam_selesai: "11:45",
    mata_pelajaran: "Basis Data", guru_nama: "Siti Rahayu", kelas: "X TBSM 2",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab Komputer 1", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },

  // ===== JUMAT =====
  // X TKJ 1
  {
    id: 30, hari: "Jumat", jam_mulai: "07:00", jam_selesai: "08:30",
    mata_pelajaran: "Basis Data", guru_nama: "Siti Rahayu", kelas: "X TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab TKJ 1", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  // XI TKJ 1
  {
    id: 31, hari: "Jumat", jam_mulai: "07:00", jam_selesai: "08:30",
    mata_pelajaran: "Pemrograman Web", guru_nama: "Andi Wijaya", kelas: "XI TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab TKJ 2", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  // X TBSM 1
  {
    id: 32, hari: "Jumat", jam_mulai: "08:30", jam_selesai: "10:00",
    mata_pelajaran: "Dasar Jaringan", guru_nama: "Asep Nugraha", kelas: "X TBSM 1",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab Komputer 2", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  // X TBSM 2
  {
    id: 33, hari: "Jumat", jam_mulai: "07:00", jam_selesai: "08:30",
    mata_pelajaran: "Informatika", guru_nama: "Budi Santoso", kelas: "X TBSM 2",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab Komputer 1", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  {
    id: 34, hari: "Jumat", jam_mulai: "10:15", jam_selesai: "11:45",
    mata_pelajaran: "Sistem Operasi", guru_nama: "Dewi Sartika", kelas: "X TBSM 2",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab Komputer 1", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },

  // ===== SABTU =====
  // X TKJ 1
  {
    id: 35, hari: "Sabtu", jam_mulai: "07:00", jam_selesai: "08:30",
    mata_pelajaran: "Sistem Operasi", guru_nama: "Dewi Sartika", kelas: "X TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab TKJ 1", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
  // X TBSM 1
  {
    id: 36, hari: "Sabtu", jam_mulai: "08:30", jam_selesai: "10:00",
    mata_pelajaran: "Basis Data", guru_nama: "Siti Rahayu", kelas: "X TBSM 1",
    tahun_ajaran: "2025/2026", semester: "Genap", ruang: "Lab Komputer 2", status: "Aktif",
    created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z",
  },
]
