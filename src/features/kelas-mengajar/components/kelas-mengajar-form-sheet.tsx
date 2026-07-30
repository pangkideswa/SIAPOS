"use client"

import { useState, useEffect } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
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
  GURU_OPTIONS,
  MATA_PELAJARAN_OPTIONS,
  KELAS_OPTIONS,
  TAHUN_AJARAN_OPTIONS,
  SEMESTER_OPTIONS,
  STATUS_OPTIONS,
  EMPTY_KELAS_MENGAJAR_FORM,
} from "@/features/kelas-mengajar/constants/kelas-mengajar.constants"
import type { KelasMengajar, KelasMengajarFormData } from "@/features/kelas-mengajar/types/kelas-mengajar"

interface KelasMengajarFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: KelasMengajar | null
  onSubmit: (data: KelasMengajarFormData) => Promise<void>
  isLoading?: boolean
}

export function KelasMengajarFormSheet({
  open,
  onOpenChange,
  editingItem,
  onSubmit,
  isLoading = false,
}: KelasMengajarFormSheetProps) {
  const [form, setForm] = useState<KelasMengajarFormData>(EMPTY_KELAS_MENGAJAR_FORM)

  useEffect(() => {
    if (editingItem) {
      setForm({
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
  }, [editingItem, open])

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit(form)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {editingItem ? "Edit Kelas Mengajar" : "Tambah Kelas Mengajar"}
          </SheetTitle>
          <SheetDescription>
            {editingItem
              ? "Perbarui informasi kelas mengajar"
              : "Isi data untuk menambahkan kelas mengajar baru"}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Informasi Kelas
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Guru *</Label>
                <Select
                  value={form.guru_nama}
                  onValueChange={(v) => v && handleChange("guru_nama", v)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Guru" />
                  </SelectTrigger>
                  <SelectContent>
                    {GURU_OPTIONS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Mata Pelajaran *</Label>
                <Select
                  value={form.mata_pelajaran}
                  onValueChange={(v) => v && handleChange("mata_pelajaran", v)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Mata Pelajaran" />
                  </SelectTrigger>
                  <SelectContent>
                    {MATA_PELAJARAN_OPTIONS.map((mp) => (
                      <SelectItem key={mp} value={mp}>
                        {mp}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Kelas *</Label>
                <Select
                  value={form.kelas}
                  onValueChange={(v) => v && handleChange("kelas", v)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {KELAS_OPTIONS.map((k) => (
                      <SelectItem key={k} value={k}>
                        {k}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tahun Ajaran *</Label>
                  <Select
                    value={form.tahun_ajaran}
                    onValueChange={(v) => v && handleChange("tahun_ajaran", v)}
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
                    onValueChange={(v) => v && handleChange("semester", v)}
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
                  onValueChange={(v) => v && handleChange("status", v)}
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

          <SheetFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingItem ? "Simpan Perubahan" : "Tambah Kelas Mengajar"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
