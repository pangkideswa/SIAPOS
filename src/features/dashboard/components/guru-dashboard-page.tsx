"use client"

import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  BookOpen,
  Users,
  ClipboardList,
  GraduationCap,
  Calendar,
  Clock,
  ChevronRight,
  BookMarked,
  Award,
  Megaphone,
  AlertTriangle,
  Info,
  Bell,
} from "lucide-react"
import { DUMMY_KELAS_MENGAJAR } from "@/features/kelas-mengajar/dummy/kelas-mengajar.data"
import { DUMMY_MATERI } from "@/features/materi/dummy/materi.data"
import { DUMMY_TUGAS } from "@/features/tugas/dummy/tugas.data"
import { DUMMY_PENGUMPULAN } from "@/features/pengumpulan/dummy/pengumpulan.data"
import {
  DUMMY_GURU_JADWAL,
  DUMMY_GURU_ACTIVITIES,
  DUMMY_ANNOUNCEMENTS,
} from "@/features/dashboard/dummy/dashboard.data"

const GURU_NAME = "Asep Nugraha"

function formatRelativeTime(timestamp: string): string {
  const now = new Date()
  const time = new Date(timestamp)
  const diffMs = now.getTime() - time.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffMin < 1) return "Baru saja"
  if (diffMin < 60) return `${diffMin} menit lalu`
  if (diffHour < 24) return `${diffHour} jam lalu`
  if (diffDay < 7) return `${diffDay} hari lalu`
  return time.toLocaleDateString("id-ID", { day: "numeric", month: "short" })
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function getTodayIndonesian(): string {
  return new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function ActivityIcon({ icon }: { icon: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    book: <BookOpen className="h-4 w-4" />,
    clipboard: <ClipboardList className="h-4 w-4" />,
    send: <ClipboardList className="h-4 w-4" />,
    calendar: <Calendar className="h-4 w-4" />,
    user: <Users className="h-4 w-4" />,
    award: <Award className="h-4 w-4" />,
  }
  return <>{iconMap[icon] ?? <Info className="h-4 w-4" />}</>
}

function AnnouncementIcon({ type }: { type: string }) {
  if (type === "warning")
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />
  if (type === "urgent")
    return <Megaphone className="h-4 w-4 text-red-500" />
  return <Info className="h-4 w-4 text-primary" />
}

export function GuruDashboardPage() {
  const { user } = useAuth()
  const guruName = user?.name ?? GURU_NAME

  const kelasMengajar = DUMMY_KELAS_MENGAJAR.filter(
    (k) => k.guru_nama === guruName && k.status === "Aktif"
  )
  const uniqueMapel = new Set(kelasMengajar.map((k) => k.mata_pelajaran))
  const tugasByGuru = DUMMY_TUGAS.filter((t) => t.guru_nama === guruName)
  const tugasAktif = tugasByGuru.filter((t) => t.status === "Dipublikasikan")
  const tugasBelumDinilai = DUMMY_PENGUMPULAN.filter(
    (p) =>
      tugasByGuru.some((t) => t.id === p.tugas_id) &&
      p.nilai === null &&
      p.status === "Sudah Mengumpulkan"
  )
  const materiByGuru = DUMMY_MATERI.filter((m) => m.guru_nama === guruName)
  const allSiswaInKelas = new Set(
    kelasMengajar.flatMap((k) => {
      const siswaList: string[] = []
      if (k.kelas === "X TKJ 1") siswaList.push("Rizki", "Dewi", "Fajar")
      if (k.kelas === "X TKJ 2") siswaList.push("Ahmad", "Putri", "Andi")
      return siswaList
    })
  )

  const stats = [
    {
      title: "Kelas Mengajar",
      value: kelasMengajar.length,
      icon: BookOpen,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Mata Pelajaran",
      value: uniqueMapel.size,
      icon: BookMarked,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Materi Dibuat",
      value: materiByGuru.length,
      icon: GraduationCap,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      title: "Tugas Aktif",
      value: tugasAktif.length,
      icon: ClipboardList,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      title: "Belum Dinilai",
      value: tugasBelumDinilai.length,
      icon: Award,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      title: "Total Siswa",
      value: allSiswaInKelas.size,
      icon: Users,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
  ]

  const guruActivities = DUMMY_GURU_ACTIVITIES.filter(
    (a) => a.guru_nama === guruName
  )

  const todayHari = new Date().toLocaleDateString("id-ID", { weekday: "long" })
  const jadwalHariIni = DUMMY_GURU_JADWAL.filter(
    (j) => j.guru_nama === guruName && j.hari === todayHari
  )

  const tugasUntukDinilai = tugasByGuru
    .filter((t) => t.status === "Dipublikasikan" || t.status === "Ditutup")
    .map((t) => {
      const pengumpulan = DUMMY_PENGUMPULAN.filter((p) => p.tugas_id === t.id)
      const sudahMengumpulkan = pengumpulan.filter(
        (p) => p.status === "Sudah Mengumpulkan" || p.status === "Terlambat"
      ).length
      return {
        id: t.id,
        judul: t.judul,
        kelas: t.kelas,
        jumlah_pengumpulan: `${sudahMengumpulkan}/${pengumpulan.length}`,
        deadline: t.tenggat_waktu,
        status: t.status,
      }
    })

  const quickActions = [
    {
      label: "Tambah Materi",
      href: "/guru/materi",
      icon: BookOpen,
      color: "bg-primary/10 text-primary hover:bg-primary/20",
    },
    {
      label: "Buat Tugas",
      href: "/guru/tugas",
      icon: ClipboardList,
      color: "bg-primary/10 text-primary hover:bg-primary/20",
    },
    {
      label: "Lihat Penilaian",
      href: "/guru/penilaian",
      icon: Award,
      color: "bg-orange-50 text-orange-500 hover:bg-orange-100",
    },
    {
      label: "Lihat Kelas Mengajar",
      href: "/guru/kelas",
      icon: GraduationCap,
      color: "bg-orange-50 text-orange-500 hover:bg-orange-100",
    },
  ]

  const announcementTypeColors: Record<string, string> = {
    info: "bg-primary/10 text-primary",
    warning: "bg-yellow-50 text-yellow-600",
    urgent: "bg-red-50 text-red-600",
  }

  const announcementBadgeVariants: Record<
    string,
    "default" | "secondary" | "outline" | "destructive"
  > = {
    info: "default",
    warning: "secondary",
    urgent: "destructive",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Halo, {guruName} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Selamat datang kembali di{" "}
            <span className="font-semibold text-foreground">SIAPOS</span>.
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Hari ini adalah {getTodayIndonesian()}.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <Bell className="h-4 w-4" />
          <span>{DUMMY_ANNOUNCEMENTS.length} pengumuman</span>
        </div>
      </div>

      {/* Section 1: Ringkasan */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground">
                  {stat.title}
                </span>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Section 2 & 3: Kelas Mengajar + Tugas Perlu Dinilai */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section 2: Kelas Mengajar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Kelas Mengajar
                </CardTitle>
                <CardDescription>Daftar kelas yang Anda ampu</CardDescription>
              </div>
              <Badge variant="secondary">{kelasMengajar.length} kelas</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {kelasMengajar.map((kelas) => (
                <Link key={kelas.id} href="/guru/kelas">
                  <div className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
                    <p className="text-sm font-semibold">{kelas.kelas}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {kelas.mata_pelajaran}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Tugas yang Perlu Dinilai */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Tugas yang Perlu Dinilai
                </CardTitle>
                <CardDescription>
                  Pengumpulan tugas dari siswa
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {tugasBelumDinilai.length} belum dinilai
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Judul Tugas
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                      Kelas
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Pengumpulan
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                      Deadline
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tugasUntukDinilai.map((tugas, index) => (
                    <tr
                      key={tugas.id}
                      className={
                        index < tugasUntukDinilai.length - 1
                          ? "border-b border-border"
                          : ""
                      }
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium">{tugas.judul}</p>
                        <p className="text-xs text-muted-foreground sm:hidden">
                          {tugas.kelas}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <Badge variant="outline">{tugas.kelas}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium">
                          {tugas.jumlah_pengumpulan}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-muted-foreground">
                          {formatDateShort(tugas.deadline)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/guru/pengumpulan/${tugas.id}`}>
                          <Button variant="ghost" size="sm">
                            Nilai
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {tugasUntukDinilai.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-muted-foreground"
                      >
                        Tidak ada tugas yang perlu dinilai
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 4 & 5: Aktivitas Terbaru + Jadwal Hari Ini */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section 4: Aktivitas Terbaru */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Aktivitas Terbaru
                </CardTitle>
                <CardDescription>Riwayat aktivitas Anda</CardDescription>
              </div>
              <Badge variant="secondary">
                {guruActivities.length} aktivitas
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {guruActivities.map((activity, index) => (
                <div key={activity.id}>
                  <div className="flex items-start gap-3 py-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted shrink-0 mt-0.5">
                      <ActivityIcon icon={activity.icon} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="text-muted-foreground">
                          {activity.action}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                  {index < guruActivities.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Jadwal Hari Ini */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Jadwal Hari Ini
            </CardTitle>
            <CardDescription>
              {todayHari}, {getTodayIndonesian()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {jadwalHariIni.length > 0 ? (
              <div className="space-y-3">
                {jadwalHariIni.map((jadwal) => (
                  <div
                    key={jadwal.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex flex-col items-center shrink-0">
                      <span className="text-xs font-semibold text-primary">
                        {jadwal.waktu_mulai}
                      </span>
                      <div className="w-px h-3 bg-border" />
                      <span className="text-xs text-muted-foreground">
                        {jadwal.waktu_selesai}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{jadwal.kelas}</p>
                      <p className="text-xs text-muted-foreground">
                        {jadwal.mata_pelajaran}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground">
                Tidak ada jadwal hari ini
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Section 6 & 7: Quick Action + Pengumuman */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section 6: Quick Action */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Quick Action
            </CardTitle>
            <CardDescription>Akses cepat ke menu utama</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Link key={action.label} href={action.href}>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-auto py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <action.icon className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{action.label}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section 7: Pengumuman */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5" />
                  Pengumuman
                </CardTitle>
                <CardDescription>
                  Informasi dan pengumuman terbaru dari sekolah
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {DUMMY_ANNOUNCEMENTS.length} pengumuman
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {DUMMY_ANNOUNCEMENTS.map((announcement, index) => (
                <div key={announcement.id}>
                  <div className="flex items-start gap-3 py-3">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 mt-0.5 ${announcementTypeColors[announcement.type]}`}
                    >
                      <AnnouncementIcon type={announcement.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold">
                          {announcement.title}
                        </p>
                        <Badge
                          variant={
                            announcementBadgeVariants[announcement.type]
                          }
                          className="text-[10px] px-1.5"
                        >
                          {announcement.type === "info"
                            ? "Info"
                            : announcement.type === "warning"
                              ? "Peringatan"
                              : "Penting"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {announcement.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(announcement.date)}
                      </p>
                    </div>
                  </div>
                  {index < DUMMY_ANNOUNCEMENTS.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
