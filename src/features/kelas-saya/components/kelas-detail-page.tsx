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
  GraduationCap,
} from "lucide-react"
import { getKelasMengajarById } from "@/features/kelas-saya/lib/kelas-saya-helpers"
import { KelasOverviewTab } from "@/features/kelas-saya/components/kelas-overview-tab"
import { KelasMateriTab } from "@/features/kelas-saya/components/kelas-materi-tab"
import { KelasTugasTab } from "@/features/kelas-saya/components/kelas-tugas-tab"
import { KelasAnggotaTab } from "@/features/kelas-saya/components/kelas-anggota-tab"
import { KelasPengumpulanTab } from "@/features/kelas-saya/components/kelas-pengumpulan-tab"

type KelasTab = "overview" | "materi" | "tugas" | "pengumpulan" | "anggota"

const TABS: { value: KelasTab; label: string; icon: typeof LayoutDashboard }[] = [
  { value: "overview", label: "Overview", icon: LayoutDashboard },
  { value: "materi", label: "Materi", icon: BookOpen },
  { value: "tugas", label: "Tugas", icon: ClipboardList },
  { value: "pengumpulan", label: "Pengumpulan", icon: GraduationCap },
  { value: "anggota", label: "Anggota", icon: Users },
]

export function KelasDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const kelasMengajar = getKelasMengajarById(Number(resolvedParams.id))
  const [tab, setTab] = useState<KelasTab>("overview")

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
        <Tabs.Panel value="anggota">
          <KelasAnggotaTab kelasMengajar={kelasMengajar} />
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  )
}
