"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs } from "@/components/ui/tabs"
import {
  ArrowLeft,
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Users,
  Award,
  Calendar,
  Megaphone,
  Send,
  BookMarked,
} from "lucide-react"
import { useClassroom } from "@/hooks/use-classroom"
import { KelasOverviewTab } from "@/features/kelas-saya/components/kelas-overview-tab"
import { KelasMateriTab } from "@/features/kelas-saya/components/kelas-materi-tab"
import { KelasTugasTab } from "@/features/kelas-saya/components/kelas-tugas-tab"
import { KelasAnggotaTab } from "@/features/kelas-saya/components/kelas-anggota-tab"
import { KelasPengumpulanTab } from "@/features/kelas-saya/components/kelas-pengumpulan-tab"
import { KelasNilaiTab } from "@/features/kelas-saya/components/kelas-nilai-tab"
import { KelasJadwalTab } from "@/features/kelas-saya/components/kelas-jadwal-tab"
import { KelasPengumumanTab } from "@/features/kelas-saya/components/kelas-pengumuman-tab"

type KelasTab = "ringkasan" | "materi" | "tugas" | "pengumpulan" | "penilaian" | "anggota" | "jadwal" | "pengumuman"

const TABS: { value: KelasTab; label: string; icon: typeof LayoutDashboard }[] = [
  { value: "ringkasan", label: "Ringkasan", icon: LayoutDashboard },
  { value: "materi", label: "Materi", icon: BookOpen },
  { value: "tugas", label: "Tugas", icon: ClipboardList },
  { value: "pengumpulan", label: "Pengumpulan", icon: Send },
  { value: "penilaian", label: "Penilaian", icon: Award },
  { value: "anggota", label: "Anggota", icon: Users },
  { value: "jadwal", label: "Jadwal", icon: Calendar },
  { value: "pengumuman", label: "Pengumuman", icon: Megaphone },
]

export function KelasDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const classroom = useClassroom()
  const kelasMengajar = classroom.getKelasMengajarById(Number(resolvedParams.id))
  const [tab, setTab] = useState<KelasTab>("ringkasan")

  if (!kelasMengajar) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/guru/kelas")}
          className="-ml-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Kembali ke Kelas Saya
        </Button>
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-lg font-semibold">Kelas Tidak Ditemukan</p>
            <p className="text-sm text-muted-foreground mt-1">
              Kelas dengan ID {resolvedParams.id} tidak tersedia.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const jumlahSiswa = classroom.getAnggotaKelas(kelasMengajar.kelas).length
  const jumlahMateri = classroom.getKelasMateri(kelasMengajar.id).length
  const jumlahTugas = classroom.getKelasTugas(kelasMengajar.id).length

  const tugasList = classroom.getKelasTugas(kelasMengajar.id)
  const jumlahPengumpulan = tugasList.reduce(
    (total, t) =>
      total +
      classroom.getTugasPengumpulan(t.id).filter(
        (p) => p.status !== "Belum Mengumpulkan"
      ).length,
    0
  )

  const allGrades = tugasList.flatMap((t) =>
    classroom.getTugasPengumpulan(t.id)
      .filter((p) => p.nilai !== null)
      .map((p) => p.nilai as number)
  )
  const rataRataNilai =
    allGrades.length > 0
      ? Math.round(allGrades.reduce((a, b) => a + b, 0) / allGrades.length)
      : null

  const stats = [
    {
      label: "Materi",
      value: jumlahMateri,
      icon: BookMarked,
      color: "text-orange-500 bg-orange-500/10",
    },
    {
      label: "Tugas",
      value: jumlahTugas,
      icon: ClipboardList,
      color: "text-green-600 bg-green-600/10",
    },
    {
      label: "Pengumpulan",
      value: jumlahPengumpulan,
      icon: Send,
      color: "text-purple-600 bg-purple-600/10",
    },
    {
      label: "Rata-rata Nilai",
      value: rataRataNilai !== null ? String(rataRataNilai) : "-",
      icon: Award,
      color: "text-primary bg-primary/10",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/guru/kelas")}
          className="-ml-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Kembali
        </Button>

        <div className="mt-2 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">
              {kelasMengajar.mata_pelajaran}
            </h1>
            <Badge variant="outline">{kelasMengajar.kelas}</Badge>
            <Badge className="bg-green-100 text-green-800">
              {kelasMengajar.status}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>{kelasMengajar.guru_nama}</span>
            <span>·</span>
            <span>Semester {kelasMengajar.semester}</span>
            <span>·</span>
            <span>Tahun Akademik {kelasMengajar.tahun_ajaran}</span>
            <span>·</span>
            <span>{jumlahSiswa} siswa</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-3 p-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-lg font-bold leading-none">{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs.Root
        value={tab}
        onValueChange={(value) => setTab(value as KelasTab)}
      >
        <Tabs.List className="w-full overflow-x-auto justify-start">
          {TABS.map((t) => {
            const Icon = t.icon
            return (
              <Tabs.Tab key={t.value} value={t.value}>
                <Icon className="mr-1.5 h-4 w-4" />
                {t.label}
              </Tabs.Tab>
            )
          })}
        </Tabs.List>

        <Tabs.Panel value="ringkasan">
          <KelasOverviewTab kelasMengajar={kelasMengajar} />
        </Tabs.Panel>
        <Tabs.Panel value="materi">
          <KelasMateriTab kelasMengajar={kelasMengajar} />
        </Tabs.Panel>
        <Tabs.Panel value="tugas">
          <KelasTugasTab kelasMengajar={kelasMengajar} />
        </Tabs.Panel>
        <Tabs.Panel value="pengumpulan">
          <KelasPengumpulanTab kelasMengajar={kelasMengajar} />
        </Tabs.Panel>
        <Tabs.Panel value="penilaian">
          <KelasNilaiTab kelasMengajar={kelasMengajar} />
        </Tabs.Panel>
        <Tabs.Panel value="anggota">
          <KelasAnggotaTab kelasMengajar={kelasMengajar} />
        </Tabs.Panel>
        <Tabs.Panel value="jadwal">
          <KelasJadwalTab kelasMengajar={kelasMengajar} />
        </Tabs.Panel>
        <Tabs.Panel value="pengumuman">
          <KelasPengumumanTab kelasMengajar={kelasMengajar} />
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  )
}
