"use client"

import { useState, useEffect } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import {
  JENIS_KELAMIN_OPTIONS,
  STATUS_KEPEGAWAIAN_OPTIONS,
  PENDIDIKAN_OPTIONS,
  MATA_PELAJARAN_OPTIONS,
  EMPTY_GURU_FORM,
} from "@/features/guru/constants/guru.constants"
import type { Guru, GuruFormData } from "@/features/guru/types/guru"

interface GuruFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingGuru: Guru | null
  onSubmit: (data: GuruFormData) => Promise<void>
  isLoading?: boolean
}

export function GuruFormDialog({
  open,
  onOpenChange,
  editingGuru,
  onSubmit,
  isLoading = false,
}: GuruFormDialogProps) {
  const [form, setForm] = useState<GuruFormData>(EMPTY_GURU_FORM)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (editingGuru) {
      setForm({
        foto: editingGuru.foto,
        nama_lengkap: editingGuru.nama_lengkap,
        nip: editingGuru.nip,
        nuptk: editingGuru.nuptk ?? "",
        jenis_kelamin: editingGuru.jenis_kelamin,
        tempat_lahir: editingGuru.tempat_lahir,
        tanggal_lahir: editingGuru.tanggal_lahir,
        no_hp: editingGuru.no_hp ?? "",
        email: editingGuru.email,
        alamat: editingGuru.alamat ?? "",
        pendidikan_terakhir: editingGuru.pendidikan_terakhir,
        status_kepegawaian: editingGuru.status_kepegawaian,
        mata_pelajaran: editingGuru.mata_pelajaran,
      })
    } else {
      setForm(EMPTY_GURU_FORM)
    }
    setErrors({})
  }, [editingGuru, open])

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function toggleMataPelajaran(mp: string) {
    setForm((prev) => {
      const exists = prev.mata_pelajaran.includes(mp)
      return {
        ...prev,
        mata_pelajaran: exists
          ? prev.mata_pelajaran.filter((m) => m !== mp)
          : [...prev.mata_pelajaran, mp],
      }
    })
    if (errors.mata_pelajaran) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next.mata_pelajaran
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
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {editingGuru ? "Edit Data Guru" : "Tambah Guru Baru"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {editingGuru
              ? "Perbarui informasi data guru"
              : "Isi data untuk menambahkan guru baru"}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <ResponsiveDialogBody>
            <div className="space-y-5">
          {/* Data Diri */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Data Diri
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nama_lengkap">Nama Lengkap *</Label>
                <Input
                  id="nama_lengkap"
                  value={form.nama_lengkap}
                  onChange={(e) => handleChange("nama_lengkap", e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  disabled={isLoading}
                />
                {errors.nama_lengkap && (
                  <p className="text-xs text-destructive">
                    {errors.nama_lengkap[0]}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nip">NIP *</Label>
                  <Input
                    id="nip"
                    value={form.nip}
                    onChange={(e) => handleChange("nip", e.target.value)}
                    placeholder="198501152010011001"
                    maxLength={20}
                    disabled={isLoading}
                  />
                  {errors.nip && (
                    <p className="text-xs text-destructive">
                      {errors.nip[0]}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nuptk">NUPTK (Opsional)</Label>
                  <Input
                    id="nuptk"
                    value={form.nuptk ?? ""}
                    onChange={(e) => handleChange("nuptk", e.target.value)}
                    placeholder="123456789012345670"
                    maxLength={20}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jenis_kelamin">Jenis Kelamin *</Label>
                  <Select
                    value={form.jenis_kelamin}
                    onValueChange={(v) => v && handleChange("jenis_kelamin", v)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {JENIS_KELAMIN_OPTIONS.map((jk) => (
                        <SelectItem key={jk} value={jk}>
                          {jk}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tanggal_lahir">Tanggal Lahir *</Label>
                  <Input
                    id="tanggal_lahir"
                    type="date"
                    value={form.tanggal_lahir}
                    onChange={(e) =>
                      handleChange("tanggal_lahir", e.target.value)
                    }
                    disabled={isLoading}
                  />
                  {errors.tanggal_lahir && (
                    <p className="text-xs text-destructive">
                      {errors.tanggal_lahir[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tempat_lahir">Tempat Lahir *</Label>
                <Input
                  id="tempat_lahir"
                  value={form.tempat_lahir}
                  onChange={(e) => handleChange("tempat_lahir", e.target.value)}
                  placeholder="Contoh: Jakarta"
                  disabled={isLoading}
                />
                {errors.tempat_lahir && (
                  <p className="text-xs text-destructive">
                    {errors.tempat_lahir[0]}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Kontak
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="Contoh: budi@sekolah.sch.id"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">
                      {errors.email[0]}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="no_hp">No. HP (Opsional)</Label>
                  <Input
                    id="no_hp"
                    value={form.no_hp ?? ""}
                    onChange={(e) => handleChange("no_hp", e.target.value)}
                    placeholder="081234567890"
                    maxLength={20}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alamat">Alamat (Opsional)</Label>
                <Textarea
                  id="alamat"
                  value={form.alamat ?? ""}
                  onChange={(e) => handleChange("alamat", e.target.value)}
                  placeholder="Alamat lengkap..."
                  rows={3}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Kepegawaian */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Kepegawaian & Pendidikan
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pendidikan_terakhir">
                    Pendidikan Terakhir *
                  </Label>
                  <Select
                    value={form.pendidikan_terakhir}
                    onValueChange={(v) =>
                      v && handleChange("pendidikan_terakhir", v)
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PENDIDIKAN_OPTIONS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status_kepegawaian">
                    Status Kepegawaian *
                  </Label>
                  <Select
                    value={form.status_kepegawaian}
                    onValueChange={(v) =>
                      v && handleChange("status_kepegawaian", v)
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_KEPEGAWAIAN_OPTIONS.map((s) => (
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

          {/* Mata Pelajaran */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Mata Pelajaran *
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MATA_PELAJARAN_OPTIONS.map((mp) => (
                <label
                  key={mp}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                    form.mata_pelajaran.includes(mp)
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <Checkbox
                    checked={form.mata_pelajaran.includes(mp)}
                    onCheckedChange={() => toggleMataPelajaran(mp)}
                    disabled={isLoading}
                  />
                  <span className="text-xs font-medium leading-tight">
                    {mp}
                  </span>
                </label>
              ))}
            </div>
            {errors.mata_pelajaran && (
              <p className="text-xs text-destructive mt-2">
                {errors.mata_pelajaran[0]}
              </p>
            )}
            {form.mata_pelajaran.length > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                {form.mata_pelajaran.length} mata pelajaran dipilih
              </p>
            )}
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
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : editingGuru ? (
                "Simpan Perubahan"
              ) : (
                "Tambah Guru"
              )}
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
