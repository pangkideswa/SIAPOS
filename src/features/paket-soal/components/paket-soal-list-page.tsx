"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Plus, Pencil, Trash2, Eye, Copy, Search } from "lucide-react"
import { toast } from "sonner"
import { PaketSoalFormDialog } from "./paket-soal-form-dialog"
import { PaketSoalDeleteDialog } from "./paket-soal-delete-dialog"
import {
  STATUS_PAKET_SOAL_COLORS,
  MATA_PELAJARAN_OPTIONS,
  GURU_PAKET_SOAL_OPTIONS,
  STATUS_PAKET_SOAL_OPTIONS,
} from "../constants/paket-soal.constants"
import { DUMMY_PAKET_SOAL } from "../dummy/paket-soal.data"
import type { PaketSoal, PaketSoalFormData } from "../types/paket-soal"

export function PaketSoalListPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [mapelFilter, setMapelFilter] = useState<string>("all")
  const [guruFilter, setGuruFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [FormDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<PaketSoal | null>(null)
  const [deletingItem, setDeletingItem] = useState<PaketSoal | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<PaketSoal[]>(DUMMY_PAKET_SOAL)

  const perPage = 10

  const filteredData = data.filter((item) => {
    const matchesSearch =
      !search ||
      item.nama_paket.toLowerCase().includes(search.toLowerCase()) ||
      item.mata_pelajaran.toLowerCase().includes(search.toLowerCase()) ||
      item.guru_nama.toLowerCase().includes(search.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(search.toLowerCase())
    const matchesMapel = mapelFilter === "all" || item.mata_pelajaran === mapelFilter
    const matchesGuru = guruFilter === "all" || item.guru_nama === guruFilter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesMapel && matchesGuru && matchesStatus
  })

  const paginatedData = filteredData.slice((page - 1) * perPage, page * perPage)

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "nama_paket",
      header: "Nama Paket",
      render: (item) => (
        <div>
          <p className="font-medium">{String(item.nama_paket)}</p>
          <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{String(item.deskripsi)}</p>
        </div>
      ),
    },
    { key: "mata_pelajaran", header: "Mapel", render: (item) => String(item.mata_pelajaran) },
    { key: "guru_nama", header: "Guru", render: (item) => String(item.guru_nama) },
    {
      key: "soal_ids",
      header: "Jumlah Soal",
      render: (item) => <span className="font-medium">{(item.soal_ids as number[]).length}</span>,
    },
    {
      key: "durasi",
      header: "Durasi",
      render: (item) => <span>{String(item.durasi)} menit</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <Badge className={STATUS_PAKET_SOAL_COLORS[String(item.status)]}>{String(item.status)}</Badge>,
    },
    {
      key: "actions",
      header: "",
      className: "w-[120px]",
      render: (item) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Lihat" aria-label="Lihat" onClick={() => router.push(`/admin/paket-soal/${item.id}`)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" aria-label="Edit" onClick={() => { setEditingItem(item as unknown as PaketSoal); setFormDialogOpen(true) }}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Duplikat" aria-label="Duplikat" onClick={() => toast.success(`Paket soal ${String(item.nama_paket)} berhasil diduplikat`)}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" title="Hapus" aria-label="Hapus" onClick={() => { setDeletingItem(item as unknown as PaketSoal); setDeleteDialogOpen(true) }}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  async function handleSubmit(formData: PaketSoalFormData) {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    if (editingItem) {
      setData((prev) => prev.map((d) => d.id === editingItem.id ? { ...d, ...formData, updated_at: new Date().toISOString() } : d))
      toast.success("Paket soal berhasil diperbarui")
    } else {
      const newItem: PaketSoal = {
        ...formData,
        id: Math.max(...data.map((d) => d.id)) + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setData((prev) => [newItem, ...prev])
      toast.success("Paket soal berhasil ditambahkan")
    }
    setIsLoading(false)
    setFormDialogOpen(false)
    setEditingItem(null)
  }

  async function handleConfirmDelete() {
    if (!deletingItem) return
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    setData((prev) => prev.filter((d) => d.id !== deletingItem.id))
    toast.success("Paket soal berhasil dihapus")
    setIsLoading(false)
    setDeleteDialogOpen(false)
    setDeletingItem(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Paket Soal"
        description="Kelola paket soal untuk ujian dan penilaian"
        action={
          <Button onClick={() => { setEditingItem(null); setFormDialogOpen(true) }}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Paket
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari nama paket, mapel, guru..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="pl-9" />
        </div>
        <Select value={mapelFilter} onValueChange={(v) => { if (v) { setMapelFilter(v); setPage(1) } }}>
          <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Semua Mapel" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Mapel</SelectItem>
            {MATA_PELAJARAN_OPTIONS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={guruFilter} onValueChange={(v) => { if (v) { setGuruFilter(v); setPage(1) } }}>
          <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Semua Guru" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Guru</SelectItem>
            {GURU_PAKET_SOAL_OPTIONS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { if (v) { setStatusFilter(v); setPage(1) } }}>
          <SelectTrigger className="w-full sm:w-[130px]"><SelectValue placeholder="Semua Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            {STATUS_PAKET_SOAL_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={paginatedData as unknown as Record<string, unknown>[]}
        columns={columns}
        emptyMessage="Tidak ada paket soal ditemukan"
        onRowClick={(row) => router.push(`/admin/paket-soal/${(row as unknown as PaketSoal).id}`)}
      />

      <PaketSoalFormDialog
        open={FormDialogOpen}
        onOpenChange={setFormDialogOpen}
        editingItem={editingItem}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      <PaketSoalDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        item={deletingItem}
        onConfirm={handleConfirmDelete}
        isLoading={isLoading}
      />
    </div>
  )
}
