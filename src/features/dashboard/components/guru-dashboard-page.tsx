"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
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
import {
  BookOpen,
  ClipboardList,
  Calendar,
  ChevronRight,
  Award,
  Megaphone,
  Send,
  GraduationCap,
  Pin,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Monitor,
} from "lucide-react"
import { useTeachingClasses } from "@/hooks/use-teaching-classes"
import { useMaterials } from "@/hooks/use-materials"
import { useAssignments } from "@/hooks/use-assignments"
import { useSubmissions } from "@/hooks/use-submissions"
import { useSchedules } from "@/hooks/use-schedules"
import { useAnnouncements } from "@/hooks/use-announcements"
import { filterPengumumanByRole } from "@/features/pengumuman/lib/pengumuman-helpers"
import { KATEGORI_PENGUMUMAN_COLORS } from "@/features/pengumuman/constants/pengumuman.constants"
import { formatDateID } from "@/features/kalender-akademik/components/kalender-helpers"
import { PengumumanBaruBadge } from "@/features/pengumuman/components/pengumuman-baru-badge"
import { cn } from "@/lib/utils"

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

function SubmissionStatusBadge({ status }: { status: string }) {
  if (status === "Sudah Mengumpulkan") {
    return (
      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold shrink-0 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
        Terkumpul
      </span>
    )
  }
  if (status === "Terlambat") {
    return (
      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold shrink-0 bg-rose-500/10 text-rose-600 border-rose-500/20">
        Terlambat
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium shrink-0 bg-muted text-muted-foreground border-border">
      {status}
    </span>
  )
}

export function GuruDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const guruName = user?.name ?? GURU_NAME
  const todayHari = new Date().toLocaleDateString("id-ID", { weekday: "long" })

  const { data: kelasMengajarData } = useTeachingClasses()
  const { data: materiData } = useMaterials()
  const { data: tugasData } = useAssignments()
  const { data: pengumpulanData } = useSubmissions()
  const { data: schedules } = useSchedules({ hari: todayHari })
  const { data: announcementsData } = useAnnouncements()

  const kelasMengajar = kelasMengajarData ?? []
  const materiByGuru = (materiData ?? []).filter((m) => m.status === "Publish")
  const tugasByGuru = tugasData ?? []
  const tugasAktif = tugasByGuru.filter((t) => t.status === "Dipublikasikan")

  const pengumpulanTugas = (pengumpulanData ?? []).filter(
    (p) =>
      tugasByGuru.some((t) => t.id === p.tugas_id) &&
      (p.status === "Sudah Mengumpulkan" || p.status === "Terlambat")
  )
  const belumDinilai = pengumpulanTugas.filter((p) => p.nilai === null)

  const stats = [
    {
      title: "Kelas Mengajar",
      value: kelasMengajar.length,
      subtext: "Kelas aktif semester ini",
      icon: GraduationCap,
      color: "text-primary",
      bg: "bg-primary/10",
      borderHover: "hover:border-primary/40",
      href: "/guru/kelas",
    },
    {
      title: "Materi Dipublikasikan",
      value: materiByGuru.length,
      subtext: "Materi pembelajaran digital",
      icon: BookOpen,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10",
      borderHover: "hover:border-purple-500/40",
      href: "/guru/materi",
    },
    {
      title: "Tugas Aktif",
      value: tugasAktif.length,
      subtext: "Penugasan berjalan siswa",
      icon: ClipboardList,
      color: "text-orange",
      bg: "bg-orange/10",
      borderHover: "hover:border-orange/40",
      href: "/guru/tugas",
    },
    {
      title: "Menunggu Penilaian",
      value: belumDinilai.length,
      subtext: "Jawaban siswa siap diperiksa",
      icon: Award,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/10",
      borderHover: "hover:border-rose-500/40",
      href: "/guru/penilaian",
    },
  ]

  const jadwalHariIni = (schedules ?? [])
    .map((j) => ({
      ...j,
      waktu_mulai: j.jam_mulai,
      waktu_selesai: j.jam_selesai,
    }))
    .sort((a, b) => a.waktu_mulai.localeCompare(b.waktu_mulai))

  const pengumpulanTerbaru = [...pengumpulanTugas]
    .sort(
      (a, b) =>
        new Date(b.waktu_pengumpulan ?? 0).getTime() -
        new Date(a.waktu_pengumpulan ?? 0).getTime()
    )
    .slice(0, 5)
    .map((p) => ({
      ...p,
      judul_tugas: tugasByGuru.find((t) => t.id === p.tugas_id)?.judul ?? "-",
    }))

  const tugasUntukDinilai = tugasByGuru
    .filter((t) => t.status === "Dipublikasikan" || t.status === "Ditutup")
    .map((t) => {
      const pengumpulan = (pengumpulanData ?? []).filter((p) => p.tugas_id === t.id)
      const sudahMengumpulkan = pengumpulan.filter(
        (p) => p.status === "Sudah Mengumpulkan" || p.status === "Terlambat"
      ).length
      const belumDinilaiCount = pengumpulan.filter(
        (p) =>
          p.nilai === null &&
          (p.status === "Sudah Mengumpulkan" || p.status === "Terlambat")
      ).length
      return {
        id: t.id,
        judul: t.judul,
        kelas: t.kelas,
        jumlah_pengumpulan: `${sudahMengumpulkan}/${pengumpulan.length}`,
        belum_dinilai: belumDinilaiCount,
        deadline: t.tenggat_waktu,
        status: t.status,
      }
    })
    .filter((t) => t.belum_dinilai > 0)

  const announcements = filterPengumumanByRole(
    "guru",
    announcementsData ?? []
  ).slice(0, 5)

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. HERO WELCOME BANNER (Atmospheric & Quick Actions) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-500/10 via-card to-primary/10 border border-border/80 p-6 sm:p-8 backdrop-blur-xl shadow-lg shadow-black/5"
      >
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Guru Pengajar
              </span>
              <span className="px-3 py-1 rounded-full bg-card border border-border/80 text-xs font-bold text-foreground shadow-xs">
                {kelasMengajar.length} Kelas Aktif
              </span>
              <PengumumanBaruBadge role="guru" />
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
              Halo, {guruName} 👋
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Selamat datang di portal pendidik <strong>SIAPOS</strong>. Hari ini adalah{" "}
              <span className="text-foreground font-semibold">{getTodayIndonesian()}</span>. Kelola kegiatan belajar mengajar, bank soal, dan evaluasi siswa secara efisien.
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

            <Link href="/guru/jadwal-pelajaran" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-card/80 border-border/80 font-bold h-11 px-4 rounded-2xl gap-2 hover:bg-muted active:scale-95 transition-all"
              >
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Jadwal Pelajaran</span>
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 2. STATS CARDS (Modern Glassmorphic with Hover Effects) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.35 }}
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

                <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-muted-foreground truncate">
                      {stat.title}
                    </span>
                    <div className={cn(
                      "p-2.5 rounded-2xl transition-transform group-hover:scale-110 shadow-inner",
                      stat.bg,
                      stat.color
                    )}>
                      <stat.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                  </div>

                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors">
                      {stat.value}
                    </div>
                    <p className="text-[11px] text-muted-foreground font-medium mt-1 truncate">
                      {stat.subtext}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* 3. ROW 2: JADWAL MENGAJAR HARI INI & AKTIVITAS PENGUMPULAN SISWA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Jadwal Mengajar Hari Ini */}
        <Card className="lg:col-span-6 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-md shadow-black/5 overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <span>Jadwal Mengajar Hari Ini</span>
                </CardTitle>
                <CardDescription className="text-xs font-medium mt-0.5">
                  {todayHari}, {formatDateShort(new Date().toISOString())}
                </CardDescription>
              </div>
              <Link href="/guru/jadwal-pelajaran">
                <Button variant="ghost" size="sm" className="text-xs font-bold text-primary hover:text-primary/90 h-8 rounded-xl gap-1">
                  Semua
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {jadwalHariIni.length > 0 ? (
              <div className="space-y-2.5">
                {jadwalHariIni.map((jadwal) => (
                  <div
                    key={jadwal.id}
                    className="flex items-center gap-3.5 p-3 sm:p-3.5 rounded-2xl bg-muted/40 hover:bg-muted/70 border border-border/60 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center px-2.5 py-1.5 rounded-xl bg-card border border-border/80 shadow-xs shrink-0 text-center min-w-[70px]">
                      <span className="text-xs font-black text-primary">
                        {jadwal.waktu_mulai}
                      </span>
                      <span className="text-[10px] font-semibold text-muted-foreground">
                        s.d {jadwal.waktu_selesai}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-foreground truncate">
                        {jadwal.kelas}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-medium truncate mt-0.5">
                        {jadwal.mata_pelajaran}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-border/80 bg-muted/20">
                <Calendar className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-xs sm:text-sm font-semibold text-foreground">
                  Tidak ada jadwal mengajar hari ini
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Anda dapat memanfaatkan waktu untuk menyusun paket soal atau modul materi.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Aktivitas Pengumpulan Tugas Siswa */}
        <Card className="lg:col-span-6 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-md shadow-black/5 overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-orange/10 text-orange">
                    <Send className="h-4 w-4" />
                  </div>
                  <span>Aktivitas Pengumpulan</span>
                </CardTitle>
                <CardDescription className="text-xs font-medium mt-0.5">
                  Pengumpulan tugas siswa terbaru
                </CardDescription>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-bold rounded-full">
                {pengumpulanTerbaru.length} Terbaru
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {pengumpulanTerbaru.length > 0 ? (
              <div className="space-y-2.5">
                {pengumpulanTerbaru.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl border border-border/80 bg-card hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-foreground truncate">
                        {p.siswa_nama}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-medium truncate mt-0.5">
                        {p.judul_tugas}
                      </p>
                      <p className="text-[10px] text-muted-foreground/80 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{p.waktu_pengumpulan ? formatRelativeTime(p.waktu_pengumpulan) : "-"}</span>
                      </p>
                    </div>
                    <SubmissionStatusBadge status={p.status} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-border/80 bg-muted/20">
                <CheckCircle2 className="h-8 w-8 text-emerald-500/60 mx-auto mb-2" />
                <p className="text-xs sm:text-sm font-semibold text-foreground">
                  Belum ada pengumpulan baru
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Aktivitas pengumpulan tugas oleh siswa akan muncul di sini secara real-time.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 4. ROW 3: TUGAS MENUNGGU PENILAIAN */}
      <Card className="rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-md shadow-black/5 overflow-hidden">
        <CardHeader className="pb-4 border-b border-border/60">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600">
                  <Award className="h-4 w-4" />
                </div>
                <span>Tugas Menunggu Penilaian</span>
              </CardTitle>
              <CardDescription className="text-xs font-medium mt-0.5">
                Daftar tugas dengan berkas siswa yang belum dinilai
              </CardDescription>
            </div>
            <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20 text-xs font-bold rounded-full">
              {belumDinilai.length} Berkas Menunggu
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm min-w-[560px]">
              <thead>
                <tr className="bg-muted/40 border-b border-border/60">
                  <th className="text-left px-5 py-3 font-bold text-muted-foreground">
                    Judul Tugas
                  </th>
                  <th className="text-left px-4 py-3 font-bold text-muted-foreground hidden sm:table-cell">
                    Kelas
                  </th>
                  <th className="text-left px-4 py-3 font-bold text-muted-foreground">
                    Pengumpulan
                  </th>
                  <th className="text-left px-4 py-3 font-bold text-muted-foreground hidden md:table-cell">
                    Deadline
                  </th>
                  <th className="text-right px-5 py-3 font-bold text-muted-foreground">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {tugasUntukDinilai.map((tugas) => (
                  <tr
                    key={tugas.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-foreground">{tugas.judul}</p>
                      <p className="text-xs text-muted-foreground sm:hidden mt-0.5">
                        {tugas.kelas}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
                        {tugas.kelas}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-foreground">
                        {tugas.jumlah_pengumpulan}
                      </span>
                      <span className="text-xs text-rose-600 font-medium ml-1.5">
                        ({tugas.belum_dinilai} belum dinilai)
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-muted-foreground font-medium">
                      {formatDateShort(tugas.deadline)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link href={`/guru/pengumpulan/${tugas.id}`}>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-white font-bold h-8 px-3.5 rounded-xl gap-1 active:scale-95 transition-all"
                        >
                          <span>Nilai</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {tugasUntukDinilai.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-muted-foreground text-xs sm:text-sm font-medium"
                    >
                      <CheckCircle2 className="h-8 w-8 text-emerald-500/60 mx-auto mb-2" />
                      Semua tugas telah dinilai. Kerja bagus!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 5. ROW 4: KELAS AKTIF & PENGUMUMAN SEKOLAH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kelas Aktif Mengajar */}
        <Card className="lg:col-span-6 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-md shadow-black/5 overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <span>Kelas Aktif Mengajar</span>
                </CardTitle>
                <CardDescription className="text-xs font-medium mt-0.5">
                  Daftar kelas pengampu tahun ajaran ini
                </CardDescription>
              </div>
              <Link href="/guru/kelas">
                <Button variant="ghost" size="sm" className="text-xs font-bold text-primary hover:text-primary/90 h-8 rounded-xl gap-1">
                  Lihat semua
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {kelasMengajar.length > 0 ? (
              <div className="space-y-2.5">
                {kelasMengajar.map((kelas) => (
                  <div
                    key={kelas.id}
                    className="flex items-center gap-3.5 p-3 sm:p-3.5 rounded-2xl border border-border/80 bg-card hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary shrink-0 border border-primary/20">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-foreground truncate">{kelas.kelas}</p>
                      <p className="text-[11px] text-muted-foreground font-medium truncate mt-0.5">
                        {kelas.mata_pelajaran}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-muted border border-border text-foreground shrink-0">
                      {kelas.semester}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-border/80 bg-muted/20">
                <GraduationCap className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-xs sm:text-sm font-semibold text-foreground">
                  Tidak ada kelas mengajar aktif
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pengumuman Terbaru Sekolah */}
        <Card className="lg:col-span-6 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-md shadow-black/5 overflow-hidden">
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
                  Informasi resmi khusus dewan guru
                </CardDescription>
              </div>
              <Link href="/guru/pengumuman">
                <Button variant="ghost" size="sm" className="text-xs font-bold text-primary hover:text-primary/90 h-8 rounded-xl gap-1">
                  Lihat semua
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="divide-y divide-border/60">
              {announcements.map((announcement) => (
                <button
                  key={announcement.id}
                  type="button"
                  onClick={() => router.push(`/guru/pengumuman/${announcement.id}`)}
                  className="w-full text-left group py-3.5 hover:bg-muted/40 px-3 -mx-3 rounded-2xl transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {announcement.pinned && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20">
                            <Pin className="h-3 w-3" />
                            Disematkan
                          </span>
                        )}
                        <p className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                          {announcement.judul}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {announcement.ringkasan}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium flex-wrap">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border",
                            KATEGORI_PENGUMUMAN_COLORS[announcement.kategori] || "bg-muted text-muted-foreground border-border"
                          )}
                        >
                          {announcement.kategori}
                        </span>
                        <span>&bull;</span>
                        <span>{announcement.penulis}</span>
                        <span>&bull;</span>
                        <span>{formatDateID(announcement.tanggal_publish)}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </div>
                </button>
              ))}
              {announcements.length === 0 && (
                <p className="text-center py-8 text-xs sm:text-sm text-muted-foreground font-medium">
                  Belum ada pengumuman guru saat ini.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
