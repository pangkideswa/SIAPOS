"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { NilaiAkademik } from "../types/nilai-akademik"
import {
  SEMESTER_OPTIONS,
  STATUS_NILAI_COLORS,
} from "../constants/nilai-akademik.constants"
import { useNilai } from "@/hooks/use-nilai"
import { NilaiAkademikDetailDialog } from "./nilai-akademik-detail-dialog"
import { DataTable, type Column } from "@/components/ui/data-table"
import { FileOutput, TrendingUp } from "lucide-react"

const PER_PAGE = 10
const SISWA_LOGIN = "Rizki Pratama"

type Row = Record<string, unknown> & {
  id: number
  mata_pelajaran: string
  guru_nama: string
  tugas: number | null
  praktik: number | null
  uts: number | null
  uas: number | null
  status: string
}

export function NilaiAkademikSiswaPage() {
  const { data = [] } = useNilai()
  const items = useMemo(
    () => data.filter((d) => d.siswa_nama === SISWA_LOGIN),
    [data]
  )
  const [search, setSearch] = useState("")
  const [semesterFilter, setSemesterFilter] = useState("semua")
  const [page, setPage] = useState(1)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<NilaiAkademik | null>(null)

  const filteredData = useMemo(() => {
    let data = [...items]
    if (search) {
      const q = search.toLowerCase()
      data = data.filter((d) => d.mata_pelajaran.toLowerCase().includes(q))
    }
    if (semesterFilter !== "semua") data = data.filter((d) => d.semester === semesterFilter)
    return data
  }, [items, search, semesterFilter])

  const totalPages = Math.ceil(filteredData.length / PER_PAGE)
  const paginatedData = filteredData.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const handleDetail = (item: NilaiAkademik) => {
    setSelectedItem(item)
    setDetailOpen(true)
  }

  const columns: Column<Row>[] = [
    { key: "mata_pelajaran", header: "Mata Pelajaran", render: (item) => <span className="font-medium">{item.mata_pelajaran}</span> },
    { key: "guru_nama", header: "Guru" },
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
  ]

  const nilaiLengkap = items.filter((d) => d.status === "Lengkap").length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nilai Akademik"
        description="Lihat nilai akademik Anda"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card size="sm">
          <CardContent className="flex items-center gap-3 p-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100 text-blue-600 shrink-0">
              <FileOutput className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Mata Pelajaran</p>
              <p className="text-lg font-bold">{items.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 p-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-green-100 text-green-600 shrink-0">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Nilai Lengkap</p>
              <p className="text-lg font-bold">{nilaiLengkap}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari mata pelajaran..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="pl-9"
          />
        </div>
        <Select value={semesterFilter} onValueChange={(v) => { setSemesterFilter(v ?? "semua"); setPage(1) }}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Semester</SelectItem>
            {SEMESTER_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable<Row>
        columns={columns}
        data={paginatedData as unknown as Row[]}
        emptyMessage="Tidak ada data nilai"
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
    </div>
  )
}
