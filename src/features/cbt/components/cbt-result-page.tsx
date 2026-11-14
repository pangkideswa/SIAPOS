"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  AlertCircle,
  FileText,
  HelpCircle,
  Sparkles,
} from "lucide-react"
import { formatDateTimeWIB } from "@/lib/date-utils"

interface CBTResultPageProps {
  id: string
}

export function CBTResultPage({ id }: CBTResultPageProps) {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    async function loadResult() {
      try {
        const res = await fetch(`/api/exams/${id}/result`)
        const json = await res.json()
        if (json.success && json.data) {
          setData(json.data)
        } else {
          setErrorMessage(json.error || "Gagal memuat hasil ujian")
        }
      } catch (error) {
        setErrorMessage("Terjadi kesalahan jaringan saat memuat hasil ujian")
      } finally {
        setIsLoading(false)
      }
    }
    loadResult()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-3 text-muted-foreground">
        <Clock className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Memuat Hasil Ujian CBT...</p>
      </div>
    )
  }

  if (!data || !data.exam || !data.participant) {
    return (
      <div className="space-y-6 max-w-xl mx-auto py-12 text-center">
        <div className="p-4 rounded-full bg-destructive/10 w-16 h-16 mx-auto flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold">Hasil Ujian Belum Tersedia</h2>
          <p className="text-sm text-muted-foreground">
            {errorMessage || "Data lembar ujian tidak ditemukan atau Anda belum menyelesaikan ujian ini."}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/siswa/cbt")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Daftar CBT
        </Button>
      </div>
    )
  }

  const { exam, participant } = data
  const canViewScore = exam.can_view_score !== false
  const soalList = exam.paket_soal?.items?.map((i: any) => ({
    ...i.bank_soal,
    bobot: i.bobot,
  })) || []

  const totalNilai = Math.round(participant.nilai_akhir || 0)
  const totalSoal = soalList.length

  let totalBenar = 0
  let totalSalah = 0
  let totalEsai = 0

  soalList.forEach((soal: any) => {
    if (soal.tipe_soal === "ESAI") {
      totalEsai++
    } else {
      const ans = participant.answers.find((a: any) => a.bank_soal_id === soal.id)
      if (ans?.is_correct) totalBenar++
      else totalSalah++
    }
  })

  const hasPendingEssay = data.has_pending_essay ?? (totalEsai > 0 && participant.answers.some((a: any) => {
    const s = soalList.find((so: any) => so.id === a.bank_soal_id)
    return s?.tipe_soal === "ESAI" && (a.nilai === null || a.nilai === undefined)
  }))
  const pendingEssayCount = data.pending_essay_count ?? totalEsai

  const waktuMulai = new Date(participant.waktu_mulai || participant.created_at).getTime()
  const waktuSelesai = participant.waktu_selesai
    ? new Date(participant.waktu_selesai).getTime()
    : new Date(participant.updated_at).getTime()
  const durasiMenit = Math.max(1, Math.round((waktuSelesai - waktuMulai) / 60000))

  const kkm = exam.kkm || 75
  const lulus = totalNilai >= kkm

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Hasil Ujian — ${exam.judul}`}
        description={`${exam.paket_soal?.mata_pelajaran || "Mata Pelajaran"} — ${exam.kelas || "Semua Kelas"}`}
        action={
          <Button variant="outline" size="sm" onClick={() => router.push("/siswa/cbt")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {canViewScore ? (
            <>
              {/* Alert Banner for Pending Essay Grading */}
              {hasPendingEssay && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 shadow-sm">
                  <Clock className="h-5 w-5 shrink-0 mt-0.5 text-amber-600 animate-pulse" />
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-sm text-amber-800 dark:text-amber-300">
                      Nilai Sementara: Menunggu Koreksi Guru
                    </p>
                    <p className="leading-relaxed">
                      Nilai yang ditampilkan saat ini ({totalNilai} poin) baru mencakup butir Pilihan Ganda.
                      Jawaban Anda pada butir Esai / Isian sedang dalam antrean koreksi oleh Guru pengampu.
                      Skor definitif Anda akan bertambah secara otomatis begitu guru selesai melakukan penilaian.
                    </p>
                  </div>
                </div>
              )}

              {/* Score Card */}
              <Card className="overflow-hidden border-primary/20 bg-gradient-to-r from-primary/5 via-background to-background">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 shrink-0">
                      <Award className="h-12 w-12 text-primary" />
                    </div>
                    <div className="text-center sm:text-left space-y-1">
                      <p className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                        {hasPendingEssay ? "Nilai Sementara Ujian" : "Nilai Akhir Definitif"}
                      </p>
                      <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                        <span className="text-5xl font-black text-primary">{totalNilai}</span>
                        <span className="text-sm font-semibold text-muted-foreground">/ 100</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
                        {hasPendingEssay ? (
                          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold border border-amber-300">
                            <Clock className="mr-1 h-3 w-3 inline" />
                            Nilai Sementara (Esai Belum Dikoreksi)
                          </Badge>
                        ) : (
                          <Badge
                            className={
                              lulus
                                ? "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300 font-bold"
                                : "bg-destructive/15 text-destructive font-bold"
                            }
                          >
                            {lulus ? `Lulus (KKM ${kkm})` : `Belum Lulus (KKM ${kkm})`}
                          </Badge>
                        )}
                        {totalEsai > 0 && (
                          <Badge variant="outline" className="text-xs">
                            Termasuk {totalEsai} Butir Esai
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-green-600">{totalBenar}</p>
                    <p className="text-xs text-muted-foreground font-medium">PG Benar</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <XCircle className="h-5 w-5 text-red-500 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-red-600">{totalSalah}</p>
                    <p className="text-xs text-muted-foreground font-medium">PG Salah</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-blue-600">{durasiMenit} mnt</p>
                    <p className="text-xs text-muted-foreground font-medium">Durasi</p>
                  </CardContent>
                </Card>
              </div>

              {/* Teacher Notes / Feedback Card */}
              {participant.catatan_guru && (
                <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 dark:border-purple-800/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-purple-900 dark:text-purple-300">
                      <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      Catatan & Evaluasi Guru
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-purple-950 dark:text-purple-200 leading-relaxed whitespace-pre-wrap">
                      {participant.catatan_guru}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Question Breakdown and Explanations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Rincian Soal & Pembahasan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {soalList.map((soal: any, index: number) => {
                    const answer = participant.answers.find((a: any) => a.bank_soal_id === soal.id)
                    const isEssay = soal.tipe_soal === "ESAI"
                    const isCorrect = answer?.is_correct
                    const correctOption = soal.options?.find((o: any) => o.is_correct)
                    const selectedOption = soal.options?.find((o: any) => o.id === answer?.selected_option_id)

                    return (
                      <div
                        key={soal.id}
                        className={`p-4 rounded-xl border transition-colors ${
                          isEssay
                            ? "bg-muted/20 border-border"
                            : isCorrect
                            ? "bg-green-50/50 border-green-200 dark:bg-green-950/15 dark:border-green-800/40"
                            : "bg-red-50/50 border-red-200 dark:bg-red-950/15 dark:border-red-800/40"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs shrink-0 ${
                              isEssay
                                ? "bg-primary text-white"
                                : isCorrect
                                ? "bg-green-600 text-white"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            {index + 1}
                          </span>
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <Badge variant="outline" className="text-[10px] font-semibold">
                                {isEssay ? "Soal Esai" : "Pilihan Ganda"} • Bobot: {soal.bobot || 10}
                              </Badge>
                              {!isEssay && (
                                <Badge
                                  className={
                                    isCorrect
                                      ? "bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300 text-xs"
                                      : "bg-destructive/15 text-destructive text-xs"
                                  }
                                >
                                  {isCorrect ? "Benar" : "Salah"}
                                </Badge>
                              )}
                              {isEssay && (
                                answer?.nilai !== null && answer?.nilai !== undefined ? (
                                  <Badge className="bg-primary/10 text-primary text-xs font-bold">
                                    Nilai: {answer.nilai} / {soal.bobot || 10}
                                  </Badge>
                                ) : (
                                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-bold border border-amber-300">
                                    <Clock className="mr-1 h-3 w-3 inline" />
                                    Menunggu Koreksi Guru
                                  </Badge>
                                )
                              )}
                            </div>

                            <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                              {soal.pertanyaan}
                            </p>

                            {/* Multiple Choice Review */}
                            {!isEssay && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                                <div className="p-2.5 rounded-lg border bg-background space-y-0.5">
                                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                                    Jawaban Anda:
                                  </span>
                                  <span
                                    className={`font-semibold ${
                                      isCorrect ? "text-green-600 dark:text-green-400" : "text-destructive"
                                    }`}
                                  >
                                    {selectedOption?.teks || <span className="italic">Tidak dijawab</span>}
                                  </span>
                                </div>
                                <div className="p-2.5 rounded-lg border bg-green-500/10 border-green-500/30 text-green-950 dark:text-green-200 space-y-0.5">
                                  <span className="text-[10px] uppercase font-bold text-green-800 dark:text-green-300 block">
                                    Kunci Jawaban:
                                  </span>
                                  <span className="font-bold text-green-700 dark:text-green-300">
                                    {correctOption?.teks || "—"}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Essay Review */}
                            {isEssay && (
                              <div className="space-y-2 pt-1 text-xs">
                                <div className="p-3 rounded-lg border bg-background space-y-1">
                                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                                    Jawaban Anda:
                                  </span>
                                  <p className="text-sm text-foreground whitespace-pre-wrap">
                                    {answer?.jawaban_esai || (
                                      <span className="italic text-muted-foreground">Tidak dijawab</span>
                                    )}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Discussion / Rubric */}
                            {soal.pembahasan && (
                              <div className="p-3 rounded-lg bg-muted/40 border text-xs text-muted-foreground space-y-1">
                                <span className="font-bold text-foreground block">Pembahasan / Rubrik:</span>
                                <p className="leading-relaxed">{soal.pembahasan}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </>
          ) : (
            /* Confidential Result Banner */
            <Card className="border-amber-500/20 bg-amber-500/5 text-center p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto text-amber-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-xl font-bold text-foreground">Ujian Berhasil Dikumpulkan!</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Seluruh jawaban Anda telah tersimpan dengan aman di server. Hasil nilai dan pembahasan ujian ini
                  saat ini sedang dirahasiakan oleh guru pengawas hingga periode ujian resmi berakhir.
                </p>
              </div>
              <div className="pt-2">
                <Badge variant="outline" className="border-amber-500/30 text-amber-700 dark:text-amber-400 font-semibold">
                  Status: Selesai Mengerjakan ({durasiMenit} Menit)
                </Badge>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-primary" />
                Informasi Ujian
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground block">Judul Ujian</span>
                <span className="font-semibold text-sm">{exam.judul}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Mata Pelajaran</span>
                <span className="font-medium">{exam.paket_soal?.mata_pelajaran || "—"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Kelas Target</span>
                <span className="font-medium">{exam.kelas || "Semua Kelas"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Total Soal</span>
                <span className="font-medium">{totalSoal} Soal</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Alokasi Durasi</span>
                <span className="font-medium">{exam.durasi_menit || 60} Menit</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Nilai Minimum (KKM)</span>
                <span className="font-bold text-primary">{kkm}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Waktu Mulai Pengerjaan</span>
                <span className="font-medium">
                  {formatDateTimeWIB(participant.waktu_mulai || participant.created_at)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Waktu Submit</span>
                <span className="font-medium">
                  {formatDateTimeWIB(participant.waktu_selesai || participant.updated_at)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full" onClick={() => router.push("/siswa/cbt")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Ujian
          </Button>
        </div>
      </div>
    </div>
  )
}
