"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Trophy, AlertTriangle } from "lucide-react"
import type { TopPerformer, StudentNeedingAttention, AnalyticsByExamType } from "../types/analitik"
import { JENIS_UJIAN_CHART_COLORS } from "../constants/analitik.constants"

interface AnalyticsAnalysisTablesProps {
  topPerformers: TopPerformer[]
  studentsNeedingAttention: StudentNeedingAttention[]
  byExamType: AnalyticsByExamType[]
}

export function AnalyticsAnalysisTables({
  topPerformers,
  studentsNeedingAttention,
  byExamType,
}: AnalyticsAnalysisTablesProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Perbandingan Jenis Ujian */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100">
              <Trophy className="h-4 w-4 text-blue-600" />
            </div>
            Analisis per Jenis Ujian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Jenis</TableHead>
                <TableHead className="text-xs text-right">Rata-rata</TableHead>
                <TableHead className="text-xs text-right">% Lulus</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {byExamType.map((item) => (
                <TableRow key={item.jenis_ujian}>
                  <TableCell>
                    <Badge
                      variant="outline"
                      style={{
                        borderColor: JENIS_UJIAN_CHART_COLORS[item.jenis_ujian],
                        color: JENIS_UJIAN_CHART_COLORS[item.jenis_ujian],
                      }}
                    >
                      {item.jenis_ujian}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {item.rata_rata_nilai}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        item.persentase_lulus >= 70
                          ? "text-green-600 font-medium"
                          : "text-red-600 font-medium"
                      }
                    >
                      {item.persentase_lulus}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-green-100">
              <Trophy className="h-4 w-4 text-green-600" />
            </div>
            Siswa Berprestasi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Nama</TableHead>
                <TableHead className="text-xs">Kelas</TableHead>
                <TableHead className="text-xs text-right">Rata-rata</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPerformers.slice(0, 5).map((item, index) => (
                <TableRow key={item.siswa_nama}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground w-5">
                        {index + 1}
                      </span>
                      <span className="font-medium text-sm">{item.siswa_nama}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {item.siswa_kelas}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold text-green-600">
                    {item.rata_rata_nilai}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Students Needing Attention */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-red-100">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            Siswa Perlu Perhatian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Nama</TableHead>
                <TableHead className="text-xs">Kelas</TableHead>
                <TableHead className="text-xs text-right">Rata-rata</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentsNeedingAttention.slice(0, 5).map((item) => (
                <TableRow key={item.siswa_nama}>
                  <TableCell>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{item.siswa_nama}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        Lemah: {item.mata_pelajaran_terlemah}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {item.siswa_kelas}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold text-red-600">
                    {item.rata_rata_nilai}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
