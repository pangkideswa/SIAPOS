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
import { formatDateTimeWIB } from "@/lib/date-utils"
import { QuizFormDialog } from "./quiz-form-dialog"
import { QuizDeleteDialog } from "./quiz-delete-dialog"
import {
  STATUS_QUIZ_COLORS,
  STATUS_QUIZ_OPTIONS,
} from "../constants/quiz.constants"
import type { Quiz, QuizFormData } from "../types/quiz"

interface QuizApiResponseItem {
  id: number
  judul: string
  deskripsi?: string
  tipe?: string
  paket_soal_id?: number
  teaching_class_id?: number | null
  waktu_mulai?: string | null
  waktu_selesai?: string | null
  durasi_menit?: number
  percobaan_maksimal?: number
  acak_urutan_soal?: boolean
  acak_urutan_jawaban?: boolean
  tampilkan_nilai?: boolean
  status?: string
  created_at?: string
  updated_at?: string
  kelas?: string | null
  paket_soal?: {
    judul?: string
    mata_pelajaran?: string
    guru?: { nama_lengkap?: string }
  } | null
  teaching_class?: {
    kelas?: string
    mata_pelajaran?: string
    guru_nama?: string
    teacher?: { nama_lengkap?: string }
  } | null
}

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
        const mapped: Quiz[] = (sourceData as QuizApiResponseItem[]).map((d) => ({
          id: d.id,
          judul: d.judul,
          deskripsi: d.deskripsi || "",
          paket_soal_id: d.paket_soal_id || 0,
          teaching_class_id: d.teaching_class_id || null,
          tanggal_mulai: d.waktu_mulai ? d.waktu_mulai : "",
          tanggal_berakhir: d.waktu_selesai ? d.waktu_selesai : "",
          durasi: d.durasi_menit ?? 0,
          percobaan_maksimal: d.percobaan_maksimal ?? 1,
          acak_urutan_soal: d.acak_urutan_soal ?? false,
          acak_urutan_jawaban: d.acak_urutan_jawaban ?? false,
          tampilkan_nilai: d.tampilkan_nilai ?? true,
          status: (d.status === "PUBLISH" ? "Publish" : d.status === "SELESAI" ? "Ditutup" : "Draft"),
          paket_soal_judul: d.paket_soal?.judul || "—",
          mata_pelajaran: d.paket_soal?.mata_pelajaran || d.teaching_class?.mata_pelajaran || "—",
          guru_nama: d.teaching_class?.guru_nama || d.teaching_class?.teacher?.nama_lengkap || d.paket_soal?.guru?.nama_lengkap || "—",
          kelas: d.kelas || d.teaching_class?.kelas || "Semua Kelas",
          created_at: d.created_at || "",
          updated_at: d.updated_at || "",
        }))
        setData(mapped)
      }
    } catch {
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
    const matchesMapel = mapelFilter === "semua" || item.mata_pelajaran === mapelFilter
    const matchesGuru = guruFilter === "semua" || item.guru_nama === guruFilter
    const matchesKelas = kelasFilter === "semua" || item.kelas === kelasFilter
    const matchesStatus = statusFilter === "semua" || item.status === statusFilter
    return matchesSearch && matchesMapel && matchesGuru && matchesKelas && matchesStatus
  })

  const paginatedData = filteredData.slice((page - 1) * perPage, page * perPage)

  const mapelOptions = Array.from(new Set(data.map((d) => d.mata_pelajaran))).filter((m): m is string => Boolean(m))
  const guruOptions = Array.from(new Set(data.map((d) => d.guru_nama))).filter((g): g is string => Boolean(g))
  const kelasOptions = Array.from(new Set(data.map((d) => d.kelas))).filter((k): k is string => Boolean(k))

  const columns: Column<Quiz>[] = [
    {
      key: "judul",
      header: "Judul Quiz",
      render: (item) => {
        return (
          <div>
            <p className="font-medium">{item.judul}</p>
            <p className="text-xs text-muted-foreground">{item.paket_soal_judul}</p>
          </div>
        )
      },
    },
    {
      key: "mata_pelajaran",
      header: "Mapel",
      render: (item) => item.mata_pelajaran,
    },
    {
      key: "guru",
      header: "Guru",
      render: (item) => item.guru_nama,
    },
    { key: "kelas", header: "Kelas", render: (item) => item.kelas },
    {
      key: "durasi",
      header: "Durasi",
      render: (item) => <span>{item.durasi} mnt</span>,
    },
    {
      key: "jadwal",
      header: "Jadwal (WIB)",
      render: (item) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {item.tanggal_mulai ? formatDateTimeWIB(item.tanggal_mulai, { includeYear: false }) : "—"}
          {" s.d "}
          {item.tanggal_berakhir ? formatDateTimeWIB(item.tanggal_berakhir, { includeYear: false }) : "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <Badge className={STATUS_QUIZ_COLORS[item.status]}>{item.status}</Badge>,
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
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" aria-label="Edit" onClick={() => { setEditingItem(item); setFormDialogOpen(true) }}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" title="Hapus" aria-label="Hapus" onClick={() => { setDeletingItem(item); setDeleteDialogOpen(true) }}>
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
        tipe: "QUIZ",
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
    } catch {
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
    } catch {
      toast.error("Gagal menghapus quiz")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quiz & Ujian Harian"
        description="Kelola kuis harian, asesmen formatif, dan tes kemampuan mandiri siswa"
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
        <Select value={kelasFilter === "semua" ? undefined : kelasFilter} onValueChange={(v) => { if (v) { setKelasFilter(v); setPage(1) } }}>
          <SelectTrigger className="w-full sm:w-[140px]"><SelectValue placeholder="Kelas" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Kelas</SelectItem>
            {kelasOptions.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
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

      <DataTable<Quiz>
        page={page}
        perPage={perPage}
        total={filteredData.length}
        onPageChange={setPage}
        data={paginatedData}
        columns={columns}
        emptyMessage="Tidak ada quiz ditemukan"
        onRowClick={(row) => router.push(`/guru/quiz/${row.id}`)}
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
