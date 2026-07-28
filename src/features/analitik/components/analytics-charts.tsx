"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts"
import type {
  AnalyticsBySubject,
  AnalyticsByExamType,
  AnalyticsByClass,
  AnalyticsTimeline,
} from "../types/analitik"
import {
  STATUS_DISTRIBUTION_COLORS,
  CHART_COLORS,
} from "../constants/analitik.constants"

interface AnalyticsChartsProps {
  bySubject: AnalyticsBySubject[]
  byExamType: AnalyticsByExamType[]
  byClass: AnalyticsByClass[]
  timeline: AnalyticsTimeline[]
}

export function AnalyticsCharts({
  bySubject,
  byExamType,
  byClass,
  timeline,
}: AnalyticsChartsProps) {
  const statusDistribution = [
    {
      name: "Lulus",
      value: bySubject.reduce((sum, s) => sum + Math.round((s.persentase_lulus / 100) * s.jumlah_peserta), 0),
    },
    {
      name: "Tidak Lulus",
      value: bySubject.reduce((sum, s) => sum + s.jumlah_peserta - Math.round((s.persentase_lulus / 100) * s.jumlah_peserta), 0),
    },
  ]

  const timelineData = timeline
    .filter((t) => t.jumlah_ujian > 0)
    .map((t) => ({
      ...t,
      tanggal: new Date(t.tanggal).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      }),
    }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart: Rata-rata Nilai per Mata Pelajaran */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rata-rata Nilai per Mata Pelajaran</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bySubject} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="mata_pelajaran"
                tick={{ fontSize: 11 }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar dataKey="rata_rata_nilai" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} name="Rata-rata Nilai" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie Chart: Distribusi Status Kelulusan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Distribusi Status Kelulusan</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                <Cell fill={STATUS_DISTRIBUTION_COLORS["Lulus"]} />
                <Cell fill={STATUS_DISTRIBUTION_COLORS["Tidak Lulus"]} />
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Line Chart: Tren Nilai dari Waktu ke Waktu */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tren Nilai dari Waktu ke Waktu</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="tanggal" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="rata_rata_nilai"
                stroke={CHART_COLORS.primary}
                strokeWidth={2}
                dot={{ fill: CHART_COLORS.primary, r: 4 }}
                activeDot={{ r: 6 }}
                name="Rata-rata Nilai"
              />
              <Line
                type="monotone"
                dataKey="persentase_lulus"
                stroke={CHART_COLORS.success}
                strokeWidth={2}
                dot={{ fill: CHART_COLORS.success, r: 4 }}
                activeDot={{ r: 6 }}
                name="% Kelulusan"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Horizontal Bar Chart: Perbandingan Kelas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Perbandingan Rata-rata per Kelas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={byClass}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
              <YAxis
                dataKey="kelas"
                type="category"
                tick={{ fontSize: 12 }}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar dataKey="rata_rata_nilai" fill={CHART_COLORS.secondary} radius={[0, 4, 4, 0]} name="Rata-rata Nilai" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bar Chart: Perbandingan Jenis Ujian */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Perbandingan per Jenis Ujian</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byExamType} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="jenis_ujian" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar dataKey="rata_rata_nilai" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} name="Rata-rata Nilai" />
              <Bar dataKey="persentase_lulus" fill={CHART_COLORS.success} radius={[4, 4, 0, 0]} name="% Kelulusan" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
