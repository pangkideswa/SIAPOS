"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Pengumuman, KategoriPengumuman, StatusPengumuman, TargetPengumuman } from "../types/pengumuman"
import {
  KATEGORI_PENGUMUMAN_OPTIONS,
  STATUS_PENGUMUMAN_OPTIONS,
  TARGET_OPTIONS,
  EMPTY_PENGUMUMAN_FORM,
} from "../constants/pengumuman.constants"

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data?: Pengumuman | null
  onSave: (data: Pengumuman) => void
}

export function PengumumanFormDialog({
  open,
  onOpenChange,
  data,
  onSave,
}: FormDialogProps) {
  const [form, setForm] = useState(() => {
    if (data) {
      return {
        judul: data.judul,
        ringkasan: data.ringkasan,
        isi: data.isi,
        kategori: data.kategori,
        target: data.target,
        status: data.status,
        penulis: data.penulis,
        pinned: data.pinned,
        tanggal_publish: data.tanggal_publish,
      }
    }
    return { ...EMPTY_PENGUMUMAN_FORM }
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEdit = !!data

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.judul.trim()) errs.judul = "Judul wajib diisi"
    if (!form.ringkasan.trim()) errs.ringkasan = "Ringkasan wajib diisi"
    if (!form.isi.trim()) errs.isi = "Isi pengumuman wajib diisi"
    if (!form.penulis.trim()) errs.penulis = "Penulis wajib diisi"
    if (!form.tanggal_publish) errs.tanggal_publish = "Tanggal publish wajib diisi"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const now = new Date().toISOString()
    onSave({
      id: data?.id ?? Date.now(),
      ...form,
      created_at: data?.created_at ?? now,
      updated_at: now,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Pengumuman" : "Buat Pengumuman"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Edit data pengumuman" : "Buat pengumuman baru"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="judul">Judul</Label>
            <Input
              id="judul"
              value={form.judul}
              onChange={(e) => setForm({ ...form, judul: e.target.value })}
              placeholder="Masukkan judul pengumuman"
            />
            {errors.judul && <p className="text-xs text-destructive">{errors.judul}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ringkasan">Ringkasan</Label>
            <Input
              id="ringkasan"
              value={form.ringkasan}
              onChange={(e) => setForm({ ...form, ringkasan: e.target.value })}
              placeholder="Ringkasan singkat pengumuman"
            />
            {errors.ringkasan && <p className="text-xs text-destructive">{errors.ringkasan}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="isi">Isi Pengumuman</Label>
            <Textarea
              id="isi"
              value={form.isi}
              onChange={(e) => setForm({ ...form, isi: e.target.value })}
              placeholder="Tulis isi pengumuman di sini..."
              rows={6}
            />
            {errors.isi && <p className="text-xs text-destructive">{errors.isi}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kategori">Kategori</Label>
              <Select
                value={form.kategori}
                onValueChange={(v) => setForm({ ...form, kategori: v as KategoriPengumuman })}
              >
                <SelectTrigger id="kategori">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {KATEGORI_PENGUMUMAN_OPTIONS.map((k) => (
                    <SelectItem key={k} value={k}>{k}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="target">Target</Label>
              <Select
                value={form.target}
                onValueChange={(v) => setForm({ ...form, target: v as TargetPengumuman })}
              >
                <SelectTrigger id="target">
                  <SelectValue placeholder="Pilih target" />
                </SelectTrigger>
                <SelectContent>
                  {TARGET_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v as StatusPengumuman })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_PENGUMUMAN_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="penulis">Penulis</Label>
              <Input
                id="penulis"
                value={form.penulis}
                onChange={(e) => setForm({ ...form, penulis: e.target.value })}
                placeholder="Nama penulis"
              />
              {errors.penulis && <p className="text-xs text-destructive">{errors.penulis}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tanggal_publish">Tanggal Publish</Label>
            <Input
              id="tanggal_publish"
              type="date"
              value={form.tanggal_publish}
              onChange={(e) => setForm({ ...form, tanggal_publish: e.target.value })}
            />
            {errors.tanggal_publish && <p className="text-xs text-destructive">{errors.tanggal_publish}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="pinned"
              checked={form.pinned}
              onCheckedChange={(checked) => setForm({ ...form, pinned: checked === true })}
            />
            <Label htmlFor="pinned" className="text-sm font-normal cursor-pointer">
              Pin sebagai pengumuman penting
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>{isEdit ? "Simpan" : "Buat"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
