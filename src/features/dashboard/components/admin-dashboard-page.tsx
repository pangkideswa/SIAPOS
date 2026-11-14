"use client"

import { useState } from "react"
import { 
  ResponsiveDialog, 
  ResponsiveDialogContent, 
  ResponsiveDialogHeader, 
  ResponsiveDialogTitle, 
  ResponsiveDialogDescription,
  ResponsiveDialogBody
} from "@/components/ui/responsive-dialog"

import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { motion } from "framer-motion"
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
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Monitor,
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
import { cn } from "@/lib/utils"

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
    book: <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />,
    clipboard: <ClipboardList className="h-4 w-4 text-orange" />,
    send: <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
    calendar: <BookOpenCheck className="h-4 w-4 text-primary" />,
    user: <Users className="h-4 w-4 text-primary" />,
    award: <GraduationCap className="h-4 w-4 text-primary" />,
  }
  return <>{iconMap[icon] ?? <Info className="h-4 w-4 text-muted-foreground" />}</>
}

function AnnouncementIcon({ kategori }: { kategori: string }) {
  const pinCategories = new Set(["Kegiatan Sekolah", "PKL", "Informasi Umum"])
  if (pinCategories.has(kategori))
    return <Megaphone className="h-4 w-4 text-rose-500" />
  return <Info className="h-4 w-4 text-primary" />
}

export function AdminDashboardPage() {
  const { user } = useAuth()
  const [isActivityOpen, setIsActivityOpen] = useState(false)

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
      subtext: "Pendidik aktif terdaftar",
      icon: GraduationCap,
      color: "text-primary",
      bg: "bg-primary/10",
      borderHover: "hover:border-primary/40",
      href: "/admin/guru",
    },
    {
      title: "Total Siswa",
      value: totalSiswa,
      subtext: "Siswa aktif belajar",
      icon: Users,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      borderHover: "hover:border-emerald-500/40",
      href: "/admin/siswa",
    },
    {
      title: "Total Kelas",
      value: totalKelas,
      subtext: "Rombongan belajar aktif",
      icon: School,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10",
      borderHover: "hover:border-purple-500/40",
      href: "/admin/classes",
    },
    {
      title: "Mata Pelajaran",
      value: totalMapel,
      subtext: "Kurikulum & silabus",
      icon: BookMarked,
      color: "text-orange",
      bg: "bg-orange/10",
      borderHover: "hover:border-orange/40",
      href: "/admin/subjects",
    },
    {
      title: "Total Materi",
      value: totalMateri,
      subtext: "Modul digital terunggah",
      icon: BookOpen,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
      borderHover: "hover:border-blue-500/40",
      href: "/admin/kelas-mengajar",
    },
    {
      title: "Total Tugas",
      value: totalTugas,
      subtext: "Penugasan & kuis siswa",
      icon: ClipboardList,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
      borderHover: "hover:border-amber-500/40",
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

  const quickActions = [
    { label: "Data Guru", desc: "Kelola akun & penugasan guru", href: "/admin/guru", icon: GraduationCap, color: "text-primary bg-primary/10 border-primary/20" },
    { label: "Data Siswa", desc: "Kelola peserta didik & NISN", href: "/admin/siswa", icon: Users, color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" },
    { label: "Rombel Kelas", desc: "Manajemen kelas & wali kelas", href: "/admin/classes", icon: School, color: "text-purple-600 bg-purple-500/10 border-purple-500/20" },
    { label: "Bank & Paket Soal", desc: "Kelola bank soal kurikulum", href: "/admin/bank-soal", icon: BookOpen, color: "text-orange bg-orange/10 border-orange/20" },
    { label: "Simulasi Tugas", desc: "Uji coba alur tugas siswa", href: "/admin/simulasi-tugas", icon: ClipboardList, color: "text-blue-600 bg-blue-500/10 border-blue-500/20" },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. HERO WELCOME BANNER (Atmospheric & Official System Acronym) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-card to-blue-500/10 border border-border/80 p-6 sm:p-8 backdrop-blur-xl shadow-lg shadow-black/5"
      >
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Pusat Kendali Administrator
              </span>
              <span className="px-3 py-1 rounded-full bg-card border border-border/80 text-xs font-bold text-foreground shadow-xs">
                T.A 2026/2027 • Semester Ganjil
              </span>
              <PengumumanBaruBadge role="admin" />
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
              Halo, {user?.name ?? "Administrator"} 👋
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Selamat datang di pusat kendali <strong>SIAPOS</strong> — Sistem Integrasi Akademik dan Pembelajaran Online Sekolah. Pantau seluruh aktivitas KBM, data master pengguna, dan asesmen secara real-time.
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <Link href="/guru/cbt" className="w-full sm:w-auto">
              <Button
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold h-11 px-5 rounded-2xl shadow-md shadow-primary/25 gap-2 active:scale-95 transition-all group"
              >
                <Monitor className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>Ruang Ujian CBT</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>

            <Link href="/admin/users" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-card/80 border-border/80 font-bold h-11 px-4 rounded-2xl gap-2 hover:bg-muted active:scale-95 transition-all"
              >
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Kelola Pengguna</span>
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 2. STATS CARDS (6 Master Data Counters) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06, duration: 0.35 }}
          >
            <Link
              href={stat.href}
              className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-3xl group"
            >
              <Card className={cn(
                "h-full rounded-3xl bg-card/85 dark:bg-card/90 border border-border/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 active:scale-[0.98] overflow-hidden relative",
                stat.borderHover
              )}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <CardContent className="p-4 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold text-muted-foreground truncate">
                      {stat.title}
                    </span>
                    <div className={cn(
                      "p-2 rounded-xl transition-transform group-hover:scale-110 shadow-inner",
                      stat.bg,
                      stat.color
                    )}>
                      <stat.icon className="h-4 w-4" />
                    </div>
                  </div>

                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors">
                      {stat.value}
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground font-medium mt-1 truncate">
                      {stat.subtext}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* 3. ROW 2: AKTIVITAS TERBARU & STATUS AKADEMIK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Aktivitas Terbaru (2/3 width) */}
        <Card className="lg:col-span-8 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-md shadow-black/5 overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Bell className="h-4 w-4" />
                  </div>
                  <span>Aktivitas Pengguna Real-Time</span>
                </CardTitle>
                <CardDescription className="text-xs font-medium mt-0.5">
                  Log aksi guru dan siswa di platform SIAPOS
                </CardDescription>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-bold rounded-full">
                {activities.length} Aktivitas
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="divide-y divide-border/60">
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 py-3.5 hover:bg-muted/40 px-3 -mx-3 rounded-2xl transition-colors">
                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-card border border-border/80 shadow-xs shrink-0 mt-0.5">
                    <ActivityIcon icon={activity.icon} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm leading-relaxed">
                      <strong className="text-foreground font-bold">{activity.user_name}</strong>{" "}
                      <span className="text-muted-foreground">{activity.action}</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground/80 mt-0.5 flex items-center gap-1 font-medium">
                      <Clock className="h-3 w-3" />
                      <span>{formatRelativeTime(activity.timestamp)}</span>
                    </p>
                  </div>
                </div>
              ))}

              {activities.length === 0 && (
                <div className="text-center py-10 px-4 text-xs sm:text-sm text-muted-foreground">
                  Belum ada log aktivitas pengguna hari ini.
                </div>
              )}

              {activities.length > 5 && (
                <div className="pt-3 flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsActivityOpen(true)}
                    className="rounded-xl border-border/80 text-xs font-bold h-9 px-4 gap-1.5 hover:bg-muted active:scale-95 transition-all"
                  >
                    <span>Lihat Semua Aktivitas ({activities.length})</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Modal Dialog Aktivitas Lengkap */}
        <ResponsiveDialog open={isActivityOpen} onOpenChange={setIsActivityOpen}>
          <ResponsiveDialogContent className="sm:max-w-[620px] rounded-3xl border-border/80">
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle className="text-lg font-black flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Semua Riwayat Aktivitas Sistem
              </ResponsiveDialogTitle>
              <ResponsiveDialogDescription className="text-xs font-medium">
                Log kronologis seluruh aktivitas pengumpulan tugas dan penerbitan materi di SIAPOS.
              </ResponsiveDialogDescription>
            </ResponsiveDialogHeader>
            <ResponsiveDialogBody className="space-y-0 p-2 max-h-[60vh] overflow-y-auto divide-y divide-border/60">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 py-3 px-3 rounded-2xl hover:bg-muted/40 transition-colors">
                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-card border border-border/80 shadow-xs shrink-0 mt-0.5">
                    <ActivityIcon icon={activity.icon} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm">
                      <span className="font-bold text-foreground">{activity.user_name}</span>{" "}
                      <span className="text-muted-foreground">{activity.action}</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground/80 mt-0.5 font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatRelativeTime(activity.timestamp)}</span>
                    </p>
                  </div>
                </div>
              ))}
            </ResponsiveDialogBody>
          </ResponsiveDialogContent>
        </ResponsiveDialog>

        {/* Status Akademik Sekolah (1/3 width) */}
        <Card className="lg:col-span-4 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-md shadow-black/5 overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600">
                <School className="h-4 w-4" />
              </div>
              <span>Status Akademik</span>
            </CardTitle>
            <CardDescription className="text-xs font-medium mt-0.5">
              Konfigurasi tahun ajaran aktif
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-border/60">
              <div className="space-y-0.5">
                <p className="text-[11px] text-muted-foreground font-medium">
                  Tahun Ajaran Aktif
                </p>
                <p className="text-sm font-black text-foreground">2026/2027</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[11px] font-bold">
                Aktif
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-border/60">
              <div className="space-y-0.5">
                <p className="text-[11px] text-muted-foreground font-medium">
                  Semester Berjalan
                </p>
                <p className="text-sm font-black text-foreground">Ganjil</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px] font-bold">
                Aktif
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-border/60">
              <div className="space-y-0.5">
                <p className="text-[11px] text-muted-foreground font-medium">
                  Rombongan Belajar
                </p>
                <p className="text-sm font-black text-foreground">
                  {kelasAktifNames} Rombel
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/20 text-[11px] font-bold">
                {allKelasMengajar.length} Penugasan
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. ROW 3: PENGUMUMAN SEKOLAH & AKSES CEPAT MASTER DATA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pengumuman Sekolah (2/3 width) */}
        <Card className="lg:col-span-8 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-md shadow-black/5 overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600">
                    <Megaphone className="h-4 w-4" />
                  </div>
                  <span>Pengumuman Sekolah</span>
                </CardTitle>
                <CardDescription className="text-xs font-medium mt-0.5">
                  Informasi & edaran resmi yang dipublikasikan
                </CardDescription>
              </div>
              <Link href="/admin/pengumuman">
                <Button variant="ghost" size="sm" className="text-xs font-bold text-primary hover:text-primary/90 h-8 rounded-xl gap-1">
                  Kelola Pengumuman
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="divide-y divide-border/60">
              {announcements.slice(0, 5).map((announcement) => (
                <div key={announcement.id} className="flex items-start gap-3 py-3.5 hover:bg-muted/40 px-3 -mx-3 rounded-2xl transition-colors">
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-xl shrink-0 mt-0.5 shadow-xs border",
                      KATEGORI_PENGUMUMAN_COLORS[announcement.kategori] || "bg-muted text-muted-foreground border-border"
                    )}
                  >
                    <AnnouncementIcon kategori={announcement.kategori} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-xs sm:text-sm font-bold text-foreground truncate">
                        {announcement.judul}
                      </p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                        {announcement.kategori}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-1.5">
                      {announcement.ringkasan}
                    </p>
                    <p className="text-[11px] text-muted-foreground/80 font-medium">
                      {announcement.penulis} &bull; {formatDate(announcement.tanggal_publish)}
                    </p>
                  </div>
                </div>
              ))}

              {announcements.length === 0 && (
                <div className="text-center py-10 px-4 text-xs sm:text-sm text-muted-foreground">
                  Belum ada pengumuman yang diterbitkan.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Action Navigation (1/3 width) */}
        <Card className="lg:col-span-4 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-md shadow-black/5 overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
              <div className="p-2 rounded-xl bg-orange/10 text-orange">
                <ClipboardList className="h-4 w-4" />
              </div>
              <span>Akses Cepat Master Data</span>
            </CardTitle>
            <CardDescription className="text-xs font-medium mt-0.5">
              Pintasan langsung ke modul penting
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-3 space-y-2">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href} className="block group">
                <div className="flex items-center justify-between p-3 rounded-2xl border border-border/80 bg-card hover:bg-muted/40 hover:border-primary/40 active:scale-[0.98] transition-all">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-xl border shadow-inner transition-transform group-hover:scale-110", action.color)}>
                      <action.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {action.label}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-medium truncate mt-0.5">
                        {action.desc}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
