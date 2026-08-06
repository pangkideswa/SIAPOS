"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
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
import { Progress } from "@/components/ui/progress"
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
      <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium shrink-0 bg-red-50 text-red-600 border-red-200">
        Terlambat
      </span>
    )
  if (days === 0)
    return (
      <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium shrink-0 bg-orange-50 text-orange-600 border-orange-200">
        Hari ini
      </span>
    )
  if (days <= 3)
    return (
      <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium shrink-0 bg-yellow-50 text-yellow-600 border-yellow-200">
        {days} hari lagi
      </span>
    )
  return (
    <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium shrink-0 bg-green-50 text-green-600 border-green-200">
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
      icon: ClipboardCheck,
      color: "text-green-600",
      bg: "bg-green-50",
      href: "/siswa/tugas",
    },
    {
      title: "Progres Belajar",
      value: `${progres}%`,
      icon: BarChart3,
      color: "text-primary",
      bg: "bg-primary/10",
      href: "/siswa/tugas",
    },
    {
      title: "Kehadiran",
      value: `${kehadiran}%`,
      icon: CalendarCheck,
      color: "text-orange-500",
      bg: "bg-orange-50",
      href: "/siswa/absensi",
    },
    {
      title: "Rata-Rata Nilai",
      value: rataRata ?? "-",
      icon: Award,
      color: "text-primary",
      bg: "bg-primary/10",
      href: "/siswa/nilai",
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
    .filter((j) => j.kelas === siswaKelas && j.hari === todayHari)
    .map((j) => ({
      ...j,
      waktu_mulai: j.jam_mulai,
      waktu_selesai: j.jam_selesai,
    }))

  const announcements = filterPengumumanByRole(
    "siswa",
    announcementsData ?? []
  ).slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Halo, {siswaName} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Selamat datang kembali di{" "}
            <span className="font-semibold text-foreground">SIAPOS</span>.
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Hari ini adalah {getTodayIndonesian()}.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="hidden sm:inline-flex">
            {siswaKelas}
          </Badge>
          <PengumumanBaruBadge role="siswa" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Jadwal Hari Ini
            </CardTitle>
            <CardDescription>{getTodayIndonesian()}</CardDescription>
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
                      <p className="text-sm font-semibold">
                        {jadwal.mata_pelajaran}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {jadwal.guru_nama}
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

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Tugas dengan Deadline Terdekat
                </CardTitle>
                <CardDescription>
                  Tugas untuk kelas {siswaKelas}
                </CardDescription>
              </div>
              <Badge variant="secondary">{tugasAktif.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {tugasTerdekat.length > 0 ? (
              <div className="space-y-3">
                {tugasTerdekat.map((tugas) => (
                  <div
                    key={tugas.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {tugas.judul}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tugas.mata_pelajaran} &middot; {tugas.guru}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Tenggat {formatDateShort(tugas.deadline)}
                      </p>
                    </div>
                    <DeadlineBadge days={tugas.days_remaining} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground">
                Tidak ada tugas untuk kelas Anda
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Progres Belajar
            </CardTitle>
            <CardDescription>
              Perkembangan pengerjaan tugas kelas {siswaKelas}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">
                    {tugasSelesai.length} dari {tugasByKelas.length} tugas
                    diselesaikan
                  </span>
                  <span className="font-semibold text-primary">
                    {progres}%
                  </span>
                </div>
                <Progress value={progres} />
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-lg bg-green-50">
                  <p className="text-xl font-bold text-green-600">
                    {tugasSelesai.length}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Selesai</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-50">
                  <p className="text-xl font-bold text-orange-600">
                    {belumDinilai.length}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Belum Dinilai
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xl font-bold">
                    {tugasByKelas.length - tugasSelesai.length}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Belum Dikerjakan
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Materi Terbaru
                </CardTitle>
                <CardDescription>Materi untuk kelas Anda</CardDescription>
              </div>
              <Badge variant="secondary">{materiByKelas.length} materi</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {materiTerbaru.map((materi) => (
                <div
                  key={materi.id}
                  className="p-3 rounded-lg border border-border"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {materi.judul}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {materi.mata_pelajaran} &middot; {materi.guru_nama}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDateShort(materi.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {materiTerbaru.length === 0 && (
                <p className="text-center py-6 text-sm text-muted-foreground">
                  Belum ada materi untuk kelas Anda
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                Pengumuman Terbaru
              </CardTitle>
              <CardDescription>Informasi terbaru dari sekolah</CardDescription>
            </div>
            <Link href="/siswa/pengumuman">
              <Button variant="ghost" size="sm">
                Lihat semua
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {announcements.map((announcement, index) => (
              <button
                key={announcement.id}
                type="button"
                onClick={() =>
                  router.push(`/siswa/pengumuman/${announcement.id}`)
                }
                className="w-full text-left group"
              >
                <div className="flex items-start gap-3 py-3 group-hover:bg-muted/50 rounded-lg px-2 -mx-2 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      {announcement.pinned && (
                        <Pin className="h-3.5 w-3.5 text-red-500 shrink-0" />
                      )}
                      <p className="text-sm font-semibold truncate">
                        {announcement.judul}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                      {announcement.ringkasan}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium ${KATEGORI_PENGUMUMAN_COLORS[announcement.kategori]}`}
                      >
                        {announcement.kategori}
                      </span>
                      <span>{announcement.penulis}</span>
                      <span>{formatDateID(announcement.tanggal_publish)}</span>
                    </div>
                  </div>
                </div>
                {index < announcements.length - 1 && (
                  <div className="border-t border-border" />
                )}
              </button>
            ))}
            {announcements.length === 0 && (
              <p className="text-center py-6 text-sm text-muted-foreground">
                Belum ada pengumuman
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
