"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSchedules } from "@/hooks/use-schedules"
import type { JadwalPelajaran } from "../types/jadwal-pelajaran"
import { HARI_OPTIONS, HARI_INDEX, STATUS_JADWAL_COLORS } from "@/features/jadwal-pelajaran/constants/jadwal-pelajaran.constants"

export function JadwalPelajaranListPage() {
  const { data: jadwalData } = useSchedules()
  const [search, setSearch] = useState("")
  const [kelasFilter, setKelasFilter] = useState("semua")
  const [guruFilter, setGuruFilter] = useState("semua")
  const [hariFilter, setHariFilter] = useState("semua")

  const kelasOptions = useMemo(
    () =>
      Array.from(new Set((jadwalData ?? []).map((j) => j.kelas))).sort(),
    [jadwalData]
  )
  const guruOptions = useMemo(
    () =>
      Array.from(new Set((jadwalData ?? []).map((j) => j.guru_nama))).sort(),
    [jadwalData]
  )

  const filteredData = useMemo(() => {
    let data = [...(jadwalData ?? [])]

    if (search) {
      const q = search.toLowerCase()
      data = data.filter(
        (j) =>
          j.mata_pelajaran.toLowerCase().includes(q) ||
          j.guru_nama.toLowerCase().includes(q) ||
          j.kelas.toLowerCase().includes(q)
      )
    }

    if (kelasFilter !== "semua") {
      data = data.filter((j) => j.kelas === kelasFilter)
    }

    if (guruFilter !== "semua") {
      data = data.filter((j) => j.guru_nama === guruFilter)
    }

    if (hariFilter !== "semua") {
      data = data.filter((j) => j.hari === hariFilter)
    }

    data.sort((a, b) => {
      const hariDiff = HARI_INDEX[a.hari] - HARI_INDEX[b.hari]
      if (hariDiff !== 0) return hariDiff
      return a.jam_mulai.localeCompare(b.jam_mulai)
    })

    return data
  }, [search, kelasFilter, guruFilter, hariFilter, jadwalData])

  const groupedByHari = useMemo(() => {
    const groups: Record<string, JadwalPelajaran[]> = {}
    for (const jadwal of filteredData) {
      if (!groups[jadwal.hari]) groups[jadwal.hari] = []
      groups[jadwal.hari].push(jadwal)
    }
    return groups
  }, [filteredData])

  const sortedHari = Object.keys(groupedByHari).sort(
    (a, b) => HARI_INDEX[a] - HARI_INDEX[b]
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jadwal Pelajaran"
        description="Kelola jadwal pelajaran"
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari mata pelajaran, guru, atau kelas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={hariFilter} onValueChange={(v) => setHariFilter(v ?? "semua")}>
          <SelectTrigger className="w-full sm:w-[140px]">
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
        <Select value={kelasFilter} onValueChange={(v) => setKelasFilter(v ?? "semua")}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Semua Kelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Kelas</SelectItem>
            {kelasOptions.map((k) => (
              <SelectItem key={k} value={k}>{k}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={guruFilter} onValueChange={(v) => setGuruFilter(v ?? "semua")}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Semua Guru" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Guru</SelectItem>
            {guruOptions.map((g) => (
              <SelectItem key={g} value={g}>{g}</SelectItem>
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
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground w-20">Jam</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Mata Pelajaran</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Guru</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Kelas</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Ruang</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Status</th>
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
                        <td className="px-4 py-3 font-medium">{jadwal.mata_pelajaran}</td>
                        <td className="px-4 py-3">{jadwal.guru_nama}</td>
                        <td className="px-4 py-3">
                          <Badge className="bg-primary/10 text-primary">{jadwal.kelas}</Badge>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                          {jadwal.ruang}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <Badge className={STATUS_JADWAL_COLORS[jadwal.status] ?? ""}>
                            {jadwal.status}
                          </Badge>
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
