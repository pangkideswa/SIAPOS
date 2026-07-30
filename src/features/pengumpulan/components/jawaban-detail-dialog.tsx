"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  FileText,
  Download,
  Clock,
  GraduationCap,
  Loader2,
  Save,
} from "lucide-react"
import { toast } from "sonner"
import { STATUS_PENGUMPULAN_COLORS } from "@/features/pengumpulan/constants/pengumpulan.constants"
import { DUMMY_PENGUMPULAN } from "@/features/pengumpulan/dummy/pengumpulan.data"
import type { PengumpulanTugas } from "@/features/pengumpulan/types/pengumpulan"

interface JawabanDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  submission: PengumpulanTugas | null
  nilaiMaksimal: number
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function JawabanDetailDialog({
  open,
  onOpenChange,
  submission,
  nilaiMaksimal,
}: JawabanDetailDialogProps) {
  const [nilai, setNilai] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)

  function handleOpen(isOpen: boolean) {
    if (isOpen && submission) {
      setNilai(submission.nilai !== null ? String(submission.nilai) : "")
    }
    onOpenChange(isOpen)
  }

  async function handleSaveNilai() {
    if (!submission) return
    const parsed = Number(nilai)
    if (isNaN(parsed) || parsed < 0 || parsed > nilaiMaksimal) {
      toast.error("Nilai tidak valid", {
        description: `Nilai harus antara 0 dan ${nilaiMaksimal}.`,
      })
      return
    }

    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 500))

    const idx = DUMMY_PENGUMPULAN.findIndex(
      (p) => p.id === submission.id
    )
    if (idx !== -1) {
      DUMMY_PENGUMPULAN[idx] = {
        ...DUMMY_PENGUMPULAN[idx],
        nilai: parsed,
        updated_at: new Date().toISOString(),
      }
    }

    setIsSaving(false)
    onOpenChange(false)
    toast.success(`Nilai ${submission.siswa_nama} berhasil disimpan: ${parsed}`)
  }

  if (!submission) return null

  return (
    <Dialog open={open} onOpenChange={(v) => handleOpen(v)}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Jawaban Siswa</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Siswa Info */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
              {submission.siswa_nama
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div>
              <p className="font-medium">{submission.siswa_nama}</p>
              <p className="text-xs text-muted-foreground">
                {submission.siswa_kelas}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge
              className={
                STATUS_PENGUMPULAN_COLORS[submission.status] ?? ""
              }
            >
              {submission.status}
            </Badge>
          </div>

          {/* File Jawaban */}
          {submission.file_jawaban && (
            <div className="space-y-2">
              <Label>File Jawaban</Label>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {submission.file_jawaban.nama}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {submission.file_jawaban.ukuran}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon-sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {!submission.file_jawaban && (
            <div className="text-center py-4 text-sm text-muted-foreground border border-dashed rounded-lg">
              Tidak ada file jawaban
            </div>
          )}

          {/* Catatan */}
          <div className="space-y-2">
            <Label>Catatan Siswa</Label>
            <Textarea
              value={submission.catatan || "Tidak ada catatan."}
              readOnly
              rows={3}
              className="bg-muted/30"
            />
          </div>

          {/* Waktu Upload */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {submission.waktu_pengumpulan ? (
              <span>
                Diunggah:{" "}
                {formatDateTime(submission.waktu_pengumpulan)}
              </span>
            ) : (
              <span>Belum mengumpulkan</span>
            )}
          </div>

          {/* Beri Nilai */}
          <div className="space-y-2 p-4 rounded-lg border border-border bg-muted/30">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="h-4 w-4 text-primary" />
              <Label className="font-semibold">Beri Nilai</Label>
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min={0}
                max={nilaiMaksimal}
                value={nilai}
                onChange={(e) => setNilai(e.target.value)}
                placeholder={`0 - ${nilaiMaksimal}`}
                className="w-32"
              />
              <span className="text-sm text-muted-foreground">
                / {nilaiMaksimal}
              </span>
              <Button
                size="sm"
                onClick={handleSaveNilai}
                disabled={isSaving || submission.status === "Belum Mengumpulkan"}
                className="bg-primary hover:bg-primary/90 ml-auto"
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Simpan
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
