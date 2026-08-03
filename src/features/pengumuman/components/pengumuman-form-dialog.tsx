"use client"

import { useState, useEffect } from "react"
import { Loader2, Paperclip, X } from "lucide-react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import type {
  Pengumuman,
  KategoriPengumuman,
  StatusPengumuman,
  TargetPengumuman,
  LampiranPengumuman,
} from "../types/pengumuman"
import {
  GURU_PENULIS,
  KATEGORI_PENGUMUMAN_OPTIONS,
  STATUS_PENGUMUMAN_OPTIONS,
  TARGET_OPTIONS,
  KELAS_PENGUMUMAN_OPTIONS,
  ALLOWED_ATTACHMENT_TYPES,
  EMPTY_PENGUMUMAN_FORM,
} from "../constants/pengumuman.constants"
import { formatFileSize, validateFileSize } from "@/lib/file"

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data?: Pengumuman | null
  onSave: (data: Pengumuman) => void
  teacherMode?: boolean
  allowedKelas?: string[]
  defaultTarget?: TargetPengumuman
  defaultKelas?: string
}

function getFileType(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? ""
  const map: Record<string, string> = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
  }
  return map[ext] ?? "application/octet-stream"
}

const TEACHER_TARGET_OPTIONS: TargetPengumuman[] = [
  "Semua Pengguna",
  "Siswa",
  "Kelas Tertentu",
]

export function PengumumanFormDialog({
  open,
  onOpenChange,
  data,
  onSave,
  teacherMode = false,
  allowedKelas = [],
  defaultTarget = "Semua Pengguna",
  defaultKelas = "",
}: FormDialogProps) {
  const [form, setForm] = useState(() => {
    if (data) {
      return {
        judul: data.judul,
        ringkasan: data.ringkasan,
        isi: data.isi,
        kategori: data.kategori,
        target: data.target,
        kelas: data.kelas ?? "",
        status: data.status,
        penulis: data.penulis,
        pinned: data.pinned,
        lampiran: [...data.lampiran],
        tanggal_publish: data.tanggal_publish,
      }
    }
    return {
      ...EMPTY_PENGUMUMAN_FORM,
      penulis: teacherMode ? GURU_PENULIS : "",
      target: defaultTarget,
      kelas: defaultKelas || "",
    }
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const isEdit = !!data

  useEffect(() => {
    if (open) {
      if (data) {
        setForm({
          judul: data.judul,
          ringkasan: data.ringkasan,
          isi: data.isi,
          kategori: data.kategori,
          target: data.target,
          kelas: data.kelas ?? "",
          status: data.status,
          penulis: data.penulis,
          pinned: data.pinned,
          lampiran: [...data.lampiran],
          tanggal_publish: data.tanggal_publish,
        })
      } else {
        setForm({
          ...EMPTY_PENGUMUMAN_FORM,
          penulis: teacherMode ? GURU_PENULIS : "",
          target: defaultTarget,
          kelas: defaultKelas || "",
        })
      }
      setErrors({})
      setSubmitting(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, data])
  const kelasOptions = teacherMode ? allowedKelas : [...KELAS_PENGUMUMAN_OPTIONS]
  const targetOptions = teacherMode ? TEACHER_TARGET_OPTIONS : TARGET_OPTIONS
  const statusOptions = teacherMode
    ? STATUS_PENGUMUMAN_OPTIONS.filter((s) => s !== "Diarsipkan")
    : STATUS_PENGUMUMAN_OPTIONS

  function handleChange<K extends keyof typeof form>(
    field: K,
    value: (typeof form)[K]
  ) {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field as string]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field as string]
        return next
      })
    }
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.judul.trim()) errs.judul = "Judul wajib diisi"
    if (!form.ringkasan.trim()) errs.ringkasan = "Ringkasan wajib diisi"
    if (form.isi.replace(/<[^>]*>/g, "").trim().length === 0)
      errs.isi = "Isi pengumuman wajib diisi"
    if (form.target === "Kelas Tertentu" && !form.kelas)
      errs.kelas = "Kelas wajib dipilih"
    if (!form.penulis.trim()) errs.penulis = "Penulis wajib diisi"
    if (!form.tanggal_publish)
      errs.tanggal_publish = "Tanggal publish wajib diisi"
    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      toast.error("Formulir tidak valid", {
        description: "Silakan periksa kembali isian form Anda.",
      })
      return false
    }
    return true
  }

  const handleAddFiles = (files: FileList) => {
    const oversized = Array.from(files).find(
      (file) => !validateFileSize(file, 10).ok
    )
    if (oversized) {
      const check = validateFileSize(oversized, 10)
      toast.warning("Ukuran file terlalu besar", {
        description: check.ok ? undefined : check.error,
      })
      return
    }
    const added: LampiranPengumuman[] = Array.from(files).map((file, i) => ({
      id: Date.now() + i,
      nama: file.name,
      ukuran: formatFileSize(file.size),
      tipe: getFileType(file.name),
    }))
    setForm((f) => ({ ...f, lampiran: [...f.lampiran, ...added] }))
  }

  const handleRemoveFile = (id: number) => {
    setForm((f) => ({ ...f, lampiran: f.lampiran.filter((l) => l.id !== id) }))
  }

  const handleSubmit = async () => {
    if (submitting) return
    if (!validate()) return
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 500))
    const now = new Date().toISOString()
    onSave({
      id: data?.id ?? Date.now(),
      judul: form.judul,
      ringkasan: form.ringkasan,
      isi: form.isi,
      kategori: form.kategori,
      target: form.target,
      kelas: form.target === "Kelas Tertentu" ? form.kelas : undefined,
      status: form.status,
      penulis: form.penulis,
      pinned: form.pinned,
      lampiran: form.lampiran,
      tanggal_publish: form.tanggal_publish,
      created_at: data?.created_at ?? now,
      updated_at: now,
    })
    setSubmitting(false)
    onOpenChange(false)
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={(next) => {
        if (!submitting) onOpenChange(next)
      }}
    >
      <ResponsiveDialogContent className="sm:max-w-2xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isEdit ? "Edit Pengumuman" : "Buat Pengumuman"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isEdit ? "Edit data pengumuman" : "Buat pengumuman baru"}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="flex min-h-0 flex-1 flex-col">
          <ResponsiveDialogBody>
            <div className="space-y-5">
              {/* General Information */}
              <FormSection
                title="Informasi Umum"
                description="Judul, ringkasan, dan target pengumuman."
              >
                <div className="space-y-2">
                  <Label htmlFor="judul">
                    Judul <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="judul"
                    value={form.judul}
                    onChange={(e) => handleChange("judul", e.target.value)}
                    placeholder="Masukkan judul pengumuman"
                    disabled={submitting}
                    aria-invalid={!!errors.judul}
                    className={errors.judul ? "border-destructive" : ""}
                  />
                  <FieldError id="judul-error" message={errors.judul} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ringkasan">
                    Ringkasan <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="ringkasan"
                    value={form.ringkasan}
                    onChange={(e) =>
                      handleChange("ringkasan", e.target.value)
                    }
                    placeholder="Ringkasan singkat pengumuman"
                    disabled={submitting}
                    aria-invalid={!!errors.ringkasan}
                    className={errors.ringkasan ? "border-destructive" : ""}
                  />
                  <FieldError id="ringkasan-error" message={errors.ringkasan} />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="kategori">Kategori</Label>
                    <Select
                      value={form.kategori}
                      onValueChange={(v: string | null) =>
                        handleChange(
                          "kategori",
                          (v ?? "Informasi Umum") as KategoriPengumuman
                        )
                      }
                      disabled={submitting}
                    >
                      <SelectTrigger id="kategori">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {KATEGORI_PENGUMUMAN_OPTIONS.map((k) => (
                          <SelectItem key={k} value={k}>
                            {k}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target">Target</Label>
                    <Select
                      value={form.target}
                      onValueChange={(v: string | null) =>
                        handleChange(
                          "target",
                          (v ?? "Semua Pengguna") as TargetPengumuman
                        )
                      }
                      disabled={submitting}
                    >
                      <SelectTrigger id="target">
                        <SelectValue placeholder="Pilih target" />
                      </SelectTrigger>
                      <SelectContent>
                        {targetOptions.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {form.target === "Kelas Tertentu" && (
                  <div className="space-y-2">
                    <Label htmlFor="kelas">
                      Kelas <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={form.kelas}
                      onValueChange={(v: string | null) =>
                        handleChange("kelas", v ?? "")
                      }
                      disabled={submitting}
                    >
                      <SelectTrigger
                        id="kelas"
                        className={errors.kelas ? "border-destructive" : ""}
                      >
                        <SelectValue placeholder="Pilih kelas" />
                      </SelectTrigger>
                      <SelectContent>
                        {kelasOptions.map((k) => (
                          <SelectItem key={k} value={k}>
                            {k}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError id="kelas-error" message={errors.kelas} />
                  </div>
                )}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="penulis">
                      Penulis <span className="text-destructive">*</span>
                    </Label>
                    {teacherMode ? (
                      <Input id="penulis" value={GURU_PENULIS} disabled />
                    ) : (
                      <Input
                        id="penulis"
                        value={form.penulis}
                        onChange={(e) =>
                          handleChange("penulis", e.target.value)
                        }
                        placeholder="Nama penulis"
                        disabled={submitting}
                        aria-invalid={!!errors.penulis}
                        className={errors.penulis ? "border-destructive" : ""}
                      />
                    )}
                    <FieldError id="penulis-error" message={errors.penulis} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">
                      Status <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={form.status}
                      onValueChange={(v: string | null) =>
                        handleChange(
                          "status",
                          (v ?? "Draft") as StatusPengumuman
                        )
                      }
                      disabled={submitting}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </FormSection>

              {/* Content */}
              <FormSection
                title="Isi Pengumuman"
                description="Konten detail pengumuman."
              >
                <div className="space-y-2">
                  <Label htmlFor="isi">
                    Isi Pengumuman <span className="text-destructive">*</span>
                  </Label>
                  <RichTextEditor
                    value={form.isi}
                    onChange={(html) => handleChange("isi", html)}
                  />
                  <FieldError id="isi-error" message={errors.isi} />
                </div>
              </FormSection>

              {/* Attachment */}
              <FormSection
                title="Lampiran"
                description="Tambahkan file pendukung (opsional)."
              >
                <div className="space-y-2">
                  <FileDropzone
                    title="Tambah file lampiran"
                    hint="PDF, DOC, DOCX, JPG, PNG, WEBP (maks. 10MB per file)"
                    accept={ALLOWED_ATTACHMENT_TYPES}
                    multiple
                    disabled={submitting}
                    onFiles={handleAddFiles}
                  />
                  {form.lampiran.length > 0 && (
                    <ul className="space-y-1.5 pt-1">
                      {form.lampiran.map((file) => (
                        <li
                          key={file.id}
                          className="flex items-center justify-between gap-2 rounded-lg border border-border px-2.5 py-1.5"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <Paperclip className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            <span className="truncate text-sm">
                              {file.nama}
                            </span>
                            <span className="shrink-0 text-xs text-muted-foreground">
                              {file.ukuran}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(file.id)}
                            className="text-muted-foreground hover:text-destructive"
                            aria-label={`Hapus ${file.nama}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </FormSection>

              {/* Publishing */}
              <FormSection
                title="Publikasi"
                description="Atur status, tanggal, dan penanda penting."
              >
                <div className="space-y-2">
                  <Label htmlFor="tanggal_publish">
                    Tanggal Publish <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="tanggal_publish"
                    type="date"
                    value={form.tanggal_publish}
                    onChange={(e) =>
                      handleChange("tanggal_publish", e.target.value)
                    }
                    disabled={submitting}
                    aria-invalid={!!errors.tanggal_publish}
                    className={
                      errors.tanggal_publish ? "border-destructive" : ""
                    }
                  />
                  <FieldError
                    id="tanggal_publish-error"
                    message={errors.tanggal_publish}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="pinned"
                    checked={form.pinned}
                    onCheckedChange={(checked) =>
                      handleChange("pinned", checked === true)
                    }
                    disabled={submitting}
                  />
                  <Label
                    htmlFor="pinned"
                    className="cursor-pointer text-sm font-normal"
                  >
                    Pin sebagai pengumuman penting
                  </Label>
                </div>
              </FormSection>
            </div>
          </ResponsiveDialogBody>

          <ResponsiveDialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : isEdit ? (
                "Simpan"
              ) : (
                "Buat"
              )}
            </Button>
          </ResponsiveDialogFooter>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
