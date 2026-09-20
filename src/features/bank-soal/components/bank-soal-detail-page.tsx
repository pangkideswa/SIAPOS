"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle } from "lucide-react"
import {
  TIPE_SOAL_COLORS, KESULITAN_COLORS, STATUS_BANK_SOAL_COLORS,
} from "../constants/bank-soal.constants"

interface BankSoalDetailPageProps {
  id: string
}

export function BankSoalDetailPage({ id }: BankSoalDetailPageProps) {
  const router = useRouter()
  const [soal, setSoal] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/exams/bank/${id}`)
        const json = await res.json()
        if (res.ok && (json.data || json.success)) {
          setSoal(json.data)
        }
      } catch (error) {
        console.error("Gagal memuat detail soal")
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [id])

  if (isLoading) {
    return <div className="flex justify-center items-center h-[60vh]">Memuat Detail Soal...</div>
  }

  if (!soal) {
    return (
      <div className="space-y-6">
        <PageHeader title="Detail Soal" description="Soal tidak ditemukan" />
        <Button variant="outline" onClick={() => router.push("/admin/bank-soal")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Bank Soal
        </Button>
      </div>
    )
  }

  // Format options into PilihanGanda object if it's multiple choice
  let pilihan: any = {}
  if (soal.tipe_soal === "PILIHAN_GANDA" && soal.options) {
    const letters = ["A", "B", "C", "D", "E"]
    soal.options.forEach((opt: any, index: number) => {
      if (index < letters.length) {
        pilihan[letters[index]] = opt.teks
        if (opt.is_correct) soal.jawaban_benar = letters[index]
      }
    })
  }

  const tipeSoalMap: Record<string, string> = {
    PILIHAN_GANDA: "Pilihan Ganda",
    ESAI: "Isian Singkat", // Or "Essay"
    "Benar / Salah": "Benar / Salah"
  }

  const tipeLabel = tipeSoalMap[soal.tipe_soal] || soal.tipe_soal
  const kesulitanLabel = soal.kesulitan === "MUDAH" ? "Mudah" : soal.kesulitan === "SEDANG" ? "Sedang" : "Sulit"
  const statusLabel = soal.status === "PUBLISH" ? "Aktif" : "Draft"

  return (
    <div className="space-y-6">
      <PageHeader
        title={soal.kode_soal}
        description={`Soal ${tipeLabel} — ${soal.mata_pelajaran}`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/admin/bank-soal")}>
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
              <CardTitle>Pertanyaan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed whitespace-pre-wrap">{soal.pertanyaan}</p>
            </CardContent>
          </Card>

          {soal.tipe_soal === "PILIHAN_GANDA" && Object.keys(pilihan).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Pilihan Jawaban</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(["A", "B", "C", "D", "E"] as const).map((key) => {
                  const optionText = pilihan?.[key]
                  if (!optionText) return null
                  const isCorrect = soal.jawaban_benar === key
                  return (
                    <div key={key} className={`flex items-start gap-3 p-3 rounded-lg border ${isCorrect ? "bg-green-50 border-green-200" : ""}`}>
                      <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0 ${isCorrect ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"}`}>
                        {key}
                      </span>
                      <p className="text-sm flex-1 pt-1">{optionText}</p>
                      {isCorrect && <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-1" />}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}

          {soal.tipe_soal === "BENAR_SALAH" && (
            <Card>
              <CardHeader>
                <CardTitle>Jawaban</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${soal.jawaban_benar === "Benar" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {soal.jawaban_benar}
                </div>
              </CardContent>
            </Card>
          )}

          {soal.tipe_soal === "ESAI" && (
            <Card>
              <CardHeader>
                <CardTitle>Jawaban</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-green-700 bg-green-50 px-4 py-2 rounded-lg inline-block">
                  {soal.jawaban_benar}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Tipe Soal</p>
                <Badge className={TIPE_SOAL_COLORS[tipeLabel] || "bg-muted"}>{tipeLabel}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Mata Pelajaran</p>
                <p className="text-sm font-medium">{soal.mata_pelajaran}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Guru</p>
                <p className="text-sm font-medium">{soal.guru?.nama_lengkap || "Sistem"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Kesulitan</p>
                <Badge className={KESULITAN_COLORS[kesulitanLabel] || "bg-muted"}>{kesulitanLabel}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge className={STATUS_BANK_SOAL_COLORS[statusLabel] || "bg-muted"}>{statusLabel}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Dibuat</p>
                <p className="text-sm">{new Date(soal.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
