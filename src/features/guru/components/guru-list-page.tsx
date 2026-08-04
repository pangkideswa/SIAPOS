"use client"

import { useState, useCallback } from "react"
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
import { Plus, Pencil, Trash2, Search, Eye } from "lucide-react"
import { GuruFormDialog } from "./guru-form-dialog"
import { GuruDeleteDialog } from "./guru-delete-dialog"
import {
  STATUS_KEPEGAWAIAN_COLORS,
  STATUS_KEPEGAWAIAN_OPTIONS,
  JENIS_KELAMIN_OPTIONS,
} from "@/features/guru/constants/guru.constants"
import {
  useTeachers,
  useCreateTeacher,
  useUpdateTeacher,
  useRemoveTeacher,
} from "@/hooks/use-teachers"
import type { Guru, GuruFormData } from "@/features/guru/types/guru"

export function GuruListPage() {
  const router = useRouter()
  const {
    data: allGuru = [],
    isLoading: isTableLoading,
    isError,
    refetch,
  } = useTeachers()
  const createGuru = useCreateTeacher()
  const updateGuru = useUpdateTeacher()
  const removeGuru = useRemoveTeacher()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [jkFilter, setJkFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [FormDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingGuru, setEditingGuru] = useState<Guru | null>(null)
  const [deletingGuru, setDeletingGuru] = useState<Guru | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const perPage = 10

  const filteredGuru = allGuru.filter((g) => {
    if (statusFilter !== "all" && g.status_kepegawaian !== statusFilter)
      return false
    if (jkFilter !== "all" && g.jenis_kelamin !== jkFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        g.nama_lengkap.toLowerCase().includes(q) ||
        g.nip.includes(q) ||
        (g.nuptk?.includes(q) ?? false) ||
        g.email.toLowerCase().includes(q) ||
        g.mata_pelajaran.some((mp) => mp.toLowerCase().includes(q))
      )
    }
    return true
  })

  const totalPages = Math.ceil(filteredGuru.length / perPage)
  const paginatedGuru = filteredGuru.slice(
    (page - 1) * perPage,
    page * perPage
  )

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "nama_lengkap",
      header: "Nama Guru",
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
              {String(item.nip)}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (item) => (
        <span className="text-sm truncate max-w-[200px] block">
          {String(item.email)}
        </span>
      ),
    },
    {
      key: "mata_pelajaran",
      header: "Mata Pelajaran",
      render: (item) => {
        const mps = item.mata_pelajaran as string[]
        return (
          <div className="flex flex-wrap gap-1">
            {mps.slice(0, 2).map((mp: string) => (
              <Badge key={mp} variant="secondary" className="text-[10px]">
                {mp}
              </Badge>
            ))}
            {mps.length > 2 && (
              <Badge variant="secondary" className="text-[10px]">
                +{mps.length - 2}
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      key: "status_kepegawaian",
      header: "Status",
      render: (item) => {
        const status = String(item.status_kepegawaian)
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_KEPEGAWAIAN_COLORS[status] ?? "bg-gray-100 text-gray-800"}`}
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
            onClick={() => router.push(`/admin/guru/${item.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Edit"
            onClick={() => openEdit(item as unknown as Guru)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            title="Hapus"
            onClick={() => {
              setDeletingGuru(item as unknown as Guru)
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
    setEditingGuru(null)
    setFormDialogOpen(true)
  }

  function openEdit(guru: Guru) {
    setEditingGuru(guru)
    setFormDialogOpen(true)
  }

  const handleFormSubmit = useCallback(
    async (formData: GuruFormData) => {
      setIsLoading(true)
      try {
        if (editingGuru) {
          await updateGuru.mutateAsync({
            id: editingGuru.id,
            data: formData,
          })
        } else {
          await createGuru.mutateAsync(formData)
        }
        setFormDialogOpen(false)
      } finally {
        setIsLoading(false)
      }
    },
    [editingGuru, createGuru, updateGuru]
  )

  const handleDelete = useCallback(async () => {
    if (!deletingGuru) return
    setIsLoading(true)
    try {
      await removeGuru.mutateAsync(deletingGuru.id)
      setDeleteDialogOpen(false)
      setDeletingGuru(null)
    } finally {
      setIsLoading(false)
    }
  }, [deletingGuru, removeGuru])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Guru"
        description="Kelola data guru di SMK Wahana Bakti"
        action={
          <Button onClick={openCreate} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Guru
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama, NIP, NUPTK, atau email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={jkFilter}
          onValueChange={(value) => {
            setJkFilter(value ?? "all")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Semua Jenis Kelamin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Jenis Kelamin</SelectItem>
            {JENIS_KELAMIN_OPTIONS.map((jk) => (
              <SelectItem key={jk} value={jk}>
                {jk}
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
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            {STATUS_KEPEGAWAIAN_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={paginatedGuru as unknown as Record<string, unknown>[]}
        loading={isTableLoading}
        emptyMessage={
          isError ? "Gagal memuat data guru" : "Tidak ada guru ditemukan"
        }
        onRowClick={(item) => router.push(`/admin/guru/${item.id}`)}
      />

      {isError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 py-4 px-4 text-center text-sm text-destructive">
          Terjadi kesalahan saat memuat data guru.{" "}
          <button onClick={() => refetch()} className="underline font-medium">
            Muat ulang
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Halaman {page} dari {totalPages} ({filteredGuru.length} data)
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
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}

      <GuruFormDialog
        open={FormDialogOpen}
        onOpenChange={setFormDialogOpen}
        editingGuru={editingGuru}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
      />

      <GuruDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        guru={deletingGuru}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </div>
  )
}
