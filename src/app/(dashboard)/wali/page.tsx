"use client"

import { useAuth } from "@/contexts/auth-context"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Users, ClipboardList, TrendingUp, AlertTriangle } from "lucide-react"

const stats = [
  {
    title: "Siswa di Kelas",
    value: "36",
    description: "Kelas X RPL 1",
    icon: Users,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Rata-rata Nilai",
    value: "78.2",
    description: "Semua mata pelajaran",
    icon: TrendingUp,
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    title: "Tugas Aktif",
    value: "8",
    description: "Belum dikumpulkan siswa",
    icon: ClipboardList,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Peringatan",
    value: "3",
    description: "Siswa perlu perhatian",
    icon: AlertTriangle,
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
]

const siswaList = [
  { name: "Ahmad Rizky", nisn: "2024001", rata: 85.5, status: "Aktif" },
  { name: "Siti Nurhaliza", nisn: "2024002", rata: 92.3, status: "Aktif" },
  { name: "Budi Santoso", nisn: "2024003", rata: 67.8, status: "Perlu Perhatian" },
  { name: "Dewi Lestari", nisn: "2024004", rata: 88.1, status: "Aktif" },
  { name: "Eko Prasetyo", nisn: "2024005", rata: 55.2, status: "Perlu Perhatian" },
]

const jadwalHariIni = [
  { mapel: "Pemrograman Web", guru: "Pak Budi", time: "08:00 - 09:30", kelas: "X RPL 1" },
  { mapel: "Basis Data", guru: "Bu Sari", time: "10:00 - 11:30", kelas: "X RPL 1" },
  { mapel: "Pemrograman Mobile", guru: "Pak Andi", time: "13:00 - 14:30", kelas: "X RPL 1" },
]

export default function WaliDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Dashboard Wali Kelas
        </h1>
        <p className="text-muted-foreground">
          Selamat datang kembali, {user?.name}. Pantau perkembangan siswa kelas Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Daftar Siswa</CardTitle>
            <CardDescription>Siswa kelas X RPL 1</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {siswaList.map((siswa) => (
                <div
                  key={siswa.nisn}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{siswa.name}</p>
                    <p className="text-xs text-muted-foreground">NISN: {siswa.nisn}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{siswa.rata}</p>
                    <p className={`text-xs ${
                      siswa.status === "Aktif"
                        ? "text-emerald-600"
                        : "text-orange-600"
                    }`}>
                      {siswa.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jadwal Hari Ini</CardTitle>
            <CardDescription>Jadwal kelas X RPL 1</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {jadwalHariIni.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{item.mapel}</p>
                    <p className="text-xs text-muted-foreground">{item.guru}</p>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rekap Nilai Mingguan</CardTitle>
          <CardDescription>Ringkasan nilai siswa minggu ini</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { mapel: "Pemrograman Web", rata: 82.5, tugas: 4 },
              { mapel: "Basis Data", rata: 76.3, tugas: 3 },
              { mapel: "Pemrograman Mobile", rata: 79.8, tugas: 5 },
              { mapel: "Bahasa Indonesia", rata: 85.2, tugas: 2 },
            ].map((item) => (
              <div key={item.mapel} className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">{item.mapel}</p>
                <p className="text-xl font-bold text-foreground">{item.rata}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {item.tugas} tugas
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
