"use client"

import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2, XCircle, Clock, Award } from "lucide-react"
import { DUMMY_CBT } from "../dummy/cbt.data"
import { DUMMY_PAKET_SOAL } from "@/features/paket-soal/dummy/paket-soal.data"
import { DUMMY_BANK_SOAL } from "@/features/bank-soal/dummy/bank-soal.data"

interface CBTResultPageProps {
  id: string
}

export function CBTResultPage({ id }: CBTResultPageProps) {
  const router = useRouter()
  const cbt = DUMMY_CBT.find((c) => c.id === Number(id))
  const paket = cbt ? DUMMY_PAKET_SOAL.find((p) => p.id === cbt.paket_soal_id) : null

  if (!cbt || !paket) {
    return (
      <div className="space-y-6">
        <PageHeader title="Hasil Ujian" description="Ujian CBT tidak ditemukan" />
        <Button variant="outline" onClick={() => router.push("/siswa/cbt")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
      </div>
    )
  }

  const soalList = DUMMY_BANK_SOAL.filter((s) => paket.soal_ids.includes(s.id))

  const dummyNilai = 85
  const dummyBenar = Math.round(soalList.length * 0.85)
  const dummySalah = soalList.length - dummyBenar
  const dummyWaktu = 45
  const lulus = dummyNilai >= cbt.nilai_minimum_lulus

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Hasil — ${cbt.nama_ujian}`}
        description={`${paket.mata_pelajaran} — ${cbt.kelas}`}
        action={
          <Button variant="outline" size="sm" onClick={() => router.push("/siswa/cbt")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary/10">
                  <Award className="h-12 w-12 text-primary" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-sm text-muted-foreground">Nilai Anda</p>
                  <p className="text-5xl font-bold text-primary">{dummyNilai}</p>
                  <Badge className={lulus ? "bg-green-100 text-green-800 mt-2" : "bg-red-100 text-red-800 mt-2"}>
                    {lulus ? "Lulus" : "Tidak Lulus"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{dummyBenar}</p>
                <p className="text-xs text-muted-foreground">Benar</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600">{dummySalah}</p>
                <p className="text-xs text-muted-foreground">Salah</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{dummyWaktu} mnt</p>
                <p className="text-xs text-muted-foreground">Waktu</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pembahasan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {soalList.map((soal, index) => {
                const isCorrect = index < dummyBenar
                return (
                  <div key={soal.id} className={`p-4 rounded-lg border ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                    <div className="flex items-start gap-3">
                      <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm shrink-0 ${isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{soal.pertanyaan}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {isCorrect ? "Benar" : "Salah"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Jawaban: {soal.jawaban_benar}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Info Ujian</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Ujian</p>
                <p className="text-sm font-medium">{cbt.nama_ujian}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Mata Pelajaran</p>
                <p className="text-sm font-medium">{paket.mata_pelajaran}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Kelas</p>
                <p className="text-sm font-medium">{cbt.kelas}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Jumlah Soal</p>
                <p className="text-sm font-medium">{soalList.length} soal</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Durasi</p>
                <p className="text-sm font-medium">{cbt.durasi} menit</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Nilai Minimum Lulus</p>
                <p className="text-sm font-medium">{cbt.nilai_minimum_lulus}</p>
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full" onClick={() => router.push("/siswa/cbt")}>
            Kembali ke Daftar Ujian
          </Button>
        </div>
      </div>
    </div>
  )
}
