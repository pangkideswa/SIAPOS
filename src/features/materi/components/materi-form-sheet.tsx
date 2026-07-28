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
import { Loader2, Upload, X, FileText, Video } from "lucide-react"
import {
  STATUS_MATERI_OPTIONS,
  ALLOWED_FILE_EXTENSIONS,
  EMPTY_MATERI_FORM,
} from "@/features/materi/constants/materi.constants"
import { DUMMY_KELAS_MENGAJAR } from "@/features/kelas-mengajar/dummy/kelas-mengajar.data"
import type { Materi, MateriFormData, Lampiran } from "@/features/materi/types/materi"

interface MateriFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: Materi | null
  onSubmit: (data: MateriFormData) => Promise<void>
  isLoading?: boolean
}

export function MateriFormSheet({
  open,
  onOpenChange,
  editingItem,
  onSubmit,
  isLoading = false,
}: MateriFormSheetProps) {
  const [form, setForm] = useState<MateriFormData>(EMPTY_MATERI_FORM)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

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
        thumbnail_url: editingItem.thumbnail_url,
        lampiran: editingItem.lampiran,
        video_url: editingItem.video_url,
        isi_materi: editingItem.isi_materi,
        status: editingItem.status,
      })
      setThumbnailPreview(editingItem.thumbnail_url)
    } else {
      setForm(EMPTY_MATERI_FORM)
      setThumbnailPreview(null)
    }
  }, [editingItem, open])

  function handleChange(field: keyof MateriFormData, value: string | number | null | Lampiran[] | undefined) {
    setForm((prev) => ({ ...prev, [field]: value }))
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
  }

  function handleThumbnailUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setThumbnailPreview(url)
    handleChange("thumbnail_url", url)
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return

    const newLampiran: Lampiran[] = Array.from(files).map((file, idx) => ({
      id: Date.now() + idx,
      nama: file.name,
      ukuran: formatFileSize(file.size),
      tipe: file.type,
    }))

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

  function removeThumbnail() {
    setThumbnailPreview(null)
    handleChange("thumbnail_url", null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit(form)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {editingItem ? "Edit Materi Pembelajaran" : "Tambah Materi Pembelajaran"}
          </SheetTitle>
          <SheetDescription>
            {editingItem
              ? "Ubah informasi materi pembelajaran di bawah ini."
              : "Lengkapi form berikut untuk menambahkan materi pembelajaran baru."}
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
                <Label htmlFor="judul">Judul Materi</Label>
                <Input
                  id="judul"
                  placeholder="Contoh: Pengenalan Jaringan Komputer"
                  value={form.judul}
                  onChange={(e) => handleChange("judul", e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deskripsi">Deskripsi Singkat</Label>
                <Textarea
                  id="deskripsi"
                  placeholder="Deskripsi singkat tentang materi ini..."
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
                <Label>Pilih Kelas Mengajar</Label>
                <Select
                  value={form.kelas_mengajar_id ? String(form.kelas_mengajar_id) : ""}
                  onValueChange={handleKelasMengajarSelect}
                  disabled={isLoading}
                >
                  <SelectTrigger>
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
              </div>
              {form.kelas_mengajar_id > 0 && (
                <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-muted/50 text-sm">
                  <div>
                    <span className="text-muted-foreground text-xs">Guru</span>
                    <p className="font-medium">{form.guru_nama}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Mapel</span>
                    <p className="font-medium">{form.mata_pelajaran}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Kelas</span>
                    <p className="font-medium">{form.kelas}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Media & Lampiran */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Media & Lampiran
            </h3>
            <div className="space-y-4">
              {/* Thumbnail */}
              <div className="space-y-2">
                <Label>Thumbnail Materi</Label>
                {thumbnailPreview ? (
                  <div className="relative w-full h-40 rounded-lg border border-border overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-sm"
                      className="absolute top-2 right-2"
                      onClick={removeThumbnail}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => thumbnailInputRef.current?.click()}
                    disabled={isLoading}
                    className="w-full h-32 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Upload className="h-6 w-6" />
                    <span className="text-sm">Klik untuk upload thumbnail</span>
                    <span className="text-xs">JPG, PNG (maks. 2MB)</span>
                  </button>
                )}
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={handleThumbnailUpload}
                />
              </div>

              {/* Lampiran */}
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
                  <span className="text-xs">PDF, DOC, PPT, JPG, PNG</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ALLOWED_FILE_EXTENSIONS}
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

              {/* Video URL */}
              <div className="space-y-2">
                <Label htmlFor="video_url">URL Video YouTube</Label>
                <div className="relative">
                  <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="video_url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={form.video_url ?? ""}
                    onChange={(e) =>
                      handleChange("video_url", e.target.value || null)
                    }
                    disabled={isLoading}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Isi Materi */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Isi Materi
            </h3>
            <div className="space-y-2">
              <Label htmlFor="isi_materi">Konten Materi</Label>
              <Textarea
                id="isi_materi"
                placeholder="Tuliskan konten materi pembelajaran di sini. Gunakan HTML untuk formatting: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;em&gt;."
                value={form.isi_materi}
                onChange={(e) => handleChange("isi_materi", e.target.value)}
                disabled={isLoading}
                rows={10}
                className="font-mono text-sm"
              />
              {form.isi_materi && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">
                    Preview
                  </Label>
                  <div
                    className="prose prose-sm max-w-none p-4 rounded-lg border border-border bg-muted/30"
                    dangerouslySetInnerHTML={{ __html: form.isi_materi }}
                  />
                </div>
              )}
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
                  handleChange("status", (v ?? "Draft") as "Draft" | "Publish")
                }
                disabled={isLoading}
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
              disabled={isLoading || !form.judul || form.kelas_mengajar_id === 0}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingItem ? "Simpan Perubahan" : "Tambah Materi"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
