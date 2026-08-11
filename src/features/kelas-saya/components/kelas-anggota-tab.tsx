"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Users, Search, Phone, Hash } from "lucide-react"
import { useState } from "react"
import { EmptyState } from "@/components/ui/empty-state"
import { getInitials } from "@/lib/utils"
import { useClassroom } from "@/hooks/use-classroom"
import type { KelasMengajar } from "@/features/kelas-mengajar/types/kelas-mengajar"

interface KelasAnggotaTabProps {
  kelasMengajar: KelasMengajar
}

export function KelasAnggotaTab({ kelasMengajar }: KelasAnggotaTabProps) {
  const [search, setSearch] = useState("")

  const classroom = useClassroom()
  const anggota = classroom.getAnggotaKelas(kelasMengajar.kelas, kelasMengajar.classroom_id).filter(
    (s) =>
      !search ||
      s.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
      s.nis.includes(search) ||
      s.nisn.includes(search)
  )

  const lakiLaki = anggota.filter((s) => s.jenis_kelamin === "Laki-laki").length
  const perempuan = anggota.filter((s) => s.jenis_kelamin === "Perempuan").length

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            {anggota.length} siswa · {lakiLaki} laki-laki · {perempuan}
            perempuan
          </span>
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

      {anggota.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Tidak Ada Siswa"
          description="Tidak ada siswa yang ditemukan pada kelas ini."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {anggota.map((siswa) => (
            <Card key={siswa.id} className="hover:ring-primary/40 transition-all">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                  {getInitials(siswa.nama_lengkap)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">
                      {siswa.nama_lengkap}
                    </p>
                    <Badge
                      variant="secondary"
                      className={
                        siswa.jenis_kelamin === "Laki-laki"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-pink-100 text-pink-700"
                      }
                    >
                      {siswa.jenis_kelamin === "Laki-laki" ? "L" : "P"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      {siswa.nis}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {siswa.no_hp_ortu}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
