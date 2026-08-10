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
import { MATA_PELAJARAN_OPTIONS } from "../constants/cbt.constants"
import { DUMMY_CBT } from "../dummy/cbt.data"
import { DUMMY_PAKET_SOAL } from "@/features/paket-soal/dummy/paket-soal.data"
import type { CBTExam } from "../types/cbt"

export function SiswaCBTListPage() {
  const router = useRouter()
  const [mapelFilter, setMapelFilter] = useState<string>("semua")

  const publishedExams = DUMMY_CBT.filter((c) => c.status === "Publish")

  const filteredData = publishedExams.filter((item) => {
    const paket = DUMMY_PAKET_SOAL.find((p) => p.id === item.paket_soal_id)
    const matchesMapel = mapelFilter === "semua" || paket?.mata_pelajaran === mapelFilter
    return matchesMapel
  })

  function getPaketSoal(id: number) {
    return DUMMY_PAKET_SOAL.find((p) => p.id === id) ?? null
  }

  function getExamStatus(exam: CBTExam) {
    const now = new Date()
    const mulai = new Date(exam.tanggal_mulai)
    const berakhir = new Date(exam.tanggal_berakhir)
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

  const stats = {
    total: publishedExams.length,
    berlangsung: publishedExams.filter((c) => getExamStatus(c) === "Berlangsung").length,
    belumDimulai: publishedExams.filter((c) => getExamStatus(c) === "Belum Dimulai").length,
    telahBerakhir: publishedExams.filter((c) => getExamStatus(c) === "Telah Berakhir").length,
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Ujian CBT" description="Daftar ujian berbasis komputer yang tersedia" />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Ujian</CardTitle>
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
        <Select value={mapelFilter} onValueChange={(v) => { if (v) setMapelFilter(v) }}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Semua Mata Pelajaran" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Mata Pelajaran</SelectItem>
            {MATA_PELAJARAN_OPTIONS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredData.map((exam) => {
          const paket = getPaketSoal(exam.paket_soal_id)
          const status = getExamStatus(exam)
          return (
            <Card key={exam.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-base">{exam.nama_ujian}</h3>
                    <p className="text-sm text-muted-foreground">{paket?.mata_pelajaran ?? "—"}</p>
                  </div>
                  <Badge className={getStatusBadge(status)}>{status}</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kelas</span>
                    <span className="font-medium">{exam.kelas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Durasi</span>
                    <span className="font-medium">{exam.durasi} menit</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Soal</span>
                    <span className="font-medium">{paket?.soal_ids.length ?? 0} soal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deadline</span>
                    <span className="font-medium">
                      {new Date(exam.tanggal_berakhir).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>
                <div className="pt-2">
                  {status === "Berlangsung" ? (
                    <button
                      onClick={() => router.push(`/siswa/cbt/${exam.id}/ujian`)}
                      className="w-full px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Mulai Ujian
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
