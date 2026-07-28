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
import {
  TIPE_SOAL_COLORS, KESULITAN_COLORS,
} from "@/features/bank-soal/constants/bank-soal.constants"
import { DUMMY_BANK_SOAL } from "@/features/bank-soal/dummy/bank-soal.data"
import {
  STATUS_PAKET_SOAL_OPTIONS, MATA_PELAJARAN_OPTIONS,
  GURU_PAKET_SOAL_OPTIONS, EMPTY_PAKET_SOAL_FORM,
} from "../constants/paket-soal.constants"
import type { PaketSoal, PaketSoalFormData } from "../types/paket-soal"
import type { BankSoal } from "@/features/bank-soal/types/bank-soal"
import { Badge } from "@/components/ui/badge"

interface PaketSoalFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: PaketSoal | null
  onSubmit: (data: PaketSoalFormData) => Promise<void>
  isLoading?: boolean
}

export function PaketSoalFormSheet({
  open, onOpenChange, editingItem, onSubmit, isLoading = false,
}: PaketSoalFormSheetProps) {
  const [form, setForm] = useState<PaketSoalFormData>(EMPTY_PAKET_SOAL_FORM)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedSoalIds, setSelectedSoalIds] = useState<number[]>([])
  const [soalSearch, setSoalSearch] = useState("")

  useEffect(() => {
    if (editingItem) {
      setForm({
        nama_paket: editingItem.nama_paket,
        deskripsi: editingItem.deskripsi,
        mata_pelajaran: editingItem.mata_pelajaran,
        guru_nama: editingItem.guru_nama,
        durasi: editingItem.durasi,
        nilai_maksimal: editingItem.nilai_maksimal,
        soal_ids: editingItem.soal_ids,
        status: editingItem.status,
      })
      setSelectedSoalIds(editingItem.soal_ids)
    } else {
      setForm(EMPTY_PAKET_SOAL_FORM)
      setSelectedSoalIds([])
    }
    setErrors({})
    setSoalSearch("")
  }, [editingItem, open])

  function handleChange(field: keyof PaketSoalFormData, value: string | number | number[]) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  function toggleSoal(id: number) {
    setSelectedSoalIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      setForm((f) => ({ ...f, soal_ids: next }))
      return next
    })
  }

  function toggleAllSoal(filtered: BankSoal[]) {
    const allSelected = filtered.every((s) => selectedSoalIds.includes(s.id))
    const next = allSelected ? [] : filtered.map((s) => s.id)
    setSelectedSoalIds(next)
    setForm((f) => ({ ...f, soal_ids: next }))
  }

  const filteredBankSoal = DUMMY_BANK_SOAL.filter((item) => {
    if (!soalSearch) return true
    const q = soalSearch.toLowerCase()
    return (
      item.pertanyaan.toLowerCase().includes(q) ||
      item.kode_soal.toLowerCase().includes(q) ||
      item.tipe_soal.toLowerCase().includes(q) ||
      item.kesulitan.toLowerCase().includes(q)
    )
  })

  const allFilteredSelected = filteredBankSoal.length > 0 && filteredBankSoal.every((s) => selectedSoalIds.includes(s.id))

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    if (!form.nama_paket.trim()) newErrors.nama_paket = "Nama paket wajib diisi"
    if (!form.mata_pelajaran) newErrors.mata_pelajaran = "Mata pelajaran wajib dipilih"
    if (!form.guru_nama) newErrors.guru_nama = "Guru wajib dipilih"
    if (form.durasi <= 0) newErrors.durasi = "Durasi harus lebih dari 0"
    if (form.nilai_maksimal <= 0) newErrors.nilai_maksimal = "Nilai maksimal harus lebih dari 0"
    if (selectedSoalIds.length === 0) newErrors.soal_ids = "Pilih minimal 1 soal"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    await onSubmit({ ...form, soal_ids: selectedSoalIds })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{editingItem ? "Edit Paket Soal" : "Tambah Paket Soal Baru"}</SheetTitle>
          <SheetDescription>
            {editingItem ? "Ubah data paket soal di bawah ini." : "Isi data paket soal baru dan pilih soal dari Bank Soal."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Paket *</Label>
              <Input
                value={form.nama_paket}
                onChange={(e) => handleChange("nama_paket", e.target.value)}
                placeholder="Contoh: UTS Matematika Semester Ganjil"
              />
              {errors.nama_paket && <p className="text-xs text-destructive">{errors.nama_paket}</p>}
            </div>

            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                value={form.deskripsi}
                onChange={(e) => handleChange("deskripsi", e.target.value)}
                placeholder="Deskripsi paket soal..."
                rows={3}
              />
            </div>

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
                    {GURU_PAKET_SOAL_OPTIONS.map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.guru_nama && <p className="text-xs text-destructive">{errors.guru_nama}</p>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
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
                <Label>Nilai Maksimal *</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.nilai_maksimal}
                  onChange={(e) => handleChange("nilai_maksimal", Number(e.target.value))}
                />
                {errors.nilai_maksimal && <p className="text-xs text-destructive">{errors.nilai_maksimal}</p>}
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => v && handleChange("status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUS_PAKET_SOAL_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-semibold">Pilih Soal *</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedSoalIds.length} soal dipilih dari {DUMMY_BANK_SOAL.length} soal tersedia
                </p>
              </div>
            </div>
            {errors.soal_ids && <p className="text-xs text-destructive">{errors.soal_ids}</p>}

            <div className="relative">
              <Input
                placeholder="Cari soal..."
                value={soalSearch}
                onChange={(e) => setSoalSearch(e.target.value)}
                className="pl-3"
              />
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="w-10 px-3 py-2.5 text-left">
                        <input
                          type="checkbox"
                          checked={allFilteredSelected}
                          onChange={() => toggleAllSoal(filteredBankSoal)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </th>
                      <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Pertanyaan</th>
                      <th className="px-3 py-2.5 text-left font-medium text-muted-foreground w-[120px]">Tipe</th>
                      <th className="px-3 py-2.5 text-left font-medium text-muted-foreground w-[100px]">Kesulitan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBankSoal.map((soal) => (
                      <tr
                        key={soal.id}
                        className={`border-b border-border cursor-pointer transition-colors ${
                          selectedSoalIds.includes(soal.id) ? "bg-primary/5" : "hover:bg-muted/30"
                        }`}
                        onClick={() => toggleSoal(soal.id)}
                      >
                        <td className="px-3 py-2.5">
                          <input
                            type="checkbox"
                            checked={selectedSoalIds.includes(soal.id)}
                            onChange={() => toggleSoal(soal.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="line-clamp-1 max-w-[250px]">{soal.pertanyaan}</span>
                        </td>
                        <td className="px-3 py-2.5">
                          <Badge className={TIPE_SOAL_COLORS[soal.tipe_soal]}>{soal.tipe_soal}</Badge>
                        </td>
                        <td className="px-3 py-2.5">
                          <Badge className={KESULITAN_COLORS[soal.kesulitan]}>{soal.kesulitan}</Badge>
                        </td>
                      </tr>
                    ))}
                    {filteredBankSoal.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-3 py-6 text-center text-muted-foreground">
                          Tidak ada soal ditemukan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <SheetFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingItem ? "Simpan Perubahan" : "Tambah Paket Soal"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
