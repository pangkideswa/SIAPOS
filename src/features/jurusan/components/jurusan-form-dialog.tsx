"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { EMPTY_JURUSAN_FORM } from "@/features/jurusan/constants/jurusan.constants"
import type { Jurusan } from "@/features/jurusan/types/jurusan"

interface JurusanFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingJurusan: Jurusan | null
  onSubmit: (data: typeof EMPTY_JURUSAN_FORM) => Promise<void>
  isLoading?: boolean
}

export function JurusanFormDialog({
  open,
  onOpenChange,
  editingJurusan,
  onSubmit,
  isLoading = false,
}: JurusanFormDialogProps) {
  const [form, setForm] = useState(EMPTY_JURUSAN_FORM)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (editingJurusan) {
      setForm({
        name: editingJurusan.name,
        code: editingJurusan.code,
        is_active: editingJurusan.is_active,
        description: editingJurusan.description ?? "",
      })
    } else {
      setForm(EMPTY_JURUSAN_FORM)
    }
    setErrors({})
  }, [editingJurusan, open])

  function handleChange(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    try {
      await onSubmit(form)
    } catch (err: unknown) {
      const apiErr = err as {
        response?: { data?: { errors?: Record<string, string[]> } }
      }
      if (apiErr.response?.data?.errors) {
        setErrors(apiErr.response.data.errors)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editingJurusan ? "Edit Jurusan" : "Tambah Jurusan Baru"}
          </DialogTitle>
          <DialogDescription>
            {editingJurusan
              ? "Perbarui informasi jurusan"
              : "Isi data untuk menambahkan jurusan baru"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Jurusan *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Contoh: Teknik Komputer dan Jaringan"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Kode Jurusan *</Label>
              <Input
                id="code"
                value={form.code}
                onChange={(e) =>
                  handleChange("code", e.target.value.toUpperCase())
                }
                placeholder="Contoh: TKJ"
                maxLength={10}
                disabled={isLoading}
              />
              {errors.code && (
                <p className="text-xs text-destructive">{errors.code[0]}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="is_active">Status *</Label>
            <Select
              value={form.is_active ? "true" : "false"}
              onValueChange={(value) =>
                handleChange("is_active", value === "true")
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Aktif</SelectItem>
                <SelectItem value="false">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
            {errors.is_active && (
              <p className="text-xs text-destructive">{errors.is_active[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Deskripsi singkat tentang jurusan ini..."
              rows={3}
              disabled={isLoading}
            />
          </div>
          <DialogFooter>
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
              {editingJurusan ? "Simpan Perubahan" : "Tambah Jurusan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
