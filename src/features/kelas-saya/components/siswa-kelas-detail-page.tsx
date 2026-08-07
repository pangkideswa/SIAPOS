"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs } from "@/components/ui/tabs"
import {
  ArrowLeft,
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  CalendarCheck,
  Lock,
} from "lucide-react"
import { useClassroom } from "@/hooks/use-classroom"
import { SiswaKelasOverviewTab } from "@/features/kelas-saya/components/siswa-kelas-overview-tab"
import { SiswaKelasMateriTab } from "@/features/kelas-saya/components/siswa-kelas-materi-tab"
import { SiswaKelasTugasTab } from "@/features/kelas-saya/components/siswa-kelas-tugas-tab"
import { SiswaKelasAbsensiTab } from "@/features/kelas-saya/components/siswa-kelas-absensi-tab"

type KelasTab = "overview" | "materi" | "tugas" | "absensi"

const TABS: { value: KelasTab; label: string; icon: typeof LayoutDashboard }[] =
  [
    { value: "overview", label: "Ringkasan", icon: LayoutDashboard },
    { value: "materi", label: "Materi", icon: BookOpen },
    { value: "tugas", label: "Tugas", icon: ClipboardList },
    { value: "absensi", label: "Absensi", icon: CalendarCheck },
  ]

export function SiswaKelasDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const classroom = useClassroom()
  const kelasMengajar = classroom.getKelasMengajarById(Number(resolvedParams.id))
  const siswa = classroom.getSiswaByUser(user)
  const [tab, setTab] = useState<KelasTab>("overview")

  if (!kelasMengajar) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/siswa/kelas")}
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

  if (!siswa || siswa.kelas !== kelasMengajar.kelas) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/siswa/kelas")}
          className="-ml-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Kembali ke Kelas Saya
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted mb-4">
              <Lock className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold">Akses Terbatas</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Anda tidak terdaftar pada kelas{" "}
              {kelasMengajar.mata_pelajaran} kelas {kelasMengajar.kelas}.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/siswa/kelas")}
          className="-ml-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Kembali ke Kelas Saya
        </Button>
        <div className="mt-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">
              {kelasMengajar.mata_pelajaran}
            </h1>
            <Badge variant="outline">{kelasMengajar.kelas}</Badge>
            <Badge className="bg-green-100 text-green-800">Aktif</Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            {kelasMengajar.guru_nama} · Semester {kelasMengajar.semester} ·
            Tahun Ajaran {kelasMengajar.tahun_ajaran}
          </p>
        </div>
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

        <Tabs.Panel value="overview">
          <SiswaKelasOverviewTab
            kelasMengajar={kelasMengajar}
            siswa={siswa}
          />
        </Tabs.Panel>
        <Tabs.Panel value="materi">
          <SiswaKelasMateriTab kelasMengajar={kelasMengajar} />
        </Tabs.Panel>
        <Tabs.Panel value="tugas">
          <SiswaKelasTugasTab kelasMengajar={kelasMengajar} siswa={siswa} />
        </Tabs.Panel>
        <Tabs.Panel value="absensi">
          <SiswaKelasAbsensiTab kelasMengajar={kelasMengajar} />
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  )
}
