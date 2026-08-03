"use client"

import { useState, useEffect } from "react"
import {
  ResponsiveDialog, ResponsiveDialogContent, ResponsiveDialogDescription, ResponsiveDialogFooter, ResponsiveDialogHeader, ResponsiveDialogTitle, ResponsiveDialogBody,
} from "@/components/ui/responsive-dialog"
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
  STATUS_CBT_OPTIONS, KELAS_OPTIONS, EMPTY_CBT_FORM,
} from "../constants/cbt.constants"
import type { CBTExam, CBTExamFormData } from "../types/cbt"

interface CBTFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: CBTExam | null
  onSubmit: (data: CBTExamFormData) => Promise<void>
  isLoading?: boolean
}

export function CBTFormDialog({
  open, onOpenChange, editingItem, onSubmit, isLoading = false,
}: CBTFormDialogProps) {
  const [form, setForm] = useState<CBTExamFormData>(EMPTY_CBT_FORM)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editingItem) {
      setForm({
        nama_ujian: editingItem.nama_ujian,
        deskripsi: editingItem.deskripsi,
        paket_soal_id: editingItem.paket_soal_id,
        kelas: editingItem.kelas,
        durasi: editingItem.durasi,
        tanggal_mulai: editingItem.tanggal_mulai.slice(0, 16),
        tanggal_berakhir: editingItem.tanggal_berakhir.slice(0, 16),
        nilai_minimum_lulus: editingItem.nilai_minimum_lulus,
        acak_soal: editingItem.acak_soal,
        acak_jawaban: editingItem.acak_jawaban,
        tampilkan_nilai: editingItem.tampilkan_nilai,
        izinkan_kembali: editingItem.izinkan_kembali,
        auto_submit: editingItem.auto_submit,
        status: editingItem.status,
      })
    } else {
      setForm(EMPTY_CBT_FORM)
    }
    setErrors({})
  }, [editingItem, open])

  function handleChange(field: keyof CBTExamFormData, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    if (!form.nama_ujian.trim()) newErrors.nama_ujian = "Nama ujian wajib diisi"
    if (!form.paket_soal_id) newErrors.paket_soal_id = "Paket soal wajib dipilih"
    if (!form.kelas) newErrors.kelas = "Kelas wajib dipilih"
    if (!form.tanggal_mulai) newErrors.tanggal_mulai = "Tanggal mulai wajib diisi"
    if (!form.tanggal_berakhir) newErrors.tanggal_berakhir = "Tanggal berakhir wajib diisi"
    if (form.durasi <= 0) newErrors.durasi = "Durasi harus lebih dari 0"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    await onSubmit(form)
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{editingItem ? "Edit CBT" : "Tambah CBT Baru"}</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {editingItem ? "Ubah data ujian CBT di bawah ini." : "Isi data ujian CBT baru untuk siswa."}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <ResponsiveDialogBody>
            <div className="space-y-4 py-1">
          <div className="space-y-2">
            <Label>Nama Ujian *</Label>
            <Input
              value={form.nama_ujian}
              onChange={(e) => handleChange("nama_ujian", e.target.value)}
              placeholder="Contoh: UTS Matematika Ganjil"
            />
            {errors.nama_ujian && <p className="text-xs text-destructive">{errors.nama_ujian}</p>}
          </div>

          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Textarea
              value={form.deskripsi}
              onChange={(e) => handleChange("deskripsi", e.target.value)}
              placeholder="Deskripsi ujian CBT..."
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
              <Label>Nilai Minimum Lulus</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={form.nilai_minimum_lulus}
                onChange={(e) => handleChange("nilai_minimum_lulus", Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Pengaturan</Label>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Acak Soal</p>
                <p className="text-xs text-muted-foreground">Soal ditampilkan secara acak</p>
              </div>
              <button
                type="button"
                onClick={() => handleChange("acak_soal", !form.acak_soal)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.acak_soal ? "bg-primary" : "bg-muted"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.acak_soal ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Acak Jawaban</p>
                <p className="text-xs text-muted-foreground">Pilihan jawaban ditampilkan secara acak</p>
              </div>
              <button
                type="button"
                onClick={() => handleChange("acak_jawaban", !form.acak_jawaban)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.acak_jawaban ? "bg-primary" : "bg-muted"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.acak_jawaban ? "translate-x-6" : "translate-x-1"}`} />
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
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Izinkan Kembali ke Soal Sebelumnya</p>
                <p className="text-xs text-muted-foreground">Siswa dapat kembali ke soal sebelumnya</p>
              </div>
              <button
                type="button"
                onClick={() => handleChange("izinkan_kembali", !form.izinkan_kembali)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.izinkan_kembali ? "bg-primary" : "bg-muted"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.izinkan_kembali ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Auto Submit Saat Waktu Habis</p>
                <p className="text-xs text-muted-foreground">Otomatis kirim saat timer habis</p>
              </div>
              <button
                type="button"
                onClick={() => handleChange("auto_submit", !form.auto_submit)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.auto_submit ? "bg-primary" : "bg-muted"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.auto_submit ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => v && handleChange("status", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_CBT_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
            </div>
          </ResponsiveDialogBody>

          <ResponsiveDialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">Batal</Button>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : editingItem ? (
                "Simpan Perubahan"
              ) : (
                "Tambah CBT"
              )}
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
