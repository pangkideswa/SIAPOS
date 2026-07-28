"use client"

import { useState, useEffect } from "react"
import {
  Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { DUMMY_PAKET_SOAL } from "@/features/paket-soal/dummy/paket-soal.data"
import {
  STATUS_QUIZ_OPTIONS, KELAS_OPTIONS, EMPTY_QUIZ_FORM,
} from "../constants/quiz.constants"
import type { Quiz, QuizFormData } from "../types/quiz"

interface QuizFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: Quiz | null
  onSubmit: (data: QuizFormData) => Promise<void>
  isLoading?: boolean
}

export function QuizFormSheet({
  open, onOpenChange, editingItem, onSubmit, isLoading = false,
}: QuizFormSheetProps) {
  const [form, setForm] = useState<QuizFormData>(EMPTY_QUIZ_FORM)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editingItem) {
      setForm({
        judul: editingItem.judul,
        deskripsi: editingItem.deskripsi,
        paket_soal_id: editingItem.paket_soal_id,
        kelas: editingItem.kelas,
        tanggal_mulai: editingItem.tanggal_mulai.slice(0, 16),
        tanggal_berakhir: editingItem.tanggal_berakhir.slice(0, 16),
        durasi: editingItem.durasi,
        percobaan_maksimal: editingItem.percobaan_maksimal,
        acak_urutan_soal: editingItem.acak_urutan_soal,
        acak_urutan_jawaban: editingItem.acak_urutan_jawaban,
        tampilkan_nilai: editingItem.tampilkan_nilai,
        status: editingItem.status,
      })
    } else {
      setForm(EMPTY_QUIZ_FORM)
    }
    setErrors({})
  }, [editingItem, open])

  function handleChange(field: keyof QuizFormData, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    if (!form.judul.trim()) newErrors.judul = "Judul quiz wajib diisi"
    if (!form.paket_soal_id) newErrors.paket_soal_id = "Paket soal wajib dipilih"
    if (!form.kelas) newErrors.kelas = "Kelas wajib dipilih"
    if (!form.tanggal_mulai) newErrors.tanggal_mulai = "Tanggal mulai wajib diisi"
    if (!form.tanggal_berakhir) newErrors.tanggal_berakhir = "Tanggal berakhir wajib diisi"
    if (form.durasi <= 0) newErrors.durasi = "Durasi harus lebih dari 0"
    if (form.percobaan_maksimal <= 0) newErrors.percobaan_maksimal = "Percobaan maksimal harus lebih dari 0"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    await onSubmit(form)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{editingItem ? "Edit Quiz" : "Tambah Quiz Baru"}</SheetTitle>
          <SheetDescription>
            {editingItem ? "Ubah data quiz di bawah ini." : "Isi data quiz baru untuk siswa."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Judul Quiz *</Label>
            <Input
              value={form.judul}
              onChange={(e) => handleChange("judul", e.target.value)}
              placeholder="Contoh: Quiz Matematika - Persamaan Kuadrat"
            />
            {errors.judul && <p className="text-xs text-destructive">{errors.judul}</p>}
          </div>

          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Textarea
              value={form.deskripsi}
              onChange={(e) => handleChange("deskripsi", e.target.value)}
              placeholder="Deskripsi quiz..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Paket Soal *</Label>
            <Select value={form.paket_soal_id ? String(form.paket_soal_id) : ""} onValueChange={(v) => v && handleChange("paket_soal_id", Number(v))}>
              <SelectTrigger><SelectValue placeholder="Pilih Paket Soal" /></SelectTrigger>
              <SelectContent>
                {DUMMY_PAKET_SOAL.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>{p.nama_paket} ({p.mata_pelajaran})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.paket_soal_id && <p className="text-xs text-destructive">{errors.paket_soal_id}</p>}
          </div>

          <div className="space-y-2">
            <Label>Kelas *</Label>
            <Select value={form.kelas} onValueChange={(v) => v && handleChange("kelas", v)}>
              <SelectTrigger><SelectValue placeholder="Pilih Kelas" /></SelectTrigger>
              <SelectContent>
                {KELAS_OPTIONS.map((k) => (
                  <SelectItem key={k} value={k}>{k}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.kelas && <p className="text-xs text-destructive">{errors.kelas}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tanggal Mulai *</Label>
              <Input
                type="datetime-local"
                value={form.tanggal_mulai}
                onChange={(e) => handleChange("tanggal_mulai", e.target.value)}
              />
              {errors.tanggal_mulai && <p className="text-xs text-destructive">{errors.tanggal_mulai}</p>}
            </div>
            <div className="space-y-2">
              <Label>Tanggal Berakhir *</Label>
              <Input
                type="datetime-local"
                value={form.tanggal_berakhir}
                onChange={(e) => handleChange("tanggal_berakhir", e.target.value)}
              />
              {errors.tanggal_berakhir && <p className="text-xs text-destructive">{errors.tanggal_berakhir}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Durasi (menit) *</Label>
              <Input
                type="number"
                min={1}
                value={form.durasi}
                onChange={(e) => handleChange("durasi", Number(e.target.value))}
              />
              {errors.durasi && <p className="text-xs text-destructive">{errors.durasi}</p>}
            </div>
            <div className="space-y-2">
              <Label>Percobaan Maksimal *</Label>
              <Input
                type="number"
                min={1}
                value={form.percobaan_maksimal}
                onChange={(e) => handleChange("percobaan_maksimal", Number(e.target.value))}
              />
              {errors.percobaan_maksimal && <p className="text-xs text-destructive">{errors.percobaan_maksimal}</p>}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Pengaturan</Label>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Acak Urutan Soal</p>
                <p className="text-xs text-muted-foreground">Soal ditampilkan secara acak</p>
              </div>
              <button
                type="button"
                onClick={() => handleChange("acak_urutan_soal", !form.acak_urutan_soal)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.acak_urutan_soal ? "bg-primary" : "bg-muted"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.acak_urutan_soal ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Acak Urutan Jawaban</p>
                <p className="text-xs text-muted-foreground">Pilihan jawaban ditampilkan secara acak</p>
              </div>
              <button
                type="button"
                onClick={() => handleChange("acak_urutan_jawaban", !form.acak_urutan_jawaban)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.acak_urutan_jawaban ? "bg-primary" : "bg-muted"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.acak_urutan_jawaban ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Tampilkan Nilai Setelah Selesai</p>
                <p className="text-xs text-muted-foreground">Siswa melihat nilai langsung</p>
              </div>
              <button
                type="button"
                onClick={() => handleChange("tampilkan_nilai", !form.tampilkan_nilai)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.tampilkan_nilai ? "bg-primary" : "bg-muted"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.tampilkan_nilai ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => v && handleChange("status", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_QUIZ_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <SheetFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingItem ? "Simpan Perubahan" : "Tambah Quiz"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
