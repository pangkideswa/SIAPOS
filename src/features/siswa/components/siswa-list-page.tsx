"use client"

import { useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Eye,
  Upload,
  Download,
} from "lucide-react"
import { SiswaFormDialog } from "./siswa-form-dialog"
import { SiswaDeleteDialog } from "./siswa-delete-dialog"
import {
  STATUS_SISWA_COLORS,
  STATUS_SISWA_OPTIONS,
  JURUSAN_OPTIONS,
} from "@/features/siswa/constants/siswa.constants"
import {
  useStudentsPaginated,
  useCreateStudent,
  useUpdateStudent,
  useRemoveStudent,
} from "@/hooks/use-students"
import { useClasses } from "@/hooks/use-classes"
import { studentService } from "@/lib/services/student.service"
import type { Siswa, SiswaFormData } from "@/features/siswa/types/siswa"

export function SiswaListPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState("")
  const [jurusanFilter, setJurusanFilter] = useState<string>("all")
  const [kelasFilter, setKelasFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [FormDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingSiswa, setEditingSiswa] = useState<Siswa | null>(null)
  const [deletingSiswa, setDeletingSiswa] = useState<Siswa | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    data,
    isLoading: isTableLoading,
    isError,
    refetch,
  } = useStudentsPaginated({
    search: search || undefined,
    jurusan_id:
      jurusanFilter === "all" ? undefined : Number(jurusanFilter),
    kelas: kelasFilter === "all" ? undefined : kelasFilter,
    status: statusFilter === "all" ? undefined : statusFilter,
    page,
    per_page: 10,
  })
  const createSiswa = useCreateStudent()
  const updateSiswa = useUpdateStudent()
  const removeSiswa = useRemoveStudent()

  const { data: classesData } = useClasses()
  const kelasOptions = classesData?.data ?? []

  const allSiswa = data?.data ?? []
  const meta = data?.meta

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "nama_lengkap",
      header: "Nama Siswa",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold text-sm shrink-0">
            {String(item.nama_lengkap)
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">{String(item.nama_lengkap)}</p>
            <p className="text-xs text-muted-foreground truncate">
              NIS: {String(item.nis)}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "kelas",
      header: "Kelas",
      render: (item) => (
        <Badge variant="outline" className="text-xs">
          {String(item.kelas)}
        </Badge>
      ),
    },
    {
      key: "jurusan_nama",
      header: "Jurusan",
      render: (item) => (
        <span className="text-sm truncate max-w-[150px] block">
          {String(item.jurusan_nama ?? "-")}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => {
        const status = String(item.status)
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_SISWA_COLORS[status] ?? "bg-gray-100 text-gray-800"}`}
          >
            {status}
          </span>
        )
      },
    },
    {
      key: "actions",
      header: "",
      className: "w-[120px]",
      render: (item) => (
        <div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Lihat Detail"
            onClick={() => router.push(`/admin/siswa/${item.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Edit"
            onClick={() => openEdit(item as unknown as Siswa)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            title="Hapus"
            onClick={() => {
              setDeletingSiswa(item as unknown as Siswa)
              setDeleteDialogOpen(true)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  function openCreate() {
    setEditingSiswa(null)
    setFormDialogOpen(true)
  }

  function openEdit(siswa: Siswa) {
    setEditingSiswa(siswa)
    setFormDialogOpen(true)
  }

  function handleImport() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      // TODO: Replace with actual import logic
      alert(`File "${file.name}" akan diimport (fitur belum tersedia)`)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  async function handleExport() {
    const result = await studentService.getAllPaginated({
      search: search || undefined,
      jurusan_id:
        jurusanFilter === "all" ? undefined : Number(jurusanFilter),
      kelas: kelasFilter === "all" ? undefined : kelasFilter,
      status: statusFilter === "all" ? undefined : statusFilter,
      page: 1,
      per_page: 10000,
    })
    const headers = [
      "NIS",
      "NISN",
      "Nama Lengkap",
      "Jenis Kelamin",
      "Kelas",
      "Jurusan",
      "Status",
    ]
    const rows = result.data.map((s) => [
      s.nis,
      s.nisn,
      s.nama_lengkap,
      s.jenis_kelamin,
      s.kelas,
      s.jurusan_nama ?? "",
      s.status,
    ])
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "data-siswa.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleFormSubmit = useCallback(
    async (formData: SiswaFormData) => {
      setIsLoading(true)
      try {
        if (editingSiswa) {
          await updateSiswa.mutateAsync({
            id: editingSiswa.id,
            data: formData,
          })
        } else {
          await createSiswa.mutateAsync(formData)
        }
        setFormDialogOpen(false)
      } finally {
        setIsLoading(false)
      }
    },
    [editingSiswa, createSiswa, updateSiswa]
  )

  const handleDelete = useCallback(async () => {
    if (!deletingSiswa) return
    setIsLoading(true)
    try {
      await removeSiswa.mutateAsync(deletingSiswa.id)
      setDeleteDialogOpen(false)
      setDeletingSiswa(null)
    } finally {
      setIsLoading(false)
    }
  }, [deletingSiswa, removeSiswa])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Siswa"
        description="Kelola data siswa di SMK Wahana Bakti"
        action={
          <div className="flex flex-wrap gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleImport}
              className="hidden sm:inline-flex"
            >
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="hidden sm:inline-flex"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button
              onClick={openCreate}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Siswa
            </Button>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama, NIS, NISN, atau kelas..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={jurusanFilter}
          onValueChange={(value) => {
            setJurusanFilter(value ?? "all")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Semua Jurusan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Jurusan</SelectItem>
            {JURUSAN_OPTIONS.map((j) => (
              <SelectItem key={j.id} value={String(j.id)}>
                {j.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={kelasFilter}
          onValueChange={(value) => {
            setKelasFilter(value ?? "all")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Semua Kelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kelas</SelectItem>
            {kelasOptions.map((k) => (
              <SelectItem key={k.name} value={k.name}>
                {k.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value ?? "all")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            {STATUS_SISWA_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mobile Import/Export */}
      <div className="flex sm:hidden gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button variant="outline" size="sm" onClick={handleImport} className="flex-1">
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>
        <Button variant="outline" size="sm" onClick={handleExport} className="flex-1">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={allSiswa as unknown as Record<string, unknown>[]}
        loading={isTableLoading}
        emptyMessage={
          isError ? "Gagal memuat data siswa" : "Tidak ada siswa ditemukan"
        }
        onRowClick={(item) => router.push(`/admin/siswa/${item.id}`)}
      />

      {isError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 py-4 px-4 text-center text-sm text-destructive">
          Terjadi kesalahan saat memuat data siswa.{" "}
          <button onClick={() => refetch()} className="underline font-medium">
            Muat ulang
          </button>
        </div>
      )}

      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Halaman {meta.current_page} dari {meta.last_page} ({meta.total} data)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.last_page}
              onClick={() => setPage(page + 1)}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}

      <SiswaFormDialog
        open={FormDialogOpen}
        onOpenChange={setFormDialogOpen}
        editingSiswa={editingSiswa}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
      />

      <SiswaDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        siswa={deletingSiswa}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </div>
  )
}
