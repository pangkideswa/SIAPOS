"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, TrendingUp, Trophy, BarChart3, CheckCircle, XCircle, Clock } from "lucide-react"
import type { AnalyticsSummary } from "../types/analitik"

interface AnalyticsSummaryCardsProps {
  summary: AnalyticsSummary
}

export function AnalyticsSummaryCards({ summary }: AnalyticsSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{summary.total_ujian}</p>
              <p className="text-xs text-muted-foreground">Total Ujian</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-violet-100">
              <TrendingUp className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{summary.rata_rata_nilai}</p>
              <p className="text-xs text-muted-foreground">Rata-rata Nilai</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{summary.persentase_lulus}%</p>
              <p className="text-xs text-muted-foreground">Persentase Kelulusan</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100">
              <Trophy className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{summary.total_peserta}</p>
              <p className="text-xs text-muted-foreground">Siswa Dinilai</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface AnalyticsSecondaryCardsProps {
  summary: AnalyticsSummary
}

export function AnalyticsSecondaryCards({ summary }: AnalyticsSecondaryCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{summary.total_lulus}</p>
              <p className="text-xs text-muted-foreground">Lulus</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{summary.total_tidak_lulus}</p>
              <p className="text-xs text-muted-foreground">Tidak Lulus</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-100">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{summary.total_menunggu}</p>
              <p className="text-xs text-muted-foreground">Menunggu Penilaian</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-100">
              <BarChart3 className="h-5 w-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{summary.nilai_tertinggi}</p>
              <p className="text-xs text-muted-foreground">Nilai Tertinggi</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
