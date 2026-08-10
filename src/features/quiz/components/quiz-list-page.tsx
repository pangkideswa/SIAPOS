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
import { QuizFormDialog } from "./quiz-form-dialog"
import { QuizDeleteDialog } from "./quiz-delete-dialog"
import {
  STATUS_QUIZ_COLORS,
  MATA_PELAJARAN_OPTIONS,
  GURU_QUIZ_OPTIONS,
  KELAS_OPTIONS,
  STATUS_QUIZ_OPTIONS,
} from "../constants/quiz.constants"
import { DUMMY_QUIZ } from "../dummy/quiz.data"
import { DUMMY_PAKET_SOAL } from "@/features/paket-soal/dummy/paket-soal.data"
import type { Quiz, QuizFormData } from "../types/quiz"

export function QuizListPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [mapelFilter, setMapelFilter] = useState<string>("semua")
  const [guruFilter, setGuruFilter] = useState<string>("semua")
  const [kelasFilter, setKelasFilter] = useState<string>("semua")
  const [statusFilter, setStatusFilter] = useState<string>("semua")
  const [page, setPage] = useState(1)
  const [FormDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Quiz | null>(null)
  const [deletingItem, setDeletingItem] = useState<Quiz | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<Quiz[]>(DUMMY_QUIZ)

  const perPage = 10

  const filteredData = data.filter((item) => {
    const matchesSearch =
      !search ||
      item.judul.toLowerCase().includes(search.toLowerCase()) ||
      item.kelas.toLowerCase().includes(search.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(search.toLowerCase())
    const matchesMapel = mapelFilter === "semua" || getPaketSoal(item.paket_soal_id)?.mata_pelajaran === mapelFilter
    const matchesGuru = guruFilter === "semua" || getPaketSoal(item.paket_soal_id)?.guru_nama === guruFilter
    const matchesKelas = kelasFilter === "semua" || item.kelas === kelasFilter
    const matchesStatus = statusFilter === "semua" || item.status === statusFilter
    return matchesSearch && matchesMapel && matchesGuru && matchesKelas && matchesStatus
  })

  const paginatedData = filteredData.slice((page - 1) * perPage, page * perPage)

  function getPaketSoal(id: number) {
    return DUMMY_PAKET_SOAL.find((p) => p.id === id) ?? null
  }

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "judul",
      header: "Judul Quiz",
      render: (item) => {
        const paket = getPaketSoal(item.paket_soal_id as number)
        return (
          <div>
            <p className="font-medium">{String(item.judul)}</p>
            <p className="text-xs text-muted-foreground">{paket?.nama_paket ?? "—"}</p>
          </div>
        )
      },
    },
    {
      key: "mata_pelajaran",
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
      key: "status",
      header: "Status",
      render: (item) => <Badge className={STATUS_QUIZ_COLORS[String(item.status)]}>{String(item.status)}</Badge>,
    },
    {
      key: "actions",
      header: "",
      className: "w-[100px]",
      render: (item) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Lihat" aria-label="Lihat" onClick={() => router.push(`/guru/quiz/${item.id}`)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" aria-label="Edit" onClick={() => { setEditingItem(item as unknown as Quiz); setFormDialogOpen(true) }}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" title="Hapus" aria-label="Hapus" onClick={() => { setDeletingItem(item as unknown as Quiz); setDeleteDialogOpen(true) }}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  async function handleSubmit(formData: QuizFormData) {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    if (editingItem) {
      setData((prev) => prev.map((d) => d.id === editingItem.id ? { ...d, ...formData, updated_at: new Date().toISOString() } : d))
      toast.success("Quiz berhasil diperbarui")
    } else {
      const newItem: Quiz = {
        ...formData,
        id: Math.max(...data.map((d) => d.id)) + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setData((prev) => [newItem, ...prev])
      toast.success("Quiz berhasil ditambahkan")
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
    toast.success("Quiz berhasil dihapus")
    setIsLoading(false)
    setDeleteDialogOpen(false)
    setDeletingItem(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quiz"
        description="Kelola quiz untuk siswa"
        action={
          <Button onClick={() => { setEditingItem(null); setFormDialogOpen(true) }}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Quiz
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari judul, kelas, deskripsi..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="pl-9" />
        </div>
        <Select value={mapelFilter} onValueChange={(v) => { if (v) { setMapelFilter(v); setPage(1) } }}>
          <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Semua Mapel" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Mapel</SelectItem>
            {MATA_PELAJARAN_OPTIONS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={guruFilter} onValueChange={(v) => { if (v) { setGuruFilter(v); setPage(1) } }}>
          <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Semua Guru" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Guru</SelectItem>
            {GURU_QUIZ_OPTIONS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={kelasFilter} onValueChange={(v) => { if (v) { setKelasFilter(v); setPage(1) } }}>
          <SelectTrigger className="w-full sm:w-[140px]"><SelectValue placeholder="Semua Kelas" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Kelas</SelectItem>
            {KELAS_OPTIONS.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { if (v) { setStatusFilter(v); setPage(1) } }}>
          <SelectTrigger className="w-full sm:w-[130px]"><SelectValue placeholder="Semua Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Status</SelectItem>
            {STATUS_QUIZ_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={paginatedData as unknown as Record<string, unknown>[]}
        columns={columns}
        emptyMessage="Tidak ada quiz ditemukan"
        onRowClick={(row) => router.push(`/guru/quiz/${(row as unknown as Quiz).id}`)}
      />

      <QuizFormDialog
        open={FormDialogOpen}
        onOpenChange={setFormDialogOpen}
        editingItem={editingItem}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      <QuizDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        item={deletingItem}
        onConfirm={handleConfirmDelete}
        isLoading={isLoading}
      />
    </div>
  )
}
