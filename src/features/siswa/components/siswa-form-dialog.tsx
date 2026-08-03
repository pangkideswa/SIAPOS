"use client"

import { useState, useEffect, useRef } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Camera, X } from "lucide-react"
import {
  JENIS_KELAMIN_OPTIONS,
  AGAMA_OPTIONS,
  STATUS_SISWA_OPTIONS,
  KELAS_OPTIONS,
  TAHUN_AJARAN_OPTIONS,
  JURUSAN_OPTIONS,
  EMPTY_SISWA_FORM,
} from "@/features/siswa/constants/siswa.constants"
import type { Siswa, SiswaFormData } from "@/features/siswa/types/siswa"

interface SiswaFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingSiswa: Siswa | null
  onSubmit: (data: SiswaFormData) => Promise<void>
  isLoading?: boolean
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function SiswaFormDialog({
  open,
  onOpenChange,
  editingSiswa,
  onSubmit,
  isLoading = false,
}: SiswaFormDialogProps) {
  const [form, setForm] = useState<SiswaFormData>(EMPTY_SISWA_FORM)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)

  useEffect(() => {
    if (editingSiswa) {
      setForm({
        foto: editingSiswa.foto,
        nis: editingSiswa.nis,
        nisn: editingSiswa.nisn,
        nama_lengkap: editingSiswa.nama_lengkap,
        jenis_kelamin: editingSiswa.jenis_kelamin,
        tempat_lahir: editingSiswa.tempat_lahir,
        tanggal_lahir: editingSiswa.tanggal_lahir,
        agama: editingSiswa.agama,
        alamat: editingSiswa.alamat ?? "",
        jurusan_id: editingSiswa.jurusan_id,
        kelas: editingSiswa.kelas,
        tahun_masuk: editingSiswa.tahun_masuk,
        tahun_ajaran: editingSiswa.tahun_ajaran,
        status: editingSiswa.status,
        nama_ayah: editingSiswa.nama_ayah,
        nama_ibu: editingSiswa.nama_ibu,
        no_hp_ortu: editingSiswa.no_hp_ortu ?? "",
        alamat_ortu: editingSiswa.alamat_ortu ?? "",
      })
      setFotoPreview(editingSiswa.foto)
    } else {
      setForm(EMPTY_SISWA_FORM)
      setFotoPreview(null)
    }
    setErrors({})
  }, [editingSiswa, open])

  function handleChange(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setFotoPreview(result)
        setForm((prev) => ({ ...prev, foto: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  function handleRemoveFoto() {
    setFotoPreview(null)
    setForm((prev) => ({ ...prev, foto: null }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
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
            {editingSiswa ? "Edit Data Siswa" : "Tambah Siswa Baru"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {editingSiswa
              ? "Perbarui informasi data siswa"
              : "Isi data untuk menambahkan siswa baru"}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <ResponsiveDialogBody>
            <div className="space-y-5">
          {/* Foto */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Foto Profil
            </h3>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={fotoPreview ?? undefined} alt="Foto siswa" />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                  {form.nama_lengkap ? getInitials(form.nama_lengkap) : "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFotoChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Pilih Foto
                </Button>
                {fotoPreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFoto}
                    disabled={isLoading}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Hapus
                  </Button>
                )}
                <p className="text-xs text-muted-foreground">
                  JPG, PNG. Maks 2MB.
                </p>
              </div>
            </div>
          </div>

          {/* Identitas */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Identitas
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nis">NIS *</Label>
                  <Input
                    id="nis"
                    value={form.nis}
                    onChange={(e) => handleChange("nis", e.target.value)}
                    placeholder="Contoh: 2024001"
                    maxLength={20}
                    disabled={isLoading}
                  />
                  {errors.nis && (
                    <p className="text-xs text-destructive">{errors.nis[0]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nisn">NISN *</Label>
                  <Input
                    id="nisn"
                    value={form.nisn}
                    onChange={(e) => handleChange("nisn", e.target.value)}
                    placeholder="Contoh: 0081234001"
                    maxLength={20}
                    disabled={isLoading}
                  />
                  {errors.nisn && (
                    <p className="text-xs text-destructive">{errors.nisn[0]}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nama_lengkap">Nama Lengkap *</Label>
                <Input
                  id="nama_lengkap"
                  value={form.nama_lengkap}
                  onChange={(e) => handleChange("nama_lengkap", e.target.value)}
                  placeholder="Contoh: Rizki Pratama"
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
                    onChange={(e) => handleChange("tanggal_lahir", e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.tanggal_lahir && (
                    <p className="text-xs text-destructive">
                      {errors.tanggal_lahir[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <Label htmlFor="agama">Agama *</Label>
                  <Select
                    value={form.agama}
                    onValueChange={(v) => v && handleChange("agama", v)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AGAMA_OPTIONS.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

          {/* Akademik */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Akademik
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jurusan_id">Jurusan *</Label>
                  <Select
                    value={String(form.jurusan_id)}
                    onValueChange={(v) =>
                      v && handleChange("jurusan_id", Number(v))
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {JURUSAN_OPTIONS.map((j) => (
                        <SelectItem key={j.id} value={String(j.id)}>
                          {j.code} - {j.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.jurusan_id && (
                    <p className="text-xs text-destructive">
                      {errors.jurusan_id[0]}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kelas">Kelas *</Label>
                  <Select
                    value={form.kelas}
                    onValueChange={(v) => v && handleChange("kelas", v)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {KELAS_OPTIONS.map((k) => (
                        <SelectItem key={k} value={k}>
                          {k}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.kelas && (
                    <p className="text-xs text-destructive">
                      {errors.kelas[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tahun_masuk">Tahun Masuk *</Label>
                  <Input
                    id="tahun_masuk"
                    value={form.tahun_masuk}
                    onChange={(e) => handleChange("tahun_masuk", e.target.value)}
                    placeholder="Contoh: 2024"
                    maxLength={10}
                    disabled={isLoading}
                  />
                  {errors.tahun_masuk && (
                    <p className="text-xs text-destructive">
                      {errors.tahun_masuk[0]}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tahun_ajaran">Tahun Ajaran *</Label>
                  <Select
                    value={form.tahun_ajaran}
                    onValueChange={(v) => v && handleChange("tahun_ajaran", v)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TAHUN_AJARAN_OPTIONS.map((ta) => (
                        <SelectItem key={ta} value={ta}>
                          {ta}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.tahun_ajaran && (
                    <p className="text-xs text-destructive">
                      {errors.tahun_ajaran[0]}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => v && handleChange("status", v)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_SISWA_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-xs text-destructive">
                      {errors.status[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Orang Tua */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Orang Tua
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nama_ayah">Nama Ayah *</Label>
                  <Input
                    id="nama_ayah"
                    value={form.nama_ayah}
                    onChange={(e) => handleChange("nama_ayah", e.target.value)}
                    placeholder="Contoh: Budi Pratama"
                    disabled={isLoading}
                  />
                  {errors.nama_ayah && (
                    <p className="text-xs text-destructive">
                      {errors.nama_ayah[0]}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nama_ibu">Nama Ibu *</Label>
                  <Input
                    id="nama_ibu"
                    value={form.nama_ibu}
                    onChange={(e) => handleChange("nama_ibu", e.target.value)}
                    placeholder="Contoh: Siti Pratama"
                    disabled={isLoading}
                  />
                  {errors.nama_ibu && (
                    <p className="text-xs text-destructive">
                      {errors.nama_ibu[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="no_hp_ortu">No. HP Orang Tua (Opsional)</Label>
                <Input
                  id="no_hp_ortu"
                  value={form.no_hp_ortu ?? ""}
                  onChange={(e) => handleChange("no_hp_ortu", e.target.value)}
                  placeholder="081234567890"
                  maxLength={20}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alamat_ortu">Alamat Orang Tua (Opsional)</Label>
                <Textarea
                  id="alamat_ortu"
                  value={form.alamat_ortu ?? ""}
                  onChange={(e) => handleChange("alamat_ortu", e.target.value)}
                  placeholder="Alamat orang tua..."
                  rows={3}
                  disabled={isLoading}
                />
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
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : editingSiswa ? (
                "Simpan Perubahan"
              ) : (
                "Tambah Siswa"
              )}
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
