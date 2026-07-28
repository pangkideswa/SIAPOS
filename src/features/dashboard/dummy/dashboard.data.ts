export interface DashboardActivity {
  id: number
  user_name: string
  user_role: "admin" | "guru" | "siswa" | "wali"
  action: string
  icon: string
  timestamp: string
}

export interface DashboardAnnouncement {
  id: number
  title: string
  description: string
  date: string
  type: "info" | "warning" | "urgent"
}

export const DUMMY_ACTIVITIES: DashboardActivity[] = [
  {
    id: 1,
    user_name: "Budi Santoso",
    user_role: "guru",
    action: "menambahkan materi baru",
    icon: "book",
    timestamp: "2026-07-28T09:00:00Z",
  },
  {
    id: 2,
    user_name: "Siti Rahayu",
    user_role: "guru",
    action: "membuat tugas baru",
    icon: "clipboard",
    timestamp: "2026-07-28T08:30:00Z",
  },
  {
    id: 3,
    user_name: "Rizki Pratama",
    user_role: "siswa",
    action: "mengumpulkan tugas Topologi Jaringan",
    icon: "send",
    timestamp: "2026-07-28T08:00:00Z",
  },
  {
    id: 4,
    user_name: "Andi Wijaya",
    user_role: "guru",
    action: "memperbarui jadwal kelas mengajar",
    icon: "calendar",
    timestamp: "2026-07-27T16:00:00Z",
  },
  {
    id: 5,
    user_name: "Dewi Lestari",
    user_role: "siswa",
    action: "mengumpulkan tugas HTML & CSS",
    icon: "send",
    timestamp: "2026-07-27T14:00:00Z",
  },
  {
    id: 6,
    user_name: "Admin Utama",
    user_role: "admin",
    action: "menambahkan siswa baru",
    icon: "user",
    timestamp: "2026-07-27T10:00:00Z",
  },
  {
    id: 7,
    user_name: "Budi Santoso",
    user_role: "guru",
    action: "memberikan penilaian pada tugas Basis Data",
    icon: "award",
    timestamp: "2026-07-26T15:00:00Z",
  },
  {
    id: 8,
    user_name: "Siti Rahayu",
    user_role: "guru",
    action: "menerbitkan materi Linux",
    icon: "book",
    timestamp: "2026-07-26T09:00:00Z",
  },
]

export const DUMMY_ANNOUNCEMENTS: DashboardAnnouncement[] = [
  {
    id: 1,
    title: "Tahun Ajaran 2026/2027 Dimulai",
    description:
      "Selamat datang di tahun ajaran baru 2026/2027. Pastikan seluruh data siswa dan guru sudah terupdate.",
    date: "2026-07-15",
    type: "info",
  },
  {
    id: 2,
    title: "Pengisian Rapor Semester Genap",
    description:
      "Pengisian rapor semester genap dibuka hingga 31 Juli 2026. Mohon segera lengkapi penilaian.",
    date: "2026-07-20",
    type: "warning",
  },
  {
    id: 3,
    title: "Pemeliharaan Sistem",
    description:
      "SIAPOS akan mengalami pemeliharaan pada hari Sabtu, 1 Agustus 2026 pukul 22:00 - 02:00 WIB.",
    date: "2026-07-25",
    type: "urgent",
  },
  {
    id: 4,
    title: "Workshop Penggunaan SIAPOS",
    description:
      "Workshop penggunaan SIAPOS untuk seluruh guru akan diadakan pada 5 Agustus 2026.",
    date: "2026-07-22",
    type: "info",
  },
]
