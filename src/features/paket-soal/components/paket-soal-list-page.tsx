"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Plus, Pencil, Trash2, Eye, Copy, Search, Sparkles, FileText } from "lucide-react"
import { toast } from "sonner"
import { PaketSoalFormDialog } from "./paket-soal-form-dialog"
import { PaketSoalDeleteDialog } from "./paket-soal-delete-dialog"
import { ImportAIDialog } from "@/features/bank-soal/components/import-ai-dialog"
import { AIPackageGeneratorDialog } from "./ai-package-generator-dialog"
import {
  STATUS_PAKET_SOAL_COLORS,
  STATUS_PAKET_SOAL_OPTIONS,
} from "../constants/paket-soal.constants"
import type { PaketSoal, PaketSoalFormData } from "../types/paket-soal"

export function PaketSoalListPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [mapelFilter, setMapelFilter] = useState<string>("semua")
  const [guruFilter, setGuruFilter] = useState<string>("semua")
  const [statusFilter, setStatusFilter] = useState<string>("semua")
  const [page, setPage] = useState(1)
  const [FormDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [aiPackageDialogOpen, setAiPackageDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<PaketSoal | null>(null)
  const [deletingItem, setDeletingItem] = useState<PaketSoal | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<PaketSoal[]>([])

  const perPage = 10

  useEffect(() => {
    fetchPaketSoal()
  }, [])

  async function fetchPaketSoal() {
    setIsLoading(true)
    try {
      const res = await fetch("/api/exams/packages")
      const json = await res.json()
      if (json.data || json.success) {
        const sourceData = Array.isArray(json.data) ? json.data : (json.data?.data || [])
        const mapped = sourceData.map((d: any) => ({
          ...d,
          kode_paket: d.kode_paket,
          nama_paket: d.judul,
          status: d.status === "PUBLISH" ? "Aktif" : "Draft",
          guru_nama: d.guru?.nama_lengkap || "Sistem",
          soal_ids: new Array(d._count?.items || 0).fill(0), // mock array length for count
          durasi: d.durasi_menit,
        }))
        setData(mapped)
      }
    } catch (error) {
      toast.error("Gagal memuat data paket soal")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredData = data.filter((item) => {
    const matchesSearch =
      !search ||
      item.nama_paket.toLowerCase().includes(search.toLowerCase()) ||
      item.mata_pelajaran.toLowerCase().includes(search.toLowerCase()) ||
      item.guru_nama.toLowerCase().includes(search.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(search.toLowerCase())
    const matchesMapel = mapelFilter === "semua" || item.mata_pelajaran === mapelFilter
    const matchesGuru = guruFilter === "semua" || item.guru_nama === guruFilter
    const matchesStatus = statusFilter === "semua" || item.status === statusFilter
    return matchesSearch && matchesMapel && matchesGuru && matchesStatus
  })

  const paginatedData = filteredData.slice((page - 1) * perPage, page * perPage)

  const mapelOptions = Array.from(new Set(data.map(d => d.mata_pelajaran))).filter(Boolean)
  const guruOptions = Array.from(new Set(data.map(d => d.guru_nama))).filter(Boolean)

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
    try {
      const dbPayload = {
        kode_paket: editingItem?.kode_paket || `PKG-${Date.now()}`,
        judul: formData.nama_paket,
        deskripsi: formData.deskripsi,
        mata_pelajaran: formData.mata_pelajaran,
        durasi_menit: formData.durasi,
        guru_id: formData.guru_id,
        status: formData.status === "Aktif" ? "PUBLISH" : "DRAFT",
        items: formData.soal_ids.map((id, index) => ({
          bank_soal_id: id,
          bobot: 1, // Default weight
          nomor_urut: index + 1
        }))
      }

      if (editingItem) {
        const res = await fetch(`/api/exams/packages/${editingItem.id}`, {
          method: "PUT",
          body: JSON.stringify(dbPayload)
        })
        if (!res.ok) throw new Error()
        toast.success("Paket soal berhasil diperbarui")
      } else {
        const res = await fetch("/api/exams/packages", {
          method: "POST",
          body: JSON.stringify(dbPayload)
        })
        if (!res.ok) throw new Error()
        toast.success("Paket soal berhasil ditambahkan")
      }
      await fetchPaketSoal()
      setFormDialogOpen(false)
      setEditingItem(null)
    } catch (err) {
      toast.error("Gagal menyimpan paket soal")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleConfirmDelete() {
    if (!deletingItem) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/exams/packages/${deletingItem.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Paket soal berhasil dihapus")
      await fetchPaketSoal()
      setDeleteDialogOpen(false)
      setDeletingItem(null)
    } catch (err) {
      toast.error("Gagal menghapus paket soal")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Paket Soal"
        description="Kelola paket soal untuk ujian dan penilaian"
        action={
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button />}>
              <Plus className="mr-2 h-4 w-4" />
              Buat Paket Soal
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[260px]">
              <DropdownMenuItem onClick={() => setAiPackageDialogOpen(true)} className="py-2.5 cursor-pointer">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center text-purple-600 font-medium">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Buat Paket Otomatis (AI)
                  </div>
                  <p className="text-[10px] text-muted-foreground ml-6">Generate soal dan rakit jadi paket</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setImportDialogOpen(true)} className="py-2.5 cursor-pointer">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center text-blue-600 font-medium">
                    <FileText className="mr-2 h-4 w-4" />
                    Import Paket (Dokumen AI)
                  </div>
                  <p className="text-[10px] text-muted-foreground ml-6">Ekstrak dari PDF / Word langsung ke paket</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { setEditingItem(null); setFormDialogOpen(true) }} className="cursor-pointer">
                <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Buat Paket Kosong (Manual)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari nama paket, mapel, guru..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="pl-9" />
        </div>
        <Select value={mapelFilter === "semua" ? undefined : mapelFilter} onValueChange={(v) => { if (v) { setMapelFilter(v); setPage(1) } }}>
          <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Mapel" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Mapel</SelectItem>
            {mapelOptions.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={guruFilter === "semua" ? undefined : guruFilter} onValueChange={(v) => { if (v) { setGuruFilter(v); setPage(1) } }}>
          <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Guru" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Guru</SelectItem>
            {guruOptions.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter === "semua" ? undefined : statusFilter} onValueChange={(v) => { if (v) { setStatusFilter(v); setPage(1) } }}>
          <SelectTrigger className="w-full sm:w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Status</SelectItem>
            {STATUS_PAKET_SOAL_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        page={page}
        perPage={perPage}
        total={filteredData.length}
        onPageChange={setPage}
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

      <AIPackageGeneratorDialog
        open={aiPackageDialogOpen}
        onOpenChange={setAiPackageDialogOpen}
        onSuccess={() => {}}
      />

      <ImportAIDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onSuccess={() => {}}
      />
    </div>
  )
}
