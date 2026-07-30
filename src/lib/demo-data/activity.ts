export interface DemoActivity {
  id: number
  user_name: string
  user_role: "admin" | "guru" | "siswa" | "wali"
  action: string
  icon: string
  timestamp: string
}

export const DEMO_ACTIVITIES: DemoActivity[] = [
  {
    id: 1, user_name: "Budi Santoso", user_role: "guru",
    action: "menambahkan materi baru", icon: "book",
    timestamp: "2026-07-28T09:00:00Z",
  },
  {
    id: 2, user_name: "Siti Rahayu", user_role: "guru",
    action: "membuat tugas baru", icon: "clipboard",
    timestamp: "2026-07-28T08:30:00Z",
  },
  {
    id: 3, user_name: "Rizki Pratama", user_role: "siswa",
    action: "mengumpulkan tugas Topologi Jaringan", icon: "send",
    timestamp: "2026-07-28T08:00:00Z",
  },
  {
    id: 4, user_name: "Andi Wijaya", user_role: "guru",
    action: "memperbarui jadwal kelas mengajar", icon: "calendar",
    timestamp: "2026-07-27T16:00:00Z",
  },
  {
    id: 5, user_name: "Dewi Lestari", user_role: "siswa",
    action: "mengumpulkan tugas HTML & CSS", icon: "send",
    timestamp: "2026-07-27T14:00:00Z",
  },
  {
    id: 6, user_name: "Admin Utama", user_role: "admin",
    action: "menambahkan siswa baru", icon: "user",
    timestamp: "2026-07-27T10:00:00Z",
  },
  {
    id: 7, user_name: "Budi Santoso", user_role: "guru",
    action: "memberikan penilaian pada tugas Basis Data", icon: "award",
    timestamp: "2026-07-26T15:00:00Z",
  },
  {
    id: 8, user_name: "Siti Rahayu", user_role: "guru",
    action: "menerbitkan materi Linux", icon: "book",
    timestamp: "2026-07-26T09:00:00Z",
  },
  {
    id: 9, user_name: "Rina Wulandari", user_role: "guru",
    action: "memublikasikan materi HTML dan CSS Dasar", icon: "book",
    timestamp: "2026-07-28T09:15:00Z",
  },
  {
    id: 10, user_name: "Rina Wulandari", user_role: "guru",
    action: "membuat tugas Proyek Akhir Website Portfolio", icon: "clipboard",
    timestamp: "2026-07-28T08:45:00Z",
  },
  {
    id: 11, user_name: "Dian Permata", user_role: "admin",
    action: "memperbarui pengaturan sekolah", icon: "settings",
    timestamp: "2026-07-26T11:00:00Z",
  },
  {
    id: 12, user_name: "Asep Nugraha", user_role: "guru",
    action: "memublikasikan materi Konsep Dasar Informatika", icon: "book",
    timestamp: "2026-07-28T09:00:00Z",
  },
  {
    id: 13, user_name: "Asep Nugraha", user_role: "guru",
    action: "membuat tugas baru Topologi dan Protokol", icon: "clipboard",
    timestamp: "2026-07-28T08:30:00Z",
  },
  {
    id: 14, user_name: "Putri Wulandari", user_role: "siswa",
    action: "mengumpulkan tugas JavaScript Dasar", icon: "send",
    timestamp: "2026-07-27T09:00:00Z",
  },
]
