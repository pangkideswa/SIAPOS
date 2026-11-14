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
  Clock,
  ChevronRight,
  FileText,
  Megaphone,
  Pin,
  CalendarCheck,
  BarChart3,
  Award,
  ClipboardCheck,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Calendar,
  TrendingUp,
} from "lucide-react"
import { useMaterials } from "@/hooks/use-materials"
import { useAssignments } from "@/hooks/use-assignments"
import { useSubmissions } from "@/hooks/use-submissions"
import { useSchedules } from "@/hooks/use-schedules"
import { useStudents } from "@/hooks/use-students"
import { useAnnouncements } from "@/hooks/use-announcements"
import { useAttendanceRekap } from "@/hooks/use-attendance"
import { filterPengumumanByRole } from "@/features/pengumuman/lib/pengumuman-helpers"
import { KATEGORI_PENGUMUMAN_COLORS } from "@/features/pengumuman/constants/pengumuman.constants"
import { formatDateID } from "@/features/kalender-akademik/components/kalender-helpers"
import { PengumumanBaruBadge } from "@/features/pengumuman/components/pengumuman-baru-badge"
import { cn } from "@/lib/utils"

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

function getDaysRemaining(deadline: string): number {
  const deadlineDate = new Date(deadline)
  deadlineDate.setHours(23, 59, 59, 999)
  const diff = deadlineDate.getTime() - new Date().getTime()
  return Math.ceil(diff / 86400000)
}

function DeadlineBadge({ days }: { days: number }) {
  if (days < 0)
    return (
      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold shrink-0 bg-rose-500/10 text-rose-600 border-rose-500/20">
        Terlambat
      </span>
    )
  if (days === 0)
    return (
      <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold shrink-0 bg-orange/15 text-orange border-orange/30 animate-pulse">
        <span>Hari ini</span>
      </span>
    )
  if (days <= 3)
    return (
      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold shrink-0 bg-amber-500/10 text-amber-600 border-amber-500/20">
        {days} hari lagi
      </span>
    )
  return (
    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold shrink-0 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
      {days} hari lagi
    </span>
  )
}

export function SiswaDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const siswaName = user?.name ?? "Rizki Pratama"

  const { data: materiData } = useMaterials()
  const { data: tugasData } = useAssignments()
  const { data: pengumpulanData } = useSubmissions()
  const { data: schedules } = useSchedules()
  const { data: siswaData } = useStudents()
  const { data: announcementsData } = useAnnouncements()
  const { data: rekapData } = useAttendanceRekap()

  const siswa = (siswaData ?? []).find(
    (s) =>
      s.nama_lengkap.toLowerCase() === siswaName.toLowerCase() &&
      s.status === "Aktif"
  )
  const siswaKelas = siswa?.kelas ?? ""

  const materiByKelas = (materiData ?? []).filter(
    (m) => m.kelas === siswaKelas && m.status === "Publish"
  )
  const materiTerbaru = [...materiByKelas]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 4)

  const tugasByKelas = (tugasData ?? []).filter(
    (t) =>
      t.kelas === siswaKelas &&
      (t.status === "Dipublikasikan" || t.status === "Ditutup")
  )
  const tugasAktif = tugasByKelas.filter((t) => t.status === "Dipublikasikan")
  const pengumpulanBySiswa = (pengumpulanData ?? []).filter(
    (p) => p.siswa_nama === siswaName
  )
  const tugasSelesai = pengumpulanBySiswa.filter(
    (p) => p.status === "Sudah Mengumpulkan" || p.status === "Terlambat"
  )
  const belumDinilai = pengumpulanBySiswa.filter(
    (p) =>
      p.nilai === null &&
      (p.status === "Sudah Mengumpulkan" || p.status === "Terlambat")
  )

  const progres =
    tugasByKelas.length > 0
      ? Math.round((tugasSelesai.length / tugasByKelas.length) * 100)
      : 0

  const rekap = (rekapData ?? []).find((r) => r.siswa_nama === siswaName)
  const kehadiran = rekap?.persentase ?? 0

  const nilaiSiswa = pengumpulanBySiswa
    .filter((p) => p.nilai !== null)
    .map((p) => p.nilai as number)
  const rataRata =
    nilaiSiswa.length > 0
      ? Math.round(nilaiSiswa.reduce((sum, n) => sum + n, 0) / nilaiSiswa.length)
      : null

  const stats = [
    {
      title: "Tugas Selesai",
      value: tugasSelesai.length,
      subtext: `Dari ${tugasByKelas.length} tugas total`,
      icon: ClipboardCheck,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      borderHover: "hover:border-emerald-500/40",
      href: "/siswa/tugas",
    },
    {
      title: "Progres Belajar",
      value: `${progres}%`,
      subtext: `${tugasSelesai.length} tugas terkumpul`,
      icon: BarChart3,
      color: "text-primary",
      bg: "bg-primary/10",
      borderHover: "hover:border-primary/40",
      href: "/siswa/tugas",
    },
    {
      title: "Tingkat Kehadiran",
      value: `${kehadiran}%`,
      subtext: "Presensi semester berjalan",
      icon: CalendarCheck,
      color: "text-orange",
      bg: "bg-orange/10",
      borderHover: "hover:border-orange/40",
      href: "/siswa/absensi",
    },
    {
      title: "Rata-Rata Nilai",
      value: rataRata ?? "-",
      subtext: "Berdasarkan tugas tergradasi",
      icon: Award,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10",
      borderHover: "hover:border-purple-500/40",
      href: "/siswa/nilai-akademik",
    },
  ]

  const tugasTerdekat = [...tugasByKelas]
    .sort((a, b) => a.tenggat_waktu.localeCompare(b.tenggat_waktu))
    .slice(0, 5)
    .map((t) => ({
      id: t.id,
      judul: t.judul,
      mata_pelajaran: t.mata_pelajaran,
      guru: t.guru_nama,
      deadline: t.tenggat_waktu,
      days_remaining: getDaysRemaining(t.tenggat_waktu),
    }))

  const todayHari = new Date().toLocaleDateString("id-ID", { weekday: "long" })
  const jadwalHariIni = (schedules ?? [])
    .filter((j) => j.kelas === siswa?.kelas && j.hari === todayHari)
    .map((j) => ({
      ...j,
      waktu_mulai: j.jam_mulai,
      waktu_selesai: j.jam_selesai,
    }))
    .sort((a, b) => a.waktu_mulai.localeCompare(b.waktu_mulai))

  const announcements = filterPengumumanByRole(
    "siswa",
    announcementsData ?? []
  ).slice(0, 5)

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. HERO WELCOME BANNER (Personalized & Atmospheric) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-card to-orange/10 border border-border/80 p-6 sm:p-8 backdrop-blur-xl shadow-lg shadow-black/5"
      >
        {/* Subtle Decorative Ambient Background Glows */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-orange/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Siswa Aktif
              </span>
              <PengumumanBaruBadge role="siswa" />
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
              Halo, {siswaName} 👋
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Selamat datang di portal akademik <strong>SIAPOS</strong>. Hari ini adalah{" "}
              <span className="text-foreground font-semibold">{getTodayIndonesian()}</span>. Tetap semangat belajar dan capai target akademismu!
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <Link href="/siswa/cbt" className="w-full sm:w-auto">
              <Button
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold h-11 px-5 rounded-2xl shadow-md shadow-primary/25 gap-2 active:scale-95 transition-all group"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-300 transition-transform group-hover:scale-110" />
                <span>Ruang Ujian CBT</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>

            <Link href="/siswa/jadwal-pelajaran" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-card/80 border-border/80 font-bold h-11 px-4 rounded-2xl gap-2 hover:bg-muted active:scale-95 transition-all"
              >
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Jadwal KBM</span>
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
                {/* Accent Top Border Hover Line */}
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

      {/* 3. ROW 2: JADWAL HARI INI & TUGAS DEADLINE TERDEKAT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Jadwal Pelajaran Hari Ini (Left Column) */}
        <Card className="lg:col-span-6 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-md shadow-black/5 overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Clock className="h-4 w-4" />
                  </div>
                  <span>Jadwal Hari Ini</span>
                </CardTitle>
                <CardDescription className="text-xs font-medium mt-0.5">
                  {todayHari}, {formatDateShort(new Date().toISOString())}
                </CardDescription>
              </div>
              <Link href="/siswa/jadwal-pelajaran">
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
                        s.d {jadwal.waktu_selesai} WIB
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-foreground truncate">
                        {jadwal.mata_pelajaran}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-medium truncate mt-0.5">
                        {jadwal.guru_nama}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-border/80 bg-muted/20">
                <Calendar className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-xs sm:text-sm font-semibold text-foreground">
                  Tidak ada jadwal belajar hari ini
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Gunakan waktu luang untuk mengulang materi atau menyelesaikan tugas mandiri.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tugas dengan Deadline Terdekat (Right Column) */}
        <Card className="lg:col-span-6 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-md shadow-black/5 overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-orange/10 text-orange">
                    <ClipboardList className="h-4 w-4" />
                  </div>
                  <span>Tugas Deadline Terdekat</span>
                </CardTitle>
                <CardDescription className="text-xs font-medium mt-0.5">
                  Tugas aktif kelas {siswaKelas || "Anda"}
                </CardDescription>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-bold rounded-full">
                {tugasAktif.length} Aktif
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {tugasTerdekat.length > 0 ? (
              <div className="space-y-2.5">
                {tugasTerdekat.map((tugas) => (
                  <Link
                    key={tugas.id}
                    href={`/siswa/tugas`}
                    className="flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl border border-border/80 bg-card hover:bg-muted/40 hover:border-primary/40 transition-all duration-200 group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {tugas.judul}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-medium truncate mt-0.5">
                        {tugas.mata_pelajaran} &middot; {tugas.guru}
                      </p>
                      <p className="text-[10px] text-muted-foreground/80 mt-1">
                        Tenggat: <strong className="text-foreground">{formatDateShort(tugas.deadline)}</strong>
                      </p>
                    </div>
                    <DeadlineBadge days={tugas.days_remaining} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-border/80 bg-muted/20">
                <CheckCircle2 className="h-8 w-8 text-emerald-500/60 mx-auto mb-2" />
                <p className="text-xs sm:text-sm font-semibold text-foreground">
                  Semua tugas terselesaikan!
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tidak ada tanggungan tugas mendesak untuk kelas Anda saat ini.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 4. ROW 3: PROGRES BELAJAR & MATERI TERBARU */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Progres Belajar Bar & Metrics (Left Column) */}
        <Card className="lg:col-span-6 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-md shadow-black/5 overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                <TrendingUp className="h-4 w-4" />
              </div>
              <span>Progres Belajar Semester</span>
            </CardTitle>
            <CardDescription className="text-xs font-medium mt-0.5">
              Tingkat penyelesaian tugas & asesmen mandiri
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                <span className="text-muted-foreground font-medium">
                  {tugasSelesai.length} dari {tugasByKelas.length} tugas diselesaikan
                </span>
                <span className="font-extrabold text-primary text-base">
                  {progres}%
                </span>
              </div>
              <div className="h-3 w-full bg-muted rounded-full overflow-hidden p-0.5 border border-border/60">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progres}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {tugasSelesai.length}
                </p>
                <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">Selesai</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-orange/10 border border-orange/20">
                <p className="text-xl sm:text-2xl font-black text-orange">
                  {belumDinilai.length}
                </p>
                <p className="text-[11px] font-bold text-orange mt-0.5">
                  Menunggu Nilai
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-muted/60 border border-border/80">
                <p className="text-xl sm:text-2xl font-black text-foreground">
                  {Math.max(0, tugasByKelas.length - tugasSelesai.length)}
                </p>
                <p className="text-[11px] font-bold text-muted-foreground mt-0.5">
                  Belum Selesai
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Materi Terbaru (Right Column) */}
        <Card className="lg:col-span-6 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-md shadow-black/5 overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <span>Materi Pembelajaran Terbaru</span>
                </CardTitle>
                <CardDescription className="text-xs font-medium mt-0.5">
                  Materi digital untuk kelas Anda
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs font-bold rounded-full">
                {materiByKelas.length} Materi
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2.5">
              {materiTerbaru.map((materi) => (
                <div
                  key={materi.id}
                  className="p-3 sm:p-3.5 rounded-2xl border border-border/80 bg-card hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary shrink-0 border border-primary/20">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-foreground truncate">
                        {materi.judul}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-medium mt-0.5 truncate">
                        {materi.mata_pelajaran} &middot; {materi.guru_nama}
                      </p>
                      <p className="text-[10px] text-muted-foreground/80 mt-1">
                        Dipublikasikan {formatDateShort(materi.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {materiTerbaru.length === 0 && (
                <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-border/80 bg-muted/20">
                  <BookOpen className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm font-semibold text-foreground">
                    Belum ada materi untuk kelas Anda
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Guru belum mempublikasikan materi baru hari ini.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 5. ROW 4: PENGUMUMAN TERBARU SEKOLAH */}
      <Card className="rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-md shadow-black/5 overflow-hidden">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600">
                  <Megaphone className="h-4 w-4" />
                </div>
                <span>Papan Pengumuman Sekolah</span>
              </CardTitle>
              <CardDescription className="text-xs font-medium mt-0.5">
                Informasi dan pemberitahuan resmi
              </CardDescription>
            </div>
            <Link href="/siswa/pengumuman">
              <Button variant="ghost" size="sm" className="text-xs font-bold text-primary hover:text-primary/90 rounded-xl gap-1">
                Lihat semua
                <ChevronRight className="h-4 w-4 ml-1" />
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
                onClick={() =>
                  router.push(`/siswa/pengumuman/${announcement.id}`)
                }
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
                Belum ada pengumuman untuk siswa saat ini.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
