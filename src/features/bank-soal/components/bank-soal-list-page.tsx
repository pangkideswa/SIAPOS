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
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Plus, Pencil, Trash2, Eye, Copy, Search, Sparkles, FileText } from "lucide-react"
import { toast } from "sonner"
import { BankSoalFormDialog } from "./bank-soal-form-dialog"
import { BankSoalDeleteDialog } from "./bank-soal-delete-dialog"
import { AIGeneratorDialog } from "./ai-generator-dialog"
import { ImportAIDialog } from "./import-ai-dialog"
import {
  KESULITAN_COLORS, TIPE_SOAL_COLORS, STATUS_BANK_SOAL_COLORS,
  KESULITAN_OPTIONS, TIPE_SOAL_OPTIONS, STATUS_BANK_SOAL_OPTIONS,
} from "../constants/bank-soal.constants"
import type { BankSoal, BankSoalFormData } from "../types/bank-soal"

export function BankSoalListPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [tipeFilter, setTipeFilter] = useState<string>("semua")
  const [mapelFilter, setMapelFilter] = useState<string>("semua")
  const [guruFilter, setGuruFilter] = useState<string>("semua")
  const [kesulitanFilter, setKesulitanFilter] = useState<string>("semua")
  const [statusFilter, setStatusFilter] = useState<string>("semua")
  const [page, setPage] = useState(1)
  const [FormDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [aiDialogOpen, setAiDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<BankSoal | null>(null)
  const [deletingItem, setDeletingItem] = useState<BankSoal | null>(null)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<BankSoal[]>([])
  
  const perPage = 10

  useEffect(() => {
    fetchBankSoal()
  }, [])

  async function fetchBankSoal() {
    setIsLoading(true)
    try {
      const res = await fetch("/api/exams/bank")
      const json = await res.json()
      if (json.data || json.success) {
        // Map database fields to frontend fields
        const sourceData = Array.isArray(json.data) ? json.data : (json.data?.data || [])
        const mapped = sourceData.map((d: any) => ({
          ...d,
          tipe_soal: d.tipe_soal === "PILIHAN_GANDA" ? "Pilihan Ganda" : "Essay",
          kesulitan: d.kesulitan === "MUDAH" ? "Mudah" : d.kesulitan === "SEDANG" ? "Sedang" : "Sulit",
          status: d.status === "PUBLISH" ? "Aktif" : "Draft",
          guru_nama: d.guru?.nama_lengkap || "Sistem",
        }))
        setData(mapped)
      }
    } catch (error) {
      toast.error("Gagal memuat data bank soal")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredData = data.filter((item) => {
    const matchesSearch =
      !search ||
      item.kode_soal.toLowerCase().includes(search.toLowerCase()) ||
      item.pertanyaan.toLowerCase().includes(search.toLowerCase()) ||
      item.mata_pelajaran.toLowerCase().includes(search.toLowerCase()) ||
      item.guru_nama.toLowerCase().includes(search.toLowerCase())
    const matchesTipe = tipeFilter === "semua" || item.tipe_soal === tipeFilter
    const matchesMapel = mapelFilter === "semua" || item.mata_pelajaran === mapelFilter
    const matchesGuru = guruFilter === "semua" || item.guru_nama === guruFilter
    const matchesKesulitan = kesulitanFilter === "semua" || item.kesulitan === kesulitanFilter
    const matchesStatus = statusFilter === "semua" || item.status === statusFilter
    return matchesSearch && matchesTipe && matchesMapel && matchesGuru && matchesKesulitan && matchesStatus
  })

  const paginatedData = filteredData.slice((page - 1) * perPage, page * perPage)
  
  const mapelOptions = Array.from(new Set(data.map(d => d.mata_pelajaran))).filter(Boolean)
  const guruOptions = Array.from(new Set(data.map(d => d.guru_nama))).filter(Boolean)

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "select",
      header: (
        <Checkbox
          checked={paginatedData.length > 0 && selectedIds.length === paginatedData.length}
          onCheckedChange={(checked) => {
            if (checked) {
              setSelectedIds(paginatedData.map((d) => Number(d.id)))
            } else {
              setSelectedIds([])
            }
          }}
          aria-label="Select all"
        />
      ),
      className: "w-[40px]",
      render: (item) => (
        <Checkbox
          checked={selectedIds.includes(Number(item.id))}
          onCheckedChange={(checked) => {
            if (checked) {
              setSelectedIds([...selectedIds, Number(item.id)])
            } else {
              setSelectedIds(selectedIds.filter((id) => id !== Number(item.id)))
            }
          }}
          aria-label="Select row"
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
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
    try {
      // Map frontend fields to database fields
      const dbPayload = {
        ...formData,
        tipe_soal: formData.tipe_soal === "Pilihan Ganda" ? "PILIHAN_GANDA" : "ESAI",
        kesulitan: formData.kesulitan === "Mudah" ? "MUDAH" : formData.kesulitan === "Sedang" ? "SEDANG" : "SULIT",
        status: formData.status === "Aktif" ? "PUBLISH" : "DRAFT",
      }

      if (editingItem) {
        const res = await fetch(`/api/exams/bank/${editingItem.id}`, {
          method: "PUT",
          body: JSON.stringify(dbPayload)
        })
        if (!res.ok) throw new Error()
        toast.success("Soal berhasil diperbarui")
      } else {
        const res = await fetch("/api/exams/bank", {
          method: "POST",
          body: JSON.stringify(dbPayload)
        })
        if (!res.ok) throw new Error()
        toast.success("Soal berhasil ditambahkan")
      }
      await fetchBankSoal()
      setFormDialogOpen(false)
      setEditingItem(null)
    } catch (err) {
      toast.error("Gagal menyimpan soal")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDeleteConfirm() {
    if (!deletingItem) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/exams/bank/${deletingItem.id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Soal berhasil dihapus")
        fetchBankSoal()
      } else {
        toast.error("Gagal menghapus soal")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    } finally {
      setIsLoading(false)
      setDeleteDialogOpen(false)
      setDeletingItem(null)
    }
  }

  async function handleBulkDelete() {
    if (!confirm(`Anda yakin ingin menghapus ${selectedIds.length} soal terpilih?`)) return
    
    setIsLoading(true)
    try {
      const res = await fetch("/api/exams/bank/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds })
      })
      const result = await res.json()
      if (res.ok) {
        toast.success(result.message || `${selectedIds.length} soal berhasil dihapus`)
        setSelectedIds([])
        fetchBankSoal()
      } else {
        toast.error(result.message || "Gagal menghapus soal")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title="Bank Soal"
        description="Kelola soal-soal untuk ujian dan penilaian"
        action={
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button />}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Soal
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[260px]">
              <DropdownMenuItem onClick={() => setAiDialogOpen(true)} className="py-2.5 cursor-pointer">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center text-purple-600 font-medium">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate dari Topik (AI)
                  </div>
                  <p className="text-[10px] text-muted-foreground ml-6">Buat soal otomatis dari topik materi</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setImportDialogOpen(true)} className="py-2.5 cursor-pointer">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center text-blue-600 font-medium">
                    <FileText className="mr-2 h-4 w-4" />
                    Import dari Dokumen (AI)
                  </div>
                  <p className="text-[10px] text-muted-foreground ml-6">Ekstrak soal dari file PDF / Word</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { setEditingItem(null); setFormDialogOpen(true) }} className="cursor-pointer">
                <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Tambah Manual (1 Soal)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari kode, pertanyaan, mapel, guru..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="pl-9" />
        </div>
        <Select value={tipeFilter === "semua" ? undefined : tipeFilter} onValueChange={(v) => { if (v) { setTipeFilter(v); setPage(1) } }}>
          <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Tipe" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Tipe</SelectItem>
            {TIPE_SOAL_OPTIONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
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
        <Select value={kesulitanFilter === "semua" ? undefined : kesulitanFilter} onValueChange={(v) => { if (v) { setKesulitanFilter(v); setPage(1) } }}>
          <SelectTrigger className="w-full sm:w-[130px]"><SelectValue placeholder="Level" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Level</SelectItem>
            {KESULITAN_OPTIONS.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter === "semua" ? undefined : statusFilter} onValueChange={(v) => { if (v) { setStatusFilter(v); setPage(1) } }}>
          <SelectTrigger className="w-full sm:w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Status</SelectItem>
            {STATUS_BANK_SOAL_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
        onConfirm={handleDeleteConfirm}
        isLoading={isLoading}
      />

      <AIGeneratorDialog
        open={aiDialogOpen}
        onOpenChange={setAiDialogOpen}
        onSuccess={() => {}}
      />

      <ImportAIDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onSuccess={fetchBankSoal}
      />
      
      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-card border shadow-lg rounded-full px-6 py-3 flex items-center gap-4 animate-in slide-in-from-bottom-10 fade-in">
          <span className="text-sm font-medium">{selectedIds.length} soal terpilih</span>
          <Button variant="destructive" size="sm" className="rounded-full" onClick={handleBulkDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Hapus Terpilih
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0" onClick={() => setSelectedIds([])}>
            X
          </Button>
        </div>
      )}
    </div>
  )
}
