"use client"

import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Pencil, CheckCircle } from "lucide-react"
import {
  TIPE_SOAL_COLORS, KESULITAN_COLORS, STATUS_BANK_SOAL_COLORS,
} from "../constants/bank-soal.constants"
import { DUMMY_BANK_SOAL } from "../dummy/bank-soal.data"

interface BankSoalDetailPageProps {
  id: string
}

export function BankSoalDetailPage({ id }: BankSoalDetailPageProps) {
  const router = useRouter()
  const soal = DUMMY_BANK_SOAL.find((s) => s.id === Number(id))

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

  return (
    <div className="space-y-6">
      <PageHeader
        title={soal.kode_soal}
        description={`Soal ${soal.tipe_soal} — ${soal.mata_pelajaran}`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/admin/bank-soal")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push("/admin/bank-soal")}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
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

          {soal.tipe_soal === "Pilihan Ganda" && soal.pilihan && (
            <Card>
              <CardHeader>
                <CardTitle>Pilihan Jawaban</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(["A", "B", "C", "D", "E"] as const).map((key) => {
                  const isCorrect = soal.jawaban_benar === key
                  const optionText = soal.pilihan?.[key] ?? ""
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

          {soal.tipe_soal === "Benar / Salah" && (
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

          {soal.tipe_soal === "Isian Singkat" && (
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
                <Badge className={TIPE_SOAL_COLORS[soal.tipe_soal]}>{soal.tipe_soal}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Mata Pelajaran</p>
                <p className="text-sm font-medium">{soal.mata_pelajaran}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Guru</p>
                <p className="text-sm font-medium">{soal.guru_nama}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Kelas</p>
                <p className="text-sm font-medium">{soal.kelas}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Kesulitan</p>
                <Badge className={KESULITAN_COLORS[soal.kesulitan]}>{soal.kesulitan}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge className={STATUS_BANK_SOAL_COLORS[soal.status]}>{soal.status}</Badge>
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
