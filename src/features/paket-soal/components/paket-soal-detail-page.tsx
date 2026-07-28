"use client"

import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, FileText } from "lucide-react"
import {
  STATUS_PAKET_SOAL_COLORS,
} from "../constants/paket-soal.constants"
import { DUMMY_PAKET_SOAL } from "../dummy/paket-soal.data"
import { DUMMY_BANK_SOAL } from "@/features/bank-soal/dummy/bank-soal.data"
import {
  TIPE_SOAL_COLORS, KESULITAN_COLORS,
} from "@/features/bank-soal/constants/bank-soal.constants"

interface PaketSoalDetailPageProps {
  id: string
}

export function PaketSoalDetailPage({ id }: PaketSoalDetailPageProps) {
  const router = useRouter()
  const paket = DUMMY_PAKET_SOAL.find((p) => p.id === Number(id))

  if (!paket) {
    return (
      <div className="space-y-6">
        <PageHeader title="Detail Paket Soal" description="Paket soal tidak ditemukan" />
        <Button variant="outline" onClick={() => router.push("/admin/paket-soal")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Paket Soal
        </Button>
      </div>
    )
  }

  const soalList = DUMMY_BANK_SOAL.filter((s) => paket.soal_ids.includes(s.id))

  return (
    <div className="space-y-6">
      <PageHeader
        title={paket.nama_paket}
        description={`${paket.mata_pelajaran} — ${paket.guru_nama}`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/admin/paket-soal")}>
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
              <p className="text-base leading-relaxed whitespace-pre-wrap">{paket.deskripsi || "Tidak ada deskripsi"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daftar Soal ({soalList.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {soalList.map((soal, index) => (
                <div key={soal.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm line-clamp-2">{soal.pertanyaan}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge className={TIPE_SOAL_COLORS[soal.tipe_soal]}>{soal.tipe_soal}</Badge>
                      <Badge className={KESULITAN_COLORS[soal.kesulitan]}>{soal.kesulitan}</Badge>
                    </div>
                  </div>
                </div>
              ))}
              {soalList.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Tidak ada soal dalam paket ini</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Paket</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Mata Pelajaran</p>
                <p className="text-sm font-medium">{paket.mata_pelajaran}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Guru</p>
                <p className="text-sm font-medium">{paket.guru_nama}</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Durasi</p>
                  <p className="text-sm font-medium">{paket.durasi} menit</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Jumlah Soal</p>
                  <p className="text-sm font-medium">{soalList.length} soal</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Nilai Maksimal</p>
                <p className="text-sm font-medium">{paket.nilai_maksimal}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge className={STATUS_PAKET_SOAL_COLORS[paket.status]}>{paket.status}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Dibuat</p>
                <p className="text-sm">{new Date(paket.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
