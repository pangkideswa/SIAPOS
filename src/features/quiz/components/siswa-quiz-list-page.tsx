"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Clock, FileText, AlertCircle } from "lucide-react"
import {
  MATA_PELAJARAN_OPTIONS,
} from "../constants/quiz.constants"
import { DUMMY_QUIZ } from "../dummy/quiz.data"
import { DUMMY_PAKET_SOAL } from "@/features/paket-soal/dummy/paket-soal.data"
import type { Quiz } from "../types/quiz"

export function SiswaQuizListPage() {
  const router = useRouter()
  const [mapelFilter, setMapelFilter] = useState<string>("semua")

  const publishedQuizzes = DUMMY_QUIZ.filter((q) => q.status === "Publish")

  const filteredData = publishedQuizzes.filter((item) => {
    const paket = DUMMY_PAKET_SOAL.find((p) => p.id === item.paket_soal_id)
    const matchesMapel = mapelFilter === "semua" || paket?.mata_pelajaran === mapelFilter
    return matchesMapel
  })

  function getPaketSoal(id: number) {
    return DUMMY_PAKET_SOAL.find((p) => p.id === id) ?? null
  }

  function getQuizStatus(quiz: Quiz) {
    const now = new Date()
    const mulai = new Date(quiz.tanggal_mulai)
    const berakhir = new Date(quiz.tanggal_berakhir)
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
    total: publishedQuizzes.length,
    berlangsung: publishedQuizzes.filter((q) => getQuizStatus(q) === "Berlangsung").length,
    belumDimulai: publishedQuizzes.filter((q) => getQuizStatus(q) === "Belum Dimulai").length,
    telahBerakhir: publishedQuizzes.filter((q) => getQuizStatus(q) === "Telah Berakhir").length,
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
        {filteredData.map((quiz) => {
          const paket = getPaketSoal(quiz.paket_soal_id)
          const status = getQuizStatus(quiz)
          return (
            <Card key={quiz.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-base">{quiz.judul}</h3>
                    <p className="text-sm text-muted-foreground">{paket?.mata_pelajaran ?? "—"}</p>
                  </div>
                  <Badge className={getStatusBadge(status)}>{status}</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guru</span>
                    <span className="font-medium">{paket?.guru_nama ?? "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Durasi</span>
                    <span className="font-medium">{quiz.durasi} menit</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Soal</span>
                    <span className="font-medium">{paket?.soal_ids.length ?? 0} soal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deadline</span>
                    <span className="font-medium">
                      {new Date(quiz.tanggal_berakhir).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
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
