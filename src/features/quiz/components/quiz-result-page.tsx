"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2, XCircle, Clock, Award } from "lucide-react"

interface QuizResultPageProps {
  id: string
}

export function QuizResultPage({ id }: QuizResultPageProps) {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadResult() {
      try {
        const res = await fetch(`/api/exams/${id}/result`)
        const json = await res.json()
        if (json.success) {
          setData(json.data)
        }
      } catch (error) {
        console.error("Gagal memuat hasil quiz")
      } finally {
        setIsLoading(false)
      }
    }
    loadResult()
  }, [id])

  if (isLoading) {
    return <div className="flex justify-center items-center h-[60vh]">Memuat Hasil Quiz...</div>
  }

  if (!data || !data.exam || !data.participant) {
    return (
      <div className="space-y-6">
        <PageHeader title="Hasil Quiz" description="Quiz tidak ditemukan" />
        <Button variant="outline" onClick={() => router.push("/siswa/quiz")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
      </div>
    )
  }

  const { exam, participant } = data
  const soalList = exam.paket_soal?.items?.map((i: any) => i.bank_soal) || []
  
  const totalNilai = Math.round(participant.nilai_akhir || 0)
  const totalSoal = soalList.length
  
  let totalBenar = 0
  let totalSalah = 0
  
  participant.answers.forEach((ans: any) => {
    if (ans.is_correct) totalBenar++
    else if (ans.selected_option_id) totalSalah++
  })
  
  const waktuMulai = new Date(participant.waktu_mulai || participant.created_at).getTime()
  const waktuSelesai = new Date(participant.updated_at).getTime()
  const durasiMenit = Math.max(1, Math.round((waktuSelesai - waktuMulai) / 60000))
  
  const kkm = exam.kkm || 75
  const lulus = totalNilai >= kkm

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Hasil — ${exam.judul}`}
        description={`${exam.paket_soal?.mata_pelajaran || "Mapel"} — ${exam.kelas || "Semua Kelas"}`}
        action={
          <Button variant="outline" size="sm" onClick={() => router.push("/siswa/quiz")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary/10">
                  <Award className="h-12 w-12 text-primary" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-sm text-muted-foreground">Nilai Anda</p>
                  <p className="text-5xl font-bold text-primary">{totalNilai}</p>
                  <Badge className={lulus ? "bg-green-100 text-green-800 mt-2" : "bg-red-100 text-red-800 mt-2"}>
                    {lulus ? "Lulus" : "Tidak Lulus"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{totalBenar}</p>
                <p className="text-xs text-muted-foreground">Benar</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600">{totalSalah}</p>
                <p className="text-xs text-muted-foreground">Salah</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{durasiMenit} mnt</p>
                <p className="text-xs text-muted-foreground">Waktu</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pembahasan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {soalList.map((soal: any, index: number) => {
                const answer = participant.answers.find((a: any) => a.bank_soal_id === soal.id)
                const isCorrect = answer?.is_correct
                const correctOption = soal.options?.find((o: any) => o.is_correct)
                const selectedOption = soal.options?.find((o: any) => o.id === answer?.selected_option_id)
                
                return (
                  <div key={soal.id} className={`p-4 rounded-lg border ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                    <div className="flex items-start gap-3">
                      <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm shrink-0 ${isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                        {index + 1}
                      </span>
                      <div className="flex-1 space-y-2">
                        <p className="text-sm font-medium">{soal.pertanyaan}</p>
                        {soal.tipe_soal === "PILIHAN_GANDA" && (
                          <div className="space-y-1 mt-2 text-sm">
                            <p className="text-muted-foreground">Jawaban Anda: <span className="font-semibold text-foreground">{selectedOption?.teks || "(Kosong)"}</span></p>
                            <p className="text-muted-foreground">Kunci Jawaban: <span className="font-semibold text-foreground">{correctOption?.teks || "(Tidak ada)"}</span></p>
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {isCorrect ? "Benar" : "Salah"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Info Quiz</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Quiz</p>
                <p className="text-sm font-medium">{exam.judul}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Mata Pelajaran</p>
                <p className="text-sm font-medium">{exam.paket_soal?.mata_pelajaran || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Kelas</p>
                <p className="text-sm font-medium">{exam.kelas || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Jumlah Soal</p>
                <p className="text-sm font-medium">{totalSoal} soal</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Durasi</p>
                <p className="text-sm font-medium">{exam.durasi_menit || 60} menit</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Nilai Minimum Lulus</p>
                <p className="text-sm font-medium">{kkm}</p>
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full" onClick={() => router.push("/siswa/quiz")}>
            Kembali ke Daftar Quiz
          </Button>
        </div>
      </div>
    </div>
  )
}
