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
import { CBTFormDialog } from "./cbt-form-dialog"
import { CBTDeleteDialog } from "./cbt-delete-dialog"
import {
  STATUS_CBT_COLORS,
  STATUS_CBT_OPTIONS,
  MATA_PELAJARAN_OPTIONS,
  KELAS_OPTIONS,
} from "../constants/cbt.constants"
import type { CBTExam, CBTExamFormData } from "../types/cbt"

export function CBTListPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [mapelFilter, setMapelFilter] = useState<string>("semua")
  const [kelasFilter, setKelasFilter] = useState<string>("semua")
  const [statusFilter, setStatusFilter] = useState<string>("semua")
  const [page, setPage] = useState(1)
  const [FormDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<CBTExam | null>(null)
  const [deletingItem, setDeletingItem] = useState<CBTExam | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<CBTExam[]>([])

  const perPage = 10

  useEffect(() => {
    fetchCbts()
  }, [])

  async function fetchCbts() {
    setIsLoading(true)
    try {
      const res = await fetch("/api/exams")
      const json = await res.json()
      if (json.success) {
        // Map data to match frontend CBT interface
        const mapped = json.data.map((d: any) => ({
          ...d,
          nama_ujian: d.judul,
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
      toast.error("Gagal memuat data CBT")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredData = data.filter((item) => {
    const matchesSearch =
      !search ||
      item.nama_ujian.toLowerCase().includes(search.toLowerCase()) ||
      item.kelas.toLowerCase().includes(search.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(search.toLowerCase())
    const matchesMapel = mapelFilter === "semua" || (item as any).mata_pelajaran === mapelFilter
    const matchesKelas = kelasFilter === "semua" || item.kelas === kelasFilter
    const matchesStatus = statusFilter === "semua" || item.status === statusFilter
    return matchesSearch && matchesMapel && matchesKelas && matchesStatus
  })

  const paginatedData = filteredData.slice((page - 1) * perPage, page * perPage)

  const mapelOptions = Array.from(new Set(data.map((d: any) => d.mata_pelajaran))).filter(Boolean)
  const kelasOptions = Array.from(new Set(data.map((d: any) => d.kelas))).filter(Boolean)

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "nama_ujian",
      header: "Nama Ujian",
      render: (item: any) => {
        return (
          <div>
            <p className="font-medium">{String(item.nama_ujian)}</p>
            <p className="text-xs text-muted-foreground">{item.paket_soal_judul}</p>
          </div>
        )
      },
    },
    {
      key: "mapel",
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
    try {
      const dbPayload = {
        judul: formData.nama_ujian,
        tipe: "CBT",
        deskripsi: formData.deskripsi,
        paket_soal_id: formData.paket_soal_id,
        kelas: formData.kelas,
        waktu_mulai: formData.tanggal_mulai ? new Date(formData.tanggal_mulai).toISOString() : undefined,
        waktu_selesai: formData.tanggal_berakhir ? new Date(formData.tanggal_berakhir).toISOString() : undefined,
        durasi_menit: formData.durasi,
        status: formData.status === "Publish" ? "PUBLISH" : formData.status === "Selesai" ? "SELESAI" : "DRAFT",
      }

      if (editingItem) {
        const res = await fetch(`/api/exams/${editingItem.id}`, {
          method: "PUT",
          body: JSON.stringify(dbPayload)
        })
        if (!res.ok) throw new Error()
        toast.success("CBT berhasil diperbarui")
      } else {
        const res = await fetch("/api/exams", {
          method: "POST",
          body: JSON.stringify(dbPayload)
        })
        if (!res.ok) throw new Error()
        toast.success("CBT berhasil ditambahkan")
      }
      await fetchCbts()
      setFormDialogOpen(false)
      setEditingItem(null)
    } catch (err) {
      toast.error("Gagal menyimpan CBT")
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
      toast.success("CBT berhasil dihapus")
      await fetchCbts()
      setDeleteDialogOpen(false)
      setDeletingItem(null)
    } catch (err) {
      toast.error("Gagal menghapus CBT")
    } finally {
      setIsLoading(false)
    }
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
        <Select value={mapelFilter === "semua" ? undefined : mapelFilter} onValueChange={(v) => { if (v) { setMapelFilter(v); setPage(1) } }}>
          <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Mapel" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Mapel</SelectItem>
            {mapelOptions.map((m: any) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
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
