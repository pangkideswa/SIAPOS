"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Clock, FileText, AlertCircle, Loader2 } from "lucide-react"
import {
  MATA_PELAJARAN_OPTIONS,
} from "../constants/quiz.constants"

export function SiswaQuizListPage() {
  const router = useRouter()
  const [mapelFilter, setMapelFilter] = useState<string>("semua")
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/student/exams?tipe=QUIZ")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setQuizzes(data.data)
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

  function getQuizStatus(quiz: any) {
    const now = new Date()
    const mulai = new Date(quiz.waktu_mulai || quiz.created_at)
    const berakhir = new Date(quiz.waktu_selesai || quiz.created_at)
    if (now < mulai) return "Belum Dimulai"
    if (now > berakhir) return "Telah Berakhir"
    return "Berlangsung"
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "Berlangsung": return "bg-green-100 text-green-800"
      case "Belum Dimulai": return "bg-yellow-100 text-yellow-800"
      case "Telah Berakhir": return "bg-red-100 text-red-800"
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
      <PageHeader title="Quiz" description="Daftar quiz yang tersedia untuk Anda" />

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
            {MATA_PELAJARAN_OPTIONS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
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
        ) : filteredData.map((quiz) => {
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
                    <span className="font-medium">
                      {quiz.waktu_selesai ? new Date(quiz.waktu_selesai).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-"}
                    </span>
                  </div>
                </div>
                <div className="pt-2">
                  {status === "Berlangsung" ? (
                    <button
                      onClick={() => router.push(`/siswa/quiz/${quiz.id}/kerjakan`)}
                      className="w-full px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Mulai Quiz
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full px-4 py-2 bg-muted text-muted-foreground text-sm font-medium rounded-lg cursor-not-allowed"
                    >
                      {status === "Belum Dimulai" ? "Menunggu" : "Selesai"}
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
