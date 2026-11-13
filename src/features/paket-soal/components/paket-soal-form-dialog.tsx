"use client"

import { useState, useEffect, useMemo } from "react"
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
import { Loader2, Sparkles, SlidersHorizontal, UserCheck, ShieldAlert, BookOpen } from "lucide-react"
import {
  TIPE_SOAL_COLORS, KESULITAN_COLORS,
} from "@/features/bank-soal/constants/bank-soal.constants"
import {
  STATUS_PAKET_SOAL_OPTIONS, EMPTY_PAKET_SOAL_FORM,
} from "../constants/paket-soal.constants"
import type { PaketSoal, PaketSoalFormData } from "../types/paket-soal"
import type { BankSoal } from "@/features/bank-soal/types/bank-soal"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { distributeProportionalWeights } from "@/lib/cbt-scoring"

interface PaketSoalFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: PaketSoal | null
  onSubmit: (data: PaketSoalFormData) => Promise<void>
  isLoading?: boolean
}

export function PaketSoalFormDialog({
  open, onOpenChange, editingItem, onSubmit, isLoading = false,
}: PaketSoalFormDialogProps) {
  const [form, setForm] = useState<PaketSoalFormData>(EMPTY_PAKET_SOAL_FORM)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedSoalIds, setSelectedSoalIds] = useState<number[]>([])
  const [weights, setWeights] = useState<Record<number, number>>({})
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Filters for question table
  const [soalSearch, setSoalSearch] = useState("")
  const [mapelFilter, setMapelFilter] = useState("semua")
  const [guruFilter, setGuruFilter] = useState("semua")
  
  const [teachers, setTeachers] = useState<Array<{ id: number, nama_lengkap: string }>>([])
  const [subjects, setSubjects] = useState<Array<{ id: number, name: string }>>([])
  const [bankSoal, setBankSoal] = useState<Array<BankSoal>>([])

  useEffect(() => {
    async function fetchMasterData() {
      try {
        const [resTeachers, resSubjects, resBank, resUser] = await Promise.all([
          fetch("/api/teachers"),
          fetch("/api/subjects"),
          fetch("/api/exams/bank?scope=all"),
          fetch("/api/auth/profile")
        ])
        
        const [dataTeachers, dataSubjects, dataBank, dataUser] = await Promise.all([
          resTeachers.json(),
          resSubjects.json(),
          resBank.json(),
          resUser.json()
        ])

        if (dataUser?.data) {
          setCurrentUser(dataUser.data)
        }

        if (dataTeachers.data) {
          const items = dataTeachers.data.data ? dataTeachers.data.data : dataTeachers.data
          setTeachers(items)
        }
        if (dataSubjects.data) {
          const items = dataSubjects.data.data ? dataSubjects.data.data : dataSubjects.data
          setSubjects(items)
        }
        if (dataBank.data) {
          const mapped = dataBank.data.map((d: any) => ({
            id: d.id,
            kode_soal: d.kode_soal,
            pertanyaan: d.pertanyaan,
            tipe_soal: d.tipe_soal === "PILIHAN_GANDA" ? "Pilihan Ganda" : "Essay",
            kesulitan: d.kesulitan === "MUDAH" ? "Mudah" : d.kesulitan === "SEDANG" ? "Sedang" : "Sulit",
            status: d.status === "PUBLISH" ? "Aktif" : "Draft",
            guru_nama: d.guru?.nama_lengkap || "Sistem",
            mata_pelajaran: d.mata_pelajaran || "Umum",
            guru_id: d.guru_id ?? null,
          }))
          setBankSoal(mapped)
        }
      } catch (error) {
        console.error("Gagal memuat data master", error)
      }
    }
    if (open) {
      fetchMasterData()
    }
  }, [open])

  // Determine editing permissions
  const isSuperAdminOrAdmin = currentUser?.role === "super_admin" || currentUser?.role === "admin"
  const isOwner = !editingItem || !editingItem.guru_id || (currentUser?.teacher_id && editingItem.guru_id === currentUser.teacher_id)
  const canEditWeights = isSuperAdminOrAdmin || isOwner

  useEffect(() => {
    if (editingItem) {
      setForm({
        nama_paket: editingItem.nama_paket,
        deskripsi: editingItem.deskripsi,
        mata_pelajaran: editingItem.mata_pelajaran,
        guru_id: editingItem.guru_id ?? null,
        durasi: editingItem.durasi,
        nilai_maksimal: editingItem.nilai_maksimal,
        soal_ids: editingItem.soal_ids,
        status: editingItem.status,
      })
      setSelectedSoalIds(editingItem.soal_ids)

      // Initialize weights
      const initWeights: Record<number, number> = {}
      if (editingItem.custom_weights) {
        Object.assign(initWeights, editingItem.custom_weights)
      } else if (editingItem.items && Array.isArray(editingItem.items)) {
        editingItem.items.forEach((it: any) => {
          if (it.bank_soal_id) initWeights[it.bank_soal_id] = it.bobot ?? 1
        })
      }
      // Fill missing weights with 1
      editingItem.soal_ids.forEach((id) => {
        if (initWeights[id] === undefined) initWeights[id] = 1
      })
      setWeights(initWeights)
    } else {
      setForm(EMPTY_PAKET_SOAL_FORM)
      setSelectedSoalIds([])
      setWeights({})
    }
    setErrors({})
    setSoalSearch("")
    setMapelFilter("semua")
    setGuruFilter("semua")
  }, [editingItem, open])

  function handleChange(field: keyof PaketSoalFormData, value: string | number | number[] | null) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  function toggleSoal(id: number) {
    setSelectedSoalIds((prev) => {
      const isSelected = prev.includes(id)
      const next = isSelected ? prev.filter((i) => i !== id) : [...prev, id]
      setForm((f) => ({ ...f, soal_ids: next }))
      
      // If selected newly, assign default weight 1 if not exists
      if (!isSelected && weights[id] === undefined) {
        setWeights((w) => ({ ...w, [id]: 1 }))
      }
      return next
    })
  }

  function toggleAllSoal(filtered: BankSoal[]) {
    const allSelected = filtered.every((s) => selectedSoalIds.includes(s.id))
    const next = allSelected ? [] : Array.from(new Set([...selectedSoalIds, ...filtered.map((s) => s.id)]))
    setSelectedSoalIds(next)
    setForm((f) => ({ ...f, soal_ids: next }))

    // Assign default weight for new items
    setWeights((w) => {
      const updated = { ...w }
      next.forEach((id) => {
        if (updated[id] === undefined) updated[id] = 1
      })
      return updated
    })
  }

  function handleAutoDistributeWeights() {
    if (selectedSoalIds.length === 0) {
      toast.warning("Pilih minimal 1 soal terlebih dahulu")
      return
    }

    const itemsForWeighting = selectedSoalIds.map((id, idx) => {
      const soal = bankSoal.find((s) => s.id === id)
      return {
        bank_soal_id: id,
        tipe_soal: soal?.tipe_soal === "Pilihan Ganda" ? "PILIHAN_GANDA" : "ESAI",
        nomor_urut: idx + 1,
      }
    })

    const distributed = distributeProportionalWeights(itemsForWeighting, 100)
    const newWeights: Record<number, number> = {}
    distributed.forEach((item) => {
      newWeights[item.bank_soal_id] = item.bobot
    })

    setWeights(newWeights)
    toast.success("Bobot soal berhasil didistribusikan secara proporsional (Total: 100 pt)")
  }

  // Calculate Total Weight of Selected Questions
  const totalBobot = useMemo(() => {
    return selectedSoalIds.reduce((sum, id) => sum + (Number(weights[id]) || 0), 0)
  }, [selectedSoalIds, weights])
  const roundedTotalBobot = Math.round(totalBobot * 100) / 100
  const isExact100 = Math.abs(roundedTotalBobot - 100) < 0.01

  // Filter options
  const mapelOptions = useMemo(() => {
    return Array.from(new Set(bankSoal.map((b) => b.mata_pelajaran).filter(Boolean))) as string[]
  }, [bankSoal])

  const guruOptions = useMemo(() => {
    return Array.from(new Set(bankSoal.map((b) => b.guru_nama).filter(Boolean))) as string[]
  }, [bankSoal])

  const filteredBankSoal = useMemo(() => {
    return bankSoal.filter((item) => {
      const q = soalSearch.toLowerCase().trim()
      const matchesSearch =
        !q ||
        item.pertanyaan.toLowerCase().includes(q) ||
        item.kode_soal.toLowerCase().includes(q) ||
        item.tipe_soal.toLowerCase().includes(q) ||
        (item.mata_pelajaran && item.mata_pelajaran.toLowerCase().includes(q)) ||
        (item.guru_nama && item.guru_nama.toLowerCase().includes(q))

      const matchesMapel = mapelFilter === "semua" || item.mata_pelajaran === mapelFilter
      const matchesGuru = guruFilter === "semua" || item.guru_nama === guruFilter

      return matchesSearch && matchesMapel && matchesGuru
    })
  }, [bankSoal, soalSearch, mapelFilter, guruFilter])

  const allFilteredSelected = filteredBankSoal.length > 0 && filteredBankSoal.every((s) => selectedSoalIds.includes(s.id))

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    if (!form.nama_paket.trim()) newErrors.nama_paket = "Nama paket wajib diisi"
    if (!form.mata_pelajaran) newErrors.mata_pelajaran = "Mata pelajaran wajib dipilih"
    if (!form.guru_id) newErrors.guru_id = "Guru wajib dipilih"
    if (form.durasi <= 0) newErrors.durasi = "Durasi harus lebih dari 0"
    if (form.nilai_maksimal <= 0) newErrors.nilai_maksimal = "Nilai maksimal harus lebih dari 0"
    if (selectedSoalIds.length === 0) newErrors.soal_ids = "Pilih minimal 1 soal"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    await onSubmit({
      ...form,
      soal_ids: selectedSoalIds,
      custom_weights: weights,
    })
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-5xl max-h-[92vh] flex flex-col">
        <ResponsiveDialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <ResponsiveDialogTitle className="text-xl">
                {editingItem ? "Edit Paket Soal" : "Tambah Paket Soal Baru"}
              </ResponsiveDialogTitle>
              <ResponsiveDialogDescription>
                {editingItem
                  ? "Kelola butir soal, identitas guru pembuat, serta tentukan bobot mandiri tiap butir."
                  : "Buat paket soal baru, pilih soal dari bank soal, dan tentukan bobot proporsional (Total 100)."}
              </ResponsiveDialogDescription>
            </div>
            {isSuperAdminOrAdmin && (
              <Badge variant="outline" className="hidden sm:inline-flex bg-primary/10 text-primary border-primary/30 text-xs py-1">
                Akses Super Admin: Kelola Bobot Semua Guru
              </Badge>
            )}
          </div>
        </ResponsiveDialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <ResponsiveDialogBody className="overflow-y-auto px-4 sm:px-6">
            <div className="space-y-6 py-2">
              {/* Form Metadata Section */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Nama Paket Soal *</Label>
                    <Input
                      value={form.nama_paket}
                      onChange={(e) => handleChange("nama_paket", e.target.value)}
                      placeholder="Contoh: UTS Produktif TKJ Semester Ganjil"
                    />
                    {errors.nama_paket && <p className="text-xs text-destructive">{errors.nama_paket}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Mata Pelajaran *</Label>
                    <Select value={form.mata_pelajaran} onValueChange={(v) => v && handleChange("mata_pelajaran", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Mata Pelajaran" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((s) => (
                          <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.mata_pelajaran && <p className="text-xs text-destructive">{errors.mata_pelajaran}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Deskripsi</Label>
                  <Textarea
                    value={form.deskripsi}
                    onChange={(e) => handleChange("deskripsi", e.target.value)}
                    placeholder="Deskripsi singkat mengenai paket soal ini..."
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-sm font-semibold">Guru Pengampu / Pembuat *</Label>
                    <Select
                      value={form.guru_id ? String(form.guru_id) : ""}
                      onValueChange={(v) => v && handleChange("guru_id", Number(v))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Guru" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map((t) => (
                          <SelectItem key={t.id} value={String(t.id)}>{t.nama_lengkap}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.guru_id && <p className="text-xs text-destructive">{errors.guru_id}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Durasi (Menit) *</Label>
                    <Input
                      type="number"
                      min={1}
                      value={form.durasi}
                      onChange={(e) => handleChange("durasi", parseInt(e.target.value) || 0)}
                    />
                    {errors.durasi && <p className="text-xs text-destructive">{errors.durasi}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Status Paket</Label>
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

              {/* Question Selection & Weight Customization Section */}
              <div className="space-y-3 pt-2 border-t border-border">
                {/* Weight Status Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-muted/40 border border-border">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="flex items-center gap-1.5 font-semibold text-sm">
                      <SlidersHorizontal className="h-4 w-4 text-primary" />
                      <span>Butir Soal & Bobot Nilai</span>
                    </div>
                    <Badge
                      variant={isExact100 ? "default" : "outline"}
                      className={`font-mono text-xs font-bold px-2 py-0.5 ${
                        isExact100
                          ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                          : "border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/30"
                      }`}
                    >
                      Total Bobot: {roundedTotalBobot} / 100 pt
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      ({selectedSoalIds.length} soal terpilih)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {canEditWeights ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAutoDistributeWeights}
                        disabled={selectedSoalIds.length === 0}
                        className="h-8 text-xs font-semibold text-primary border-primary/30 hover:bg-primary/10 gap-1.5"
                        title="Hitung proporsional: PG 5 pt, Esai 10 pt (Total otomatis pas 100)"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        Hitung Bobot Proporsional (100)
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-[11px] text-amber-600 border-amber-300">
                        <ShieldAlert className="mr-1 h-3 w-3 inline" />
                        Hanya Pembuat & Super Admin yang dapat mengubah bobot
                      </Badge>
                    )}
                  </div>
                </div>

                {errors.soal_ids && <p className="text-xs text-destructive font-medium">{errors.soal_ids}</p>}

                {/* Question Filter Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <Input
                    placeholder="Cari pertanyaan, kode, atau guru..."
                    value={soalSearch}
                    onChange={(e) => setSoalSearch(e.target.value)}
                    className="h-9 text-xs"
                  />
                  <Select value={mapelFilter} onValueChange={(v) => v && setMapelFilter(v)}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Semua Mapel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semua">Semua Mata Pelajaran ({mapelOptions.length})</SelectItem>
                      {mapelOptions.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={guruFilter} onValueChange={(v) => v && setGuruFilter(v)}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Semua Guru Pembuat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semua">Semua Guru Pembuat ({guruOptions.length})</SelectItem>
                      {guruOptions.map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Question Selection & Weight Table */}
                <div className="rounded-lg border border-border overflow-hidden">
                  <div className="overflow-x-auto max-h-[380px]">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur border-b border-border">
                        <tr className="text-muted-foreground text-xs font-semibold">
                          <th className="w-10 px-3 py-2.5 text-left">
                            <input
                              type="checkbox"
                              checked={allFilteredSelected}
                              onChange={() => toggleAllSoal(filteredBankSoal)}
                              className="h-4 w-4 rounded border-border"
                            />
                          </th>
                          <th className="px-3 py-2.5 text-left min-w-[200px]">Pertanyaan</th>
                          <th className="px-3 py-2.5 text-left min-w-[120px]">Mata Pelajaran</th>
                          <th className="px-3 py-2.5 text-left min-w-[130px]">Guru Pembuat</th>
                          <th className="px-3 py-2.5 text-left w-[100px]">Tipe</th>
                          <th className="px-3 py-2.5 text-left w-[90px]">Kesulitan</th>
                          <th className="px-3 py-2.5 text-right w-[110px]">Bobot (Poin)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBankSoal.map((soal) => {
                          const isSelected = selectedSoalIds.includes(soal.id)
                          const isMyQuestion = currentUser?.teacher_id && soal.guru_id === currentUser.teacher_id
                          const currentWeight = weights[soal.id] ?? 1

                          return (
                            <tr
                              key={soal.id}
                              className={`border-b border-border transition-colors ${
                                isSelected ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/30"
                              }`}
                              onClick={() => toggleSoal(soal.id)}
                            >
                              <td className="px-3 py-2.5">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleSoal(soal.id)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="h-4 w-4 rounded border-border cursor-pointer"
                                />
                              </td>
                              <td className="px-3 py-2.5">
                                <div className="space-y-0.5">
                                  <p className="line-clamp-2 text-xs font-medium text-foreground">
                                    {soal.pertanyaan}
                                  </p>
                                  <span className="text-[10px] text-muted-foreground font-mono">
                                    {soal.kode_soal}
                                  </span>
                                </div>
                              </td>
                              <td className="px-3 py-2.5">
                                <Badge variant="outline" className="text-[11px] font-normal border-border bg-background">
                                  {soal.mata_pelajaran || "Umum"}
                                </Badge>
                              </td>
                              <td className="px-3 py-2.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs text-foreground font-medium">
                                    {soal.guru_nama}
                                  </span>
                                  {isMyQuestion && (
                                    <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-none font-semibold">
                                      Saya
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td className="px-3 py-2.5">
                                <Badge className={`text-[10px] px-1.5 py-0.5 ${TIPE_SOAL_COLORS[soal.tipe_soal]}`}>
                                  {soal.tipe_soal}
                                </Badge>
                              </td>
                              <td className="px-3 py-2.5">
                                <Badge className={`text-[10px] px-1.5 py-0.5 ${KESULITAN_COLORS[soal.kesulitan]}`}>
                                  {soal.kesulitan}
                                </Badge>
                              </td>
                              <td className="px-3 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                                {isSelected ? (
                                  <div className="flex items-center justify-end gap-1">
                                    <Input
                                      type="number"
                                      min={0.5}
                                      step={0.5}
                                      disabled={!canEditWeights}
                                      value={currentWeight}
                                      onChange={(e) => {
                                        const val = parseFloat(e.target.value) || 0
                                        setWeights((prev) => ({ ...prev, [soal.id]: val }))
                                      }}
                                      className="h-7 w-16 px-1 text-center font-mono text-xs font-bold text-primary bg-background"
                                      title={canEditWeights ? "Ubah bobot poin soal ini" : "Anda tidak memiliki hak akses mengubah bobot"}
                                    />
                                    <span className="text-[10px] font-semibold text-muted-foreground">pt</span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-muted-foreground mr-3">—</span>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                        {filteredBankSoal.length === 0 && (
                          <tr>
                            <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground text-xs">
                              Tidak ada butir soal yang sesuai dengan pencarian atau filter.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </ResponsiveDialogBody>

          <ResponsiveDialogFooter className="px-4 py-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span>Status Bobot:</span>
              <strong className={isExact100 ? "text-emerald-600" : "text-amber-600"}>
                {roundedTotalBobot} / 100 pt
              </strong>
              {!isExact100 && selectedSoalIds.length > 0 && (
                <span className="text-[11px] text-amber-600 hidden sm:inline">
                  (Disarankan 100 pt agar kalkulasi nilai otomatis 0–100)
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 sm:flex-initial text-xs">
                Batal
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1 sm:flex-initial text-xs">
                {isLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    Menyimpan...
                  </>
                ) : editingItem ? (
                  "Simpan Perubahan Paket & Bobot"
                ) : (
                  "Tambah Paket Soal"
                )}
              </Button>
            </div>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
