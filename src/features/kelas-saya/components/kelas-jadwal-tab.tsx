"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { useClassroom } from "@/hooks/use-classroom"
import type { KelasMengajar } from "@/features/kelas-mengajar/types/kelas-mengajar"

interface KelasJadwalTabProps {
  kelasMengajar: KelasMengajar
}

const HARI_URUTAN = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
]

const HARI_COLORS: Record<string, string> = {
  Senin: "bg-blue-100 text-blue-700",
  Selasa: "bg-green-100 text-green-700",
  Rabu: "bg-yellow-100 text-yellow-700",
  Kamis: "bg-purple-100 text-purple-700",
  Jumat: "bg-red-100 text-red-700",
  Sabtu: "bg-orange-100 text-orange-700",
  Minggu: "bg-gray-100 text-gray-700",
}

export function KelasJadwalTab({ kelasMengajar }: KelasJadwalTabProps) {
  const classroom = useClassroom()
  const jadwalList = classroom.getKelasJadwal(kelasMengajar.kelas)

  const jadwalByHari = HARI_URUTAN.map((hari) => ({
    hari,
    jadwal: jadwalList
      .filter((j) => j.hari === hari)
      .sort((a, b) => a.waktu_mulai.localeCompare(b.waktu_mulai)),
  })).filter((g) => g.jadwal.length > 0)

  if (jadwalList.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="Belum Ada Jadwal"
        description="Jadwal pelajaran belum ditetapkan untuk kelas ini."
      />
    )
  }

  return (
    <div className="space-y-4">
      {jadwalByHari.map((group) => (
        <Card key={group.hari}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  HARI_COLORS[group.hari] ?? "bg-gray-100 text-gray-700"
                }`}
              >
                {group.hari}
              </span>
              <span className="text-sm text-muted-foreground font-normal">
                {group.jadwal.length} jam pelajaran
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {group.jadwal.map((j) => (
              <div
                key={j.id}
                className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">
                      {j.waktu_mulai} - {j.waktu_selesai}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{j.mata_pelajaran}</p>
                    <p className="text-xs text-muted-foreground">{j.guru_nama}</p>
                  </div>
                </div>
                </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
