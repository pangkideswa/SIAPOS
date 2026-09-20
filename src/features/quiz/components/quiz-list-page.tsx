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
  const [data, setData] = useState<Quiz[]>([])

  const perPage = 10

  useEffect(() => {
    fetchQuizzes()
  }, [])

  async function fetchQuizzes() {
    setIsLoading(true)
    try {
      const res = await fetch("/api/exams?tipe=QUIZ")
      const json = await res.json()
      if (json.data || json.success) {
        // Map data to match frontend Quiz interface
        const sourceData = Array.isArray(json.data) ? json.data : (json.data?.data || [])
        const mapped = sourceData.map((d: any) => ({
          ...d,
          tanggal_mulai: d.waktu_mulai ? d.waktu_mulai : "",
          tanggal_berakhir: d.waktu_selesai ? d.waktu_selesai : "",
          durasi: d.durasi_menit ?? 0,
          status: d.status === "PUBLISH" ? "Publish" : d.status === "SELESAI" ? "Ditutup" : "Draft",
          paket_soal_judul: d.paket_soal?.judul || "—",
          mata_pelajaran: d.paket_soal?.mata_pelajaran || d.teaching_class?.mata_pelajaran || "—",
          guru_nama: d.teaching_class?.guru_nama || "—"
        }))
        setData(mapped)
      }
    } catch (error) {
      toast.error("Gagal memuat data quiz")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredData = data.filter((item) => {
    const matchesSearch =
      !search ||
      item.judul.toLowerCase().includes(search.toLowerCase()) ||
      item.kelas.toLowerCase().includes(search.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(search.toLowerCase())
    const matchesMapel = mapelFilter === "semua" || (item as any).mata_pelajaran === mapelFilter
    const matchesGuru = guruFilter === "semua" || (item as any).guru_nama === guruFilter
    const matchesKelas = kelasFilter === "semua" || item.kelas === kelasFilter
    const matchesStatus = statusFilter === "semua" || item.status === statusFilter
    return matchesSearch && matchesMapel && matchesGuru && matchesKelas && matchesStatus
  })

  const paginatedData = filteredData.slice((page - 1) * perPage, page * perPage)

  const mapelOptions = Array.from(new Set(data.map((d: any) => d.mata_pelajaran))).filter(Boolean)
  const guruOptions = Array.from(new Set(data.map((d: any) => d.guru_nama))).filter(Boolean)
  const kelasOptions = Array.from(new Set(data.map((d: any) => d.kelas))).filter(Boolean)

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "judul",
      header: "Judul Quiz",
      render: (item: any) => {
        return (
          <div>
            <p className="font-medium">{String(item.judul)}</p>
            <p className="text-xs text-muted-foreground">{item.paket_soal_judul}</p>
          </div>
        )
      },
    },
    {
      key: "mata_pelajaran",
      header: "Mapel",
      render: (item: any) => item.mata_pelajaran,
    },
    {
      key: "guru",
      header: "Guru",
      render: (item: any) => item.guru_nama,
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
    try {
      const dbPayload = {
        ...formData,
        waktu_mulai: formData.tanggal_mulai ? new Date(formData.tanggal_mulai).toISOString() : undefined,
        waktu_selesai: formData.tanggal_berakhir ? new Date(formData.tanggal_berakhir).toISOString() : undefined,
        durasi_menit: formData.durasi,
        status: formData.status === "Publish" ? "PUBLISH" : formData.status === "Ditutup" ? "SELESAI" : "DRAFT",
      }

      if (editingItem) {
        const res = await fetch(`/api/exams/${editingItem.id}`, {
          method: "PUT",
          body: JSON.stringify(dbPayload)
        })
        if (!res.ok) throw new Error()
        toast.success("Quiz berhasil diperbarui")
      } else {
        const res = await fetch("/api/exams", {
          method: "POST",
          body: JSON.stringify(dbPayload)
        })
        if (!res.ok) throw new Error()
        toast.success("Quiz berhasil ditambahkan")
      }
      await fetchQuizzes()
      setFormDialogOpen(false)
      setEditingItem(null)
    } catch (err) {
      toast.error("Gagal menyimpan quiz")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleConfirmDelete() {
    if (!deletingItem) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/exams/${deletingItem.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Quiz berhasil dihapus")
      await fetchQuizzes()
      setDeleteDialogOpen(false)
      setDeletingItem(null)
    } catch (err) {
      toast.error("Gagal menghapus quiz")
    } finally {
      setIsLoading(false)
    }
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
        <Select value={mapelFilter === "semua" ? undefined : mapelFilter} onValueChange={(v) => { if (v) { setMapelFilter(v); setPage(1) } }}>
          <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Mapel" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Mapel</SelectItem>
            {mapelOptions.map((m: any) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={guruFilter === "semua" ? undefined : guruFilter} onValueChange={(v) => { if (v) { setGuruFilter(v); setPage(1) } }}>
          <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Guru" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Guru</SelectItem>
            {guruOptions.map((g: any) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={kelasFilter === "semua" ? undefined : kelasFilter} onValueChange={(v) => { if (v) { setKelasFilter(v); setPage(1) } }}>
          <SelectTrigger className="w-full sm:w-[140px]"><SelectValue placeholder="Kelas" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Kelas</SelectItem>
            {kelasOptions.map((k: any) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter === "semua" ? undefined : statusFilter} onValueChange={(v) => { if (v) { setStatusFilter(v); setPage(1) } }}>
          <SelectTrigger className="w-full sm:w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Status</SelectItem>
            {STATUS_QUIZ_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
