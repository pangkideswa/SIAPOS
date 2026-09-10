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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { KalenderEvent, KategoriEvent, StatusEvent } from "../types/kalender-akademik"
import {
  KATEGORI_OPTIONS,
  STATUS_EVENT_OPTIONS,
  TAHUN_AJARAN_OPTIONS,
  SEMESTER_OPTIONS,
  EMPTY_EVENT_FORM,
} from "../constants/kalender-akademik.constants"

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event?: KalenderEvent | null
  onSave: (data: KalenderEvent) => void
}

export function KalenderEventFormDialog({
  open,
  onOpenChange,
  event,
  onSave,
}: FormDialogProps) {
  const [form, setForm] = useState(() => {
    if (event) {
      return {
        nama_event: event.nama_event,
        deskripsi: event.deskripsi,
        kategori: event.kategori,
        tanggal_mulai: event.tanggal_mulai,
        tanggal_selesai: event.tanggal_selesai,
        tahun_ajaran: event.tahun_ajaran,
        semester: event.semester,
        status: event.status,
      }
    }
    return { ...EMPTY_EVENT_FORM }
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEdit = !!event

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.nama_event.trim()) errs.nama_event = "Nama event wajib diisi"
    if (!form.tanggal_mulai) errs.tanggal_mulai = "Tanggal mulai wajib diisi"
    if (!form.tanggal_selesai) errs.tanggal_selesai = "Tanggal selesai wajib diisi"
    if (form.tanggal_mulai && form.tanggal_selesai && form.tanggal_mulai > form.tanggal_selesai) {
      errs.tanggal_selesai = "Tanggal selesai harus setelah tanggal mulai"
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const now = new Date().toISOString()
    onSave({
      id: event?.id ?? Date.now(),
      ...form,
      created_at: event?.created_at ?? now,
      updated_at: now,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Event" : "Tambah Event"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Edit data event kalender akademik"
              : "Tambahkan event baru ke kalender akademik"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="nama_event">Nama Event</Label>
            <Input
              id="nama_event"
              value={form.nama_event}
              onChange={(e) => setForm({ ...form, nama_event: e.target.value })}
              placeholder="Masukkan nama event"
            />
            {errors.nama_event && (
              <p className="text-xs text-destructive">{errors.nama_event}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea
              id="deskripsi"
              value={form.deskripsi}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
              placeholder="Masukkan deskripsi event"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kategori">Kategori</Label>
            <Select
              value={form.kategori}
              onValueChange={(v) => setForm({ ...form, kategori: v as KategoriEvent })}
            >
              <SelectTrigger id="kategori">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {KATEGORI_OPTIONS.map((k) => (
                  <SelectItem key={k} value={k}>
                    {k}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
              <Input
                id="tanggal_mulai"
                type="date"
                value={form.tanggal_mulai}
                onChange={(e) => setForm({ ...form, tanggal_mulai: e.target.value })}
              />
              {errors.tanggal_mulai && (
                <p className="text-xs text-destructive">{errors.tanggal_mulai}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
              <Input
                id="tanggal_selesai"
                type="date"
                value={form.tanggal_selesai}
                onChange={(e) => setForm({ ...form, tanggal_selesai: e.target.value })}
              />
              {errors.tanggal_selesai && (
                <p className="text-xs text-destructive">{errors.tanggal_selesai}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tahun_ajaran">Tahun Ajaran</Label>
              <Select
                value={form.tahun_ajaran}
                onValueChange={(v) => setForm({ ...form, tahun_ajaran: v ?? "" })}
              >
                <SelectTrigger id="tahun_ajaran">
                  <SelectValue placeholder="Pilih tahun ajaran" />
                </SelectTrigger>
                <SelectContent>
                  {TAHUN_AJARAN_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select
                value={form.semester}
                onValueChange={(v) => setForm({ ...form, semester: v ?? "" })}
              >
                <SelectTrigger id="semester">
                  <SelectValue placeholder="Pilih semester" />
                </SelectTrigger>
                <SelectContent>
                  {SEMESTER_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) => setForm({ ...form, status: v as StatusEvent })}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_EVENT_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>{isEdit ? "Simpan" : "Tambah"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
