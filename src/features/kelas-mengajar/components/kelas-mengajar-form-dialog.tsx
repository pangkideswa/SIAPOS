"use client"

import { useState, useEffect, useMemo } from "react"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogBody,
} from "@/components/ui/responsive-dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import {
  TAHUN_AJARAN_OPTIONS,
  SEMESTER_OPTIONS,
  STATUS_OPTIONS,
  EMPTY_KELAS_MENGAJAR_FORM,
} from "@/features/kelas-mengajar/constants/kelas-mengajar.constants"
import { useTeachers } from "@/hooks/use-teachers"
import { useSubjects } from "@/hooks/use-subjects"
import { useClasses } from "@/hooks/use-classes"
import type { KelasMengajar, KelasMengajarFormData } from "@/features/kelas-mengajar/types/kelas-mengajar"

interface KelasMengajarFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: KelasMengajar | null
  onSubmit: (data: KelasMengajarFormData) => Promise<void>
  isLoading?: boolean
}

export function KelasMengajarFormDialog({
  open,
  onOpenChange,
  editingItem,
  onSubmit,
  isLoading = false,
}: KelasMengajarFormDialogProps) {
  const [form, setForm] = useState<KelasMengajarFormData>(EMPTY_KELAS_MENGAJAR_FORM)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  // Data dari API
  const { data: teachersData, isLoading: teachersLoading } = useTeachers()
  const { data: subjectsData, isLoading: subjectsLoading } = useSubjects({ is_active: true, per_page: 100 })
  const { data: classesData, isLoading: classesLoading } = useClasses({ per_page: 200 })

  const teachers = useMemo(() => teachersData ?? [], [teachersData])
  const subjects = useMemo(() => subjectsData?.data ?? [], [subjectsData])
  const classrooms = useMemo(() => classesData?.data ?? [], [classesData])

  useEffect(() => {
    if (!open) return
    if (editingItem) {
      setForm({
        teacher_id: editingItem.teacher_id ?? null,
        subject_id: editingItem.subject_id ?? null,
        classroom_id: editingItem.classroom_id ?? null,
        guru_nama: editingItem.guru_nama,
        mata_pelajaran: editingItem.mata_pelajaran,
        kelas: editingItem.kelas,
        tahun_ajaran: editingItem.tahun_ajaran,
        semester: editingItem.semester,
        status: editingItem.status,
      })
    } else {
      setForm(EMPTY_KELAS_MENGAJAR_FORM)
    }
    setErrors({})
  }, [editingItem, open])

  function handleSimpleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleTeacherChange(value: string) {
    const id = Number(value)
    const teacher = teachers.find((t) => t.id === id)
    if (!teacher) return
    setForm((prev) => ({
      ...prev,
      teacher_id: teacher.id,
      guru_nama: teacher.nama_lengkap,
    }))
    if (errors.guru_nama) setErrors((prev) => { const n = { ...prev }; delete n.guru_nama; return n })
  }

  function handleSubjectChange(value: string) {
    const id = Number(value)
    const subject = subjects.find((s) => s.id === id)
    if (!subject) return
    setForm((prev) => ({
      ...prev,
      subject_id: subject.id,
      mata_pelajaran: subject.name,
    }))
    if (errors.mata_pelajaran) setErrors((prev) => { const n = { ...prev }; delete n.mata_pelajaran; return n })
  }

  function handleClassroomChange(value: string) {
    const id = Number(value)
    const classroom = classrooms.find((c) => c.id === id)
    if (!classroom) return
    setForm((prev) => ({
      ...prev,
      classroom_id: classroom.id,
      kelas: classroom.name,
    }))
    if (errors.kelas) setErrors((prev) => { const n = { ...prev }; delete n.kelas; return n })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Validasi manual
    const nextErrors: Record<string, string[]> = {}
    if (!form.guru_nama) nextErrors.guru_nama = ["Guru wajib dipilih"]
    if (!form.mata_pelajaran) nextErrors.mata_pelajaran = ["Mata pelajaran wajib dipilih"]
    if (!form.kelas) nextErrors.kelas = ["Kelas wajib dipilih"]
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    try {
      await onSubmit(form)
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { errors?: Record<string, string[]> } } }
      if (apiErr.response?.data?.errors) {
        setErrors(apiErr.response.data.errors)
      }
    }
  }

  const isDataLoading = teachersLoading || subjectsLoading || classesLoading

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {editingItem ? "Edit Kelas Mengajar" : "Tambah Kelas Mengajar"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {editingItem
              ? "Perbarui informasi kelas mengajar"
              : "Isi data untuk menambahkan kelas mengajar baru"}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <ResponsiveDialogBody>
            <div className="space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Informasi Kelas
            </h3>
            <div className="space-y-4">
              {/* Guru */}
              <div className="space-y-2">
                <Label>Guru *</Label>
                <Select
                  value={form.teacher_id != null ? String(form.teacher_id) : ""}
                  onValueChange={(v) => v && handleTeacherChange(v)}
                  disabled={isLoading || teachersLoading}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        teachersLoading
                          ? "Memuat data guru..."
                          : form.guru_nama || "Pilih Guru"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.nama_lengkap}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.guru_nama && (
                  <p className="text-xs text-destructive">{errors.guru_nama[0]}</p>
                )}
              </div>

              {/* Mata Pelajaran */}
              <div className="space-y-2">
                <Label>Mata Pelajaran *</Label>
                <Select
                  value={form.subject_id != null ? String(form.subject_id) : ""}
                  onValueChange={(v) => v && handleSubjectChange(v)}
                  disabled={isLoading || subjectsLoading}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        subjectsLoading
                          ? "Memuat mata pelajaran..."
                          : form.mata_pelajaran || "Pilih Mata Pelajaran"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.mata_pelajaran && (
                  <p className="text-xs text-destructive">{errors.mata_pelajaran[0]}</p>
                )}
              </div>

              {/* Kelas */}
              <div className="space-y-2">
                <Label>Kelas *</Label>
                <Select
                  value={form.classroom_id != null ? String(form.classroom_id) : ""}
                  onValueChange={(v) => v && handleClassroomChange(v)}
                  disabled={isLoading || classesLoading}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        classesLoading
                          ? "Memuat data kelas..."
                          : form.kelas || "Pilih Kelas"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {classrooms.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.kelas && (
                  <p className="text-xs text-destructive">{errors.kelas[0]}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tahun Ajaran *</Label>
                  <Select
                    value={form.tahun_ajaran}
                    onValueChange={(v) => v && handleSimpleChange("tahun_ajaran", v)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TAHUN_AJARAN_OPTIONS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Semester *</Label>
                  <Select
                    value={form.semester}
                    onValueChange={(v) => v && handleSimpleChange("semester", v)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SEMESTER_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status *</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => v && handleSimpleChange("status", v)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
            </div>
          </ResponsiveDialogBody>

          <ResponsiveDialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
              disabled={isLoading || isDataLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : editingItem ? (
                "Simpan Perubahan"
              ) : (
                "Tambah Kelas Mengajar"
              )}
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
