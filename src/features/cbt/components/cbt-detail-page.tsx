"use client"

import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/ui/data-table"
import { ArrowLeft, Clock, Users, Calendar } from "lucide-react"
import {
  STATUS_CBT_COLORS, STATUS_PARTISIPAN_CBT_COLORS,
} from "../constants/cbt.constants"
import { DUMMY_CBT, DUMMY_CBT_RESULT } from "../dummy/cbt.data"
import { DUMMY_PAKET_SOAL } from "@/features/paket-soal/dummy/paket-soal.data"

interface CBTDetailPageProps {
  id: string
}

export function CBTDetailPage({ id }: CBTDetailPageProps) {
  const router = useRouter()
  const cbt = DUMMY_CBT.find((c) => c.id === Number(id))

  if (!cbt) {
    return (
      <div className="space-y-6">
        <PageHeader title="Detail CBT" description="Ujian CBT tidak ditemukan" />
        <Button variant="outline" onClick={() => router.push("/guru/cbt")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke CBT
        </Button>
      </div>
    )
  }

  const paket = DUMMY_PAKET_SOAL.find((p) => p.id === cbt.paket_soal_id)
  const results = DUMMY_CBT_RESULT.filter((r) => r.cbt_id === cbt.id)
  const selesaiCount = results.filter((r) => r.status === "Selesai").length
  const rataNilai = results.filter((r) => r.nilai !== null).reduce((acc, r, _, arr) => acc + (r.nilai ?? 0) / arr.length, 0)

  const participantColumns: Column<Record<string, unknown>>[] = [
    {
      key: "siswa_nama",
      header: "Nama Siswa",
      render: (item) => {
        const initials = String(item.siswa_nama).split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
        return (
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-xs shrink-0">
              {initials}
            </div>
            <div>
              <p className="font-medium">{String(item.siswa_nama)}</p>
              <p className="text-xs text-muted-foreground">{String(item.siswa_kelas)}</p>
            </div>
          </div>
        )
      },
    },
    {
      key: "nilai",
      header: "Nilai",
      render: (item) => item.nilai !== null ? <span className="font-bold">{String(item.nilai)}</span> : <span className="text-muted-foreground">—</span>,
    },
    {
      key: "benar",
      header: "Benar",
      render: (item) => <span className="text-green-600 font-medium">{String(item.benar)}</span>,
    },
    {
      key: "salah",
      header: "Salah",
      render: (item) => <span className="text-red-600 font-medium">{String(item.salah)}</span>,
    },
    {
      key: "waktu",
      header: "Waktu",
      render: (item) => <span>{String(item.waktu_pengerjaan)} mnt</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <Badge className={STATUS_PARTISIPAN_CBT_COLORS[String(item.status)]}>{String(item.status)}</Badge>,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={cbt.nama_ujian}
        description={`${paket?.mata_pelajaran ?? "—"} — ${cbt.kelas}`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/guru/cbt")}>
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
              <p className="text-base leading-relaxed whitespace-pre-wrap">{cbt.deskripsi || "Tidak ada deskripsi"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daftar Peserta ({results.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={results as unknown as Record<string, unknown>[]}
                columns={participantColumns}
                emptyMessage="Tidak ada peserta"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informasi CBT</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Paket Soal</p>
                <p className="text-sm font-medium">{paket?.nama_paket ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Kelas</p>
                <p className="text-sm font-medium">{cbt.kelas}</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Durasi</p>
                  <p className="text-sm font-medium">{cbt.durasi} menit</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Periode</p>
                  <p className="text-sm font-medium">
                    {new Date(cbt.tanggal_mulai).toLocaleDateString("id-ID")} — {new Date(cbt.tanggal_berakhir).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Peserta</p>
                  <p className="text-sm font-medium">{selesaiCount}/{results.length} selesai</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Nilai Minimum Lulus</p>
                <p className="text-sm font-medium">{cbt.nilai_minimum_lulus}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rata-rata Nilai</p>
                <p className="text-sm font-bold">{rataNilai > 0 ? rataNilai.toFixed(1) : "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge className={STATUS_CBT_COLORS[cbt.status]}>{cbt.status}</Badge>
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
                <Badge className={cbt.acak_soal ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                  {cbt.acak_soal ? "Ya" : "Tidak"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Acak Jawaban</span>
                <Badge className={cbt.acak_jawaban ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                  {cbt.acak_jawaban ? "Ya" : "Tidak"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tampilkan Nilai</span>
                <Badge className={cbt.tampilkan_nilai ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                  {cbt.tampilkan_nilai ? "Ya" : "Tidak"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Izinkan Kembali</span>
                <Badge className={cbt.izinkan_kembali ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                  {cbt.izinkan_kembali ? "Ya" : "Tidak"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Auto Submit</span>
                <Badge className={cbt.auto_submit ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                  {cbt.auto_submit ? "Ya" : "Tidak"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
