import type { SesiAbsensi, AbsensiSiswa, RekapAbsensi } from "../types/absensi"

export const DUMMY_SESI_ABSENSI: SesiAbsensi[] = [
  // Minggu 1: 14-18 Juli 2026
  {
    id: 1, tanggal: "2026-07-14", jam_mulai: "07:00", jam_selesai: "08:30",
    mata_pelajaran: "Dasar Jaringan", guru_nama: "Asep Nugraha", kelas: "X TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 8,
    hadir: 7, izin: 1, sakit: 0, alpha: 0, terlambat: 0, status: "Selesai",
    created_at: "2026-07-14T07:00:00Z", updated_at: "2026-07-14T08:30:00Z",
  },
  {
    id: 2, tanggal: "2026-07-14", jam_mulai: "08:30", jam_selesai: "10:00",
    mata_pelajaran: "Administrasi Sistem Jaringan", guru_nama: "Rina Wulandari", kelas: "XI TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 7,
    hadir: 6, izin: 0, sakit: 1, alpha: 0, terlambat: 0, status: "Selesai",
    created_at: "2026-07-14T08:30:00Z", updated_at: "2026-07-14T10:00:00Z",
  },
  {
    id: 3, tanggal: "2026-07-14", jam_mulai: "10:15", jam_selesai: "11:45",
    mata_pelajaran: "Pemrograman Web", guru_nama: "Andi Wijaya", kelas: "X TBSM 1",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 8,
    hadir: 6, izin: 0, sakit: 0, alpha: 1, terlambat: 1, status: "Selesai",
    created_at: "2026-07-14T10:15:00Z", updated_at: "2026-07-14T11:45:00Z",
  },
  {
    id: 4, tanggal: "2026-07-14", jam_mulai: "12:30", jam_selesai: "14:00",
    mata_pelajaran: "Basis Data", guru_nama: "Siti Rahayu", kelas: "X TBSM 2",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 7,
    hadir: 7, izin: 0, sakit: 0, alpha: 0, terlambat: 0, status: "Selesai",
    created_at: "2026-07-14T12:30:00Z", updated_at: "2026-07-14T14:00:00Z",
  },
  // 15 Juli
  {
    id: 5, tanggal: "2026-07-15", jam_mulai: "07:00", jam_selesai: "08:30",
    mata_pelajaran: "Komputer dan Jaringan Dasar", guru_nama: "Budi Santoso", kelas: "X TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 8,
    hadir: 8, izin: 0, sakit: 0, alpha: 0, terlambat: 0, status: "Selesai",
    created_at: "2026-07-15T07:00:00Z", updated_at: "2026-07-15T08:30:00Z",
  },
  {
    id: 6, tanggal: "2026-07-15", jam_mulai: "08:30", jam_selesai: "10:00",
    mata_pelajaran: "Sistem Operasi", guru_nama: "Asep Nugraha", kelas: "X TKJ 2",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 7,
    hadir: 5, izin: 1, sakit: 0, alpha: 1, terlambat: 0, status: "Selesai",
    created_at: "2026-07-15T08:30:00Z", updated_at: "2026-07-15T10:00:00Z",
  },
  {
    id: 7, tanggal: "2026-07-15", jam_mulai: "10:15", jam_selesai: "11:45",
    mata_pelajaran: "Dasar Jaringan", guru_nama: "Asep Nugraha", kelas: "XI TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 7,
    hadir: 6, izin: 0, sakit: 0, alpha: 0, terlambat: 1, status: "Selesai",
    created_at: "2026-07-15T10:15:00Z", updated_at: "2026-07-15T11:45:00Z",
  },
  {
    id: 8, tanggal: "2026-07-15", jam_mulai: "12:30", jam_selesai: "14:00",
    mata_pelajaran: "Pemrograman Web", guru_nama: "Andi Wijaya", kelas: "X TBSM 1",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 8,
    hadir: 7, izin: 0, sakit: 1, alpha: 0, terlambat: 0, status: "Selesai",
    created_at: "2026-07-15T12:30:00Z", updated_at: "2026-07-15T14:00:00Z",
  },
  // 16 Juli
  {
    id: 9, tanggal: "2026-07-16", jam_mulai: "07:00", jam_selesai: "08:30",
    mata_pelajaran: "Administrasi Sistem Jaringan", guru_nama: "Rina Wulandari", kelas: "X TKJ 2",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 7,
    hadir: 6, izin: 0, sakit: 0, alpha: 1, terlambat: 0, status: "Selesai",
    created_at: "2026-07-16T07:00:00Z", updated_at: "2026-07-16T08:30:00Z",
  },
  {
    id: 10, tanggal: "2026-07-16", jam_mulai: "08:30", jam_selesai: "10:00",
    mata_pelajaran: "Informatika", guru_nama: "Budi Santoso", kelas: "X TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 8,
    hadir: 7, izin: 0, sakit: 0, alpha: 0, terlambat: 1, status: "Selesai",
    created_at: "2026-07-16T08:30:00Z", updated_at: "2026-07-16T10:00:00Z",
  },
  // 17 Juli
  {
    id: 11, tanggal: "2026-07-17", jam_mulai: "07:00", jam_selesai: "08:30",
    mata_pelajaran: "Basis Data", guru_nama: "Siti Rahayu", kelas: "XI TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 7,
    hadir: 7, izin: 0, sakit: 0, alpha: 0, terlambat: 0, status: "Selesai",
    created_at: "2026-07-17T07:00:00Z", updated_at: "2026-07-17T08:30:00Z",
  },
  {
    id: 12, tanggal: "2026-07-17", jam_mulai: "08:30", jam_selesai: "10:00",
    mata_pelajaran: "Komputer dan Jaringan Dasar", guru_nama: "Budi Santoso", kelas: "X TBSM 2",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 7,
    hadir: 6, izin: 1, sakit: 0, alpha: 0, terlambat: 0, status: "Selesai",
    created_at: "2026-07-17T08:30:00Z", updated_at: "2026-07-17T10:00:00Z",
  },
  // 18 Juli
  {
    id: 13, tanggal: "2026-07-18", jam_mulai: "07:00", jam_selesai: "08:30",
    mata_pelajaran: "Sistem Operasi", guru_nama: "Asep Nugraha", kelas: "X TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 8,
    hadir: 8, izin: 0, sakit: 0, alpha: 0, terlambat: 0, status: "Selesai",
    created_at: "2026-07-18T07:00:00Z", updated_at: "2026-07-18T08:30:00Z",
  },
  {
    id: 14, tanggal: "2026-07-18", jam_mulai: "10:15", jam_selesai: "11:45",
    mata_pelajaran: "Informatika", guru_nama: "Budi Santoso", kelas: "X TBSM 1",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 8,
    hadir: 7, izin: 0, sakit: 0, alpha: 0, terlambat: 1, status: "Selesai",
    created_at: "2026-07-18T10:15:00Z", updated_at: "2026-07-18T11:45:00Z",
  },
  // Minggu 2: 21-25 Juli 2026
  {
    id: 15, tanggal: "2026-07-21", jam_mulai: "07:00", jam_selesai: "08:30",
    mata_pelajaran: "Dasar Jaringan", guru_nama: "Asep Nugraha", kelas: "X TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 8,
    hadir: 7, izin: 0, sakit: 1, alpha: 0, terlambat: 0, status: "Selesai",
    created_at: "2026-07-21T07:00:00Z", updated_at: "2026-07-21T08:30:00Z",
  },
  {
    id: 16, tanggal: "2026-07-21", jam_mulai: "08:30", jam_selesai: "10:00",
    mata_pelajaran: "Administrasi Sistem Jaringan", guru_nama: "Rina Wulandari", kelas: "XI TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 7,
    hadir: 6, izin: 0, sakit: 0, alpha: 1, terlambat: 0, status: "Selesai",
    created_at: "2026-07-21T08:30:00Z", updated_at: "2026-07-21T10:00:00Z",
  },
  {
    id: 17, tanggal: "2026-07-21", jam_mulai: "10:15", jam_selesai: "11:45",
    mata_pelajaran: "Pemrograman Web", guru_nama: "Andi Wijaya", kelas: "X TBSM 1",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 8,
    hadir: 8, izin: 0, sakit: 0, alpha: 0, terlambat: 0, status: "Selesai",
    created_at: "2026-07-21T10:15:00Z", updated_at: "2026-07-21T11:45:00Z",
  },
  {
    id: 18, tanggal: "2026-07-21", jam_mulai: "12:30", jam_selesai: "14:00",
    mata_pelajaran: "Basis Data", guru_nama: "Siti Rahayu", kelas: "X TBSM 2",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 7,
    hadir: 5, izin: 1, sakit: 0, alpha: 1, terlambat: 0, status: "Selesai",
    created_at: "2026-07-21T12:30:00Z", updated_at: "2026-07-21T14:00:00Z",
  },
  // 22 Juli
  {
    id: 19, tanggal: "2026-07-22", jam_mulai: "07:00", jam_selesai: "08:30",
    mata_pelajaran: "Komputer dan Jaringan Dasar", guru_nama: "Budi Santoso", kelas: "X TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 8,
    hadir: 7, izin: 0, sakit: 0, alpha: 1, terlambat: 0, status: "Selesai",
    created_at: "2026-07-22T07:00:00Z", updated_at: "2026-07-22T08:30:00Z",
  },
  {
    id: 20, tanggal: "2026-07-22", jam_mulai: "08:30", jam_selesai: "10:00",
    mata_pelajaran: "Sistem Operasi", guru_nama: "Asep Nugraha", kelas: "X TKJ 2",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 7,
    hadir: 6, izin: 0, sakit: 0, alpha: 0, terlambat: 1, status: "Selesai",
    created_at: "2026-07-22T08:30:00Z", updated_at: "2026-07-22T10:00:00Z",
  },
  {
    id: 21, tanggal: "2026-07-22", jam_mulai: "10:15", jam_selesai: "11:45",
    mata_pelajaran: "Dasar Jaringan", guru_nama: "Asep Nugraha", kelas: "XI TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 7,
    hadir: 7, izin: 0, sakit: 0, alpha: 0, terlambat: 0, status: "Selesai",
    created_at: "2026-07-22T10:15:00Z", updated_at: "2026-07-22T11:45:00Z",
  },
  // 23 Juli
  {
    id: 22, tanggal: "2026-07-23", jam_mulai: "07:00", jam_selesai: "08:30",
    mata_pelajaran: "Informatika", guru_nama: "Budi Santoso", kelas: "X TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 8,
    hadir: 8, izin: 0, sakit: 0, alpha: 0, terlambat: 0, status: "Selesai",
    created_at: "2026-07-23T07:00:00Z", updated_at: "2026-07-23T08:30:00Z",
  },
  {
    id: 23, tanggal: "2026-07-23", jam_mulai: "08:30", jam_selesai: "10:00",
    mata_pelajaran: "Basis Data", guru_nama: "Siti Rahayu", kelas: "X TBSM 1",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 8,
    hadir: 7, izin: 1, sakit: 0, alpha: 0, terlambat: 0, status: "Selesai",
    created_at: "2026-07-23T08:30:00Z", updated_at: "2026-07-23T10:00:00Z",
  },
  // 24 Juli
  {
    id: 24, tanggal: "2026-07-24", jam_mulai: "07:00", jam_selesai: "08:30",
    mata_pelajaran: "Administrasi Sistem Jaringan", guru_nama: "Rina Wulandari", kelas: "XI TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 7,
    hadir: 6, izin: 0, sakit: 1, alpha: 0, terlambat: 0, status: "Selesai",
    created_at: "2026-07-24T07:00:00Z", updated_at: "2026-07-24T08:30:00Z",
  },
  {
    id: 25, tanggal: "2026-07-24", jam_mulai: "08:30", jam_selesai: "10:00",
    mata_pelajaran: "Komputer dan Jaringan Dasar", guru_nama: "Budi Santoso", kelas: "X TBSM 2",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 7,
    hadir: 6, izin: 0, sakit: 0, alpha: 0, terlambat: 1, status: "Selesai",
    created_at: "2026-07-24T08:30:00Z", updated_at: "2026-07-24T10:00:00Z",
  },
  // 25 Juli
  {
    id: 26, tanggal: "2026-07-25", jam_mulai: "07:00", jam_selesai: "08:30",
    mata_pelajaran: "Sistem Operasi", guru_nama: "Asep Nugraha", kelas: "X TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 8,
    hadir: 7, izin: 0, sakit: 0, alpha: 1, terlambat: 0, status: "Selesai",
    created_at: "2026-07-25T07:00:00Z", updated_at: "2026-07-25T08:30:00Z",
  },
  {
    id: 27, tanggal: "2026-07-25", jam_mulai: "10:15", jam_selesai: "11:45",
    mata_pelajaran: "Informatika", guru_nama: "Budi Santoso", kelas: "X TBSM 1",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 8,
    hadir: 8, izin: 0, sakit: 0, alpha: 0, terlambat: 0, status: "Selesai",
    created_at: "2026-07-25T10:15:00Z", updated_at: "2026-07-25T11:45:00Z",
  },
  // Dewi Sartika sessions
  {
    id: 28, tanggal: "2026-07-21", jam_mulai: "10:15", jam_selesai: "11:45",
    mata_pelajaran: "Sistem Operasi", guru_nama: "Dewi Sartika", kelas: "X TBSM 2",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 7,
    hadir: 6, izin: 0, sakit: 0, alpha: 1, terlambat: 0, status: "Selesai",
    created_at: "2026-07-21T10:15:00Z", updated_at: "2026-07-21T11:45:00Z",
  },
  {
    id: 29, tanggal: "2026-07-25", jam_mulai: "10:15", jam_selesai: "11:45",
    mata_pelajaran: "Sistem Operasi", guru_nama: "Dewi Sartika", kelas: "X TBSM 2",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 7,
    hadir: 7, izin: 0, sakit: 0, alpha: 0, terlambat: 0, status: "Selesai",
    created_at: "2026-07-25T10:15:00Z", updated_at: "2026-07-25T11:45:00Z",
  },
  {
    id: 30, tanggal: "2026-07-25", jam_mulai: "07:00", jam_selesai: "08:30",
    mata_pelajaran: "Sistem Operasi", guru_nama: "Dewi Sartika", kelas: "X TKJ 1",
    tahun_ajaran: "2025/2026", semester: "Genap", total_siswa: 8,
    hadir: 7, izin: 0, sakit: 0, alpha: 0, terlambat: 1, status: "Selesai",
    created_at: "2026-07-25T07:00:00Z", updated_at: "2026-07-25T08:30:00Z",
  },
]

// Siswa data for attendance - 30 siswa aktif across 4 kelas
const SISWA_X_TKJ_1 = [
  { id: 101, nama: "Ahmad Fauzi", kelas: "X TKJ 1" },
  { id: 102, nama: "Rina Marlina", kelas: "X TKJ 1" },
  { id: 103, nama: "Dimas Prayoga", kelas: "X TKJ 1" },
  { id: 104, nama: "Salsa Amalia", kelas: "X TKJ 1" },
  { id: 105, nama: "Yoga Firmansyah", kelas: "X TKJ 1" },
  { id: 106, nama: "Mega Putri", kelas: "X TKJ 1" },
  { id: 107, nama: "Rizal Hidayat", kelas: "X TKJ 1" },
  { id: 108, nama: "Nabila Azzahra", kelas: "X TKJ 1" },
]

const SISWA_XI_TKJ_1 = [
  { id: 201, nama: "Budi Santoso", kelas: "XI TKJ 1" },
  { id: 202, nama: "Rizki Pratama", kelas: "XI TKJ 1" },
  { id: 203, nama: "Ahmad Rizky", kelas: "XI TKJ 1" },
  { id: 204, nama: "Putri Wulandari", kelas: "XI TKJ 1" },
  { id: 205, nama: "Fadil Akbar", kelas: "XI TKJ 1" },
  { id: 206, nama: "Nanda Kusuma", kelas: "XI TKJ 1" },
  { id: 207, nama: "Citra Dewi", kelas: "XI TKJ 1" },
]

const SISWA_X_TBSM_1 = [
  { id: 301, nama: "Dewi Lestari", kelas: "X TBSM 1" },
  { id: 302, nama: "Andi Prasetyo", kelas: "X TBSM 1" },
  { id: 303, nama: "Mutiara Sari", kelas: "X TBSM 1" },
  { id: 304, nama: "Hendra Gunawan", kelas: "X TBSM 1" },
  { id: 305, nama: "Ayu Lestari", kelas: "X TBSM 1" },
  { id: 306, nama: "Bayu Saputra", kelas: "X TBSM 1" },
  { id: 307, nama: "Fitri Handayani", kelas: "X TBSM 1" },
  { id: 308, nama: "Cakra Pratama", kelas: "X TBSM 1" },
]

const SISWA_X_TBSM_2 = [
  { id: 401, nama: "Rizky Ramadhan", kelas: "X TBSM 2" },
  { id: 402, nama: "Indah Permata", kelas: "X TBSM 2" },
  { id: 403, nama: "Farhan Maulana", kelas: "X TBSM 2" },
  { id: 404, nama: "Winda Oktaviani", kelas: "X TBSM 2" },
  { id: 405, nama: "Angga Setiawan", kelas: "X TBSM 2" },
  { id: 406, nama: "Ratna Sari", kelas: "X TBSM 2" },
  { id: 407, nama: "Ilham Pratama", kelas: "X TBSM 2" },
]

type SiswaInfo = { id: number; nama: string; kelas: string }

function generateSesiAbsensi(
  sesiId: number,
  siswaList: SiswaInfo[],
  hadirCount: number,
  izinIds: number[],
  sakitIds: number[],
  alphaIds: number[],
  terlambatIds: number[],
): AbsensiSiswa[] {
  const sesi = DUMMY_SESI_ABSENSI.find((s) => s.id === sesiId)
  if (!sesi) return []
  return siswaList.map((siswa) => {
    let status: AbsensiSiswa["status"] = "Hadir"
    if (alphaIds.includes(siswa.id)) status = "Alpha"
    else if (izinIds.includes(siswa.id)) status = "Izin"
    else if (sakitIds.includes(siswa.id)) status = "Sakit"
    else if (terlambatIds.includes(siswa.id)) status = "Terlambat"
    return {
      id: sesiId * 100 + siswa.id,
      sesi_id: sesiId,
      siswa_id: siswa.id,
      siswa_nama: siswa.nama,
      siswa_kelas: siswa.kelas,
      status,
      keterangan: status === "Izin" ? "Izin keperluan keluarga" : status === "Sakit" ? "Sakit demam" : "",
      created_at: sesi.created_at,
      updated_at: sesi.updated_at,
    }
  })
}

export const DUMMY_ABSENSI_SISWA: AbsensiSiswa[] = [
  // Sesi 1: X TKJ 1 - Dasar Jaringan - 14 Juli
  ...generateSesiAbsensi(1, SISWA_X_TKJ_1, 7, [103], [], [], []),
  // Sesi 2: XI TKJ 1 - Admin Jaringan - 14 Juli
  ...generateSesiAbsensi(2, SISWA_XI_TKJ_1, 6, [], [205], [], []),
  // Sesi 3: X TBSM 1 - Pemrograman Web - 14 Juli
  ...generateSesiAbsensi(3, SISWA_X_TBSM_1, 6, [], [], [304], [308]),
  // Sesi 4: X TBSM 2 - Basis Data - 14 Juli
  ...generateSesiAbsensi(4, SISWA_X_TBSM_2, 7, [], [], [], []),
  // Sesi 5: X TKJ 1 - KJD - 15 Juli
  ...generateSesiAbsensi(5, SISWA_X_TKJ_1, 8, [], [], [], []),
  // Sesi 6: X TKJ 2 - Sistem Operasi - 15 Juli
  ...generateSesiAbsensi(6, SISWA_X_TKJ_1.slice(0, 5).concat([{ id: 501, nama: "Lintang Sari", kelas: "X TKJ 2" }, { id: 502, nama: "Gilang Pratama", kelas: "X TKJ 2" }]), 5, [501], [], [502], []),
  // Sesi 7: XI TKJ 1 - Dasar Jaringan - 15 Juli
  ...generateSesiAbsensi(7, SISWA_XI_TKJ_1, 6, [], [], [], [207]),
  // Sesi 8: X TBSM 1 - Pemrograman Web - 15 Juli
  ...generateSesiAbsensi(8, SISWA_X_TBSM_1, 7, [], [306], [], []),
  // Sesi 9: X TKJ 2 - Admin Jaringan - 16 Juli
  ...generateSesiAbsensi(9, SISWA_X_TKJ_1.slice(0, 5).concat([{ id: 501, nama: "Lintang Sari", kelas: "X TKJ 2" }, { id: 502, nama: "Gilang Pratama", kelas: "X TKJ 2" }]), 6, [], [], [501], []),
  // Sesi 10: X TKJ 1 - Informatika - 16 Juli
  ...generateSesiAbsensi(10, SISWA_X_TKJ_1, 7, [], [], [], [108]),
  // Sesi 11: XI TKJ 1 - Basis Data - 17 Juli
  ...generateSesiAbsensi(11, SISWA_XI_TKJ_1, 7, [], [], [], []),
  // Sesi 12: X TBSM 2 - KJD - 17 Juli
  ...generateSesiAbsensi(12, SISWA_X_TBSM_2, 6, [403], [], [], []),
  // Sesi 13: X TKJ 1 - Sistem Operasi - 18 Juli
  ...generateSesiAbsensi(13, SISWA_X_TKJ_1, 8, [], [], [], []),
  // Sesi 14: X TBSM 1 - Informatika - 18 Juli
  ...generateSesiAbsensi(14, SISWA_X_TBSM_1, 7, [], [], [], [302]),
  // Sesi 15: X TKJ 1 - Dasar Jaringan - 21 Juli
  ...generateSesiAbsensi(15, SISWA_X_TKJ_1, 7, [], [104], [], []),
  // Sesi 16: XI TKJ 1 - Admin Jaringan - 21 Juli
  ...generateSesiAbsensi(16, SISWA_XI_TKJ_1, 6, [], [], [203], []),
  // Sesi 17: X TBSM 1 - Pemrograman Web - 21 Juli
  ...generateSesiAbsensi(17, SISWA_X_TBSM_1, 8, [], [], [], []),
  // Sesi 18: X TBSM 2 - Basis Data - 21 Juli
  ...generateSesiAbsensi(18, SISWA_X_TBSM_2, 5, [407], [], [401], []),
  // Sesi 19: X TKJ 1 - KJD - 22 Juli
  ...generateSesiAbsensi(19, SISWA_X_TKJ_1, 7, [], [], [106], []),
  // Sesi 20: X TKJ 2 - Sistem Operasi - 22 Juli
  ...generateSesiAbsensi(20, SISWA_X_TKJ_1.slice(0, 5).concat([{ id: 501, nama: "Lintang Sari", kelas: "X TKJ 2" }, { id: 502, nama: "Gilang Pratama", kelas: "X TKJ 2" }]), 6, [], [], [], [502]),
  // Sesi 21: XI TKJ 1 - Dasar Jaringan - 22 Juli
  ...generateSesiAbsensi(21, SISWA_XI_TKJ_1, 7, [], [], [], []),
  // Sesi 22: X TKJ 1 - Informatika - 23 Juli
  ...generateSesiAbsensi(22, SISWA_X_TKJ_1, 8, [], [], [], []),
  // Sesi 23: X TBSM 1 - Basis Data - 23 Juli
  ...generateSesiAbsensi(23, SISWA_X_TBSM_1, 7, [307], [], [], []),
  // Sesi 24: XI TKJ 1 - Admin Jaringan - 24 Juli
  ...generateSesiAbsensi(24, SISWA_XI_TKJ_1, 6, [], [202], [], []),
  // Sesi 25: X TBSM 2 - KJD - 24 Juli
  ...generateSesiAbsensi(25, SISWA_X_TBSM_2, 6, [], [], [], [405]),
  // Sesi 26: X TKJ 1 - Sistem Operasi - 25 Juli
  ...generateSesiAbsensi(26, SISWA_X_TKJ_1, 7, [], [], [102], []),
  // Sesi 27: X TBSM 1 - Informatika - 25 Juli
  ...generateSesiAbsensi(27, SISWA_X_TBSM_1, 8, [], [], [], []),
  // Sesi 28: X TBSM 2 - Sistem Operasi - Dewi Sartika - 21 Juli
  ...generateSesiAbsensi(28, SISWA_X_TBSM_2, 6, [], [], [401], []),
  // Sesi 29: X TBSM 2 - Sistem Operasi - Dewi Sartika - 25 Juli
  ...generateSesiAbsensi(29, SISWA_X_TBSM_2, 7, [], [], [], []),
  // Sesi 30: X TKJ 1 - Sistem Operasi - Dewi Sartika - 25 Juli
  ...generateSesiAbsensi(30, SISWA_X_TKJ_1, 7, [], [], [], [108]),
]

export function getRekapAbsensi(): RekapAbsensi[] {
  const siswaMap = new Map<number, RekapAbsensi>()

  const allSiswa = [...SISWA_X_TKJ_1, ...SISWA_XI_TKJ_1, ...SISWA_X_TBSM_1, ...SISWA_X_TBSM_2]
  for (const s of allSiswa) {
    siswaMap.set(s.id, {
      siswa_id: s.id,
      siswa_nama: s.nama,
      siswa_kelas: s.kelas,
      hadir: 0, izin: 0, sakit: 0, alpha: 0, terlambat: 0,
      total_pertemuan: 0, persentase: 0,
    })
  }

  const kelasSesiCount = new Map<string, Set<number>>()

  for (const a of DUMMY_ABSENSI_SISWA) {
    const rec = siswaMap.get(a.siswa_id)
    if (!rec) continue
    if (a.status === "Hadir") rec.hadir++
    else if (a.status === "Izin") rec.izin++
    else if (a.status === "Sakit") rec.sakit++
    else if (a.status === "Alpha") rec.alpha++
    else if (a.status === "Terlambat") rec.terlambat++

    const key = a.siswa_kelas
    if (!kelasSesiCount.has(key)) kelasSesiCount.set(key, new Set())
    kelasSesiCount.get(key)!.add(a.sesi_id)
  }

  for (const [kelas, sesiIds] of kelasSesiCount) {
    const total = sesiIds.size
    for (const rec of siswaMap.values()) {
      if (rec.siswa_kelas === kelas) {
        rec.total_pertemuan = total
        rec.persentase = total > 0 ? Math.round(((rec.hadir + rec.terlambat) / total) * 100) : 0
      }
    }
  }

  return Array.from(siswaMap.values()).filter((r) => r.total_pertemuan > 0)
}
