"use client"

import { useState } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable, type Column } from "@/components/ui/data-table"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Button } from "@/components/ui/button"
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
import { Plus, Trash2, Loader2 } from "lucide-react"
import { useTeacherSubjects, useCreateTeacherSubject, useDeleteTeacherSubject } from "@/hooks/use-teacher-subjects"
import { useTeachers } from "@/hooks/use-teachers"
import { useSubjects } from "@/hooks/use-subjects"
import { useClasses } from "@/hooks/use-classes"
import type { TeacherSubject } from "@/types"

interface FormData {
  teacher_id: string
  subject_id: string
  class_id: string
}

const EMPTY_FORM: FormData = {
  teacher_id: "",
  subject_id: "",
  class_id: "",
}

export default function TeacherAssignmentsPage() {
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingAssignment, setDeletingAssignment] = useState<TeacherSubject | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const { data: teacherData } = useTeachers()
  const { data: subjectData } = useSubjects({ is_active: true, per_page: 100 })
  const { data: classData } = useClasses({ per_page: 100 })

  const { data, isLoading } = useTeacherSubjects({ page })
  const createAssignment = useCreateTeacherSubject()
  const deleteAssignment = useDeleteTeacherSubject()

  const assignments = data?.data ?? []
  const meta = data?.meta

  const teachers = teacherData ?? []
  const subjects = subjectData?.data ?? []
  const classes = classData?.data ?? []

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "teacher",
      header: "Guru",
      render: (item) => {
        const ts = item as unknown as TeacherSubject
        return <span className="font-medium">{ts.teacher?.name ?? "-"}</span>
      },
    },
    {
      key: "subject",
      header: "Mata Pelajaran",
      render: (item) => {
        const ts = item as unknown as TeacherSubject
        return <span>{ts.subject?.name ?? "-"}</span>
      },
    },
    {
      key: "class",
      header: "Kelas",
      render: (item) => {
        const ts = item as unknown as TeacherSubject
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {ts.class?.name ?? "-"}
          </span>
        )
      },
    },
    {
      key: "actions",
      header: "",
      className: "w-[60px]",
      render: (item) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation()
            setDeletingAssignment(item as unknown as TeacherSubject)
            setDeleteDialogOpen(true)
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  function openCreate() {
    setForm(EMPTY_FORM)
    setErrors({})
    setDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    try {
      await createAssignment.mutateAsync({
        teacher_id: Number(form.teacher_id),
        subject_id: Number(form.subject_id),
        class_id: Number(form.class_id),
      })
      setDialogOpen(false)
    } catch (err: unknown) {
      const apiErr = err as {
        response?: { data?: { errors?: Record<string, string[]>; message?: string } }
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
    if (!deletingAssignment) return
    try {
      await deleteAssignment.mutateAsync(deletingAssignment.id)
      setDeleteDialogOpen(false)
      setDeletingAssignment(null)
    } catch {
      // handled
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Penugasan Guru"
        description="Tugaskan guru ke mata pelajaran dan kelas"
        action={
          <Button onClick={openCreate} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Penugasan
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={assignments as unknown as Record<string, unknown>[]}
        loading={isLoading}
        emptyMessage="Belum ada penugasan guru"
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
            <DialogTitle>Tambah Penugasan Guru</DialogTitle>
            <DialogDescription>
              Pilih guru, mata pelajaran, dan kelas yang akan ditugaskan
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Guru *</Label>
              <Select value={form.teacher_id} onValueChange={(value) => setForm({ ...form, teacher_id: value ?? "" })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih guru" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.nama_lengkap}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.teacher_id && <p className="text-xs text-destructive">{errors.teacher_id[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label>Mata Pelajaran *</Label>
              <Select value={form.subject_id} onValueChange={(value) => setForm({ ...form, subject_id: value ?? "" })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih mata pelajaran" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subject_id && <p className="text-xs text-destructive">{errors.subject_id[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label>Kelas *</Label>
              <Select value={form.class_id} onValueChange={(value) => setForm({ ...form, class_id: value ?? "" })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name} - {c.major}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.class_id && <p className="text-xs text-destructive">{errors.class_id[0]}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={createAssignment.isPending}
              >
                {createAssignment.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Simpan Penugasan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Hapus Penugasan"
        description="Apakah Anda yakin ingin menghapus penugasan ini?"
        onConfirm={handleDelete}
        isLoading={deleteAssignment.isPending}
      />
    </div>
  )
}
