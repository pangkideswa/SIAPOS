"use client"

import { useState, useMemo } from "react"
import { Plus, Search, Pin } from "lucide-react"
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
import type { Pengumuman } from "../types/pengumuman"
import {
  KATEGORI_PENGUMUMAN_OPTIONS,
  STATUS_PENGUMUMAN_OPTIONS,
  TARGET_OPTIONS,
  KATEGORI_PENGUMUMAN_COLORS,
  STATUS_PENGUMUMAN_COLORS,
} from "../constants/pengumuman.constants"
import { DUMMY_PENGUMUMAN } from "../dummy/pengumuman.data"
import { PengumumanSummaryCards } from "./pengumuman-summary-cards"
import { PengumumanFormDialog } from "./pengumuman-form-dialog"
import { PengumumanDetailDialog } from "./pengumuman-detail-dialog"
import { DataTable, type Column } from "@/components/ui/data-table"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { formatDateID } from "@/features/kalender-akademik/components/kalender-helpers"

const PER_PAGE = 10

type Row = Record<string, unknown> & {
  id: number
  judul: string
  kategori: string
  target: string
  penulis: string
  status: string
  tanggal_publish: string
  pinned: boolean
}

export function PengumumanAdminPage() {
  const [items, setItems] = useState<Pengumuman[]>(DUMMY_PENGUMUMAN)
  const [search, setSearch] = useState("")
  const [kategoriFilter, setKategoriFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [targetFilter, setTargetFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Pengumuman | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Pengumuman | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const filteredData = useMemo(() => {
    let data = [...items]
    if (search) {
      const q = search.toLowerCase()
      data = data.filter((d) => d.judul.toLowerCase().includes(q))
    }
    if (kategoriFilter !== "all") data = data.filter((d) => d.kategori === kategoriFilter)
    if (statusFilter !== "all") data = data.filter((d) => d.status === statusFilter)
    if (targetFilter !== "all") data = data.filter((d) => d.target === targetFilter)
    return data
  }, [items, search, kategoriFilter, statusFilter, targetFilter])

  const totalPages = Math.ceil(filteredData.length / PER_PAGE)
  const paginatedData = filteredData.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const handleCreate = () => {
    setEditingItem(null)
    setFormOpen(true)
  }

  const handleEdit = (item: Pengumuman) => {
    setEditingItem(item)
    setFormOpen(true)
  }

  const handleDelete = (id: number) => {
    setDeletingId(id)
    setDeleteOpen(true)
  }

  const confirmDelete = () => {
    if (deletingId !== null) {
      setItems((prev) => prev.filter((d) => d.id !== deletingId))
      setDeleteOpen(false)
      setDeletingId(null)
    }
  }

  const handleSave = (data: Pengumuman) => {
    if (editingItem) {
      setItems((prev) => prev.map((d) => (d.id === data.id ? data : d)))
    } else {
      setItems((prev) => [data, ...prev])
    }
  }

  const handleDetail = (item: Pengumuman) => {
    setSelectedItem(item)
    setDetailOpen(true)
  }

  const columns: Column<Row>[] = [
    {
      key: "judul",
      header: "Judul",
      render: (item) => (
        <div className="flex items-center gap-2">
          {item.pinned && <Pin className="h-3.5 w-3.5 text-red-500 shrink-0" />}
          <span className="font-medium">{item.judul}</span>
        </div>
      ),
    },
    {
      key: "kategori",
      header: "Kategori",
      render: (item) => (
        <Badge className={KATEGORI_PENGUMUMAN_COLORS[item.kategori as keyof typeof KATEGORI_PENGUMUMAN_COLORS] ?? ""}>
          {item.kategori}
        </Badge>
      ),
    },
    { key: "target", header: "Target" },
    { key: "penulis", header: "Penulis" },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <Badge className={STATUS_PENGUMUMAN_COLORS[item.status as keyof typeof STATUS_PENGUMUMAN_COLORS] ?? ""}>
          {item.status}
        </Badge>
      ),
    },
    {
      key: "tanggal_publish",
      header: "Tanggal Publish",
      render: (item) => formatDateID(item.tanggal_publish),
    },
    {
      key: "aksi",
      header: "Aksi",
      className: "w-[140px]",
      render: (item) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="xs"
            onClick={(e) => { e.stopPropagation(); handleEdit(items.find((d) => d.id === item.id)!) }}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="xs"
            className="text-destructive"
            onClick={(e) => { e.stopPropagation(); handleDelete(item.id) }}
          >
            Hapus
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengumuman"
        description="Kelola pengumuman dan informasi sekolah"
        action={
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-1" />
            Buat Pengumuman
          </Button>
        }
      />

      <PengumumanSummaryCards data={items} />

      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari pengumuman..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="pl-9"
          />
        </div>
        <Select value={kategoriFilter} onValueChange={(v) => { setKategoriFilter(v ?? "all"); setPage(1) }}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {KATEGORI_PENGUMUMAN_OPTIONS.map((k) => (
              <SelectItem key={k} value={k}>{k}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v ?? "all"); setPage(1) }}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            {STATUS_PENGUMUMAN_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={targetFilter} onValueChange={(v) => { setTargetFilter(v ?? "all"); setPage(1) }}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Target" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Target</SelectItem>
            {TARGET_OPTIONS.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable<Row>
        columns={columns}
        data={paginatedData as unknown as Row[]}
        emptyMessage="Tidak ada data pengumuman"
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

      <PengumumanFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        data={editingItem}
        onSave={handleSave}
      />

      <PengumumanDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        data={selectedItem}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Hapus Pengumuman"
        description="Apakah Anda yakin ingin menghapus pengumuman ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={confirmDelete}
      />
    </div>
  )
}
