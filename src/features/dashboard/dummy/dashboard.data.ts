export type { DemoActivity as DashboardActivity } from "@/lib/demo-data/activity"
export { DEMO_ACTIVITIES as DUMMY_ACTIVITIES } from "@/lib/demo-data/activity"
export type { DemoAnnouncement as DashboardAnnouncement } from "@/lib/demo-data/announcements"
export { DEMO_ANNOUNCEMENTS as DUMMY_ANNOUNCEMENTS } from "@/lib/demo-data/announcements"

export interface GuruJadwal {
  id: number
  guru_nama: string
  kelas: string
  mata_pelajaran: string
  waktu_mulai: string
  waktu_selesai: string
  hari: string
}

export interface GuruActivity {
  id: number
  guru_nama: string
  action: string
  icon: string
  timestamp: string
}

export const DUMMY_GURU_JADWAL: GuruJadwal[] = [
  {
    id: 1,
    guru_nama: "Asep Nugraha",
    kelas: "X TKJ 1",
    mata_pelajaran: "Informatika",
    waktu_mulai: "07:30",
    waktu_selesai: "09:00",
    hari: "Senin",
  },
  {
    id: 2,
    guru_nama: "Asep Nugraha",
    kelas: "X TKJ 2",
    mata_pelajaran: "Dasar Jaringan",
    waktu_mulai: "09:30",
    waktu_selesai: "11:00",
    hari: "Senin",
  },
  {
    id: 3,
    guru_nama: "Rina Wulandari",
    kelas: "XI TKJ 1",
    mata_pelajaran: "Administrasi Sistem Jaringan",
    waktu_mulai: "08:00",
    waktu_selesai: "09:30",
    hari: "Senin",
  },
  {
    id: 4,
    guru_nama: "Rina Wulandari",
    kelas: "XI TBSM 1",
    mata_pelajaran: "Pemrograman Web",
    waktu_mulai: "10:00",
    waktu_selesai: "11:30",
    hari: "Senin",
  },
  {
    id: 5,
    guru_nama: "Siti Rahayu",
    kelas: "X TBSM 1",
    mata_pelajaran: "Sistem Operasi",
    waktu_mulai: "07:30",
    waktu_selesai: "09:00",
    hari: "Senin",
  },
  {
    id: 6,
    guru_nama: "Asep Nugraha",
    kelas: "X TKJ 1",
    mata_pelajaran: "Informatika",
    waktu_mulai: "13:00",
    waktu_selesai: "14:30",
    hari: "Selasa",
  },
  {
    id: 7,
    guru_nama: "Asep Nugraha",
    kelas: "X TKJ 2",
    mata_pelajaran: "Dasar Jaringan",
    waktu_mulai: "08:00",
    waktu_selesai: "09:30",
    hari: "Selasa",
  },
  {
    id: 8,
    guru_nama: "Rina Wulandari",
    kelas: "XI TKJ 1",
    mata_pelajaran: "Administrasi Sistem Jaringan",
    waktu_mulai: "10:00",
    waktu_selesai: "11:30",
    hari: "Selasa",
  },
  {
    id: 9,
    guru_nama: "Rina Wulandari",
    kelas: "XI TBSM 1",
    mata_pelajaran: "Pemrograman Web",
    waktu_mulai: "13:00",
    waktu_selesai: "14:30",
    hari: "Selasa",
  },
  {
    id: 10,
    guru_nama: "Siti Rahayu",
    kelas: "X TBSM 1",
    mata_pelajaran: "Sistem Operasi",
    waktu_mulai: "09:30",
    waktu_selesai: "11:00",
    hari: "Selasa",
  },
]

export const DUMMY_GURU_ACTIVITIES: GuruActivity[] = [
  {
    id: 1,
    guru_nama: "Asep Nugraha",
    action: "memublikasikan materi Konsep Dasar Informatika",
    icon: "book",
    timestamp: "2026-07-28T09:00:00Z",
  },
  {
    id: 2,
    guru_nama: "Asep Nugraha",
    action: "membuat tugas baru Topologi dan Protokol",
    icon: "clipboard",
    timestamp: "2026-07-28T08:30:00Z",
  },
  {
    id: 3,
    guru_nama: "Asep Nugraha",
    action: "5 siswa mengumpulkan tugas Dasar Jaringan",
    icon: "send",
    timestamp: "2026-07-28T08:00:00Z",
  },
  {
    id: 4,
    guru_nama: "Asep Nugraha",
    action: "memberikan penilaian pada tugas Topologi",
    icon: "award",
    timestamp: "2026-07-27T16:00:00Z",
  },
  {
    id: 5,
    guru_nama: "Asep Nugraha",
    action: "memperbarui materi Pengenalan Jaringan",
    icon: "book",
    timestamp: "2026-07-27T14:00:00Z",
  },
  {
    id: 6,
    guru_nama: "Rina Wulandari",
    action: "memublikasikan materi HTML dan CSS Dasar",
    icon: "book",
    timestamp: "2026-07-28T09:15:00Z",
  },
  {
    id: 7,
    guru_nama: "Rina Wulandari",
    action: "membuat tugas Proyek Akhir Website Portfolio",
    icon: "clipboard",
    timestamp: "2026-07-28T08:45:00Z",
  },
  {
    id: 8,
    guru_nama: "Rina Wulandari",
    action: "3 siswa mengumpulkan tugas HTML & CSS",
    icon: "send",
    timestamp: "2026-07-28T08:15:00Z",
  },
  {
    id: 9,
    guru_nama: "Rina Wulandari",
    action: "memberikan penilaian pada tugas DHCP Server",
    icon: "award",
    timestamp: "2026-07-27T15:30:00Z",
  },
  {
    id: 10,
    guru_nama: "Siti Rahayu",
    action: "memublikasikan materi Pengenalan Linux",
    icon: "book",
    timestamp: "2026-07-28T09:30:00Z",
  },
  {
    id: 11,
    guru_nama: "Siti Rahayu",
    action: "membuat tugas Perintah Dasar Terminal",
    icon: "clipboard",
    timestamp: "2026-07-28T08:00:00Z",
  },
  {
    id: 12,
    guru_nama: "Siti Rahayu",
    action: "2 siswa mengumpulkan tugas Linux",
    icon: "send",
    timestamp: "2026-07-27T14:00:00Z",
  },
]

export interface SiswaJadwal {
  id: number
  kelas: string
  mata_pelajaran: string
  guru_nama: string
  waktu_mulai: string
  waktu_selesai: string
  hari: string
}

export interface SiswaTugasStatus {
  tugas_id: number
  siswa_nama: string
  kelas: string
  status: "Belum Dikerjakan" | "Sudah Dikerjakan" | "Terlambat"
}

export const DUMMY_SISWA_JADWAL: SiswaJadwal[] = [
  {
    id: 1,
    kelas: "XI TKJ 1",
    mata_pelajaran: "Administrasi Sistem Jaringan",
    guru_nama: "Rina Wulandari",
    waktu_mulai: "07:30",
    waktu_selesai: "09:00",
    hari: "Senin",
  },
  {
    id: 2,
    kelas: "XI TKJ 1",
    mata_pelajaran: "Pemrograman Web",
    guru_nama: "Rina Wulandari",
    waktu_mulai: "09:30",
    waktu_selesai: "11:00",
    hari: "Senin",
  },
  {
    id: 3,
    kelas: "XI TKJ 1",
    mata_pelajaran: "Basis Data",
    guru_nama: "Budi Santoso",
    waktu_mulai: "12:30",
    waktu_selesai: "14:00",
    hari: "Senin",
  },
  {
    id: 4,
    kelas: "XI TKJ 1",
    mata_pelajaran: "Informatika",
    guru_nama: "Asep Nugraha",
    waktu_mulai: "07:30",
    waktu_selesai: "09:00",
    hari: "Selasa",
  },
  {
    id: 5,
    kelas: "XI TKJ 1",
    mata_pelajaran: "Administrasi Sistem Jaringan",
    guru_nama: "Rina Wulandari",
    waktu_mulai: "09:30",
    waktu_selesai: "11:00",
    hari: "Selasa",
  },
  {
    id: 6,
    kelas: "XI TKJ 1",
    mata_pelajaran: "Sistem Operasi",
    guru_nama: "Siti Rahayu",
    waktu_mulai: "13:00",
    waktu_selesai: "14:30",
    hari: "Selasa",
  },
]

export const DUMMY_SISWA_TUGAS_STATUS: SiswaTugasStatus[] = [
  { tugas_id: 2, siswa_nama: "Rizki Pratama", kelas: "XI TKJ 1", status: "Sudah Dikerjakan" },
  { tugas_id: 3, siswa_nama: "Rizki Pratama", kelas: "XI TKJ 1", status: "Sudah Dikerjakan" },
]
