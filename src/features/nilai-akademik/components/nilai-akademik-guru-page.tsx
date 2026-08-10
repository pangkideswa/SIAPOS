"use client"

import { useState, useMemo } from "react"
import { Search, Pencil } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { NilaiAkademik } from "../types/nilai-akademik"
import {
  MATA_PELAJARAN_OPTIONS,
  KELAS_OPTIONS,
  STATUS_NILAI_COLORS,
} from "../constants/nilai-akademik.constants"
import { useNilai, useUpdateNilai } from "@/hooks/use-nilai"
import type { NilaiUpdateData } from "@/lib/services/nilai.service"
import { NilaiAkademikDetailDialog } from "./nilai-akademik-detail-dialog"
import { NilaiAkademikFormDialog } from "./nilai-akademik-form-dialog"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Card, CardContent } from "@/components/ui/card"
import { ClipboardX, FileOutput } from "lucide-react"

const PER_PAGE = 10
const GURU_LOGIN = "Asep Nugraha"

type Row = Record<string, unknown> & {
  id: number
  siswa_nama: string
  siswa_kelas: string
  mata_pelajaran: string
  guru_nama: string
  tugas: number | null
  praktik: number | null
  uts: number | null
  uas: number | null
  status: string
}

export function NilaiAkademikGuruPage() {
  const { data = [] } = useNilai()
  const updateNilai = useUpdateNilai()
  const items = useMemo(
    () => data.filter((d) => d.guru_nama === GURU_LOGIN),
    [data]
  )
  const [search, setSearch] = useState("")
  const [mapelFilter, setMapelFilter] = useState("semua")
  const [kelasFilter, setKelasFilter] = useState("semua")
  const [page, setPage] = useState(1)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<NilaiAkademik | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<NilaiAkademik | null>(null)

  const filteredData = useMemo(() => {
    let data = [...items]
    if (search) {
      const q = search.toLowerCase()
      data = data.filter((d) => d.siswa_nama.toLowerCase().includes(q))
    }
    if (mapelFilter !== "semua") data = data.filter((d) => d.mata_pelajaran === mapelFilter)
    if (kelasFilter !== "semua") data = data.filter((d) => d.siswa_kelas === kelasFilter)
    return data
  }, [items, search, mapelFilter, kelasFilter])

  const totalPages = Math.ceil(filteredData.length / PER_PAGE)
  const paginatedData = filteredData.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const belumDiinput = items.filter((d) => d.status === "Belum Lengkap").length

  const handleDetail = (item: NilaiAkademik) => {
    setSelectedItem(item)
    setDetailOpen(true)
  }

  const handleEdit = (item: NilaiAkademik) => {
    setEditingItem(item)
    setFormOpen(true)
  }

  const handleSave = (data: NilaiAkademik) => {
    const payload: NilaiUpdateData = {
      tugas: data.tugas,
      praktik: data.praktik,
      uts: data.uts,
      uas: data.uas,
      semester: data.semester,
      tahun_ajaran: data.tahun_ajaran,
    }
    updateNilai.mutate({ id: data.id, data: payload })
  }

  const columns: Column<Row>[] = [
    { key: "siswa_nama", header: "Nama Siswa", render: (item) => <span className="font-medium">{item.siswa_nama}</span> },
    { key: "siswa_kelas", header: "Kelas" },
    { key: "mata_pelajaran", header: "Mata Pelajaran" },
    {
      key: "tugas",
      header: "Tugas",
      render: (item) => (item.tugas !== null ? item.tugas : "-"),
      className: "text-center",
    },
    {
      key: "praktik",
      header: "Praktik",
      render: (item) => (item.praktik !== null ? item.praktik : "-"),
      className: "text-center",
    },
    {
      key: "uts",
      header: "UTS",
      render: (item) => (item.uts !== null ? item.uts : "-"),
      className: "text-center",
    },
    {
      key: "uas",
      header: "UAS",
      render: (item) => (item.uas !== null ? item.uas : "-"),
      className: "text-center",
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <Badge className={STATUS_NILAI_COLORS[item.status as keyof typeof STATUS_NILAI_COLORS] ?? ""}>
          {item.status}
        </Badge>
      ),
    },
    {
      key: "aksi",
      header: "Aksi",
      className: "w-[80px]",
      render: (item) => (
        <Button
          variant="ghost"
          size="xs"
          aria-label="Input atau edit nilai"
          onClick={(e) => { e.stopPropagation(); handleEdit(items.find((d) => d.id === item.id)!) }}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nilai Akademik"
        description="Input dan kelola nilai akademik kelas yang Anda ampu"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card size="sm">
          <CardContent className="flex items-center gap-3 p-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100 text-blue-600 shrink-0">
              <FileOutput className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Nilai</p>
              <p className="text-lg font-bold">{items.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 p-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-green-100 text-green-600 shrink-0">
              <FileOutput className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Data Lengkap</p>
              <p className="text-lg font-bold">{items.filter((d) => d.status === "Lengkap").length}</p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 p-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-yellow-100 text-yellow-600 shrink-0">
              <ClipboardX className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Belum Diinput</p>
              <p className="text-lg font-bold">{belumDiinput}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari siswa..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="pl-9"
          />
        </div>
        <Select value={mapelFilter} onValueChange={(v) => { setMapelFilter(v ?? "semua"); setPage(1) }}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Mata Pelajaran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Mapel</SelectItem>
            {MATA_PELAJARAN_OPTIONS.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={kelasFilter} onValueChange={(v) => { setKelasFilter(v ?? "semua"); setPage(1) }}>
          <SelectTrigger className="w-full sm:w-[130px]">
            <SelectValue placeholder="Kelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Kelas</SelectItem>
            {KELAS_OPTIONS.map((k) => (
              <SelectItem key={k} value={k}>{k}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable<Row>
        columns={columns}
        data={paginatedData as unknown as Row[]}
        emptyMessage="Tidak ada data nilai ditemukan"
        onRowClick={(item) => handleDetail(items.find((d) => d.id === item.id)!)}
      />
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Menampilkan {(page - 1) * PER_PAGE + 1}-
            {Math.min(page * PER_PAGE, filteredData.length)} dari{" "}
            {filteredData.length} data
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm rounded-md border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 text-sm rounded-md border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}

      <NilaiAkademikDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        data={selectedItem}
      />

      <NilaiAkademikFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        data={editingItem}
        onSave={handleSave}
      />
    </div>
  )
}
