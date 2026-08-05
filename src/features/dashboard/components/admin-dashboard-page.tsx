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
  GraduationCap,
  Users,
  School,
  BookMarked,
  BookOpen,
  ClipboardList,
  Bell,
  Megaphone,
  Info,
  ChevronRight,
  BookOpenCheck,
  FileSpreadsheet,
} from "lucide-react"
import { useTeachers } from "@/hooks/use-teachers"
import { useStudents } from "@/hooks/use-students"
import { useTeachingClasses } from "@/hooks/use-teaching-classes"
import { useMaterials } from "@/hooks/use-materials"
import { useAssignments } from "@/hooks/use-assignments"
import { useSubmissions } from "@/hooks/use-submissions"
import { useAnnouncements } from "@/hooks/use-announcements"
import { useNilai } from "@/hooks/use-nilai"
import { KATEGORI_PENGUMUMAN_COLORS } from "@/features/pengumuman/constants/pengumuman.constants"
import { PengumumanBaruBadge } from "@/features/pengumuman/components/pengumuman-baru-badge"

type AdminActivity = {
  id: string
  icon: string
  user_name: string
  action: string
  timestamp: string
}

function getUniqueCount<T>(items: T[], key: keyof T): number {
  return new Set(items.map((item) => item[key])).size
}

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
  return time.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  })
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
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
    calendar: <BookOpenCheck className="h-4 w-4" />,
    user: <Users className="h-4 w-4" />,
    award: <GraduationCap className="h-4 w-4" />,
  }
  return <>{iconMap[icon] ?? <Info className="h-4 w-4" />}</>
}

function AnnouncementIcon({ kategori }: { kategori: string }) {
  const pinCategories = new Set(["Kegiatan Sekolah", "PKL", "Informasi Umum"])
  if (pinCategories.has(kategori))
    return <Megaphone className="h-4 w-4 text-red-500" />
  return <Info className="h-4 w-4 text-primary" />
}

export function AdminDashboardPage() {
  const { user } = useAuth()

  const { data: teachers } = useTeachers()
  const { data: students } = useStudents()
  const { data: teachingClasses } = useTeachingClasses()
  const { data: materials } = useMaterials()
  const { data: assignments } = useAssignments()
  const { data: submissions } = useSubmissions()
  const { data: announcementsData } = useAnnouncements()
  const { data: nilaiData } = useNilai()

  const allKelasMengajar = teachingClasses ?? []
  const totalGuru = (teachers ?? []).length
  const totalSiswa = (students ?? []).filter((s) => s.status === "Aktif").length
  const totalKelas = getUniqueCount(allKelasMengajar, "kelas")
  const totalMapel = getUniqueCount(allKelasMengajar, "mata_pelajaran")
  const totalMateri = (materials ?? []).length
  const totalTugas = (assignments ?? []).length

  const stats = [
    {
      title: "Total Guru",
      value: totalGuru,
      icon: GraduationCap,
      color: "text-primary",
      bg: "bg-primary/10",
      href: "/admin/guru",
    },
    {
      title: "Total Siswa",
      value: totalSiswa,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
      href: "/admin/siswa",
    },
    {
      title: "Total Kelas",
      value: totalKelas,
      icon: School,
      color: "text-primary",
      bg: "bg-primary/10",
      href: "/admin/classes",
    },
    {
      title: "Mata Pelajaran",
      value: totalMapel,
      icon: BookMarked,
      color: "text-orange-500",
      bg: "bg-orange-50",
      href: "/admin/kelas-mengajar",
    },
    {
      title: "Total Materi",
      value: totalMateri,
      icon: BookOpen,
      color: "text-orange-500",
      bg: "bg-orange-50",
      href: "/admin/kelas-mengajar",
    },
    {
      title: "Total Tugas",
      value: totalTugas,
      icon: ClipboardList,
      color: "text-orange-500",
      bg: "bg-orange-50",
      href: "/admin/kelas-mengajar",
    },
  ]

  const kelasAktif = allKelasMengajar.filter((k) => k.status === "Aktif")
  const kelasAktifNames = new Set(kelasAktif.map((k) => k.kelas)).size

  const judulTugasMap = new Map((assignments ?? []).map((t) => [t.id, t.judul]))
  const activities: AdminActivity[] = [
    ...(submissions ?? [])
      .filter((s) => s.waktu_pengumpulan)
      .map((s) => ({
        id: `submission-${s.id}`,
        icon: "send",
        user_name: s.siswa_nama,
        action: `mengumpulkan tugas: ${judulTugasMap.get(s.tugas_id) ?? "Tugas"}`,
        timestamp: s.waktu_pengumpulan ?? "",
      })),
    ...(materials ?? []).map((m) => ({
      id: `material-${m.id}`,
      icon: "book",
      user_name: m.guru_nama,
      action: `menambahkan materi: ${m.judul}`,
      timestamp: m.created_at,
    })),
    ...(assignments ?? []).map((t) => ({
      id: `assignment-${t.id}`,
      icon: "clipboard",
      user_name: t.guru_nama,
      action: `membuat tugas: ${t.judul}`,
      timestamp: t.created_at,
    })),
  ].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
  const announcements = announcementsData ?? []
  const semuaNilai = nilaiData ?? []

  const quickActions = [
    { label: "Guru", href: "/admin/guru", icon: GraduationCap, color: "bg-primary/10 text-primary hover:bg-primary/20" },
    { label: "Siswa", href: "/admin/siswa", icon: Users, color: "bg-primary/10 text-primary hover:bg-primary/20" },
    { label: "Kelas", href: "/admin/classes", icon: School, color: "bg-orange-50 text-orange-500 hover:bg-orange-100" },
    { label: "Materi", href: "/admin/kelas-mengajar", icon: BookOpen, color: "bg-orange-50 text-orange-500 hover:bg-orange-100" },
    { label: "Tugas", href: "/admin/kelas-mengajar", icon: ClipboardList, color: "bg-primary/10 text-primary hover:bg-primary/20" },
  ]

  return (
    <div className="space-y-6">
      {/* Section 1: Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Halo, {user?.name ?? "Admin"} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Selamat datang di{" "}
            <span className="font-semibold text-foreground">SIAPOS</span>.
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Sistem Integrasi Akademik dan Pembelajaran Online Sekolah.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <Bell className="h-4 w-4" />
          <span>
            {announcements.length} pengumuman
          </span>
        </div>
        <PengumumanBaruBadge role="admin" />
      </div>

      {/* Section 2: Statistik */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
            <Card className="h-full transition-colors hover:border-primary/40">
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
          </Link>
        ))}
      </div>

      {/* Statistik Input Nilai */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <Card size="sm">
          <CardContent className="flex items-center gap-3 p-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100 text-blue-600 shrink-0">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Nilai</p>
              <p className="text-lg font-bold">{semuaNilai.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 p-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-green-100 text-green-600 shrink-0">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Data Lengkap</p>
              <p className="text-lg font-bold">{semuaNilai.filter((n) => n.status === "Lengkap").length}</p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 p-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-yellow-100 text-yellow-600 shrink-0">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Belum Lengkap</p>
              <p className="text-lg font-bold">{semuaNilai.filter((n) => n.status === "Belum Lengkap").length}</p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 p-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-purple-100 text-purple-600 shrink-0">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Guru Penginput</p>
              <p className="text-lg font-bold">{new Set(semuaNilai.map((n) => n.guru_nama)).size}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 3 & 4: Aktivitas Terbaru + Status Akademik */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section 3: Aktivitas Terbaru */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Aktivitas Terbaru
                </CardTitle>
                <CardDescription>
                  Riwayat aktivitas pengguna di sistem
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {activities.length} aktivitas
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {activities.map((activity, index) => (
                <div key={activity.id}>
                  <div className="flex items-start gap-3 py-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted shrink-0 mt-0.5">
                      <ActivityIcon icon={activity.icon} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-semibold">
                          {activity.user_name}
                        </span>{" "}
                        <span className="text-muted-foreground">
                          {activity.action}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                  {index < activities.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Status Akademik */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5" />
              Status Akademik
            </CardTitle>
            <CardDescription>Informasi tahun ajaran aktif</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground">
                  Tahun Ajaran Aktif
                </p>
                <p className="text-sm font-semibold">2026/2027</p>
              </div>
              <Badge variant="outline">Aktif</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground">
                  Semester Aktif
                </p>
                <p className="text-sm font-semibold">Ganjil</p>
              </div>
              <Badge variant="outline">Aktif</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground">
                  Jumlah Kelas Aktif
                </p>
                <p className="text-sm font-semibold">
                  {kelasAktifNames} kelas
                </p>
              </div>
              <Badge variant="outline">
                {allKelasMengajar.length} penugasan
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 5 & 6: Pengumuman + Quick Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section 5: Pengumuman */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5" />
                  Pengumuman
                </CardTitle>
                <CardDescription>
                  Informasi dan pengumuman terbaru
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {announcements.length} pengumuman
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {announcements.map((announcement, index) => (
                <div key={announcement.id}>
                  <div className="flex items-start gap-3 py-3">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 mt-0.5 ${KATEGORI_PENGUMUMAN_COLORS[announcement.kategori]}`}
                    >
                      <AnnouncementIcon kategori={announcement.kategori} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <p className="text-sm font-semibold">
                          {announcement.judul}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5"
                        >
                          {announcement.kategori}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {announcement.ringkasan}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {announcement.penulis} &middot;{" "}
                        {formatDate(announcement.tanggal_publish)}
                      </p>
                    </div>
                  </div>
                  {index < announcements.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
                      <div
                        className={`p-2 rounded-lg ${action.color}`}
                      >
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
      </div>
    </div>
  )
}
