"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Calendar,
  ClipboardList,
  Loader2,
  Upload,
  FileText,
  MessageSquareText,
  History,
  Download,
} from "lucide-react"
import { toast } from "sonner"
import { EmptyState } from "@/components/ui/empty-state"
import { MAX_PENGUMPULAN_FILE_SIZE_MB } from "@/features/pengumpulan/constants/pengumpulan.constants"
import { useAssignments } from "@/hooks/use-assignments"
import { useSubmissions, useCreateSubmission } from "@/hooks/use-submissions"
import type { PengumpulanFile } from "@/features/pengumpulan/types/pengumpulan"
import type { Tugas } from "@/features/tugas/types/tugas"
import type { Siswa } from "@/features/siswa/types/siswa"
import type { KelasMengajar } from "@/features/kelas-mengajar/types/kelas-mengajar"

interface SiswaKelasTugasTabProps {
  kelasMengajar: KelasMengajar
  siswa: Siswa
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

function formatDeadline(dateStr: string, jam?: string | null) {
  const date = new Date(dateStr + "T00:00:00").toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  return jam ? `${date} ${jam} WIB` : date
}

function formatWaktu(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const MY_STATUS_BADGE: Record<string, string> = {
  "Belum Mengumpulkan": "bg-gray-100 text-gray-800",
  "Sudah Mengumpulkan": "bg-green-100 text-green-800",
  Terlambat: "bg-red-100 text-red-800",
}

export function SiswaKelasTugasTab({
  kelasMengajar,
  siswa,
}: SiswaKelasTugasTabProps) {
  const [selectedFiles, setSelectedFiles] = useState<
    Record<number, PengumpulanFile | null>
  >({})
  const [catatans, setCatatans] = useState<Record<number, string>>({})
  const [uploadingId, setUploadingId] = useState<number | null>(null)

  const { data: allAssignments = [] } = useAssignments()
  const { data: allSubmissions = [] } = useSubmissions()
  const createSubmission = useCreateSubmission()

  const tugasList = allAssignments
    .filter(
      (t) =>
        t.kelas_mengajar_id === kelasMengajar.id &&
        t.status === "Dipublikasikan"
    )
    .sort(
      (a, b) =>
        new Date(b.tenggat_waktu).getTime() -
        new Date(a.tenggat_waktu).getTime()
    )

  function getMySubmission(tugasId: number) {
    return (
      allSubmissions.find(
        (p) => p.tugas_id === tugasId && p.siswa_id === siswa.id
      ) ?? null
    )
  }

  function handleFileSelect(
    tugasId: number,
    file: File,
    input?: HTMLInputElement | null
  ) {
    if (file.size > MAX_PENGUMPULAN_FILE_SIZE_MB * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar", {
        description: `Maksimal ukuran file ${MAX_PENGUMPULAN_FILE_SIZE_MB} MB.`,
      })
      if (input) input.value = ""
      return
    }
    setSelectedFiles((prev) => ({
      ...prev,
      [tugasId]: {
        nama: file.name,
        ukuran: formatFileSize(file.size),
        tipe: file.type,
      },
    }))
  }

  async function handleUpload(tugas: Tugas) {
    const file = selectedFiles[tugas.id]
    if (!file) {
      toast.error("Pilih file terlebih dahulu")
      return
    }
    setUploadingId(tugas.id)
    try {
      await createSubmission.mutateAsync({
        assignment_id: tugas.id,
        student_id: siswa.id,
        data: {
          file_jawaban: { ...file },
          catatan: catatans[tugas.id] || null,
        },
      })
      setSelectedFiles((prev) => ({ ...prev, [tugas.id]: null }))
      setCatatans((prev) => ({ ...prev, [tugas.id]: "" }))
    } finally {
      setUploadingId(null)
    }
  }

  if (tugasList.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Belum Ada Tugas Aktif"
        description="Tugas yang dipublikasikan guru akan tampil di sini."
      />
    )
  }

  return (
    <div className="space-y-4">
      {tugasList.map((tugas) => {
        const mySubmission = getMySubmission(tugas.id)
        const selectedFile = selectedFiles[tugas.id] ?? null
        const riwayat = mySubmission?.riwayat_pengumpulan ?? []
        const isSubmitting = uploadingId === tugas.id

        return (
          <Card key={tugas.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 shrink-0">
                    <ClipboardList className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-base">
                      {tugas.judul}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Tenggat: {formatDeadline(tugas.tenggat_waktu, tugas.tenggat_jam)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline">
                    Nilai Maks: {tugas.nilai_maksimal}
                  </Badge>
                  {mySubmission ? (
                    <Badge
                      className={
                        MY_STATUS_BADGE[mySubmission.status] ?? ""
                      }
                    >
                      {mySubmission.status}
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">
                      Belum Mengumpulkan
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {tugas.deskripsi && (
                <p className="text-sm text-muted-foreground">
                  {tugas.deskripsi}
                </p>
              )}

              {tugas.lampiran.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">
                    Lampiran Tugas
                  </p>
                  {tugas.lampiran.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between rounded-lg border border-border p-2.5"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 text-orange-500 shrink-0" />
                        <span className="text-sm truncate">{file.nama}</span>
                        <span className="text-xs text-muted-foreground">
                          {file.ukuran}
                        </span>
                      </div>
                      <Button variant="ghost" size="icon-sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {mySubmission && mySubmission.file_jawaban && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-green-700 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {mySubmission.file_jawaban.nama}
                        </p>
                        <p className="text-xs text-green-700/80">
                          Dikumpulkan {formatWaktu(mySubmission.waktu_pengumpulan ?? "")}
                        </p>
                      </div>
                    </div>
                    {mySubmission.nilai !== null && (
                      <Badge className="bg-green-700 text-white font-semibold">
                        {mySubmission.nilai}
                      </Badge>
                    )}
                  </div>
                  {mySubmission.feedback && (
                    <div className="mt-2 flex items-start gap-2 rounded-md bg-white/70 p-2.5">
                      <MessageSquareText className="h-4 w-4 text-green-700 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-green-800">
                          Umpan balik guru
                        </p>
                        <p className="text-sm text-green-900">
                          {mySubmission.feedback}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {riwayat.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <History className="h-3.5 w-3.5" />
                    Riwayat Pengumpulan
                  </p>
                  <div className="space-y-1">
                    {riwayat.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center gap-2 rounded-lg border border-border p-2 text-xs text-muted-foreground"
                      >
                        <FileText className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          {r.file_jawaban?.nama ?? "Tanpa file"}
                        </span>
                        <span className="ml-auto shrink-0">
                          {r.waktu_pengumpulan
                            ? formatWaktu(r.waktu_pengumpulan)
                            : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-lg border border-border p-4 space-y-3">
                <p className="text-sm font-medium">
                  {mySubmission?.file_jawaban
                    ? "Ganti Jawaban (masih dapat dikumpulkan)"
                    : "Kumpulkan Jawaban"}
                </p>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    File Jawaban (PDF, DOC, DOCX, PPT, PPTX, ZIP)
                  </Label>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileSelect(tugas.id, file, e.target)
                    }}
                  />
                  {selectedFile && (
                    <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2 text-sm">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="truncate">{selectedFile.nama}</span>
                      <span className="text-xs text-muted-foreground">
                        {selectedFile.ukuran}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Catatan (opsional)
                  </Label>
                  <Textarea
                    rows={2}
                    placeholder="Tambahkan catatan untuk guru..."
                    value={catatans[tugas.id] ?? ""}
                    onChange={(e) =>
                      setCatatans((prev) => ({
                        ...prev,
                        [tugas.id]: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                className="bg-primary hover:bg-primary/90 ml-auto"
                disabled={!selectedFile || isSubmitting}
                onClick={() => handleUpload(tugas)}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                {mySubmission?.file_jawaban
                  ? "Perbarui Jawaban"
                  : "Kumpulkan"}
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
