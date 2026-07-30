export interface DemoAnnouncement {
  id: number
  title: string
  description: string
  date: string
  type: "info" | "warning" | "urgent"
  targetRole?: "admin" | "guru" | "siswa" | "semua"
}

export const DEMO_ANNOUNCEMENTS: DemoAnnouncement[] = [
  {
    id: 1,
    title: "Tahun Ajaran 2026/2027 Dimulai",
    description: "Selamat datang di tahun ajaran baru 2026/2027. Pastikan seluruh data siswa dan guru sudah terupdate.",
    date: "2026-07-15",
    type: "info",
    targetRole: "semua",
  },
  {
    id: 2,
    title: "Pengisian Rapor Semester Genap",
    description: "Pengisian rapor semester genap dibuka hingga 31 Juli 2026. Mohon segera lengkapi penilaian.",
    date: "2026-07-20",
    type: "warning",
    targetRole: "guru",
  },
  {
    id: 3,
    title: "Pemeliharaan Sistem",
    description: "SIAPOS akan mengalami pemeliharaan pada hari Sabtu, 1 Agustus 2026 pukul 22:00 - 02:00 WIB.",
    date: "2026-07-25",
    type: "urgent",
    targetRole: "semua",
  },
  {
    id: 4,
    title: "Workshop Penggunaan SIAPOS",
    description: "Workshop penggunaan SIAPOS untuk seluruh guru akan diadakan pada 5 Agustus 2026.",
    date: "2026-07-22",
    type: "info",
    targetRole: "guru",
  },
  {
    id: 5,
    title: "Jadwal UTS Ganjil 2026/2027",
    description: "UTS Ganjil akan dilaksanakan pada 21-25 September 2026. Persiapkan diri dengan baik.",
    date: "2026-08-01",
    type: "info",
    targetRole: "siswa",
  },
  {
    id: 6,
    title: "Perubahan Jadwal Pelajaran",
    description: "Jadwal pelajaran untuk kelas X mengalami perubahan. Cek jadwal terbaru di menu Jadwal Pelajaran.",
    date: "2026-07-28",
    type: "warning",
    targetRole: "siswa",
  },
]

export function getAnnouncementsByRole(
  role: "admin" | "guru" | "siswa" | "wali"
): DemoAnnouncement[] {
  return DEMO_ANNOUNCEMENTS.filter(
    (a) => a.targetRole === "semua" || a.targetRole === role
  )
}
