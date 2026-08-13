"use client"

import { useState, useEffect } from "react"
import {
  Loader2,
  X,
  FileText,
  Video,
  Globe,
  ImageIcon,
} from "lucide-react"
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
  STATUS_MATERI_OPTIONS,
  JENIS_MATERI_OPTIONS,
  ALLOWED_FILE_EXTENSIONS,
  EMPTY_MATERI_FORM,
} from "@/features/materi/constants/materi.constants"
import { useTeachingClasses } from "@/hooks/use-teaching-classes"
import { formatFileSize, validateFileSize } from "@/lib/file"
import { cn } from "@/lib/utils"
import type {
  Materi,
  MateriFormData,
  Lampiran,
  JenisMateri,
} from "@/features/materi/types/materi"

interface MateriFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: Materi | null
  onSubmit: (data: MateriFormData) => Promise<void>
  isLoading?: boolean
  defaultKelasMengajarId?: number
}

type MateriFormErrors = Partial<
  Record<"judul" | "kelas_mengajar_id" | "pertemuan" | "video_url" | "link_drive" | "link_eksternal", string>
>

export function MateriFormDialog({
  open,
  onOpenChange,
  editingItem,
  onSubmit,
  isLoading = false,
  defaultKelasMengajarId,
}: MateriFormDialogProps) {
  const { data: activeKelasMengajar = [] } = useTeachingClasses()
  const [form, setForm] = useState<MateriFormData>(EMPTY_MATERI_FORM)
  const [errors, setErrors] = useState<MateriFormErrors>({})
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (editingItem) {
      setForm({
        judul: editingItem.judul,
        deskripsi: editingItem.deskripsi,
        kelas_mengajar_id: editingItem.kelas_mengajar_id,
        guru_nama: editingItem.guru_nama,
        mata_pelajaran: editingItem.mata_pelajaran,
        kelas: editingItem.kelas,
        pertemuan: editingItem.pertemuan,
        jenis_materi: editingItem.jenis_materi,
        thumbnail_url: editingItem.thumbnail_url,
        lampiran: editingItem.lampiran,
        video_url: editingItem.video_url,
        link_drive: editingItem.link_drive,
        link_eksternal: editingItem.link_eksternal,
        isi_materi: editingItem.isi_materi,
        status: editingItem.status,
      })
      setThumbnailPreview(editingItem.thumbnail_url)
    } else {
      const defaultKm =
        defaultKelasMengajarId !== undefined
          ? activeKelasMengajar.find((km) => km.id === defaultKelasMengajarId)
          : undefined
      if (defaultKm) {
        setForm({
          ...EMPTY_MATERI_FORM,
          kelas_mengajar_id: defaultKm.id,
          guru_nama: defaultKm.guru_nama,
          mata_pelajaran: defaultKm.mata_pelajaran,
          kelas: defaultKm.kelas,
        })
      } else {
        setForm(EMPTY_MATERI_FORM)
      }
      setThumbnailPreview(null)
      setThumbnailFile(null)
    }
    setErrors({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingItem, open, defaultKelasMengajarId])

  function handleChange(
    field: keyof MateriFormData,
    value: string | number | null | Lampiran[] | undefined
  ) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof MateriFormErrors]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field as keyof MateriFormErrors]
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

  function handleThumbnailUpload(files: FileList) {
    const file = files[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.warning("Format file tidak valid", {
        description: "Thumbnail harus berupa gambar (JPG/PNG).",
      })
      return
    }
    const sizeCheck = validateFileSize(file, 2)
    if (!sizeCheck.ok) {
      toast.warning("Ukuran file terlalu besar", {
        description: sizeCheck.error,
      })
      return
    }
    const url = URL.createObjectURL(file)
    setThumbnailPreview(url)
    setThumbnailFile(file)
    // We don't set thumbnail_url in form state yet, it will be set after direct upload
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

    const newFiles = Array.from(files)
    const newLampirans: Lampiran[] = newFiles.map((file, idx) => ({
      id: Date.now() + idx,
      nama: file.name,
      ukuran: formatFileSize(file.size),
      tipe: file.type,
      file: file // Save the raw file for upload on submit
    }))
    
    setForm((prev) => ({
      ...prev,
      lampiran: [...prev.lampiran, ...newLampirans],
    }))
  }

  function removeLampiran(id: number) {
    handleChange(
      "lampiran",
      form.lampiran.filter((l) => l.id !== id)
    )
  }

  function removeThumbnail() {
    setThumbnailPreview(null)
    setThumbnailFile(null)
    handleChange("thumbnail_url", null)
  }

  function validate(): boolean {
    const newErrors: MateriFormErrors = {}

    if (!form.judul.trim()) {
      newErrors.judul = "Judul materi wajib diisi."
    }
    if (form.kelas_mengajar_id === 0) {
      newErrors.kelas_mengajar_id = "Mata pelajaran / kelas wajib dipilih."
    }
    if (form.pertemuan !== null && form.pertemuan < 1) {
      newErrors.pertemuan = "Pertemuan minimal 1."
    }
    if (
      form.video_url &&
      !/^https?:\/\//i.test(form.video_url)
    ) {
      newErrors.video_url = "URL YouTube harus diawali http(s)://"
    }
    if (
      form.link_drive &&
      !/^https?:\/\//i.test(form.link_drive)
    ) {
      newErrors.link_drive = "Link Google Drive harus diawali http(s)://"
    }
    if (
      form.link_eksternal &&
      !/^https?:\/\//i.test(form.link_eksternal)
    ) {
      newErrors.link_eksternal = "Link eksternal harus diawali http(s)://"
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

  async function uploadFileDirectly(file: File, materialId?: number): Promise<string> {
     // Request upload URL
     const res = await fetch('/api/materials/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           filename: file.name,
           contentType: file.type,
           size: file.size,
           kelas_mengajar_id: form.kelas_mengajar_id,
           materialId: materialId || undefined
        })
     })
     
     if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || `Gagal mendapatkan url upload untuk ${file.name}`)
     }
     
     const { uploadUrl, storagePath } = await res.json()
     
     // Direct PUT to Supabase
     const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
           'Content-Type': file.type,
        },
        body: file
     })
     
     if (!uploadRes.ok) {
        throw new Error(`Gagal mengupload ${file.name}`)
     }
     
     return storagePath
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    
    setIsUploading(true)
    const payload = { ...form }
    
    try {
      // 1. Upload Thumbnail
      if (thumbnailFile) {
         payload.thumbnail_url = await uploadFileDirectly(thumbnailFile, editingItem?.id)
      }

      // 2. Upload Lampirans
      payload.lampiran = await Promise.all(
         payload.lampiran.map(async (lamp) => {
            if (lamp.file) {
               const storage_path = await uploadFileDirectly(lamp.file, editingItem?.id)
               const { file: _file, ...lampWithoutFile } = lamp
               return { ...lampWithoutFile, storage_path }
            }
            return lamp
         })
      )
      
      await onSubmit(payload)
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui"
      toast.error("Upload gagal", {
         description: msg
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={(next) => {
        if (!isLoading && !isUploading) onOpenChange(next)
      }}
    >
      <ResponsiveDialogContent className="sm:max-w-2xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {editingItem ? "Edit Materi Pembelajaran" : "Tambah Materi Pembelajaran"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {editingItem
              ? "Ubah informasi materi pembelajaran di bawah ini."
              : "Lengkapi form berikut untuk menambahkan materi pembelajaran baru."}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <ResponsiveDialogBody>
            <div className="space-y-5">
              {/* General Information */}
              <FormSection
                title="Informasi Umum"
                description="Informasi dasar tentang materi."
              >
                <div className="space-y-2">
                  <Label htmlFor="judul">
                    Judul Materi <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="judul"
                    placeholder="Contoh: Pengenalan Jaringan Komputer"
                    value={form.judul}
                    onChange={(e) => handleChange("judul", e.target.value)}
                    disabled={isLoading || isUploading}
                    aria-invalid={!!errors.judul}
                    className={errors.judul ? "border-destructive" : ""}
                  />
                  <FieldError id="judul-error" message={errors.judul} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pertemuan">Pertemuan Ke-</Label>
                    <Input
                      id="pertemuan"
                      type="number"
                      min={1}
                      placeholder="Contoh: 1"
                      value={form.pertemuan ?? ""}
                      onChange={(e) =>
                        handleChange(
                          "pertemuan",
                          e.target.value === ""
                            ? null
                            : Math.max(1, Number(e.target.value))
                        )
                      }
                      disabled={isLoading || isUploading}
                      aria-invalid={!!errors.pertemuan}
                      className={errors.pertemuan ? "border-destructive" : ""}
                    />
                    <FieldError id="pertemuan-error" message={errors.pertemuan} />
                  </div>
                  <div className="space-y-2">
                    <Label>Jenis Materi</Label>
                    <Select
                      value={form.jenis_materi}
                      onValueChange={(v: string | null) =>
                        handleChange(
                          "jenis_materi",
                          (v ?? "Lainnya") as JenisMateri
                        )
                      }
                      disabled={isLoading || isUploading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis materi" />
                      </SelectTrigger>
                      <SelectContent>
                        {JENIS_MATERI_OPTIONS.map((jenis) => (
                          <SelectItem key={jenis} value={jenis}>
                            {jenis}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
                    disabled={isLoading || isUploading}
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

              {/* Description */}
              <FormSection
                title="Deskripsi"
                description="Ringkasan dan isi materi."
              >
                <div className="space-y-2">
                  <Label htmlFor="deskripsi">Deskripsi Singkat</Label>
                  <Textarea
                    id="deskripsi"
                    placeholder="Deskripsi singkat tentang materi ini..."
                    value={form.deskripsi}
                    onChange={(e) => handleChange("deskripsi", e.target.value)}
                    disabled={isLoading || isUploading}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isi_materi">Konten Materi</Label>
                  <Textarea
                    id="isi_materi"
                    placeholder="Tuliskan konten materi pembelajaran di sini. Gunakan HTML untuk formatting: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>."
                    value={form.isi_materi}
                    onChange={(e) => handleChange("isi_materi", e.target.value)}
                    disabled={isLoading || isUploading}
                    rows={6}
                    className="font-mono text-sm"
                  />
                  {form.isi_materi && (
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Preview
                      </Label>
                      <div
                        className="max-w-none rounded-lg border border-border bg-muted/30 p-4 text-sm prose prose-sm"
                        dangerouslySetInnerHTML={{ __html: form.isi_materi }}
                      />
                    </div>
                  )}
                </div>
              </FormSection>

              {/* Attachment */}
              <FormSection
                title="Lampiran"
                description="Tambahkan media pendukung materi."
              >
                <div className="space-y-2">
                  <Label>Thumbnail Materi</Label>
                  {thumbnailPreview ? (
                    <div className="relative h-40 w-full overflow-hidden rounded-lg border border-border bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail"
                        className="h-full w-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon-sm"
                        className="absolute top-2 right-2"
                        onClick={removeThumbnail}
                        disabled={isLoading || isUploading}
                        aria-label="Hapus thumbnail"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <FileDropzone
                        title="Klik untuk upload thumbnail"
                        hint="JPG, PNG (maks. 2MB)"
                        accept="image/jpeg,image/png"
                        multiple={false}
                        disabled={isLoading || isUploading}
                        onFiles={handleThumbnailUpload}
                      />
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <ImageIcon className="h-3.5 w-3.5" />
                        Gunakan gambar berukuran 16:9 agar tampil baik.
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>File Materi</Label>
                  <FileDropzone
                    title="Klik untuk upload file materi"
                    hint="PDF, DOCX, PPTX, JPG, PNG (maks. 20MB per file)"
                    accept={ALLOWED_FILE_EXTENSIONS}
                    multiple
                    disabled={isLoading || isUploading}
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
                            disabled={isLoading || isUploading}
                            aria-label={`Hapus ${file.nama}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video_url">URL Video YouTube</Label>
                  <div className="relative">
                    <Video className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="video_url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={form.video_url ?? ""}
                      onChange={(e) =>
                        handleChange("video_url", e.target.value || null)
                      }
                      disabled={isLoading || isUploading}
                      aria-invalid={!!errors.video_url}
                      className={cn(
                        "pl-9",
                        errors.video_url ? "border-destructive" : ""
                      )}
                    />
                  </div>
                  <FieldError id="video_url-error" message={errors.video_url} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link_drive">Link Google Drive</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="link_drive"
                      placeholder="https://drive.google.com/file/d/..."
                      value={form.link_drive ?? ""}
                      onChange={(e) =>
                        handleChange("link_drive", e.target.value || null)
                      }
                      disabled={isLoading || isUploading}
                      aria-invalid={!!errors.link_drive}
                      className={cn(
                        "pl-9",
                        errors.link_drive ? "border-destructive" : ""
                      )}
                    />
                  </div>
                  <FieldError id="link_drive-error" message={errors.link_drive} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link_eksternal">Link Eksternal</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="link_eksternal"
                      placeholder="https://..."
                      value={form.link_eksternal ?? ""}
                      onChange={(e) =>
                        handleChange("link_eksternal", e.target.value || null)
                      }
                      disabled={isLoading || isUploading}
                      aria-invalid={!!errors.link_eksternal}
                      className={cn(
                        "pl-9",
                        errors.link_eksternal ? "border-destructive" : ""
                      )}
                    />
                  </div>
                  <FieldError
                    id="link_eksternal-error"
                    message={errors.link_eksternal}
                  />
                </div>
              </FormSection>

              {/* Publishing */}
              <FormSection
                title="Publikasi"
                description="Atur status tampilan materi."
              >
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v: string | null) =>
                      handleChange(
                        "status",
                        (v ?? "Draft") as "Draft" | "Publish"
                      )
                    }
                    disabled={isLoading || isUploading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_MATERI_OPTIONS.map((status) => (
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
              disabled={isLoading || isUploading}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isUploading}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              {(isLoading || isUploading) ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isUploading ? "Mengunggah..." : "Menyimpan..."}
                </>
              ) : editingItem ? (
                "Simpan Perubahan"
              ) : (
                "Tambah Materi"
              )}
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
