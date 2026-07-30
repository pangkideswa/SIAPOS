"use client"

import { useState, useRef } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  FileText,
  Upload,
  X,
  Send,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  School,
} from "lucide-react"
import { toast } from "sonner"
import { STATUS_TUGAS_COLORS } from "@/features/tugas/constants/tugas.constants"
import { DUMMY_TUGAS } from "@/features/tugas/dummy/tugas.data"
import { DUMMY_PENGUMPULAN } from "@/features/pengumpulan/dummy/pengumpulan.data"
import type { Tugas } from "@/features/tugas/types/tugas"
import type {
  PengumpulanTugas,
  PengumpulanFile,
} from "@/features/pengumpulan/types/pengumpulan"

const SISWA_SIMULASI = {
  id: 99,
  nama: "Andi Siswa (Simulasi)",
  kelas: "XI TKJ 1",
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function isAfterDeadline(tenggat: string): boolean {
  return new Date() > new Date(tenggat + "T23:59:59")
}

export function SimulasiSiswaPage() {
  const [selectedTugas, setSelectedTugas] = useState<Tugas | null>(null)
  const [file, setFile] = useState<PengumpulanFile | null>(null)
  const [catatan, setCatatan] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const siswaTugas = DUMMY_TUGAS.filter(
    (t) =>
      t.status === "Dipublikasikan" &&
      (t.kelas === SISWA_SIMULASI.kelas ||
        t.kelas === "X TKJ 2" ||
        t.kelas === "XI TBSM 1")
  )

  function getSiswaSubmission(tugasId: number): PengumpulanTugas | null {
    return (
      DUMMY_PENGUMPULAN.find(
        (p) =>
          p.tugas_id === tugasId &&
          (p.siswa_nama === SISWA_SIMULASI.nama ||
            p.siswa_id === SISWA_SIMULASI.id)
      ) ?? null
    )
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return

    if (f.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar", {
        description: "Maksimal ukuran file adalah 5MB.",
      })
      return
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/zip",
      "application/x-zip-compressed",
    ]

    if (!allowedTypes.includes(f.type)) {
      toast.error("Format file tidak didukung", {
        description: "Format yang diizinkan: PDF, DOCX, PPTX, ZIP",
      })
      return
    }

    setFile({
      nama: f.name,
      ukuran:
        f.size < 1024
          ? f.size + " B"
          : f.size < 1024 * 1024
            ? (f.size / 1024).toFixed(0) + " KB"
            : (f.size / (1024 * 1024)).toFixed(1) + " MB",
      tipe: f.type,
    })
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function removeFile() {
    setFile(null)
  }

  async function handleSubmit() {
    if (!selectedTugas) return

    if (!file) {
      toast.error("File wajib dipilih", {
        description: "Silakan upload file jawaban terlebih dahulu.",
      })
      return
    }

    if (isAfterDeadline(selectedTugas.tenggat_waktu)) {
      toast.error("Tenggat waktu sudah lewat", {
        description:
          "Anda tidak dapat mengumpulkan tugas setelah tenggat waktu.",
      })
      return
    }

    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 800))

    const now = new Date().toISOString()
    const isLate = isAfterDeadline(selectedTugas.tenggat_waktu)

    const newSubmission: PengumpulanTugas = {
      id: Math.max(...DUMMY_PENGUMPULAN.map((p) => p.id), 0) + 1,
      tugas_id: selectedTugas.id,
      siswa_id: SISWA_SIMULASI.id,
      siswa_nama: SISWA_SIMULASI.nama,
      siswa_kelas: SISWA_SIMULASI.kelas,
      file_jawaban: file,
      catatan,
      waktu_pengumpulan: now,
      status: isLate ? "Terlambat" : "Sudah Mengumpulkan",
      nilai: null,
      created_at: now,
      updated_at: now,
    }

    DUMMY_PENGUMPULAN.push(newSubmission)

    setIsSubmitting(false)
    setFile(null)
    setCatatan("")
    setSelectedTugas(null)

    toast.success("Tugas berhasil dikirim.", {
      description: "Jawaban Anda telah berhasil dikumpulkan.",
    })
  }

  if (selectedTugas) {
    const existing = getSiswaSubmission(selectedTugas.id)
    const deadline = isAfterDeadline(selectedTugas.tenggat_waktu)

    return (
      <div className="space-y-6">
        <PageHeader
          title="Kirim Tugas"
          description={selectedTugas.judul}
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSelectedTugas(null)
                setFile(null)
                setCatatan("")
              }}
            >
              Kembali
            </Button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tugas Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Info Tugas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{selectedTugas.mata_pelajaran}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <School className="h-4 w-4 text-muted-foreground" />
                <span>{selectedTugas.kelas}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Tenggat: {formatDate(selectedTugas.tenggat_waktu)}</span>
              </div>
              {deadline && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>Deadline sudah lewat</span>
                </div>
              )}
              {existing && (
                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="font-medium">Sudah mengumpulkan</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    {existing.waktu_pengumpulan &&
                      formatDateTime(existing.waktu_pengumpulan)}
                  </p>
                </div>
              )}
              <Badge className={STATUS_TUGAS_COLORS[selectedTugas.status]}>
                {selectedTugas.status}
              </Badge>
            </CardContent>
          </Card>

          {/* Upload Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Upload Jawaban</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Upload */}
              <div className="space-y-2">
                <Label>
                  File Jawaban <span className="text-destructive">*</span>
                </Label>
                {file ? (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{file.nama}</p>
                        <p className="text-xs text-muted-foreground">
                          {file.ukuran}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={removeFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={deadline}
                    className="w-full p-6 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Upload className="h-6 w-6" />
                    <span className="text-sm">
                      Klik untuk upload file jawaban
                    </span>
                    <span className="text-xs">
                      PDF, DOCX, PPTX, ZIP (maks. 5MB)
                    </span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {/* Catatan */}
              <div className="space-y-2">
                <Label htmlFor="catatan">Catatan (opsional)</Label>
                <Textarea
                  id="catatan"
                  placeholder="Tambahkan catatan untuk guru..."
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Submit */}
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || deadline || !file}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Kirim Tugas
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Simulasi Siswa — Kirim Tugas"
        description={`Masuk sebagai: ${SISWA_SIMULASI.nama} (${SISWA_SIMULASI.kelas})`}
      />

      <div className="space-y-4">
        {siswaTugas.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground py-12">
              Tidak ada tugas yang tersedia untuk kelas Anda.
            </CardContent>
          </Card>
        ) : (
          siswaTugas.map((tugas) => {
            const submission = getSiswaSubmission(tugas.id)
            const deadline = isAfterDeadline(tugas.tenggat_waktu)

            return (
              <Card
                key={tugas.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  if (!submission) {
                    setSelectedTugas(tugas)
                  }
                }}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold">{tugas.judul}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {tugas.mata_pelajaran} — {tugas.kelas}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Tenggat: {formatDate(tugas.tenggat_waktu)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {submission ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Sudah Dikirim
                        </Badge>
                      ) : deadline ? (
                        <Badge className="bg-red-100 text-red-800">
                          <AlertCircle className="mr-1 h-3 w-3" />
                          Deadline Lewat
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedTugas(tugas)
                          }}
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Kirim Tugas
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
