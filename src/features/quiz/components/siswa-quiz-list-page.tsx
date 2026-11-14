"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Clock, FileText, Loader2, Sparkles, CheckCircle2, AlertCircle } from "lucide-react"
import { PaginationControls } from "@/components/ui/pagination-controls"
import { formatDateTimeWIB } from "@/lib/date-utils"

interface StudentQuizItem {
  id: number
  judul: string
  deskripsi?: string
  durasi_menit: number
  waktu_mulai?: string | null
  waktu_selesai?: string | null
  created_at?: string
  paket_soal?: {
    judul?: string
    mata_pelajaran?: string
    _count?: { items: number }
  } | null
  teaching_class?: {
    mata_pelajaran?: string
    guru_nama?: string
  } | null
  participant?: {
    id: number
    status: string
    nilai_akhir?: number | null
  } | null
}

export function SiswaQuizListPage() {
  const router = useRouter()
  const [mapelFilter, setMapelFilter] = useState<string>("semua")
  const [page, setPage] = useState(1)
  const perPage = 9
  const [quizzes, setQuizzes] = useState<StudentQuizItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/student/exams?tipe=QUIZ")
      .then(res => res.json())
      .then(data => {
        if (data.data || data.success) {
          const sourceData = Array.isArray(data.data) ? data.data : (data.data?.data || [])
          setQuizzes(sourceData)
        }
        setIsLoading(false)
      })
      .catch(err => {
        console.error(err)
        setIsLoading(false)
      })
  }, [])

  const filteredData = quizzes.filter((item) => {
    const mapel = item.paket_soal?.mata_pelajaran || item.teaching_class?.mata_pelajaran
    return mapelFilter === "semua" || mapel === mapelFilter
  })

  function getQuizStatus(quiz: StudentQuizItem) {
    const participant = quiz.participant
    if (participant) {
      if (participant.status === "SELESAI") return "Selesai"
      if (participant.status === "MENGERJAKAN") return "Sedang Dikerjakan"
    }
    const now = new Date()
    const mulai = quiz.waktu_mulai ? new Date(quiz.waktu_mulai) : null
    const berakhir = quiz.waktu_selesai ? new Date(quiz.waktu_selesai) : null
    if (mulai && now < mulai) return "Belum Dimulai"
    if (berakhir && now > berakhir) return "Telah Berakhir"
    return "Berlangsung"
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "Berlangsung": return "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300"
      case "Sedang Dikerjakan": return "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
      case "Selesai": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
      case "Belum Dimulai": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300"
      case "Telah Berakhir": return "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300"
      default: return "bg-muted text-foreground"
    }
  }

  // Table columns removed in favor of Card layout

  const stats = {
    total: quizzes.length,
    berlangsung: quizzes.filter((q) => getQuizStatus(q) === "Berlangsung").length,
    belumDimulai: quizzes.filter((q) => getQuizStatus(q) === "Belum Dimulai").length,
    telahBerakhir: quizzes.filter((q) => getQuizStatus(q) === "Telah Berakhir").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5 text-purple-500" />
              Ujian Harian & Tes Kemampuan
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Quiz & Asesmen Harian
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Uji pemahaman materi dan asah kompetensi belajar Anda melalui latihan mandiri berkala.
          </p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Berlangsung</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{stats.berlangsung}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Belum Dimulai</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <span className="text-2xl font-bold">{stats.belumDimulai}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Telah Berakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-red-500" />
              <span className="text-2xl font-bold">{stats.telahBerakhir}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={mapelFilter === "semua" ? undefined : mapelFilter} onValueChange={(v) => { if (v) setMapelFilter(v) }}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Mata Pelajaran" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Mata Pelajaran</SelectItem>
            {Array.from(new Set(quizzes.map(d => d.paket_soal?.mata_pelajaran || d.teaching_class?.mata_pelajaran))).filter(Boolean).map((m) => (
              <SelectItem key={m as string} value={m as string}>{m as string}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredData.length === 0 ? (
          <div className="col-span-full flex justify-center py-10 text-muted-foreground">
            Tidak ada quiz tersedia
          </div>
        ) : filteredData.slice((page - 1) * perPage, page * perPage).map((quiz) => {
          const status = getQuizStatus(quiz)
          const mapel = quiz.paket_soal?.mata_pelajaran || quiz.teaching_class?.mata_pelajaran
          return (
            <Card key={quiz.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-base">{quiz.judul}</h3>
                    <p className="text-sm text-muted-foreground">{mapel ?? "—"}</p>
                  </div>
                  <Badge className={getStatusBadge(status)}>{status}</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guru</span>
                    <span className="font-medium">{quiz.teaching_class?.guru_nama ?? "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Durasi</span>
                    <span className="font-medium">{quiz.durasi_menit} menit</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Soal</span>
                    <span className="font-medium">{quiz.paket_soal?._count?.items ?? 0} soal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deadline</span>
                    <span className="font-medium text-right">
                      {quiz.waktu_selesai ? formatDateTimeWIB(quiz.waktu_selesai) : "Fleksibel"}
                    </span>
                  </div>
                </div>
                <div className="pt-2">
                  {status === "Berlangsung" || status === "Sedang Dikerjakan" ? (
                    <button
                      onClick={() => router.push(`/siswa/quiz/${quiz.id}/kerjakan`)}
                      className="w-full px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                    >
                      {status === "Sedang Dikerjakan" ? "Lanjutkan Quiz" : "Mulai Quiz"}
                    </button>
                  ) : status === "Selesai" ? (
                    <button
                      onClick={() => router.push(`/siswa/quiz/${quiz.id}/hasil`)}
                      className="w-full px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg hover:bg-secondary/80 transition-colors flex items-center justify-center gap-1.5 font-semibold"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Lihat Hasil ({Math.round(quiz.participant?.nilai_akhir ?? 0)})
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full px-4 py-2 bg-muted text-muted-foreground text-sm font-medium rounded-lg cursor-not-allowed font-medium"
                    >
                      {status === "Belum Dimulai" ? "Menunggu Jadwal" : "Telah Berakhir"}
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <PaginationControls
        page={page}
        total={filteredData.length}
        perPage={perPage}
        onPageChange={setPage}
        itemName="quiz"
      />
    </div>
  )
}
