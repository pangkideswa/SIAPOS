"use client"

import { useState, useEffect, useRef } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
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
import { Loader2, Upload, X, FileText, Calendar } from "lucide-react"
import { toast } from "sonner"
import {
  STATUS_TUGAS_OPTIONS,
  ALLOWED_TUGAS_FILE_EXTENSIONS,
  EMPTY_TUGAS_FORM,
} from "@/features/tugas/constants/tugas.constants"
import { DUMMY_KELAS_MENGAJAR } from "@/features/kelas-mengajar/dummy/kelas-mengajar.data"
import type { Tugas, TugasFormData, TugasLampiran } from "@/features/tugas/types/tugas"

interface TugasFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: Tugas | null
  onSubmit: (data: TugasFormData) => Promise<void>
  isLoading?: boolean
}

export function TugasFormSheet({
  open,
  onOpenChange,
  editingItem,
  onSubmit,
  isLoading = false,
}: TugasFormSheetProps) {
  const [form, setForm] = useState<TugasFormData>(EMPTY_TUGAS_FORM)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const activeKelasMengajar = DUMMY_KELAS_MENGAJAR.filter(
    (km) => km.status === "Aktif"
  )

  useEffect(() => {
    if (editingItem) {
      setForm({
        judul: editingItem.judul,
        deskripsi: editingItem.deskripsi,
        kelas_mengajar_id: editingItem.kelas_mengajar_id,
        guru_nama: editingItem.guru_nama,
        mata_pelajaran: editingItem.mata_pelajaran,
        kelas: editingItem.kelas,
        lampiran: editingItem.lampiran,
        tanggal_dibuka: editingItem.tanggal_dibuka,
        tenggat_waktu: editingItem.tenggat_waktu,
        nilai_maksimal: editingItem.nilai_maksimal,
        status: editingItem.status,
      })
    } else {
      setForm(EMPTY_TUGAS_FORM)
    }
    setErrors({})
  }, [editingItem, open])

  function handleChange(
    field: keyof TugasFormData,
    value: string | number | TugasLampiran[]
  ) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function handleKelasMengajarSelect(value: string | null) {
    const kmId = Number(value)
    const km = DUMMY_KELAS_MENGAJAR.find((k) => k.id === kmId)
    if (km) {
      setForm((prev) => ({
        ...prev,
        kelas_mengajar_id: km.id,
        guru_nama: km.guru_nama,
        mata_pelajaran: km.mata_pelajaran,
        kelas: km.kelas,
      }))
    }
    if (errors.kelas_mengajar_id) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next.kelas_mengajar_id
        return next
      })
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return

    const newLampiran: TugasLampiran[] = Array.from(files).map(
      (file, idx) => ({
        id: Date.now() + idx,
        nama: file.name,
        ukuran: formatFileSize(file.size),
        tipe: file.type,
      })
    )

    handleChange("lampiran", [...form.lampiran, ...newLampiran])
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function removeLampiran(id: number) {
    handleChange(
      "lampiran",
      form.lampiran.filter((l) => l.id !== id)
    )
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {}

    if (!form.judul.trim()) {
      newErrors.judul = "Judul tugas wajib diisi."
    }
    if (form.kelas_mengajar_id === 0) {
      newErrors.kelas_mengajar_id = "Kelas mengajar wajib dipilih."
    }
    if (!form.tanggal_dibuka) {
      newErrors.tanggal_dibuka = "Tanggal dibuka wajib diisi."
    }
    if (!form.tenggat_waktu) {
      newErrors.tenggat_waktu = "Tenggat waktu wajib diisi."
    }
    if (
      form.tanggal_dibuka &&
      form.tenggat_waktu &&
      form.tenggat_waktu < form.tanggal_dibuka
    ) {
      newErrors.tenggat_waktu =
        "Tenggat waktu tidak boleh sebelum tanggal dibuka."
    }
    if (form.nilai_maksimal < 1) {
      newErrors.nilai_maksimal = "Nilai maksimal minimal 1."
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      toast.error("Formulir tidak valid", {
        description: "Silakan periksa kembali isian form Anda.",
      })
      return false
    }

    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    await onSubmit(form)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {editingItem
              ? "Edit Tugas"
              : "Tambah Tugas Baru"}
          </SheetTitle>
          <SheetDescription>
            {editingItem
              ? "Ubah informasi tugas di bawah ini."
              : "Lengkapi form berikut untuk membuat tugas baru."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Informasi Umum */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Informasi Umum
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="judul">
                  Judul Tugas <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="judul"
                  placeholder="Contoh: Tugas Jaringan Topologi"
                  value={form.judul}
                  onChange={(e) => handleChange("judul", e.target.value)}
                  disabled={isLoading}
                  className={errors.judul ? "border-destructive" : ""}
                />
                {errors.judul && (
                  <p className="text-xs text-destructive">{errors.judul}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="deskripsi">Deskripsi</Label>
                <Textarea
                  id="deskripsi"
                  placeholder="Deskripsi singkat tentang tugas ini..."
                  value={form.deskripsi}
                  onChange={(e) => handleChange("deskripsi", e.target.value)}
                  disabled={isLoading}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Kelas Mengajar */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Kelas Mengajar
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>
                  Pilih Kelas Mengajar{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={
                    form.kelas_mengajar_id
                      ? String(form.kelas_mengajar_id)
                      : ""
                  }
                  onValueChange={handleKelasMengajarSelect}
                  disabled={isLoading}
                >
                  <SelectTrigger
                    className={
                      errors.kelas_mengajar_id ? "border-destructive" : ""
                    }
                  >
                    <SelectValue placeholder="Pilih kelas mengajar" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeKelasMengajar.map((km) => (
                      <SelectItem key={km.id} value={String(km.id)}>
                        {km.mata_pelajaran} — {km.kelas} ({km.guru_nama})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.kelas_mengajar_id && (
                  <p className="text-xs text-destructive">
                    {errors.kelas_mengajar_id}
                  </p>
                )}
              </div>
              {form.kelas_mengajar_id > 0 && (
                <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-muted/50 text-sm">
                  <div>
                    <span className="text-muted-foreground text-xs">Guru</span>
                    <p className="font-medium">{form.guru_nama}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">
                      Mapel
                    </span>
                    <p className="font-medium">{form.mata_pelajaran}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">
                      Kelas
                    </span>
                    <p className="font-medium">{form.kelas}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lampiran */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Lampiran
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Upload Lampiran</Label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="w-full p-4 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Upload className="h-5 w-5" />
                  <span className="text-sm">Klik untuk upload file</span>
                  <span className="text-xs">
                    PDF, DOCX, PPTX, XLSX, ZIP
                  </span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ALLOWED_TUGAS_FILE_EXTENSIONS}
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
                {form.lampiran.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {form.lampiran.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{file.nama}</p>
                            <p className="text-xs text-muted-foreground">
                              {file.ukuran}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => removeLampiran(file.id)}
                          disabled={isLoading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Jadwal & Penilaian */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Jadwal & Penilaian
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tanggal_dibuka">
                    Tanggal Dibuka{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="tanggal_dibuka"
                      type="date"
                      value={form.tanggal_dibuka}
                      onChange={(e) =>
                        handleChange("tanggal_dibuka", e.target.value)
                      }
                      disabled={isLoading}
                      className={
                        "pl-9" +
                        (errors.tanggal_dibuka ? " border-destructive" : "")
                      }
                    />
                  </div>
                  {errors.tanggal_dibuka && (
                    <p className="text-xs text-destructive">
                      {errors.tanggal_dibuka}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenggat_waktu">
                    Tenggat Waktu{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="tenggat_waktu"
                      type="date"
                      value={form.tenggat_waktu}
                      onChange={(e) =>
                        handleChange("tenggat_waktu", e.target.value)
                      }
                      disabled={isLoading}
                      min={form.tanggal_dibuka || undefined}
                      className={
                        "pl-9" +
                        (errors.tenggat_waktu ? " border-destructive" : "")
                      }
                    />
                  </div>
                  {errors.tenggat_waktu && (
                    <p className="text-xs text-destructive">
                      {errors.tenggat_waktu}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nilai_maksimal">
                  Nilai Maksimal{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nilai_maksimal"
                  type="number"
                  min={1}
                  value={form.nilai_maksimal}
                  onChange={(e) =>
                    handleChange(
                      "nilai_maksimal",
                      Math.max(1, Number(e.target.value))
                    )
                  }
                  disabled={isLoading}
                  className={
                    errors.nilai_maksimal ? "border-destructive" : ""
                  }
                />
                {errors.nilai_maksimal && (
                  <p className="text-xs text-destructive">
                    {errors.nilai_maksimal}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Pengaturan
            </h3>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v: string | null) =>
                  handleChange(
                    "status",
                    (v ?? "Draft") as
                      | "Draft"
                      | "Dipublikasikan"
                      | "Ditutup"
                  )
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_TUGAS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingItem ? "Simpan Perubahan" : "Tambah Tugas"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
