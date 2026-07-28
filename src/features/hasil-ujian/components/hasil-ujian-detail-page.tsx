"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import {
  ArrowLeft,
  User,
  BookOpen,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  MinusCircle,
  FileText,
  GraduationCap,
  BarChart3,
  Save,
  Loader2,
  MessageSquare,
} from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import {
  STATUS_HASIL_COLORS,
  STATUS_HASIL_OPTIONS,
} from "@/features/hasil-ujian/constants/hasil-ujian.constants"
import { DUMMY_HASIL_UJIAN } from "@/features/hasil-ujian/dummy/hasil-ujian.data"
import type { HasilUjian } from "@/features/hasil-ujian/types/hasil-ujian"

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

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "Benar":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />
    case "Salah":
      return <XCircle className="h-4 w-4 text-red-600" />
    case "Tidak Dijawab":
      return <MinusCircle className="h-4 w-4 text-gray-400" />
    default:
      return null
  }
}

export function HasilUjianDetailPage({
  id,
}: {
  id: string
}) {
  const router = useRouter()
  const { user } = useAuth()
  const isSiswa = user?.role === "siswa"

  const [catatanEvaluasi, setCatatanEvaluasi] = useState<string>("")
  const [statusHasil, setStatusHasil] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)
  const [initialized, setInitialized] = useState(false)

  const hasil = DUMMY_HASIL_UJIAN.find(
    (h) => h.id === Number(id)
  )

  useEffect(() => {
    if (hasil && !initialized) {
      setCatatanEvaluasi(hasil.catatan_evaluasi)
      setStatusHasil(hasil.status)
      setInitialized(true)
    }
  }, [hasil, initialized])

  async function handleSave() {
    if (!hasil) return

    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 500))

    const idx = DUMMY_HASIL_UJIAN.findIndex((h) => h.id === hasil.id)
    if (idx !== -1) {
      DUMMY_HASIL_UJIAN[idx] = {
        ...DUMMY_HASIL_UJIAN[idx],
        catatan_evaluasi: catatanEvaluasi,
        status: statusHasil as HasilUjian["status"],
        updated_at: new Date().toISOString(),
      }
    }

    setIsSaving(false)
    toast.success("Hasil ujian berhasil diperbarui.")
    router.push("/guru/hasil-ujian")
  }

  if (!hasil) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Hasil Ujian"
          description="Data hasil ujian tidak ditemukan."
          action={
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  isSiswa ? "/siswa/hasil-ujian" : "/guru/hasil-ujian"
                )
              }
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          }
        />
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground py-12">
            Data hasil ujian dengan ID {id} tidak ditemukan.
          </CardContent>
        </Card>
      </div>
    )
  }

  const persentaseNilai = hasil.nilai !== null ? hasil.nilai : 0
  const backHref = isSiswa ? "/siswa/hasil-ujian" : "/guru/hasil-ujian"

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hasil Ujian"
        description={`Detail hasil: ${hasil.siswa_nama}`}
        action={
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => router.push(backHref)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
            {!isSiswa && (
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Simpan
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Informasi Peserta */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informasi Peserta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                  {hasil.siswa_nama
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold">{hasil.siswa_nama}</p>
                  <p className="text-xs text-muted-foreground">
                    NIS: {hasil.siswa_nis}
                  </p>
                </div>
              </div>
              <div className="divide-y divide-border">
                <InfoRow icon={User} label="Nama Lengkap" value={hasil.siswa_nama} />
                <InfoRow icon={FileText} label="NIS" value={hasil.siswa_nis} />
                <InfoRow icon={GraduationCap} label="Kelas" value={hasil.siswa_kelas} />
              </div>
            </CardContent>
          </Card>

          {/* Informasi Ujian */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informasi Ujian</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                <InfoRow icon={BookOpen} label="Nama Ujian" value={hasil.nama_ujian} />
                <InfoRow icon={BookOpen} label="Mata Pelajaran" value={hasil.mata_pelajaran} />
                <InfoRow icon={User} label="Guru" value={hasil.guru_nama} />
                <InfoRow
                  icon={FileText}
                  label="Jenis Ujian"
                  value={hasil.jenis_ujian}
                />
                <InfoRow
                  icon={Clock}
                  label="Durasi"
                  value={`${hasil.durasi} menit`}
                />
                <InfoRow
                  icon={Calendar}
                  label="Waktu Mulai"
                  value={formatDateTime(hasil.waktu_mulai)}
                />
                <InfoRow
                  icon={Calendar}
                  label="Waktu Selesai"
                  value={formatDateTime(hasil.waktu_selesai)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ringkasan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ringkasan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Nilai Akhir + Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Nilai Akhir
                  </span>
                  <span className="text-2xl font-bold">
                    {hasil.nilai !== null ? hasil.nilai : "-"}
                  </span>
                </div>
                {hasil.nilai !== null && (
                  <>
                    <Progress value={hasil.nilai} className="h-3" />
                    <p className="text-xs text-muted-foreground text-right">
                      {persentaseNilai}% dari 100
                    </p>
                  </>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-green-700 font-medium">
                      Benar
                    </span>
                  </div>
                  <p className="text-xl font-bold text-green-700">
                    {hasil.jumlah_benar}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                  <div className="flex items-center gap-2 mb-1">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-xs text-red-700 font-medium">
                      Salah
                    </span>
                  </div>
                  <p className="text-xl font-bold text-red-700">
                    {hasil.jumlah_salah}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <MinusCircle className="h-4 w-4 text-gray-500" />
                    <span className="text-xs text-gray-600 font-medium">
                      Kosong
                    </span>
                  </div>
                  <p className="text-xl font-bold text-gray-600">
                    {hasil.jumlah_kosong}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <span className="text-xs text-blue-700 font-medium">
                      Total Soal
                    </span>
                  </div>
                  <p className="text-xl font-bold text-blue-700">
                    {hasil.jumlah_soal}
                  </p>
                </div>
              </div>

              {/* Status Kelulusan */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">
                  Status Kelulusan:
                </span>
                <Badge className={STATUS_HASIL_COLORS[hasil.status] ?? ""}>
                  {hasil.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Review Jawaban (hanya jika ada soal_review) */}
          {hasil.soal_review.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Review Jawaban</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" defaultValue="soal-1">
                  {hasil.soal_review.map((soal) => (
                    <AccordionItem key={soal.nomor} value={`soal-${soal.nomor}`}>
                      <AccordionTrigger>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">
                            {soal.nomor}
                          </span>
                          <span className="text-sm font-medium text-left">
                            {soal.pertanyaan.length > 60
                              ? soal.pertanyaan.slice(0, 60) + "..."
                              : soal.pertanyaan}
                          </span>
                          <StatusIcon status={soal.status} />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 pl-10">
                          <p className="text-sm">{soal.pertanyaan}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="p-3 rounded-lg bg-muted/30">
                              <p className="text-xs text-muted-foreground mb-1">
                                Jawaban Peserta
                              </p>
                              <p className="text-sm font-medium">
                                {soal.jawaban_peserta ?? (
                                  <span className="text-muted-foreground italic">
                                    Tidak dijawab
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                              <p className="text-xs text-green-700 mb-1">
                                Jawaban Benar
                              </p>
                              <p className="text-sm font-medium text-green-700">
                                {soal.jawaban_benar}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              Status:
                            </span>
                            <Badge
                              className={
                                soal.status === "Benar"
                                  ? "bg-green-100 text-green-800"
                                  : soal.status === "Salah"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-600"
                              }
                            >
                              {soal.status}
                            </Badge>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}

          {/* Guru: Catatan Evaluasi + Status */}
          {!isSiswa && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Catatan Evaluasi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="catatan">Catatan untuk Siswa</Label>
                  <Textarea
                    id="catatan"
                    value={catatanEvaluasi}
                    onChange={(e) => setCatatanEvaluasi(e.target.value)}
                    placeholder="Tulis catatan evaluasi untuk siswa..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status Hasil</Label>
                  <Select
                    value={statusHasil}
                    onValueChange={(v: string | null) =>
                      setStatusHasil(v ?? hasil.status)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_HASIL_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Siswa: Feedback Guru */}
          {isSiswa && hasil.feedback_guru && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Feedback Guru
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{hasil.feedback_guru}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
