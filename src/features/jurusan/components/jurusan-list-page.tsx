"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Pencil, Trash2, Search, Eye } from "lucide-react"
import { JurusanFormDialog } from "./jurusan-form-dialog"
import { JurusanDeleteDialog } from "./jurusan-delete-dialog"
import {
  STATUS_LABELS,
  STATUS_COLORS,
  EMPTY_JURUSAN_FORM,
} from "@/features/jurusan/constants/jurusan.constants"
import { DUMMY_JURUSANS } from "@/features/jurusan/dummy/jurusan.data"
import type { Jurusan } from "@/features/jurusan/types/jurusan"

export function JurusanListPage() {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingJurusan, setEditingJurusan] = useState<Jurusan | null>(null)
  const [deletingJurusan, setDeletingJurusan] = useState<Jurusan | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const perPage = 10

  const filteredJurusan = DUMMY_JURUSANS.filter((j) => {
    if (statusFilter === "active" && !j.is_active) return false
    if (statusFilter === "inactive" && j.is_active) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        j.name.toLowerCase().includes(q) ||
        j.code.toLowerCase().includes(q) ||
        (j.description?.toLowerCase().includes(q) ?? false)
      )
    }
    return true
  })

  const totalPages = Math.ceil(filteredJurusan.length / perPage)
  const paginatedJurusan = filteredJurusan.slice(
    (page - 1) * perPage,
    page * perPage
  )

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "code",
      header: "Kode",
      className: "w-[100px]",
      render: (item) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-primary/10 text-primary">
          {String(item.code)}
        </span>
      ),
    },
    {
      key: "name",
      header: "Nama Jurusan",
      render: (item) => (
        <div>
          <p className="font-medium">{String(item.name)}</p>
          {Boolean(item.description) && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              {String(item.description ?? "")}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "is_active",
      header: "Status",
      render: (item) => {
        const active = item.is_active as boolean
        const key = active ? "active" : "inactive"
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[key]}`}
          >
            {STATUS_LABELS[key]}
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
            onClick={() => router.push(`/admin/jurusan/${item.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Edit"
            onClick={() => openEdit(item as unknown as Jurusan)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            title="Hapus"
            onClick={() => {
              setDeletingJurusan(item as unknown as Jurusan)
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
    setEditingJurusan(null)
    setFormDialogOpen(true)
  }

  function openEdit(jurusan: Jurusan) {
    setEditingJurusan(jurusan)
    setFormDialogOpen(true)
  }

  const handleFormSubmit = useCallback(
    async (formData: typeof EMPTY_JURUSAN_FORM) => {
      setIsLoading(true)
      try {
        // TODO: Replace with backend API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (editingJurusan) {
          const idx = DUMMY_JURUSANS.findIndex(
            (j) => j.id === editingJurusan.id
          )
          if (idx !== -1) {
            DUMMY_JURUSANS[idx] = {
              ...DUMMY_JURUSANS[idx],
              name: formData.name,
              code: formData.code,
              is_active: formData.is_active,
              description: formData.description || null,
              updated_at: new Date().toISOString(),
            }
          }
        } else {
          const newJurusan: Jurusan = {
            id: Date.now(),
            name: formData.name,
            code: formData.code,
            is_active: formData.is_active,
            description: formData.description || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          DUMMY_JURUSANS.push(newJurusan)
        }
        setFormDialogOpen(false)
      } finally {
        setIsLoading(false)
      }
    },
    [editingJurusan]
  )

  const handleDelete = useCallback(async () => {
    if (!deletingJurusan) return
    setIsLoading(true)
    try {
      // TODO: Replace with backend API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      const idx = DUMMY_JURUSANS.findIndex((j) => j.id === deletingJurusan.id)
      if (idx !== -1) DUMMY_JURUSANS.splice(idx, 1)
      setDeleteDialogOpen(false)
      setDeletingJurusan(null)
    } finally {
      setIsLoading(false)
    }
  }, [deletingJurusan])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Master Data Jurusan"
        description="Kelola data jurusan di SMK Wahana Bakti"
        action={
          <Button
            onClick={openCreate}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Jurusan
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama jurusan atau kode..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value ?? "all")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Tidak Aktif</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={paginatedJurusan as unknown as Record<string, unknown>[]}
        loading={false}
        emptyMessage="Tidak ada jurusan ditemukan"
        onRowClick={(item) => router.push(`/admin/jurusan/${item.id}`)}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Halaman {page} dari {totalPages} ({filteredJurusan.length} data)
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

      <JurusanFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        editingJurusan={editingJurusan}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
      />

      <JurusanDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        jurusan={deletingJurusan}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </div>
  )
}
