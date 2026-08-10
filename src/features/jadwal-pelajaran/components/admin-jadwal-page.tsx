"use client"

import { useState, useMemo } from "react"
import { Plus, Search, Pencil, Trash2 } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSchedules } from "@/hooks/use-schedules"
import { useClasses } from "@/hooks/use-classes"
import { useTeachers } from "@/hooks/use-teachers"
import type { JadwalPelajaran } from "../types/jadwal-pelajaran"
import { HARI_OPTIONS, HARI_INDEX, STATUS_JADWAL_COLORS } from "@/features/jadwal-pelajaran/constants/jadwal-pelajaran.constants"
import { JadwalFormDialog } from "./jadwal-form-dialog"
import { JadwalDeleteDialog } from "./jadwal-delete-dialog"

export function AdminJadwalPage() {
  const { data: jadwalData = [], isLoading, refetch } = useSchedules()
  const { data: classesData } = useClasses({ per_page: 200 })
  const classes = classesData?.data ?? []
  const { data: teachers } = useTeachers()
  
  const [search, setSearch] = useState("")
  const [kelasFilter, setKelasFilter] = useState("all")
  const [guruFilter, setGuruFilter] = useState("all")
  const [hariFilter, setHariFilter] = useState("all")
  
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<JadwalPelajaran | null>(null)
  const [deletingItem, setDeletingItem] = useState<JadwalPelajaran | null>(null)

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

    if (kelasFilter !== "all") {
      data = data.filter((j) => j.kelas === kelasFilter)
    }

    if (guruFilter !== "all") {
      data = data.filter((j) => j.guru_nama === guruFilter)
    }

    if (hariFilter !== "all") {
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

  function openCreate() {
    setEditingItem(null)
    setFormDialogOpen(true)
  }

  function openEdit(item: JadwalPelajaran) {
    setEditingItem(item)
    setFormDialogOpen(true)
  }

  function openDelete(item: JadwalPelajaran) {
    setDeletingItem(item)
    setDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kelola Jadwal Pelajaran"
        description="Pusat manajemen jadwal pelajaran untuk semua kelas."
        action={
          <Button onClick={openCreate} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Jadwal
          </Button>
        }
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
        <Select value={hariFilter} onValueChange={(v) => setHariFilter(v ?? "all")}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Semua Hari" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Hari</SelectItem>
            {HARI_OPTIONS.map((h) => (
              <SelectItem key={h.value} value={h.value}>
                {h.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={kelasFilter} onValueChange={(v) => setKelasFilter(v ?? "all")}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Semua Kelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kelas</SelectItem>
            {classes.map((k) => (
              <SelectItem key={k.id} value={k.name}>{k.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={guruFilter} onValueChange={(v) => setGuruFilter(v ?? "all")}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Semua Guru" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Guru</SelectItem>
            {teachers?.map((g) => (
              <SelectItem key={g.id} value={g.nama_lengkap}>{g.nama_lengkap}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-muted-foreground">
          Memuat jadwal...
        </div>
      ) : sortedHari.length === 0 ? (
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
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">Aksi</th>
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
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="mr-1 text-muted-foreground hover:text-foreground"
                            onClick={() => openEdit(jadwal)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => openDelete(jadwal)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
      
      <JadwalFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        editingItem={editingItem}
        onSuccess={() => refetch()}
      />
      <JadwalDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        item={deletingItem}
        onSuccess={() => refetch()}
      />
    </div>
  )
}
