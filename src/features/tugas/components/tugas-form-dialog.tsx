"use client"

import { useState, useEffect } from "react"
import { Loader2, X, FileText, Calendar } from "lucide-react"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogBody,
} from "@/components/ui/responsive-dialog"
import { FormSection } from "@/components/ui/form-section"
import { FieldError } from "@/components/ui/field-error"
import { FileDropzone } from "@/components/ui/file-dropzone"
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
import { toast } from "sonner"
import {
  STATUS_TUGAS_OPTIONS,
  ALLOWED_TUGAS_FILE_EXTENSIONS,
  EMPTY_TUGAS_FORM,
} from "@/features/tugas/constants/tugas.constants"
import { useTeachingClasses } from "@/hooks/use-teaching-classes"
import { formatFileSize, validateFileSize } from "@/lib/file"
import { cn } from "@/lib/utils"
import type {
  Tugas,
  TugasFormData,
  TugasLampiran,
} from "@/features/tugas/types/tugas"

interface TugasFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: Tugas | null
  onSubmit: (data: TugasFormData) => Promise<void>
  isLoading?: boolean
  defaultKelasMengajarId?: number
}

type TugasFormErrors = Partial<
  Record<
    | "judul"
    | "kelas_mengajar_id"
    | "tanggal_dibuka"
    | "tenggat_waktu"
    | "tenggat_jam"
    | "nilai_maksimal",
    string
  >
>

export function TugasFormDialog({
  open,
  onOpenChange,
  editingItem,
  onSubmit,
  isLoading = false,
  defaultKelasMengajarId,
}: TugasFormDialogProps) {
  const { data: activeKelasMengajar = [] } = useTeachingClasses()
  const [form, setForm] = useState<TugasFormData>(EMPTY_TUGAS_FORM)
  const [errors, setErrors] = useState<TugasFormErrors>({})

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
        tenggat_jam: editingItem.tenggat_jam,
        nilai_maksimal: editingItem.nilai_maksimal,
        status: editingItem.status,
      })
    } else {
      const defaultKm =
        defaultKelasMengajarId !== undefined
          ? activeKelasMengajar.find((km) => km.id === defaultKelasMengajarId)
          : undefined
      if (defaultKm) {
        setForm({
          ...EMPTY_TUGAS_FORM,
          kelas_mengajar_id: defaultKm.id,
          guru_nama: defaultKm.guru_nama,
          mata_pelajaran: defaultKm.mata_pelajaran,
          kelas: defaultKm.kelas,
        })
      } else {
        setForm(EMPTY_TUGAS_FORM)
      }
    }
    setErrors({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingItem, open, defaultKelasMengajarId])

  function handleChange(
    field: keyof TugasFormData,
    value: string | number | TugasLampiran[] | null
  ) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof TugasFormErrors]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field as keyof TugasFormErrors]
        return next
      })
    }
  }

  function handleKelasMengajarSelect(value: string | null) {
    const kmId = Number(value)
    const km = activeKelasMengajar.find((k) => k.id === kmId)
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

  function handleFileUpload(files: FileList) {
    const oversized = Array.from(files).find(
      (file) => !validateFileSize(file, 20).ok
    )
    if (oversized) {
      const check = validateFileSize(oversized, 20)
      toast.warning("Ukuran file terlalu besar", {
        description: check.ok ? undefined : check.error,
      })
      return
    }

    const newLampiran: TugasLampiran[] = Array.from(files).map(
      (file, idx) => ({
        id: Date.now() + idx,
        nama: file.name,
        ukuran: formatFileSize(file.size),
        tipe: file.type,
      })
    )

    handleChange("lampiran", [...form.lampiran, ...newLampiran])
  }

  function removeLampiran(id: number) {
    handleChange(
      "lampiran",
      form.lampiran.filter((l) => l.id !== id)
    )
  }

  function validate(): boolean {
    const newErrors: TugasFormErrors = {}

    if (!form.judul.trim()) {
      newErrors.judul = "Judul tugas wajib diisi."
    }
    if (form.kelas_mengajar_id === 0) {
      newErrors.kelas_mengajar_id = "Mata pelajaran / kelas wajib dipilih."
    }
    if (!form.tanggal_dibuka) {
      newErrors.tanggal_dibuka = "Tanggal dibuka wajib diisi."
    }
    if (!form.tenggat_waktu) {
      newErrors.tenggat_waktu = "Tenggat waktu wajib diisi."
    }
    if (!form.tenggat_jam) {
      newErrors.tenggat_jam = "Tenggat jam wajib diisi."
    }
    if (
      form.tanggal_dibuka &&
      form.tenggat_waktu &&
      form.tenggat_waktu < form.tanggal_dibuka
    ) {
      newErrors.tenggat_waktu =
        "Tenggat waktu tidak boleh sebelum tanggal dibuka."
    }
    if (!Number.isFinite(form.nilai_maksimal) || form.nilai_maksimal < 1) {
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
    <ResponsiveDialog
      open={open}
      onOpenChange={(next) => {
        if (!isLoading) onOpenChange(next)
      }}
    >
      <ResponsiveDialogContent className="sm:max-w-2xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {editingItem ? "Edit Tugas" : "Tambah Tugas Baru"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {editingItem
              ? "Ubah informasi tugas di bawah ini."
              : "Lengkapi form berikut untuk membuat tugas baru."}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <ResponsiveDialogBody>
            <div className="space-y-5">
              {/* General Information */}
              <FormSection
                title="Informasi Umum"
                description="Informasi dasar tentang tugas."
              >
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
                    aria-invalid={!!errors.judul}
                    className={errors.judul ? "border-destructive" : ""}
                  />
                  <FieldError id="judul-error" message={errors.judul} />
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
                <div className="space-y-2">
                  <Label>
                    Mata Pelajaran / Kelas{" "}
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
                  <FieldError
                    id="kelas_mengajar_id-error"
                    message={errors.kelas_mengajar_id}
                  />
                  {form.kelas_mengajar_id > 0 && (
                    <div className="grid grid-cols-3 gap-3 rounded-lg bg-muted/50 p-3 text-sm">
                      <div className="min-w-0">
                        <span className="text-xs text-muted-foreground">Guru</span>
                        <p className="truncate font-medium">{form.guru_nama}</p>
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs text-muted-foreground">Mapel</span>
                        <p className="truncate font-medium">
                          {form.mata_pelajaran}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs text-muted-foreground">Kelas</span>
                        <p className="truncate font-medium">{form.kelas}</p>
                      </div>
                    </div>
                  )}
                </div>
              </FormSection>

              {/* Schedule */}
              <FormSection
                title="Jadwal"
                description="Atur waktu pembukaan dan tenggat tugas."
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="tanggal_dibuka">
                      Tanggal Dibuka <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="tanggal_dibuka"
                        type="date"
                        value={form.tanggal_dibuka}
                        onChange={(e) =>
                          handleChange("tanggal_dibuka", e.target.value)
                        }
                        disabled={isLoading}
                        aria-invalid={!!errors.tanggal_dibuka}
                        className={cn(
                          "pl-9",
                          errors.tanggal_dibuka ? "border-destructive" : ""
                        )}
                      />
                    </div>
                    <FieldError
                      id="tanggal_dibuka-error"
                      message={errors.tanggal_dibuka}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tenggat_waktu">
                      Tenggat Waktu <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="tenggat_waktu"
                        type="date"
                        value={form.tenggat_waktu}
                        onChange={(e) =>
                          handleChange("tenggat_waktu", e.target.value)
                        }
                        disabled={isLoading}
                        min={form.tanggal_dibuka || undefined}
                        aria-invalid={!!errors.tenggat_waktu}
                        className={cn(
                          "pl-9",
                          errors.tenggat_waktu ? "border-destructive" : ""
                        )}
                      />
                    </div>
                    <FieldError
                      id="tenggat_waktu-error"
                      message={errors.tenggat_waktu}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenggat_jam">
                    Tenggat Jam <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="tenggat_jam"
                    type="time"
                    value={form.tenggat_jam ?? ""}
                    onChange={(e) =>
                      handleChange("tenggat_jam", e.target.value || null)
                    }
                    disabled={isLoading}
                    aria-invalid={!!errors.tenggat_jam}
                    className={errors.tenggat_jam ? "border-destructive" : ""}
                  />
                  <FieldError
                    id="tenggat_jam-error"
                    message={errors.tenggat_jam}
                  />
                </div>
              </FormSection>

              {/* Attachment */}
              <FormSection
                title="Lampiran"
                description="Tambahkan file pendukung tugas."
              >
                <div className="space-y-2">
                  <Label>Upload Lampiran</Label>
                  <FileDropzone
                    title="Klik untuk upload file"
                    hint="PDF, DOCX, PPTX, XLSX, ZIP (maks. 20MB per file)"
                    accept={ALLOWED_TUGAS_FILE_EXTENSIONS}
                    multiple
                    disabled={isLoading}
                    onFiles={handleFileUpload}
                  />
                  {form.lampiran.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {form.lampiran.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between rounded-lg bg-muted/50 p-2"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {file.nama}
                              </p>
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
                            aria-label={`Hapus ${file.nama}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FormSection>

              {/* Assessment */}
              <FormSection
                title="Penilaian"
                description="Atur penilaian tugas."
              >
                <div className="space-y-2">
                  <Label htmlFor="nilai_maksimal">
                    Nilai Maksimal <span className="text-destructive">*</span>
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
                    aria-invalid={!!errors.nilai_maksimal}
                    className={
                      errors.nilai_maksimal ? "border-destructive" : ""
                    }
                  />
                  <FieldError
                    id="nilai_maksimal-error"
                    message={errors.nilai_maksimal}
                  />
                </div>
              </FormSection>

              {/* Publishing */}
              <FormSection
                title="Publikasi"
                description="Atur status tampilan tugas."
              >
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
              </FormSection>
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
              disabled={isLoading}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : editingItem ? (
                "Simpan Perubahan"
              ) : (
                "Tambah Tugas"
              )}
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
