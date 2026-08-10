"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { EmptyState } from "@/components/ui/empty-state"
import { Award, Search, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { getInitials } from "@/features/kelas-saya/lib/kelas-saya-helpers"
import { useClassroom } from "@/hooks/use-classroom"
import type { KelasMengajar } from "@/features/kelas-mengajar/types/kelas-mengajar"

interface KelasNilaiTabProps {
  kelasMengajar: KelasMengajar
}

interface NilaiSiswa {
  siswaNama: string
  nis: string
  rataRata: number | null
  tugasDinilai: number
  totalTugas: number
}

function getTrendIcon(rataRata: number | null) {
  if (rataRata === null) return <Minus className="h-3.5 w-3.5 text-muted-foreground" />
  if (rataRata >= 80) return <TrendingUp className="h-3.5 w-3.5 text-green-600" />
  if (rataRata >= 60) return <Minus className="h-3.5 w-3.5 text-yellow-600" />
  return <TrendingDown className="h-3.5 w-3.5 text-red-600" />
}

function getNilaiColor(rataRata: number | null) {
  if (rataRata === null) return "bg-muted text-muted-foreground"
  if (rataRata >= 80) return "bg-green-100 text-green-700"
  if (rataRata >= 60) return "bg-yellow-100 text-yellow-700"
  return "bg-red-100 text-red-700"
}

export function KelasNilaiTab({ kelasMengajar }: KelasNilaiTabProps) {
  const [search, setSearch] = useState("")

  const classroom = useClassroom()
  const tugasList = classroom.getKelasTugas(kelasMengajar.id)
  const anggota = classroom.getAnggotaKelas(kelasMengajar.kelas)

  const nilaiData = useMemo<NilaiSiswa[]>(() => {
    return anggota.map((siswa) => {
      const gradedSubmissions = tugasList.reduce<{
        total: number
        count: number
      }>(
        (acc, tugas) => {
          const submissions = classroom.getTugasPengumpulan(tugas.id)
          const sub = submissions.find(
            (p) => p.siswa_id === siswa.id && p.nilai !== null
          )
          if (sub && sub.nilai !== null) {
            return { total: acc.total + sub.nilai, count: acc.count + 1 }
          }
          return acc
        },
        { total: 0, count: 0 }
      )

      return {
        siswaNama: siswa.nama_lengkap,
        nis: siswa.nis,
        rataRata:
          gradedSubmissions.count > 0
            ? Math.round(gradedSubmissions.total / gradedSubmissions.count)
            : null,
        tugasDinilai: gradedSubmissions.count,
        totalTugas: tugasList.length,
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anggota, tugasList, classroom.submissions])

  const filtered = nilaiData.filter(
    (n) =>
      !search ||
      n.siswaNama.toLowerCase().includes(search.toLowerCase()) ||
      n.nis.includes(search)
  )

  const rataRataKelas = useMemo(() => {
    const graded = nilaiData.filter((n) => n.rataRata !== null)
    if (graded.length === 0) return null
    return Math.round(
      graded.reduce((sum, n) => sum + (n.rataRata ?? 0), 0) / graded.length
    )
  }, [nilaiData])

  if (tugasList.length === 0) {
    return (
      <EmptyState
        icon={Award}
        title="Belum Ada Tugas"
        description="Buat tugas terlebih dahulu di tab Tugas untuk mulai menilai."
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Card className="inline-flex">
            <CardContent className="flex items-center gap-2 px-4 py-2">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Rata-rata Kelas:</span>
              <Badge className={getNilaiColor(rataRataKelas)}>
                {rataRataKelas !== null ? rataRataKelas : "-"}
              </Badge>
            </CardContent>
          </Card>
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau NIS..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Tidak Ada Siswa"
          description="Tidak ada siswa yang sesuai dengan pencarian."
        />
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="hidden md:grid grid-cols-[minmax(0,2fr)_1fr_1fr_1fr_0.8fr] gap-3 bg-muted/50 px-4 py-2.5 text-xs font-medium text-muted-foreground">
            <span>Siswa</span>
            <span className="text-center">Rata-rata</span>
            <span className="text-center">Tugas Dinilai</span>
            <span className="text-center">Total Tugas</span>
            <span className="text-right">Status</span>
          </div>
          <div className="divide-y divide-border">
            {filtered.map((nilai) => (
              <div
                key={nilai.nis}
                className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_1fr_1fr_1fr_0.8fr] gap-2 md:gap-3 px-4 py-3 items-center"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">
                    {getInitials(nilai.siswaNama)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {nilai.siswaNama}
                    </p>
                    <p className="text-xs text-muted-foreground">{nilai.nis}</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1.5">
                  {getTrendIcon(nilai.rataRata)}
                  <Badge className={getNilaiColor(nilai.rataRata)}>
                    {nilai.rataRata !== null ? nilai.rataRata : "-"}
                  </Badge>
                </div>

                <p className="text-sm text-center">{nilai.tugasDinilai}</p>
                <p className="text-sm text-center">{nilai.totalTugas}</p>

                <div className="md:text-right">
                  <Badge
                    variant="secondary"
                    className={
                      nilai.rataRata !== null
                        ? nilai.rataRata >= 60
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {nilai.rataRata !== null
                      ? nilai.rataRata >= 60
                        ? "Lulus"
                        : "Perlu Perbaikan"
                      : "Belum Dinilai"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
