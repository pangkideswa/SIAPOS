"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/ui/data-table"
import { ArrowLeft, Clock, Users, Calendar } from "lucide-react"

interface QuizDetailPageProps {
  id: string
}

export function QuizDetailPage({ id }: QuizDetailPageProps) {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/exams/${id}/participants`)
        const json = await res.json()
        if (json.success) {
          setData(json.data)
        }
      } catch (error) {
        console.error("Gagal memuat detail Quiz")
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [id])

  if (isLoading) {
    return <div className="flex justify-center items-center h-[60vh]">Memuat Detail Quiz...</div>
  }

  if (!data || !data.exam) {
    return (
      <div className="space-y-6">
        <PageHeader title="Detail Quiz" description="Quiz tidak ditemukan" />
        <Button variant="outline" onClick={() => router.push("/guru/quiz")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Quiz
        </Button>
      </div>
    )
  }

  const { exam, participants } = data
  
  const selesaiCount = participants.filter((r: any) => r.status === "SELESAI").length
  const rataNilai = participants.filter((r: any) => r.nilai_akhir !== null).reduce((acc: number, r: any, _: number, arr: any[]) => acc + (r.nilai_akhir ?? 0) / arr.length, 0)

  const participantColumns: Column<Record<string, unknown>>[] = [
    {
      key: "siswa_nama",
      header: "Nama Siswa",
      render: (item: any) => {
        const studentName = item.student?.user?.name || "Unknown"
        const studentClass = item.student?.kelas || "—"
        const initials = String(studentName).split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
        return (
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-xs shrink-0">
              {initials}
            </div>
            <div>
              <p className="font-medium">{studentName}</p>
              <p className="text-xs text-muted-foreground">{studentClass}</p>
            </div>
          </div>
        )
      },
    },
    {
      key: "nilai",
      header: "Nilai",
      render: (item: any) => item.nilai_akhir !== null ? <span className="font-bold">{Math.round(Number(item.nilai_akhir))}</span> : <span className="text-muted-foreground">—</span>,
    },
    {
      key: "benar",
      header: "Benar",
      render: (item: any) => {
        const benar = item.answers?.filter((a: any) => a.is_correct).length || 0
        return <span className="text-green-600 font-medium">{benar}</span>
      },
    },
    {
      key: "salah",
      header: "Salah",
      render: (item: any) => {
        const salah = item.answers?.filter((a: any) => !a.is_correct && a.selected_option_id).length || 0
        return <span className="text-red-600 font-medium">{salah}</span>
      },
    },
    {
      key: "waktu",
      header: "Waktu",
      render: (item: any) => {
        if (!item.waktu_mulai) return <span>—</span>
        const start = new Date(item.waktu_mulai).getTime()
        const end = new Date(item.updated_at).getTime()
        const mins = Math.max(1, Math.round((end - start) / 60000))
        return <span>{mins} mnt</span>
      },
    },
    {
      key: "status",
      header: "Status",
      render: (item: any) => {
        const statusMap: any = {
           "BELUM_MULAI": { label: "Belum Mulai", color: "bg-gray-100 text-gray-800" },
           "MENGERJAKAN": { label: "Mengerjakan", color: "bg-blue-100 text-blue-800" },
           "SELESAI": { label: "Selesai", color: "bg-green-100 text-green-800" },
           "PELANGGARAN": { label: "Pelanggaran", color: "bg-red-100 text-red-800" }
        }
        const s = statusMap[item.status] || statusMap["BELUM_MULAI"]
        return <Badge className={s.color}>{s.label}</Badge>
      },
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={exam.judul}
        description={`${exam.kelas || "Semua Kelas"}`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/guru/quiz")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deskripsi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed whitespace-pre-wrap">{exam.deskripsi || "Tidak ada deskripsi"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daftar Peserta ({participants.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={participants as unknown as Record<string, unknown>[]}
                columns={participantColumns}
                emptyMessage="Tidak ada peserta"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Quiz</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Paket Soal</p>
                <p className="text-sm font-medium">{exam.paket_soal?.judul ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Kelas</p>
                <p className="text-sm font-medium">{exam.kelas || "—"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Durasi</p>
                  <p className="text-sm font-medium">{exam.durasi_menit || 60} menit</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Periode</p>
                  <p className="text-sm font-medium">
                    {exam.waktu_mulai ? new Date(exam.waktu_mulai).toLocaleDateString("id-ID") : "—"} — {exam.waktu_selesai ? new Date(exam.waktu_selesai).toLocaleDateString("id-ID") : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Peserta</p>
                  <p className="text-sm font-medium">{selesaiCount}/{participants.length} selesai</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Nilai Minimum Lulus</p>
                <p className="text-sm font-medium">{exam.kkm || 75}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rata-rata Nilai</p>
                <p className="text-sm font-bold">{rataNilai > 0 ? rataNilai.toFixed(1) : "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge className={exam.status === "PUBLISH" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>{exam.status}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pengaturan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Acak Soal</span>
                <Badge className={exam.acak_urutan_soal ? "bg-green-100 text-green-800" : "bg-muted text-foreground"}>
                  {exam.acak_urutan_soal ? "Ya" : "Tidak"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Acak Jawaban</span>
                <Badge className={exam.acak_urutan_jawaban ? "bg-green-100 text-green-800" : "bg-muted text-foreground"}>
                  {exam.acak_urutan_jawaban ? "Ya" : "Tidak"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tampilkan Nilai</span>
                <Badge className={exam.tampilkan_nilai ? "bg-green-100 text-green-800" : "bg-muted text-foreground"}>
                  {exam.tampilkan_nilai ? "Ya" : "Tidak"}
                </Badge>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
