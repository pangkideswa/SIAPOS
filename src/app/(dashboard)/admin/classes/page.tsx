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
import { useClasses, useCreateClass, useUpdateClass, useDeleteClass } from "@/hooks/use-classes"
import type { SchoolClass } from "@/types"

const GRADE_LEVELS = ["X", "XI", "XII"]

interface FormData {
  name: string
  major: string
  grade_level: string
  homeroom_teacher_id: string
}

const EMPTY_FORM: FormData = {
  name: "",
  major: "",
  grade_level: "XI",
  homeroom_teacher_id: "",
}

export default function ClassesPage() {
  const [search, setSearch] = useState("")
  const [gradeFilter, setGradeFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null)
  const [deletingClass, setDeletingClass] = useState<SchoolClass | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const { data, isLoading } = useClasses({
    search: search || undefined,
    grade_level: gradeFilter === "all" ? undefined : gradeFilter,
    page,
  })

  const createClass = useCreateClass()
  const updateClass = useUpdateClass()
  const deleteClass = useDeleteClass()

  const classes = data?.data ?? []
  const meta = data?.meta

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "name",
      header: "Nama Kelas",
      render: (item) => <span className="font-medium">{String(item.name)}</span>,
    },
    {
      key: "major",
      header: "Jurusan",
    },
    {
      key: "grade_level",
      header: "Tingkat",
      render: (item) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {String(item.grade_level)}
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
            onClick={() => openEdit(item as unknown as SchoolClass)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => {
              setDeletingClass(item as unknown as SchoolClass)
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
    setEditingClass(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setDialogOpen(true)
  }

  function openEdit(cls: SchoolClass) {
    setEditingClass(cls)
    setForm({
      name: cls.name,
      major: cls.major,
      grade_level: cls.grade_level,
      homeroom_teacher_id: cls.homeroom_teacher_id ? String(cls.homeroom_teacher_id) : "",
    })
    setErrors({})
    setDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const payload = {
      name: form.name,
      major: form.major,
      grade_level: form.grade_level,
      homeroom_teacher_id: form.homeroom_teacher_id ? Number(form.homeroom_teacher_id) : null,
    }

    try {
      if (editingClass) {
        await updateClass.mutateAsync({ id: editingClass.id, data: payload })
      } else {
        await createClass.mutateAsync(payload)
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
    if (!deletingClass) return
    try {
      await deleteClass.mutateAsync(deletingClass.id)
      setDeleteDialogOpen(false)
      setDeletingClass(null)
    } catch {
      // handled
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Kelas"
        description="Kelola data kelas dan jurusan"
        action={
          <Button onClick={openCreate} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Kelas
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama kelas atau jurusan..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={gradeFilter}
          onValueChange={(value) => {
            setGradeFilter(value ?? "all")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Semua Tingkat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tingkat</SelectItem>
            {GRADE_LEVELS.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={classes as unknown as Record<string, unknown>[]}
        loading={isLoading}
        emptyMessage="Tidak ada kelas ditemukan"
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
            <DialogTitle>{editingClass ? "Edit Kelas" : "Tambah Kelas Baru"}</DialogTitle>
            <DialogDescription>
              {editingClass ? "Perbarui informasi kelas" : "Isi data untuk menambahkan kelas baru"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Kelas *</Label>
                <Input
                  id="name"
                  placeholder="Contoh: XI TKJ"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="major">Jurusan *</Label>
                <Input
                  id="major"
                  placeholder="Contoh: Teknik Komputer Jaringan"
                  value={form.major}
                  onChange={(e) => setForm({ ...form, major: e.target.value })}
                  required
                />
                {errors.major && <p className="text-xs text-destructive">{errors.major[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade_level">Tingkat *</Label>
                <Select
                  value={form.grade_level}
                  onValueChange={(value) => setForm({ ...form, grade_level: value ?? "XI" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADE_LEVELS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.grade_level && <p className="text-xs text-destructive">{errors.grade_level[0]}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={createClass.isPending || updateClass.isPending}
              >
                {(createClass.isPending || updateClass.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingClass ? "Simpan Perubahan" : "Tambah Kelas"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Hapus Kelas"
        description={`Apakah Anda yakin ingin menghapus kelas ${deletingClass?.name}? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
        isLoading={deleteClass.isPending}
      />
    </div>
  )
}
