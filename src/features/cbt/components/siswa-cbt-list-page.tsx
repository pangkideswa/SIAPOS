"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Clock, FileText, AlertCircle, Loader2, CheckCircle2, ShieldAlert } from "lucide-react"
import { toast } from "sonner"
import { PaginationControls } from "@/components/ui/pagination-controls"

export function SiswaCBTListPage() {
  const router = useRouter()
  const [mapelFilter, setMapelFilter] = useState<string>("semua")
  const [page, setPage] = useState(1)
  const perPage = 9
  const [exams, setExams] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/student/exams?tipe=CBT")
      .then(res => res.json())
      .then(data => {
        if (data.data || data.success) {
          const sourceData = Array.isArray(data.data) ? data.data : (data.data?.data || [])
          setExams(sourceData)
        }
        setIsLoading(false)
      })
      .catch(err => {
        console.error(err)
        toast.error("Gagal memuat daftar ujian CBT")
        setIsLoading(false)
      })
  }, [])

  const filteredData = exams.filter((item) => {
    const mapel = item.paket_soal?.mata_pelajaran || item.teaching_class?.mata_pelajaran
    return mapelFilter === "semua" || mapel === mapelFilter
  })

  function getExamStudentStatus(cbt: any) {
    const participant = cbt.participant
    if (participant) {
      if (participant.status === "SELESAI") return "Selesai"
      if (participant.status === "CURANG") return "Pelanggaran"
      if (participant.status === "MENGERJAKAN") return "Sedang Dikerjakan"
    }
    const now = new Date()
    const mulai = new Date(cbt.waktu_mulai || cbt.created_at)
    const berakhir = new Date(cbt.waktu_selesai || cbt.created_at)
    if (now < mulai) return "Belum Dimulai"
    if (now > berakhir) return "Telah Berakhir"
    return "Tersedia"
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "Selesai":
        return "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300"
      case "Sedang Dikerjakan":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
      case "Pelanggaran":
        return "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300"
      case "Tersedia":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
      case "Belum Dimulai":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
      case "Telah Berakhir":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-foreground"
    }
  }

  const stats = {
    total: exams.length,
    selesai: exams.filter((c) => c.participant?.status === "SELESAI").length,
    tersedia: exams.filter((c) => getExamStudentStatus(c) === "Tersedia" || getExamStudentStatus(c) === "Sedang Dikerjakan").length,
    belumDimulai: exams.filter((c) => getExamStudentStatus(c) === "Belum Dimulai").length,
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Ujian CBT" description="Daftar ujian berbasis komputer resmi yang tersedia" />

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
            <CardTitle className="text-sm font-medium text-muted-foreground">Tersedia / Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-emerald-500" />
              <span className="text-2xl font-bold">{stats.tersedia}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Telah Selesai</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{stats.selesai}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Belum Dimulai</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold">{stats.belumDimulai}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={mapelFilter === "semua" ? undefined : mapelFilter} onValueChange={(v) => { if (v) setMapelFilter(v) }}>
          <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Mata Pelajaran" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Mata Pelajaran</SelectItem>
            {Array.from(new Set(exams.map(d => d.paket_soal?.mata_pelajaran || d.teaching_class?.mata_pelajaran))).filter(Boolean).map((m) => (
              <SelectItem key={m as string} value={m as string}>{m as string}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm">Memuat daftar ujian CBT...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground gap-2 border rounded-xl bg-card">
            <FileText className="h-8 w-8 text-muted-foreground/60" />
            <p className="text-sm font-medium">Tidak ada ujian CBT untuk kelas Anda saat ini.</p>
          </div>
        ) : filteredData.slice((page - 1) * perPage, page * perPage).map((cbt) => {
          const status = getExamStudentStatus(cbt)
          const mapel = cbt.paket_soal?.mata_pelajaran || cbt.teaching_class?.mata_pelajaran
          const participant = cbt.participant

          return (
            <Card key={cbt.id} className="hover:shadow-md transition-shadow flex flex-col justify-between">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base line-clamp-1">{cbt.judul}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{mapel ?? "—"}</p>
                  </div>
                  <Badge className={`${getStatusBadge(status)} text-xs shrink-0 font-medium`}>{status}</Badge>
                </div>

                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guru Pengampu</span>
                    <span className="font-medium">
                      {cbt.teaching_class?.guru_nama || cbt.teaching_class?.teacher?.nama_lengkap || cbt.paket_soal?.guru?.nama_lengkap || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Durasi</span>
                    <span className="font-medium">{cbt.durasi_menit} menit</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jumlah Soal</span>
                    <span className="font-medium">{cbt.paket_soal?._count?.items ?? 0} butir</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Batas Waktu</span>
                    <span className="font-medium text-right">
                      {cbt.waktu_selesai
                        ? new Date(cbt.waktu_selesai).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Fleksibel"}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  {status === "Selesai" ? (
                    <button
                      onClick={() => router.push(`/siswa/cbt/${cbt.id}/hasil`)}
                      className="w-full px-4 py-2.5 bg-secondary text-secondary-foreground text-xs sm:text-sm font-semibold rounded-lg hover:bg-secondary/80 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      {cbt.tampilkan_nilai
                        ? `Lihat Hasil (Nilai: ${Math.round(participant.nilai_akhir || 0)})`
                        : "Lihat Status Selesai (Hasil Dirahasiakan)"}
                    </button>
                  ) : status === "Sedang Dikerjakan" ? (
                    <button
                      onClick={() => router.push(`/siswa/cbt/${cbt.id}/ujian`)}
                      className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Clock className="h-4 w-4" />
                      Lanjutkan Ujian
                    </button>
                  ) : status === "Pelanggaran" ? (
                    <button
                      disabled
                      className="w-full px-4 py-2.5 bg-destructive/15 text-destructive text-xs sm:text-sm font-semibold rounded-lg cursor-not-allowed flex items-center justify-center gap-1.5"
                    >
                      <ShieldAlert className="h-4 w-4" />
                      Ujian Dibekukan (Pelanggaran)
                    </button>
                  ) : status === "Tersedia" ? (
                    <button
                      onClick={() => router.push(`/siswa/cbt/${cbt.id}/ujian`)}
                      className="w-full px-4 py-2.5 bg-primary text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Mulai CBT
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full px-4 py-2.5 bg-muted text-muted-foreground text-xs sm:text-sm font-medium rounded-lg cursor-not-allowed"
                    >
                      {status === "Belum Dimulai" ? "Menunggu Jadwal" : "Waktu Ujian Berakhir"}
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
        itemName="CBT"
      />
    </div>
  )
}
