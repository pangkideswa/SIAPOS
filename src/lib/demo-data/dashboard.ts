import { DEMO_ACTIVITIES, type DemoActivity } from "./activity"

export interface DashboardCounter {
  label: string
  value: number
  icon: string
  trend: "up" | "down" | "neutral"
  percentage: number
}

export function getAdminCounters(): DashboardCounter[] {
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const recent = DEMO_ACTIVITIES.filter(
    (a) => new Date(a.timestamp) > weekAgo
  )

  return [
    { label: "Total Guru", value: 8, icon: "users", trend: "up", percentage: 12 },
    { label: "Total Siswa", value: 120, icon: "graduation-cap", trend: "up", percentage: 8 },
    { label: "Kelas Aktif", value: 10, icon: "book-open", trend: "neutral", percentage: 0 },
    { label: "Aktivitas Baru", value: recent.length, icon: "activity", trend: "up", percentage: 25 },
  ]
}

export function getGuruCounters(guruName: string): DashboardCounter[] {
  const myActivities = DEMO_ACTIVITIES.filter(
    (a) => a.user_role === "guru" && a.user_name === guruName
  )

  return [
    { label: "Kelas Saya", value: 3, icon: "book-open", trend: "neutral", percentage: 0 },
    { label: "Total Siswa", value: 22, icon: "users", trend: "up", percentage: 5 },
    { label: "Tugas Aktif", value: 4, icon: "clipboard", trend: "up", percentage: 33 },
    { label: "Aktivitas Baru", value: myActivities.length, icon: "activity", trend: "up", percentage: 20 },
  ]
}

export function getSiswaCounters(namaSiswa: string): DashboardCounter[] {
  const myActivities = DEMO_ACTIVITIES.filter(
    (a) => a.user_role === "siswa" && a.user_name === namaSiswa
  )

  return [
    { label: "Tugas Saya", value: 6, icon: "clipboard", trend: "neutral", percentage: 0 },
    { label: "Selesai", value: 4, icon: "check-circle", trend: "up", percentage: 15 },
    { label: "Belum Dikerjakan", value: 2, icon: "clock", trend: "down", percentage: 10 },
    { label: "Aktivitas Baru", value: myActivities.length, icon: "activity", trend: "up", percentage: 30 },
  ]
}

export function getRecentActivities(
  role?: "admin" | "guru" | "siswa",
  limit = 6
): DemoActivity[] {
  let filtered = DEMO_ACTIVITIES
  if (role) {
    filtered = filtered.filter((a) => a.user_role === role)
  }
  return filtered
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)
}
