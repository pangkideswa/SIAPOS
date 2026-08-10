"use client"

import { useState } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable, type Column } from "@/components/ui/data-table"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Pencil, Trash2, Loader2, Search } from "lucide-react"
import { useSubjects, useCreateSubject, useUpdateSubject, useDeleteSubject } from "@/hooks/use-subjects"
import type { Subject } from "@/types"

interface FormData {
  name: string
  description: string
  is_active: boolean
}

const EMPTY_FORM: FormData = {
  name: "",
  description: "",
  is_active: true,
}

export default function SubjectsPage() {
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const { data, isLoading } = useSubjects({
    search: search || undefined,
    is_active: activeFilter === "all" ? undefined : activeFilter === "true",
    page,
  })

  const createSubject = useCreateSubject()
  const updateSubject = useUpdateSubject()
  const deleteSubject = useDeleteSubject()

  const subjects = data?.data ?? []
  const meta = data?.meta

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "name",
      header: "Mata Pelajaran",
      render: (item) => <span className="font-medium">{String(item.name)}</span>,
    },
    {
      key: "description",
      header: "Deskripsi",
      render: (item) => (
        <span className="text-muted-foreground text-sm line-clamp-1">
          {item.description ? String(item.description) : "—"}
        </span>
      ),
    },
    {
      key: "is_active",
      header: "Status",
      render: (item) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.is_active
              ? "bg-green-100 text-green-800"
              : "bg-muted text-foreground"
          }`}
        >
          {item.is_active ? "Aktif" : "Nonaktif"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-[100px]",
      render: (item) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => openEdit(item as unknown as Subject)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => {
              setDeletingSubject(item as unknown as Subject)
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
    setEditingSubject(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setDialogOpen(true)
  }

  function openEdit(subject: Subject) {
    setEditingSubject(subject)
    setForm({
      name: subject.name,
      description: subject.description ?? "",
      is_active: subject.is_active,
    })
    setErrors({})
    setDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    try {
      if (editingSubject) {
        await updateSubject.mutateAsync({ id: editingSubject.id, data: form as unknown as Record<string, unknown> })
      } else {
        await createSubject.mutateAsync(form)
      }
      setDialogOpen(false)
    } catch (err: unknown) {
      const apiErr = err as {
        response?: { data?: { errors?: Record<string, string[]> } }
        errors?: Record<string, string[]>
      }
      if (apiErr.response?.data?.errors) {
        setErrors(apiErr.response.data.errors)
      } else if (apiErr.errors) {
        setErrors(apiErr.errors)
      }
    }
  }

  async function handleDelete() {
    if (!deletingSubject) return
    try {
      await deleteSubject.mutateAsync(deletingSubject.id)
      setDeleteDialogOpen(false)
      setDeletingSubject(null)
    } catch {
      // handled
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mata Pelajaran"
        description="Kelola data mata pelajaran"
        action={
          <Button onClick={openCreate} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Mata Pelajaran
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama mata pelajaran..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={activeFilter}
          onValueChange={(value) => {
            setActiveFilter(value ?? "all")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="true">Aktif</SelectItem>
            <SelectItem value="false">Nonaktif</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={subjects as unknown as Record<string, unknown>[]}
        loading={isLoading}
        emptyMessage="Tidak ada mata pelajaran ditemukan"
      />

      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Halaman {meta.current_page} dari {meta.last_page} ({meta.total} data)
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Sebelumnya
            </Button>
            <Button variant="outline" size="sm" disabled={page >= meta.last_page} onClick={() => setPage(page + 1)}>
              Selanjutnya
            </Button>
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingSubject ? "Edit Mata Pelajaran" : "Tambah Mata Pelajaran Baru"}
            </DialogTitle>
            <DialogDescription>
              {editingSubject
                ? "Perbarui informasi mata pelajaran"
                : "Isi data untuk menambahkan mata pelajaran baru"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Mata Pelajaran *</Label>
              <Input
                id="name"
                placeholder="Contoh: Pemrograman Web"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Input
                id="description"
                placeholder="Deskripsi singkat mata pelajaran"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.is_active ? "true" : "false"}
                onValueChange={(value) => setForm({ ...form, is_active: (value ?? "true") === "true" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Aktif</SelectItem>
                  <SelectItem value="false">Nonaktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={createSubject.isPending || updateSubject.isPending}
              >
                {(createSubject.isPending || updateSubject.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingSubject ? "Simpan Perubahan" : "Tambah Mata Pelajaran"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Hapus Mata Pelajaran"
        description={`Apakah Anda yakin ingin menghapus ${deletingSubject?.name}? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
        isLoading={deleteSubject.isPending}
      />
    </div>
  )
}
