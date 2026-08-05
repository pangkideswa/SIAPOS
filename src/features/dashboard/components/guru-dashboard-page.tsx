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
  const variants: Record<string, string> = {
    "Sudah Mengumpulkan": "bg-green-50 text-green-600 border-green-200",
    Terlambat: "bg-red-50 text-red-600 border-red-200",
  }
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium shrink-0 ${variants[status] ?? "bg-muted text-muted-foreground"}`}
    >
      {status}
    </span>
  )
}

export function GuruDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const guruName = user?.name ?? GURU_NAME

  const { data: kelasMengajarData } = useTeachingClasses()
  const { data: materiData } = useMaterials()
  const { data: tugasData } = useAssignments()
  const { data: pengumpulanData } = useSubmissions()
  const { data: schedules } = useSchedules()
  const { data: announcementsData } = useAnnouncements()

  const kelasMengajar = (kelasMengajarData ?? []).filter(
    (k) => k.guru_nama === guruName && k.status === "Aktif"
  )
  const materiByGuru = (materiData ?? []).filter(
    (m) => m.guru_nama === guruName && m.status === "Publish"
  )
  const tugasByGuru = (tugasData ?? []).filter(
    (t) => t.guru_nama === guruName
  )
  const tugasAktif = tugasByGuru.filter((t) => t.status === "Dipublikasikan")

  const pengumpulanTugas = (pengumpulanData ?? []).filter(
    (p) =>
      tugasByGuru.some((t) => t.id === p.tugas_id) &&
      (p.status === "Sudah Mengumpulkan" || p.status === "Terlambat")
  )
  const belumDinilai = pengumpulanTugas.filter((p) => p.nilai === null)

  const stats = [
    {
      title: "Total Kelas",
      value: kelasMengajar.length,
      icon: GraduationCap,
      color: "text-primary",
      bg: "bg-primary/10",
      href: "/guru/kelas",
    },
    {
      title: "Total Materi",
      value: materiByGuru.length,
      icon: BookOpen,
      color: "text-primary",
      bg: "bg-primary/10",
      href: "/guru/materi",
    },
    {
      title: "Total Tugas",
      value: tugasAktif.length,
      icon: ClipboardList,
      color: "text-orange-500",
      bg: "bg-orange-50",
      href: "/guru/tugas",
    },
    {
      title: "Perlu Dinilai",
      value: belumDinilai.length,
      icon: Award,
      color: "text-orange-500",
      bg: "bg-orange-50",
      href: "/guru/pengumpulan",
    },
  ]

  const todayHari = new Date().toLocaleDateString("id-ID", { weekday: "long" })
  const jadwalHariIni = (schedules ?? [])
    .filter((j) => j.guru_nama === guruName && j.hari === todayHari)
    .map((j) => ({
      ...j,
      waktu_mulai: j.jam_mulai,
      waktu_selesai: j.jam_selesai,
    }))

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
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-2">
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
        <PengumumanBaruBadge role="guru" />
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
              <Calendar className="h-5 w-5" />
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

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Aktivitas Pengumpulan
                </CardTitle>
                <CardDescription>Pengumpulan tugas oleh siswa</CardDescription>
              </div>
              <Badge variant="secondary">{pengumpulanTerbaru.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {pengumpulanTerbaru.length > 0 ? (
              <div className="space-y-3">
                {pengumpulanTerbaru.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {p.siswa_nama}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {p.judul_tugas}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {p.waktu_pengumpulan
                          ? formatRelativeTime(p.waktu_pengumpulan)
                          : "-"}
                      </p>
                    </div>
                    <SubmissionStatusBadge status={p.status} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground">
                Belum ada pengumpulan tugas
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Tugas Menunggu Penilaian
              </CardTitle>
              <CardDescription>
                Tugas dengan pengumpulan yang belum dinilai
              </CardDescription>
            </div>
            <Badge variant="secondary">{belumDinilai.length} belum dinilai</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
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
                      <span className="text-xs text-muted-foreground ml-1">
                        ({tugas.belum_dinilai} belum dinilai)
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
                      Tidak ada tugas yang menunggu penilaian
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Kelas Aktif
                </CardTitle>
                <CardDescription>Kelas yang Anda ajar tahun ini</CardDescription>
              </div>
              <Link href="/guru/kelas">
                <Button variant="ghost" size="sm">
                  Lihat semua
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {kelasMengajar.length > 0 ? (
              <div className="space-y-3">
                {kelasMengajar.map((kelas) => (
                  <div
                    key={kelas.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{kelas.kelas}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {kelas.mata_pelajaran}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      {kelas.semester}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground">
                Tidak ada kelas mengajar aktif
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5" />
                  Pengumuman Terbaru
                </CardTitle>
                <CardDescription>Informasi terbaru untuk Anda</CardDescription>
              </div>
              <Link href="/guru/pengumuman">
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
                  onClick={() => router.push(`/guru/pengumuman/${announcement.id}`)}
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
    </div>
  )
}
