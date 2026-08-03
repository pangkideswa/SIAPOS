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

import {
  TIPE_SOAL_OPTIONS, KESULITAN_OPTIONS, STATUS_BANK_SOAL_OPTIONS,
  MATA_PELAJARAN_OPTIONS, KELAS_OPTIONS, GURU_BANK_SOAL_OPTIONS,
  EMPTY_BANK_SOAL_FORM, generateKodeSoal,
} from "../constants/bank-soal.constants"
import type { BankSoal, BankSoalFormData, PilihanGanda } from "../types/bank-soal"

interface BankSoalFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: BankSoal | null
  onSubmit: (data: BankSoalFormData) => Promise<void>
  isLoading?: boolean
}

export function BankSoalFormDialog({
  open, onOpenChange, editingItem, onSubmit, isLoading = false,
}: BankSoalFormDialogProps) {
  const [form, setForm] = useState<BankSoalFormData>(EMPTY_BANK_SOAL_FORM)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editingItem) {
      setForm({
        kode_soal: editingItem.kode_soal,
        pertanyaan: editingItem.pertanyaan,
        gambar_url: editingItem.gambar_url,
        tipe_soal: editingItem.tipe_soal,
        pilihan: editingItem.pilihan,
        jawaban_benar: editingItem.jawaban_benar,
        mata_pelajaran: editingItem.mata_pelajaran,
        guru_nama: editingItem.guru_nama,
        kelas: editingItem.kelas,
        kesulitan: editingItem.kesulitan,
        status: editingItem.status,
      })
    } else {
      setForm(EMPTY_BANK_SOAL_FORM)
    }
    setErrors({})
  }, [editingItem, open])

  function handleChange(field: keyof BankSoalFormData, value: string | PilihanGanda | null) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  function handlePilihanChange(key: keyof PilihanGanda, value: string) {
    setForm((prev) => ({
      ...prev,
      pilihan: prev.pilihan ? { ...prev.pilihan, [key]: value } : { A: value, B: "", C: "", D: "", E: "" },
    }))
  }

  function handleTipeChange(tipe: string) {
    const newForm = { ...form, tipe_soal: tipe as BankSoalFormData["tipe_soal"] }
    if (tipe === "Pilihan Ganda") {
      newForm.pilihan = form.pilihan ?? { A: "", B: "", C: "", D: "", E: "" }
      newForm.jawaban_benar = form.jawaban_benar || "A"
    } else if (tipe === "Benar / Salah") {
      newForm.pilihan = null
      newForm.jawaban_benar = "Benar"
    } else {
      newForm.pilihan = null
      newForm.jawaban_benar = ""
    }
    if (!editingItem && form.mata_pelajaran) {
      newForm.kode_soal = generateKodeSoal(tipe, form.mata_pelajaran)
    }
    setForm(newForm)
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    if (!form.pertanyaan.trim()) newErrors.pertanyaan = "Pertanyaan wajib diisi"
    if (!form.mata_pelajaran) newErrors.mata_pelajaran = "Mata pelajaran wajib dipilih"
    if (!form.guru_nama) newErrors.guru_nama = "Guru wajib dipilih"
    if (!form.kelas) newErrors.kelas = "Kelas wajib dipilih"
    if (form.tipe_soal === "Pilihan Ganda") {
      if (!form.jawaban_benar) newErrors.jawaban_benar = "Jawaban benar wajib dipilih"
    } else if (form.tipe_soal === "Isian Singkat") {
      if (!form.jawaban_benar.trim()) newErrors.jawaban_benar = "Jawaban benar wajib diisi"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    const kode = editingItem ? form.kode_soal : generateKodeSoal(form.tipe_soal, form.mata_pelajaran)
    await onSubmit({ ...form, kode_soal: kode })
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{editingItem ? "Edit Soal" : "Tambah Soal Baru"}</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {editingItem ? "Ubah data soal di bawah ini." : "Isi data soal baru untuk bank soal."}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <ResponsiveDialogBody>
            <div className="space-y-4 py-1">
          <div className="space-y-2">
            <Label>Tipe Soal *</Label>
            <Select value={form.tipe_soal} onValueChange={(v) => v && handleTipeChange(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TIPE_SOAL_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Pertanyaan *</Label>
            <Textarea
              value={form.pertanyaan}
              onChange={(e) => handleChange("pertanyaan", e.target.value)}
              placeholder="Tulis pertanyaan soal..."
              rows={4}
            />
            {errors.pertanyaan && <p className="text-xs text-destructive">{errors.pertanyaan}</p>}
          </div>

          {form.tipe_soal === "Pilihan Ganda" && form.pilihan && (
            <div className="space-y-2">
              <Label>Pilihan Jawaban</Label>
              {(["A", "B", "C", "D", "E"] as const).map((key) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="w-6 text-sm font-medium">{key}.</span>
                  <Input
                    value={form.pilihan?.[key] ?? ""}
                    onChange={(e) => handlePilihanChange(key, e.target.value)}
                    placeholder={`Pilihan ${key}`}
                  />
                </div>
              ))}
            </div>
          )}

          {(form.tipe_soal === "Pilihan Ganda" || form.tipe_soal === "Isian Singkat") && (
            <div className="space-y-2">
              <Label>Jawaban Benar *</Label>
              {form.tipe_soal === "Pilihan Ganda" ? (
                <Select value={form.jawaban_benar} onValueChange={(v) => v && handleChange("jawaban_benar", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["A", "B", "C", "D", "E"].map((h) => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={form.jawaban_benar}
                  onChange={(e) => handleChange("jawaban_benar", e.target.value)}
                  placeholder="Jawaban yang benar"
                />
              )}
              {errors.jawaban_benar && <p className="text-xs text-destructive">{errors.jawaban_benar}</p>}
            </div>
          )}

          {form.tipe_soal === "Benar / Salah" && (
            <div className="space-y-2">
              <Label>Jawaban Benar *</Label>
              <Select value={form.jawaban_benar} onValueChange={(v) => v && handleChange("jawaban_benar", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Benar">Benar</SelectItem>
                  <SelectItem value="Salah">Salah</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mata Pelajaran *</Label>
              <Select value={form.mata_pelajaran} onValueChange={(v) => v && handleChange("mata_pelajaran", v)}>
                <SelectTrigger><SelectValue placeholder="Pilih Mapel" /></SelectTrigger>
                <SelectContent>
                  {MATA_PELAJARAN_OPTIONS.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.mata_pelajaran && <p className="text-xs text-destructive">{errors.mata_pelajaran}</p>}
            </div>
            <div className="space-y-2">
              <Label>Guru *</Label>
              <Select value={form.guru_nama} onValueChange={(v) => v && handleChange("guru_nama", v)}>
                <SelectTrigger><SelectValue placeholder="Pilih Guru" /></SelectTrigger>
                <SelectContent>
                  {GURU_BANK_SOAL_OPTIONS.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.guru_nama && <p className="text-xs text-destructive">{errors.guru_nama}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label>Kesulitan</Label>
              <Select value={form.kesulitan} onValueChange={(v) => v && handleChange("kesulitan", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {KESULITAN_OPTIONS.map((k) => (
                    <SelectItem key={k} value={k}>{k}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => v && handleChange("status", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_BANK_SOAL_OPTIONS.map((s) => (
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
                "Tambah Soal"
              )}
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
