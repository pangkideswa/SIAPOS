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
  ClipboardList,
  Trophy,
  Bell,
  Clock,
  ChevronRight,
  FileText,
  GraduationCap,
  User,
  Megaphone,
  Info,
  AlertTriangle,
  Send,
  FileSpreadsheet,
  Monitor,
} from "lucide-react"
import { DUMMY_MATERI } from "@/features/materi/dummy/materi.data"
import { DUMMY_TUGAS } from "@/features/tugas/dummy/tugas.data"
import { DUMMY_PENGUMPULAN } from "@/features/pengumpulan/dummy/pengumpulan.data"
import { DUMMY_PENILAIAN } from "@/features/penilaian/dummy/penilaian.data"
import {
  DUMMY_SISWA_JADWAL,
  DUMMY_ANNOUNCEMENTS,
} from "@/features/dashboard/dummy/dashboard.data"
import { DUMMY_NILAI_AKADEMIK } from "@/features/nilai-akademik/dummy/nilai-akademik.data"

const SISWA_KELAS = "XI TKJ 1"

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

function AnnouncementIcon({ type }: { type: string }) {
  if (type === "warning")
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />
  if (type === "urgent")
    return <Megaphone className="h-4 w-4 text-red-500" />
  return <Info className="h-4 w-4 text-primary" />
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    "Belum Dikerjakan":
      "bg-orange-50 text-orange-600 border-orange-200",
    "Sudah Dikerjakan":
      "bg-green-50 text-green-600 border-green-200",
    Terlambat: "bg-red-50 text-red-600 border-red-200",
  }
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${variants[status] ?? "bg-muted text-muted-foreground"}`}
    >
      {status}
    </span>
  )
}

export function SiswaDashboardPage() {
  const { user } = useAuth()
  const siswaName = user?.name ?? "Rizki Pratama"

  const materiByKelas = DUMMY_MATERI.filter(
    (m) => m.kelas === SISWA_KELAS && m.status === "Publish"
  )
  const tugasByKelas = DUMMY_TUGAS.filter(
    (t) =>
      t.kelas === SISWA_KELAS &&
      (t.status === "Dipublikasikan" || t.status === "Ditutup")
  )
  const pengumpulanBySiswa = DUMMY_PENGUMPULAN.filter(
    (p) => p.siswa_nama === siswaName
  )
  const penilaianBySiswa = DUMMY_PENILAIAN.filter(
    (p) => p.siswa_nama === siswaName
  )

  const tugasAktif = tugasByKelas.filter((t) => t.status === "Dipublikasikan")
  const tugasSelesai = pengumpulanBySiswa.filter(
    (p) => p.status === "Sudah Mengumpulkan" || p.status === "Terlambat"
  )
  const pengumumanBaru = DUMMY_ANNOUNCEMENTS.length

  const nilaiSiswa = penilaianBySiswa.filter(
    (p) => p.status_penilaian === "Sudah Dinilai"
  )
  const avgNilai =
    nilaiSiswa.length > 0
      ? Math.round(
          nilaiSiswa.reduce((sum, p) => sum + (p.nilai ?? 0), 0) /
            nilaiSiswa.length
        )
      : 0

  const stats = [
    {
      title: "Materi Baru",
      value: materiByKelas.length,
      icon: BookOpen,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Tugas Aktif",
      value: tugasAktif.length,
      icon: ClipboardList,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      title: "Tugas Selesai",
      value: tugasSelesai.length,
      icon: GraduationCap,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Nilai Terbaru",
      value: avgNilai,
      icon: Trophy,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Pengumuman Baru",
      value: pengumumanBaru,
      icon: Bell,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
  ]

  const tugasUntukDikerjakan = tugasByKelas.map((t) => {
    const pengumpulan = pengumpulanBySiswa.find((p) => p.tugas_id === t.id)
    let status: "Belum Dikerjakan" | "Sudah Dikerjakan" | "Terlambat"
    if (pengumpulan) {
      status =
        pengumpulan.status === "Terlambat"
          ? "Terlambat"
          : "Sudah Dikerjakan"
    } else {
      status = "Belum Dikerjakan"
    }
    return {
      id: t.id,
      judul: t.judul,
      mata_pelajaran: t.mata_pelajaran,
      guru: t.guru_nama,
      deadline: t.tenggat_waktu,
      status,
    }
  })

  const todayHari = new Date().toLocaleDateString("id-ID", { weekday: "long" })
  const jadwalHariIni = DUMMY_SISWA_JADWAL.filter(
    (j) => j.kelas === SISWA_KELAS && j.hari === todayHari
  )

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
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{SISWA_KELAS}</span>
        </div>
      </div>

      {/* Section 1: Ringkasan */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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

      {/* Nilai Akademik Widget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card size="sm">
          <CardContent className="flex items-center gap-3 p-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100 text-blue-600 shrink-0">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Nilai Akademik</p>
              <p className="text-lg font-bold">
                {DUMMY_NILAI_AKADEMIK.filter((n) => n.siswa_nama === siswaName).length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 p-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-green-100 text-green-600 shrink-0">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Nilai Lengkap</p>
              <p className="text-lg font-bold">
                {DUMMY_NILAI_AKADEMIK.filter((n) => n.siswa_nama === siswaName && n.status === "Lengkap").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 2 & 3: Tugas + Materi */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section 2: Tugas yang Harus Dikerjakan */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Tugas yang Harus Dikerjakan
                </CardTitle>
                <CardDescription>
                  Daftar tugas untuk kelas {SISWA_KELAS}
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {tugasAktif.length} aktif
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
                      Mata Pelajaran
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                      Guru
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Deadline
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tugasUntukDikerjakan.map((tugas, index) => (
                    <tr
                      key={tugas.id}
                      className={
                        index < tugasUntukDikerjakan.length - 1
                          ? "border-b border-border"
                          : ""
                      }
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium">{tugas.judul}</p>
                        <p className="text-xs text-muted-foreground sm:hidden">
                          {tugas.mata_pelajaran}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-muted-foreground">
                          {tugas.mata_pelajaran}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-muted-foreground">
                          {tugas.guru}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-muted-foreground">
                          {formatDateShort(tugas.deadline)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={tugas.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href="/siswa/tugas">
                          <Button variant="ghost" size="sm">
                            {tugas.status === "Belum Dikerjakan"
                              ? "Kerjakan"
                              : "Lihat"}
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {tugasUntukDikerjakan.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-muted-foreground"
                      >
                        Tidak ada tugas untuk kelas Anda
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Materi Terbaru */}
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
              {materiByKelas.map((materi) => (
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
                  <div className="mt-2">
                    <Link href={`/guru/materi/${materi.id}`}>
                      <Button variant="ghost" size="sm" className="w-full">
                        Lihat Materi
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
              {materiByKelas.length === 0 && (
                <p className="text-center py-6 text-sm text-muted-foreground">
                  Belum ada materi untuk kelas Anda
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 4 & 5: Nilai Terbaru + Jadwal Hari Ini */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section 4: Nilai Terbaru */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Nilai Terbaru
                </CardTitle>
                <CardDescription>Penilaian dari guru Anda</CardDescription>
              </div>
              <Badge variant="secondary">
                {nilaiSiswa.length} dinilai
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Mata Pelajaran
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                      Tugas
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Nilai
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                      Feedback Guru
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {penilaianBySiswa
                    .filter((p) => p.status_penilaian === "Sudah Dinilai")
                    .map((nilai, index, arr) => (
                      <tr
                        key={nilai.id}
                        className={
                          index < arr.length - 1 ? "border-b border-border" : ""
                        }
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium">{nilai.mata_pelajaran}</p>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="text-muted-foreground">
                            {nilai.tugas_judul}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-lg font-bold text-primary">
                            {nilai.nilai}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {nilai.feedback_guru}
                          </p>
                        </td>
                      </tr>
                    ))}
                  {nilaiSiswa.filter((p) => p.status_penilaian === "Sudah Dinilai")
                    .length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-muted-foreground"
                      >
                        Belum ada nilai
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Jadwal Hari Ini */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
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
      </div>

      {/* Section 6 & 7: Pengumuman + Quick Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section 6: Pengumuman */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5" />
                  Pengumuman
                </CardTitle>
                <CardDescription>
                  Informasi terbaru dari sekolah
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
                        {formatDateShort(announcement.date)}
                      </p>
                    </div>
                  </div>
                  {index < DUMMY_ANNOUNCEMENTS.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section 7: Quick Action */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Quick Action
            </CardTitle>
            <CardDescription>Akses cepat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                {
                  label: "Lihat Pelajaran",
                  href: "/siswa/pelajaran",
                  icon: BookOpen,
                  color: "bg-primary/10 text-primary hover:bg-primary/20",
                },
                {
                  label: "Kerjakan Tugas",
                  href: "/siswa/tugas",
                  icon: ClipboardList,
                  color: "bg-primary/10 text-primary hover:bg-primary/20",
                },
                {
                  label: "Lihat Nilai",
                  href: "/siswa/nilai-akademik",
                  icon: Trophy,
                  color: "bg-orange-50 text-orange-500 hover:bg-orange-100",
                },
                {
                  label: "CBT",
                  href: "/siswa/cbt",
                  icon: Monitor,
                  color: "bg-orange-50 text-orange-500 hover:bg-orange-100",
                },
              ].map((action) => (
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
      </div>
    </div>
  )
}
