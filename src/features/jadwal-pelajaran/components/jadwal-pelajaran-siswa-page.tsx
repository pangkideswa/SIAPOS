"use client"

import { useMemo, useState } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { useClassroom } from "@/hooks/use-classroom"
import { useSchedules } from "@/hooks/use-schedules"
import type { JadwalPelajaran } from "../types/jadwal-pelajaran"
import { HARI_OPTIONS, HARI_INDEX } from "@/features/jadwal-pelajaran/constants/jadwal-pelajaran.constants"

export function JadwalPelajaranSiswaPage() {
  const { user } = useAuth()
  const classroom = useClassroom()
  const { data: jadwalData } = useSchedules()
  const [hariFilter, setHariFilter] = useState("semua")

  const siswa = classroom.getSiswaByUser(user)
  const siswaKelas = siswa?.kelas ?? ""

  const jadwalKelas = useMemo(
    () =>
      (jadwalData ?? [])
        .filter(
          (j) => j.kelas === siswaKelas && j.status === "Aktif"
        )
        .sort((a, b) => {
          const hariDiff = HARI_INDEX[a.hari] - HARI_INDEX[b.hari]
          if (hariDiff !== 0) return hariDiff
          return a.jam_mulai.localeCompare(b.jam_mulai)
        }),
    [jadwalData, siswaKelas]
  )

  const filteredJadwal = useMemo(
    () =>
      hariFilter === "semua"
        ? jadwalKelas
        : jadwalKelas.filter((j) => j.hari === hariFilter),
    [hariFilter, jadwalKelas]
  )

  const groupedByHari = useMemo(() => {
    const groups: Record<string, JadwalPelajaran[]> = {}
    for (const jadwal of filteredJadwal) {
      if (!groups[jadwal.hari]) groups[jadwal.hari] = []
      groups[jadwal.hari].push(jadwal)
    }
    return groups
  }, [filteredJadwal])

  const sortedHari = Object.keys(groupedByHari).sort(
    (a, b) => HARI_INDEX[a] - HARI_INDEX[b]
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jadwal Pelajaran"
        description={`Jadwal pelajaran kelas ${siswaKelas}`}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <Select value={hariFilter} onValueChange={(v) => setHariFilter(v ?? "semua")}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Semua Hari" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Hari</SelectItem>
            {HARI_OPTIONS.map((h) => (
              <SelectItem key={h.value} value={h.value}>
                {h.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {sortedHari.length === 0 ? (
        <Card>
          <CardContent>
            <p className="text-center text-muted-foreground py-8">
              Tidak ada jadwal ditemukan
            </p>
          </CardContent>
        </Card>
      ) : (
        sortedHari.map((hari) => (
          <Card key={hari}>
            <CardHeader>
              <CardTitle className="text-lg">{hari}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground w-28">
                        Jam
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                        Mata Pelajaran
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                        Guru
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                        Ruang
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedByHari[hari].map((jadwal, index) => (
                      <tr
                        key={jadwal.id}
                        className={
                          index < groupedByHari[hari].length - 1
                            ? "border-b border-border"
                            : ""
                        }
                      >
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {jadwal.jam_mulai} - {jadwal.jam_selesai}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {jadwal.mata_pelajaran}
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          {jadwal.guru_nama}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                          <Badge variant="outline">{jadwal.ruang}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
