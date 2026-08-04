"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import {
  ArrowLeft,
  User,
  BookOpen,
  School,
  Calendar,
  FileText,
  Download,
  Clock,
  Save,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import {
  STATUS_PENILAIAN_COLORS,
} from "@/features/penilaian/constants/penilaian.constants"
import { usePenilaianDetail, useUpdatePenilaian } from "@/hooks/use-penilaian"
import { useSubmission } from "@/hooks/use-submissions"
import type { Penilaian } from "@/features/penilaian/types/penilaian"

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

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value || "-"}</p>
      </div>
    </div>
  )
}

export function PenilaianDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()

  const [nilai, setNilai] = useState<string>("")
  const [feedback, setFeedback] = useState<string>("")
  const [statusPenilaian, setStatusPenilaian] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)
  const [initialized, setInitialized] = useState(false)

  const {
    data: penilaian,
    isLoading,
    isError,
    refetch,
  } = usePenilaianDetail(Number(resolvedParams.id))
  const { data: pengumpulan } = useSubmission(
    penilaian?.pengumpulan_id ?? 0
  )
  const updatePenilaian = useUpdatePenilaian()

  if (penilaian && !initialized) {
    setNilai(penilaian.nilai !== null ? String(penilaian.nilai) : "")
    setFeedback(penilaian.feedback_guru)
    setStatusPenilaian(penilaian.status_penilaian)
    setInitialized(true)
  }

  async function handleSave() {
    if (!penilaian) return

    if (statusPenilaian === "Sudah Dinilai") {
      const parsed = Number(nilai)
      if (isNaN(parsed) || parsed < 0) {
        toast.error("Nilai tidak valid", {
          description: "Nilai harus berupa angka positif.",
        })
        return
      }
    }

    setIsSaving(true)
    try {
      await updatePenilaian.mutateAsync({
        id: penilaian.id,
        data: {
          nilai:
            statusPenilaian === "Sudah Dinilai" ? Number(nilai) : null,
          feedback: feedback,
          status_penilaian:
            statusPenilaian as Penilaian["status_penilaian"],
        },
      })
      router.push("/guru/penilaian")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Penilaian"
          description="Memuat data penilaian..."
          action={
            <Button
              variant="outline"
              onClick={() => router.push("/guru/penilaian")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          }
        />
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground py-12">
            Memuat data penilaian...
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError || !penilaian) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Penilaian"
          description="Data penilaian tidak ditemukan."
          action={
            <Button
              variant="outline"
              onClick={() => router.push("/guru/penilaian")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          }
        />
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground py-12">
            {isError
              ? "Gagal memuat data penilaian."
              : `Data penilaian dengan ID ${resolvedParams.id} tidak ditemukan.`}
          </CardContent>
          {isError && (
            <CardContent className="pt-0 pb-6 text-center">
              <Button variant="outline" onClick={() => refetch()}>
                Muat Ulang
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Penilaian"
        description={`Beri nilai: ${penilaian.siswa_nama}`}
        action={
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={() => router.push("/guru/penilaian")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Simpan Penilaian
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Siswa */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Informasi Siswa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                {penilaian.siswa_nama
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <div>
                <p className="font-semibold">{penilaian.siswa_nama}</p>
                <p className="text-xs text-muted-foreground">
                  {penilaian.siswa_kelas}
                </p>
              </div>
            </div>

            <div className="divide-y divide-border">
              <InfoRow
                icon={BookOpen}
                label="Mata Pelajaran"
                value={penilaian.mata_pelajaran}
              />
              <InfoRow
                icon={User}
                label="Guru"
                value={penilaian.guru_nama}
              />
            </div>
          </CardContent>
        </Card>

        {/* Info Tugas + Jawaban */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info Tugas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informasi Tugas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                <InfoRow
                  icon={BookOpen}
                  label="Judul Tugas"
                  value={penilaian.tugas_judul}
                />
                <InfoRow
                  icon={School}
                  label="Kelas"
                  value={penilaian.siswa_kelas}
                />
                <InfoRow
                  icon={Calendar}
                  label="Tenggat Waktu"
                  value={formatDate(penilaian.tenggat_waktu)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Jawaban Siswa */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Jawaban Siswa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Jawaban */}
              {pengumpulan?.file_jawaban ? (
                <div className="space-y-2">
                  <Label>File Jawaban</Label>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {pengumpulan.file_jawaban.nama}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {pengumpulan.file_jawaban.ukuran}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon-sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-sm text-muted-foreground border border-dashed rounded-lg">
                  Tidak ada file jawaban
                </div>
              )}

              {/* Catatan Siswa */}
              <div className="space-y-2">
                <Label>Catatan Siswa</Label>
                <Textarea
                  value={pengumpulan?.catatan || "Tidak ada catatan."}
                  readOnly
                  rows={3}
                  className="bg-muted/30"
                />
              </div>

              {/* Waktu Pengumpulan */}
              {pengumpulan?.waktu_pengumpulan && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    Diunggah: {formatDateTime(pengumpulan.waktu_pengumpulan)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form Penilaian */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Form Penilaian</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nilai">Nilai</Label>
                  <Input
                    id="nilai"
                    type="number"
                    min={0}
                    value={nilai}
                    onChange={(e) => setNilai(e.target.value)}
                    placeholder="Masukkan nilai"
                    disabled={statusPenilaian !== "Sudah Dinilai"}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status Penilaian</Label>
                  <Select
                    value={statusPenilaian}
                    onValueChange={(v: string | null) =>
                      setStatusPenilaian(v ?? "Belum Dinilai")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Belum Dinilai">Belum Dinilai</SelectItem>
                      <SelectItem value="Sudah Dinilai">Sudah Dinilai</SelectItem>
                      <SelectItem value="Revisi">Revisi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback Guru</Label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tulis feedback untuk siswa..."
                  rows={4}
                />
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  className={
                    STATUS_PENILAIAN_COLORS[statusPenilaian] ?? ""
                  }
                >
                  {statusPenilaian || "Belum Dinilai"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Status saat ini
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
