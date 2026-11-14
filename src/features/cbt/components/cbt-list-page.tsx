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
import { Plus, Pencil, Trash2, Eye, Search, KeyRound, Copy, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { formatDateTimeWIB } from "@/lib/date-utils"
import { CBTFormDialog } from "./cbt-form-dialog"
import { CBTDeleteDialog } from "./cbt-delete-dialog"
import {
  STATUS_CBT_COLORS,
  STATUS_CBT_OPTIONS,
} from "../constants/cbt.constants"
import type { CBTExam, CBTExamFormData } from "../types/cbt"

interface ExamApiResponseItem {
  id: number
  judul: string
  deskripsi?: string
  tipe?: string
  paket_soal_id?: number
  teaching_class_id?: number | null
  waktu_mulai?: string | null
  waktu_selesai?: string | null
  durasi_menit?: number
  kkm?: number
  acak_urutan_soal?: boolean
  acak_urutan_jawaban?: boolean
  tampilkan_nilai?: boolean
  izinkan_kembali?: boolean
  auto_submit?: boolean
  status?: string
  token?: string | null
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
      const res = await fetch("/api/exams?tipe=CBT")
      const json = await res.json()
      if (json.data || json.success) {
        // Map data to match frontend CBT interface
        const sourceData = Array.isArray(json.data) ? json.data : (json.data?.data || [])
        const mapped: CBTExam[] = (sourceData as ExamApiResponseItem[]).map((d) => ({
          id: d.id,
          nama_ujian: d.judul,
          deskripsi: d.deskripsi || "",
          paket_soal_id: d.paket_soal_id || 0,
          teaching_class_id: d.teaching_class_id || null,
          tanggal_mulai: d.waktu_mulai ? d.waktu_mulai : "",
          tanggal_berakhir: d.waktu_selesai ? d.waktu_selesai : "",
          durasi: d.durasi_menit ?? 0,
          nilai_minimum_lulus: d.kkm ?? 75,
          acak_soal: d.acak_urutan_soal ?? false,
          acak_jawaban: d.acak_urutan_jawaban ?? false,
          tampilkan_nilai: d.tampilkan_nilai ?? false,
          izinkan_kembali: d.izinkan_kembali ?? true,
          auto_submit: d.auto_submit ?? true,
          status: (d.status === "PUBLISH" ? "Publish" : d.status === "SELESAI" ? "Selesai" : "Draft"),
          paket_soal_judul: d.paket_soal?.judul || "—",
          mata_pelajaran: d.paket_soal?.mata_pelajaran || d.teaching_class?.mata_pelajaran || "—",
          guru_nama: d.teaching_class?.guru_nama || d.teaching_class?.teacher?.nama_lengkap || d.paket_soal?.guru?.nama_lengkap || "—",
          kelas: d.kelas || d.teaching_class?.kelas || "Semua Kelas",
          token: d.token || null,
          created_at: d.created_at || "",
          updated_at: d.updated_at || "",
        }))
        setData(mapped)
      }
    } catch {
      toast.error("Gagal memuat data CBT")
    } finally {
      setIsLoading(false)
    }
  }

  const [isTokenActionId, setIsTokenActionId] = useState<number | null>(null)

  async function handleToggleToken(examId: number, action: "generate" | "remove") {
    setIsTokenActionId(examId)
    try {
      const res = await fetch(`/api/exams/${examId}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      const json = await res.json()
      if (json.success || json.data) {
        toast.success(json.message || "Token ujian berhasil diperbarui")
        await fetchCbts()
      } else {
        toast.error(json.error || json.message || "Gagal memperbarui token")
      }
    } catch {
      toast.error("Gagal memperbarui token ujian")
    } finally {
      setIsTokenActionId(null)
    }
  }

  function handleCopyToken(token: string) {
    navigator.clipboard.writeText(token)
    toast.success(`Token ${token} berhasil disalin ke clipboard!`)
  }

  const filteredData = data.filter((item) => {
    const matchesSearch =
      !search ||
      item.nama_ujian.toLowerCase().includes(search.toLowerCase()) ||
      item.kelas.toLowerCase().includes(search.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(search.toLowerCase())
    const matchesMapel = mapelFilter === "semua" || item.mata_pelajaran === mapelFilter
    const matchesKelas = kelasFilter === "semua" || item.kelas === kelasFilter
    const matchesStatus = statusFilter === "semua" || item.status === statusFilter
    return matchesSearch && matchesMapel && matchesKelas && matchesStatus
  })

  const paginatedData = filteredData.slice((page - 1) * perPage, page * perPage)

  const mapelOptions = Array.from(new Set(data.map((d) => d.mata_pelajaran))).filter((m): m is string => Boolean(m))
  const kelasOptions = Array.from(new Set(data.map((d) => d.kelas))).filter((k): k is string => Boolean(k))

  const columns: Column<CBTExam>[] = [
    {
      key: "nama_ujian",
      header: "Nama Ujian",
      render: (item) => {
        return (
          <div>
            <p className="font-medium">{item.nama_ujian}</p>
            {item.paket_soal_id ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/guru/paket-soal/${item.paket_soal_id}`)
                }}
                className="text-xs text-primary hover:underline inline-flex items-center gap-1.5 text-left mt-0.5"
                title="Klik untuk melihat paket soal & mengatur bobot butir soal"
              >
                <span>{item.paket_soal_judul}</span>
                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">
                  Atur Bobot
                </span>
              </button>
            ) : (
              <p className="text-xs text-muted-foreground">{item.paket_soal_judul}</p>
            )}
          </div>
        )
      },
    },
    {
      key: "mapel",
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
      render: (item) => {
        if (!item.tanggal_mulai) return <span className="text-xs text-muted-foreground">—</span>
        return (
          <span className="text-xs leading-tight block">
            <span>{formatDateTimeWIB(item.tanggal_mulai, { includeYear: false })}</span>
            {item.tanggal_berakhir && (
              <>
                <span className="text-muted-foreground mx-1">s.d</span>
                <span>{formatDateTimeWIB(item.tanggal_berakhir, { includeYear: false })}</span>
              </>
            )}
          </span>
        )
      },
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <Badge className={STATUS_CBT_COLORS[item.status]}>{item.status}</Badge>,
    },
    {
      key: "token",
      header: "Token Ujian",
      render: (item) => {
        const isActionLoading = isTokenActionId === item.id
        if (item.token) {
          return (
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <Badge variant="outline" className="font-mono text-xs font-black tracking-widest bg-primary/10 text-primary border-primary/30 px-2 py-0.5">
                <KeyRound className="mr-1 h-3 w-3" />
                {item.token}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                title="Salin Token"
                onClick={() => handleCopyToken(item.token || "")}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-primary"
                title="Ganti Token Baru"
                onClick={() => handleToggleToken(item.id, "generate")}
                disabled={isActionLoading}
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isActionLoading ? "animate-spin text-primary" : ""}`} />
              </Button>
            </div>
          )
        }
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[11px] px-2 font-semibold text-primary border-primary/30 hover:bg-primary/10"
              onClick={() => handleToggleToken(item.id, "generate")}
              disabled={isActionLoading}
            >
              <KeyRound className="mr-1 h-3 w-3" />
              {isActionLoading ? "Merilis..." : "Rilis Token"}
            </Button>
          </div>
        )
      },
    },
    {
      key: "actions",
      header: "Aksi",
      className: "w-[160px]",
      render: (item) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs font-bold gap-1 text-primary border-primary/30 hover:bg-primary/10"
            title="Buka Proctoring & Pengawasan CBT"
            onClick={() => router.push(`/guru/cbt/${item.id}`)}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Monitor</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title="Edit"
            aria-label="Edit"
            onClick={() => {
              setEditingItem(item as unknown as CBTExam)
              setFormDialogOpen(true)
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            title="Hapus"
            aria-label="Hapus"
            onClick={() => {
              setDeletingItem(item as unknown as CBTExam)
              setDeleteDialogOpen(true)
            }}
          >
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
        teaching_class_id: formData.teaching_class_id,
        waktu_mulai: formData.tanggal_mulai ? new Date(formData.tanggal_mulai).toISOString() : undefined,
        waktu_selesai: formData.tanggal_berakhir ? new Date(formData.tanggal_berakhir).toISOString() : undefined,
        durasi_menit: formData.durasi,
        kkm: formData.nilai_minimum_lulus,
        acak_urutan_soal: formData.acak_soal,
        acak_urutan_jawaban: formData.acak_jawaban,
        tampilkan_nilai: formData.tampilkan_nilai,
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
    } catch {
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
    } catch {
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
            {mapelOptions.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
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
            {STATUS_CBT_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <DataTable<CBTExam>
        page={page}
        perPage={perPage}
        total={filteredData.length}
        onPageChange={setPage}
        data={paginatedData}
        columns={columns}
        emptyMessage="Tidak ada ujian CBT ditemukan"
        onRowClick={(row) => router.push(`/guru/cbt/${row.id}`)}
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
