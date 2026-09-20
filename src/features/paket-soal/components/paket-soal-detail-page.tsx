"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, FileText } from "lucide-react"
import {
  STATUS_PAKET_SOAL_COLORS,
} from "../constants/paket-soal.constants"
import {
  TIPE_SOAL_COLORS, KESULITAN_COLORS,
} from "@/features/bank-soal/constants/bank-soal.constants"

interface PaketSoalDetailPageProps {
  id: string
}

export function PaketSoalDetailPage({ id }: PaketSoalDetailPageProps) {
  const router = useRouter()
  const [paket, setPaket] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadPaket() {
      try {
        const res = await fetch(`/api/exams/packages/${id}`)
        const json = await res.json()
        if (json.data || json.success) {
          setPaket(json.data)
        }
      } catch (error) {
        console.error("Gagal memuat paket soal")
      } finally {
        setIsLoading(false)
      }
    }
    loadPaket()
  }, [id])

  if (isLoading) {
    return <div className="flex h-[60vh] items-center justify-center">Memuat Detail Paket Soal...</div>
  }

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

  const soalList = paket.items?.map((item: any) => item.bank_soal) || []

  return (
    <div className="space-y-6">
      <PageHeader
        title={paket.judul}
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
              {soalList.map((soal: any, index: number) => (
                <div key={soal.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm line-clamp-2">{soal.pertanyaan}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge className={TIPE_SOAL_COLORS[soal.tipe_soal] || "bg-gray-100"}>{soal.tipe_soal}</Badge>
                      <Badge className={KESULITAN_COLORS[soal.kesulitan] || "bg-gray-100"}>{soal.kesulitan}</Badge>
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
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Jumlah Soal</p>
                  <p className="text-sm font-medium">{soalList.length} soal</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge className={STATUS_PAKET_SOAL_COLORS[paket.status] || "bg-gray-100"}>{paket.status}</Badge>
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
