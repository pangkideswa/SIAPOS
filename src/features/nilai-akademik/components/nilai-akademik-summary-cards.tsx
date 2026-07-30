import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Users, GraduationCap, ClipboardCheck, ClipboardX, FileOutput } from "lucide-react"
import type { NilaiAkademik } from "../types/nilai-akademik"

interface Props {
  data: NilaiAkademik[]
}

export function NilaiAkademikSummaryCards({ data }: Props) {
  const totalData = data.length
  const totalMapel = new Set(data.map((d) => d.mata_pelajaran)).size
  const totalGuru = new Set(data.map((d) => d.guru_nama)).size
  const totalSiswa = new Set(data.map((d) => d.siswa_nama)).size
  const dataLengkap = data.filter((d) => d.status === "Lengkap").length
  const dataBelumLengkap = data.filter((d) => d.status === "Belum Lengkap").length

  const cards = [
    {
      icon: FileOutput,
      label: "Total Nilai",
      value: totalData,
      color: "text-blue-600 bg-blue-100",
    },
    {
      icon: BookOpen,
      label: "Mata Pelajaran",
      value: totalMapel,
      color: "text-purple-600 bg-purple-100",
    },
    {
      icon: Users,
      label: "Guru",
      value: totalGuru,
      color: "text-orange-600 bg-orange-100",
    },
    {
      icon: GraduationCap,
      label: "Siswa",
      value: totalSiswa,
      color: "text-cyan-600 bg-cyan-100",
    },
    {
      icon: ClipboardCheck,
      label: "Data Lengkap",
      value: dataLengkap,
      color: "text-green-600 bg-green-100",
    },
    {
      icon: ClipboardX,
      label: "Data Belum Lengkap",
      value: dataBelumLengkap,
      color: "text-yellow-600 bg-yellow-100",
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card) => (
        <Card key={card.label} size="sm">
          <CardContent className="flex items-center gap-3 p-3">
            <div className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${card.color}`}>
              <card.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground truncate">{card.label}</p>
              <p className="text-lg font-bold">{card.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
