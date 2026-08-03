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
import { Plus, Pencil, Trash2, Eye, Search } from "lucide-react"
import { toast } from "sonner"
import { CBTFormDialog } from "./cbt-form-dialog"
import { CBTDeleteDialog } from "./cbt-delete-dialog"
import {
  STATUS_CBT_COLORS,
  STATUS_CBT_OPTIONS,
  MATA_PELAJARAN_OPTIONS,
  KELAS_OPTIONS,
} from "../constants/cbt.constants"
import { DUMMY_CBT } from "../dummy/cbt.data"
import { DUMMY_PAKET_SOAL } from "@/features/paket-soal/dummy/paket-soal.data"
import type { CBTExam, CBTExamFormData } from "../types/cbt"

export function CBTListPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [mapelFilter, setMapelFilter] = useState<string>("all")
  const [kelasFilter, setKelasFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [FormDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<CBTExam | null>(null)
  const [deletingItem, setDeletingItem] = useState<CBTExam | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<CBTExam[]>(DUMMY_CBT)

  const perPage = 10

  const filteredData = data.filter((item) => {
    const matchesSearch =
      !search ||
      item.nama_ujian.toLowerCase().includes(search.toLowerCase()) ||
      item.kelas.toLowerCase().includes(search.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(search.toLowerCase())
    const matchesMapel = mapelFilter === "all" || getPaketSoal(item.paket_soal_id)?.mata_pelajaran === mapelFilter
    const matchesKelas = kelasFilter === "all" || item.kelas === kelasFilter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesMapel && matchesKelas && matchesStatus
  })

  const paginatedData = filteredData.slice((page - 1) * perPage, page * perPage)

  function getPaketSoal(id: number) {
    return DUMMY_PAKET_SOAL.find((p) => p.id === id) ?? null
  }

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "nama_ujian",
      header: "Nama Ujian",
      render: (item) => {
        const paket = getPaketSoal(item.paket_soal_id as number)
        return (
          <div>
            <p className="font-medium">{String(item.nama_ujian)}</p>
            <p className="text-xs text-muted-foreground">{paket?.nama_paket ?? "—"}</p>
          </div>
        )
      },
    },
    {
      key: "mapel",
      header: "Mapel",
      render: (item) => {
        const paket = getPaketSoal(item.paket_soal_id as number)
        return paket?.mata_pelajaran ?? "—"
      },
    },
    {
      key: "guru",
      header: "Guru",
      render: (item) => {
        const paket = getPaketSoal(item.paket_soal_id as number)
        return paket?.guru_nama ?? "—"
      },
    },
    { key: "kelas", header: "Kelas", render: (item) => String(item.kelas) },
    {
      key: "durasi",
      header: "Durasi",
      render: (item) => <span>{String(item.durasi)} mnt</span>,
    },
    {
      key: "jadwal",
      header: "Jadwal",
      render: (item) => (
        <span className="text-xs">
          {new Date(String(item.tanggal_mulai)).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
          {" — "}
          {new Date(String(item.tanggal_berakhir)).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <Badge className={STATUS_CBT_COLORS[String(item.status)]}>{String(item.status)}</Badge>,
    },
    {
      key: "actions",
      header: "",
      className: "w-[100px]",
      render: (item) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Lihat" aria-label="Lihat" onClick={() => router.push(`/guru/cbt/${item.id}`)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" aria-label="Edit" onClick={() => { setEditingItem(item as unknown as CBTExam); setFormDialogOpen(true) }}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" title="Hapus" aria-label="Hapus" onClick={() => { setDeletingItem(item as unknown as CBTExam); setDeleteDialogOpen(true) }}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  async function handleSubmit(formData: CBTExamFormData) {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    if (editingItem) {
      setData((prev) => prev.map((d) => d.id === editingItem.id ? { ...d, ...formData, updated_at: new Date().toISOString() } : d))
      toast.success("CBT berhasil diperbarui")
    } else {
      const newItem: CBTExam = {
        ...formData,
        id: Math.max(...data.map((d) => d.id)) + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setData((prev) => [newItem, ...prev])
      toast.success("CBT berhasil ditambahkan")
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
    toast.success("CBT berhasil dihapus")
    setIsLoading(false)
    setDeleteDialogOpen(false)
    setDeletingItem(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="CBT (Computer Based Test)"
        description="Kelola ujian berbasis komputer"
        action={
          <Button onClick={() => { setEditingItem(null); setFormDialogOpen(true) }}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah CBT
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari nama ujian, kelas..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="pl-9" />
        </div>
        <Select value={mapelFilter} onValueChange={(v) => { if (v) { setMapelFilter(v); setPage(1) } }}>
          <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Semua Mapel" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Mapel</SelectItem>
            {MATA_PELAJARAN_OPTIONS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={kelasFilter} onValueChange={(v) => { if (v) { setKelasFilter(v); setPage(1) } }}>
          <SelectTrigger className="w-full sm:w-[140px]"><SelectValue placeholder="Semua Kelas" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kelas</SelectItem>
            {KELAS_OPTIONS.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { if (v) { setStatusFilter(v); setPage(1) } }}>
          <SelectTrigger className="w-full sm:w-[130px]"><SelectValue placeholder="Semua Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            {STATUS_CBT_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={paginatedData as unknown as Record<string, unknown>[]}
        columns={columns}
        emptyMessage="Tidak ada ujian CBT ditemukan"
        onRowClick={(row) => router.push(`/guru/cbt/${(row as unknown as CBTExam).id}`)}
      />

      <CBTFormDialog
        open={FormDialogOpen}
        onOpenChange={setFormDialogOpen}
        editingItem={editingItem}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      <CBTDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        item={deletingItem}
        onConfirm={handleConfirmDelete}
        isLoading={isLoading}
      />
    </div>
  )
}
