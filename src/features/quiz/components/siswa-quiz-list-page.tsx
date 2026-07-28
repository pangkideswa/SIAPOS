"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable, type Column } from "@/components/ui/data-table"
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
  const [mapelFilter, setMapelFilter] = useState<string>("all")

  const publishedQuizzes = DUMMY_QUIZ.filter((q) => q.status === "Publish")

  const filteredData = publishedQuizzes.filter((item) => {
    const paket = DUMMY_PAKET_SOAL.find((p) => p.id === item.paket_soal_id)
    const matchesMapel = mapelFilter === "all" || paket?.mata_pelajaran === mapelFilter
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
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "judul",
      header: "Judul",
      render: (item) => (
        <div>
          <p className="font-medium">{String(item.judul)}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">{String(item.deskripsi)}</p>
        </div>
      ),
    },
    {
      key: "mapel",
      header: "Mata Pelajaran",
      render: (item) => {
        const paket = getPaketSoal(item.paket_soal_id as number)
        return paket?.mata_pelajaran ?? "—"
      },
    },
    {
      key: "guru",
      header: "Guru",
      render: (item) => {
        const paket = getPaketSoal(item.paket_soal_id as number)
        return paket?.guru_nama ?? "—"
      },
    },
    {
      key: "soal",
      header: "Soal",
      render: (item) => {
        const paket = getPaketSoal(item.paket_soal_id as number)
        return <span>{paket?.soal_ids.length ?? 0} soal</span>
      },
    },
    {
      key: "durasi",
      header: "Durasi",
      render: (item) => <span>{String(item.durasi)} mnt</span>,
    },
    {
      key: "deadline",
      header: "Deadline",
      render: (item) => {
        const tanggal = String(item.tanggal_berakhir)
        return (
          <span className="text-xs">
            {new Date(tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </span>
        )
      },
    },
    {
      key: "status_waktu",
      header: "Status",
      render: (item) => {
        const status = getQuizStatus(item as unknown as Quiz)
        return <Badge className={getStatusBadge(status)}>{status}</Badge>
      },
    },
    {
      key: "aksi",
      header: "",
      className: "w-[100px]",
      render: (item) => {
        const status = getQuizStatus(item as unknown as Quiz)
        return (
          <div onClick={(e) => e.stopPropagation()}>
            {status === "Berlangsung" ? (
              <button
                onClick={() => router.push(`/siswa/quiz/${item.id}/kerjakan`)}
                className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Kerjakan
              </button>
            ) : (
              <button
                disabled
                className="px-3 py-1.5 bg-muted text-muted-foreground text-xs font-medium rounded-lg cursor-not-allowed"
              >
                {status === "Belum Dimulai" ? "Menunggu" : "Selesai"}
              </button>
            )}
          </div>
        )
      },
    },
  ]

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
        <Select value={mapelFilter} onValueChange={(v) => { if (v) setMapelFilter(v) }}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Semua Mata Pelajaran" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Mata Pelajaran</SelectItem>
            {MATA_PELAJARAN_OPTIONS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={filteredData as unknown as Record<string, unknown>[]}
        columns={columns}
        emptyMessage="Tidak ada quiz tersedia"
        onRowClick={(row) => {
          const status = getQuizStatus(row as unknown as Quiz)
          if (status === "Berlangsung") {
            router.push(`/siswa/quiz/${(row as unknown as Quiz).id}/kerjakan`)
          }
        }}
      />
    </div>
  )
}
