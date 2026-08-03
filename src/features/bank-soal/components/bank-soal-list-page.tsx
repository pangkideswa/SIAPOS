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
import { BankSoalFormDialog } from "./bank-soal-form-dialog"
import { BankSoalDeleteDialog } from "./bank-soal-delete-dialog"
import {
  TIPE_SOAL_COLORS, KESULITAN_COLORS, STATUS_BANK_SOAL_COLORS,
  MATA_PELAJARAN_OPTIONS, GURU_BANK_SOAL_OPTIONS,
  KESULITAN_OPTIONS, TIPE_SOAL_OPTIONS, STATUS_BANK_SOAL_OPTIONS,
} from "../constants/bank-soal.constants"
import { DUMMY_BANK_SOAL } from "../dummy/bank-soal.data"
import type { BankSoal, BankSoalFormData } from "../types/bank-soal"

export function BankSoalListPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [tipeFilter, setTipeFilter] = useState<string>("all")
  const [mapelFilter, setMapelFilter] = useState<string>("all")
  const [guruFilter, setGuruFilter] = useState<string>("all")
  const [kesulitanFilter, setKesulitanFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [FormDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<BankSoal | null>(null)
  const [deletingItem, setDeletingItem] = useState<BankSoal | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<BankSoal[]>(DUMMY_BANK_SOAL)

  const perPage = 10

  const filteredData = data.filter((item) => {
    const matchesSearch =
      !search ||
      item.kode_soal.toLowerCase().includes(search.toLowerCase()) ||
      item.pertanyaan.toLowerCase().includes(search.toLowerCase()) ||
      item.mata_pelajaran.toLowerCase().includes(search.toLowerCase()) ||
      item.guru_nama.toLowerCase().includes(search.toLowerCase())
    const matchesTipe = tipeFilter === "all" || item.tipe_soal === tipeFilter
    const matchesMapel = mapelFilter === "all" || item.mata_pelajaran === mapelFilter
    const matchesGuru = guruFilter === "all" || item.guru_nama === guruFilter
    const matchesKesulitan = kesulitanFilter === "all" || item.kesulitan === kesulitanFilter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesTipe && matchesMapel && matchesGuru && matchesKesulitan && matchesStatus
  })

  const paginatedData = filteredData.slice((page - 1) * perPage, page * perPage)

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "kode_soal",
      header: "Kode",
      render: (item) => <span className="font-mono text-xs">{String(item.kode_soal)}</span>,
    },
    {
      key: "pertanyaan",
      header: "Pertanyaan",
      render: (item) => <span className="line-clamp-1 max-w-[200px]">{String(item.pertanyaan)}</span>,
    },
    { key: "mata_pelajaran", header: "Mapel", render: (item) => String(item.mata_pelajaran) },
    { key: "guru_nama", header: "Guru", render: (item) => String(item.guru_nama) },
    {
      key: "tipe_soal",
      header: "Tipe",
      render: (item) => <Badge className={TIPE_SOAL_COLORS[String(item.tipe_soal)]}>{String(item.tipe_soal)}</Badge>,
    },
    {
      key: "kesulitan",
      header: "Kesulitan",
      render: (item) => <Badge className={KESULITAN_COLORS[String(item.kesulitan)]}>{String(item.kesulitan)}</Badge>,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <Badge className={STATUS_BANK_SOAL_COLORS[String(item.status)]}>{String(item.status)}</Badge>,
    },
    {
      key: "actions",
      header: "",
      className: "w-[120px]",
      render: (item) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Lihat" aria-label="Lihat" onClick={() => router.push(`/admin/bank-soal/${item.id}`)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" aria-label="Edit" onClick={() => { setEditingItem(item as unknown as BankSoal); setFormDialogOpen(true) }}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Salin" aria-label="Salin" onClick={() => toast.success(`Soal ${String(item.kode_soal)} berhasil disalin`)}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" title="Hapus" aria-label="Hapus" onClick={() => { setDeletingItem(item as unknown as BankSoal); setDeleteDialogOpen(true) }}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  async function handleSubmit(formData: BankSoalFormData) {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    if (editingItem) {
      setData((prev) => prev.map((d) => d.id === editingItem.id ? { ...d, ...formData, updated_at: new Date().toISOString() } : d))
      toast.success("Soal berhasil diperbarui")
    } else {
      const newItem: BankSoal = {
        ...formData,
        id: Math.max(...data.map((d) => d.id)) + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setData((prev) => [newItem, ...prev])
      toast.success("Soal berhasil ditambahkan")
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
    toast.success("Soal berhasil dihapus")
    setIsLoading(false)
    setDeleteDialogOpen(false)
    setDeletingItem(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bank Soal"
        description="Kelola soal-soal untuk ujian dan penilaian"
        action={
          <Button onClick={() => { setEditingItem(null); setFormDialogOpen(true) }}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Soal
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari kode, pertanyaan, mapel, guru..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="pl-9" />
        </div>
        <Select value={tipeFilter} onValueChange={(v) => { if (v) { setTipeFilter(v); setPage(1) } }}>
          <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Semua Tipe" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tipe</SelectItem>
            {TIPE_SOAL_OPTIONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
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
            {GURU_BANK_SOAL_OPTIONS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={kesulitanFilter} onValueChange={(v) => { if (v) { setKesulitanFilter(v); setPage(1) } }}>
          <SelectTrigger className="w-full sm:w-[130px]"><SelectValue placeholder="Semua Level" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Level</SelectItem>
            {KESULITAN_OPTIONS.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { if (v) { setStatusFilter(v); setPage(1) } }}>
          <SelectTrigger className="w-full sm:w-[130px]"><SelectValue placeholder="Semua Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            {STATUS_BANK_SOAL_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={paginatedData as unknown as Record<string, unknown>[]}
        columns={columns}
        emptyMessage="Tidak ada soal ditemukan"
        onRowClick={(row) => router.push(`/admin/bank-soal/${(row as unknown as BankSoal).id}`)}
      />

      <BankSoalFormDialog
        open={FormDialogOpen}
        onOpenChange={setFormDialogOpen}
        editingItem={editingItem}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      <BankSoalDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        item={deletingItem}
        onConfirm={handleConfirmDelete}
        isLoading={isLoading}
      />
    </div>
  )
}
