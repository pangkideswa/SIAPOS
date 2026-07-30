import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import type { NilaiAkademik, NilaiAkademikFormData } from "../types/nilai-akademik"
import { EMPTY_NILAI_FORM } from "../constants/nilai-akademik.constants"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: NilaiAkademik | null
  onSave: (data: NilaiAkademik) => void
}

function validateNilai(value: string): boolean {
  if (value === "") return true
  const num = Number(value)
  return !isNaN(num) && num >= 0 && num <= 100 && Number.isInteger(num)
}

export function NilaiAkademikFormDialog({ open, onOpenChange, data, onSave }: Props) {
  const [form, setForm] = useState<NilaiAkademikFormData>(EMPTY_NILAI_FORM)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      if (data) {
        setForm({
          tugas: data.tugas !== null ? String(data.tugas) : "",
          praktik: data.praktik !== null ? String(data.praktik) : "",
          uts: data.uts !== null ? String(data.uts) : "",
          uas: data.uas !== null ? String(data.uas) : "",
        })
      } else {
        setForm(EMPTY_NILAI_FORM)
      }
      setErrors({})
    }
  }, [open, data])

  const handleChange = (field: keyof NilaiAkademikFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}
    const fields: (keyof NilaiAkademikFormData)[] = ["tugas", "praktik", "uts", "uas"]

    for (const field of fields) {
      if (form[field] !== "" && !validateNilai(form[field])) {
        newErrors[field] = "Nilai harus 0-100"
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error("Mohon periksa kembali nilai yang diinput")
      return
    }

    const tugas = form.tugas !== "" ? Number(form.tugas) : null
    const praktik = form.praktik !== "" ? Number(form.praktik) : null
    const uts = form.uts !== "" ? Number(form.uts) : null
    const uas = form.uas !== "" ? Number(form.uas) : null

    const status = (tugas !== null && praktik !== null && uts !== null && uas !== null)
      ? "Lengkap" as const
      : "Belum Lengkap" as const

    const saved: NilaiAkademik = {
      ...data!,
      tugas,
      praktik,
      uts,
      uas,
      status,
      updated_at: new Date().toISOString(),
    }

    onSave(saved)
    toast.success("Nilai berhasil disimpan")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{data ? "Edit Nilai" : "Input Nilai"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {data && (
            <div className="grid grid-cols-2 gap-2 text-sm bg-muted/50 p-3 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Siswa</p>
                <p className="font-medium">{data.siswa_nama}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Kelas</p>
                <p className="font-medium">{data.siswa_kelas}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Mapel</p>
                <p className="font-medium">{data.mata_pelajaran}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Guru</p>
                <p className="font-medium">{data.guru_nama}</p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="tugas">Tugas</Label>
              <Input
                id="tugas"
                type="number"
                min={0}
                max={100}
                placeholder="0-100"
                value={form.tugas}
                onChange={(e) => handleChange("tugas", e.target.value)}
              />
              {errors.tugas && <p className="text-xs text-destructive">{errors.tugas}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="praktik">Praktik</Label>
              <Input
                id="praktik"
                type="number"
                min={0}
                max={100}
                placeholder="0-100"
                value={form.praktik}
                onChange={(e) => handleChange("praktik", e.target.value)}
              />
              {errors.praktik && <p className="text-xs text-destructive">{errors.praktik}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="uts">UTS</Label>
              <Input
                id="uts"
                type="number"
                min={0}
                max={100}
                placeholder="0-100"
                value={form.uts}
                onChange={(e) => handleChange("uts", e.target.value)}
              />
              {errors.uts && <p className="text-xs text-destructive">{errors.uts}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="uas">UAS</Label>
              <Input
                id="uas"
                type="number"
                min={0}
                max={100}
                placeholder="0-100"
                value={form.uas}
                onChange={(e) => handleChange("uas", e.target.value)}
              />
              {errors.uas && <p className="text-xs text-destructive">{errors.uas}</p>}
            </div>
          </div>
        </div>
        <DialogFooter showCloseButton>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
