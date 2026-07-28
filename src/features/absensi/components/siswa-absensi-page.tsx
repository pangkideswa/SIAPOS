"use client"

import { useMemo } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  User,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Heart,
} from "lucide-react"
import {
  STATUS_KEHADIRAN_COLORS,
} from "@/features/absensi/constants/absensi.constants"
import {
  DUMMY_SESI_ABSENSI,
  DUMMY_ABSENSI_SISWA,
} from "@/features/absensi/dummy/absensi.data"
import type { StatusKehadiran } from "@/features/absensi/types/absensi"

const SISWA_ID = 101

type AbsensiRow = Record<string, unknown> & {
  id: number
  no: number
  tanggal: string
  jam: string
  mata_pelajaran: string
  guru_nama: string
  kelas: string
  status: StatusKehadiran
  keterangan: string
}

function formatDateID(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function SiswaAbsensiPage() {
  const siswaAbsensi = useMemo(
    () => DUMMY_ABSENSI_SISWA.filter((a) => a.siswa_id === SISWA_ID),
    []
  )

  const stats = useMemo(() => {
    const total = siswaAbsensi.length
    const hadir = siswaAbsensi.filter((a) => a.status === "Hadir").length
    const izin = siswaAbsensi.filter((a) => a.status === "Izin").length
    const sakit = siswaAbsensi.filter((a) => a.status === "Sakit").length
    const alpha = siswaAbsensi.filter((a) => a.status === "Alpha").length
    const terlambat = siswaAbsensi.filter(
      (a) => a.status === "Terlambat"
    ).length
    const persentase =
      total > 0 ? Math.round(((hadir + terlambat) / total) * 100) : 0
    return { total, hadir, izin, sakit, alpha, terlambat, persentase }
  }, [siswaAbsensi])

  const tableData = useMemo<AbsensiRow[]>(() => {
    return siswaAbsensi.map((a, i) => {
      const sesi = DUMMY_SESI_ABSENSI.find((s) => s.id === a.sesi_id)
      return {
        id: a.id,
        no: i + 1,
        tanggal: a.created_at,
        jam: sesi ? `${sesi.jam_mulai} - ${sesi.jam_selesai}` : "-",
        mata_pelajaran: sesi?.mata_pelajaran ?? "-",
        guru_nama: sesi?.guru_nama ?? "-",
        kelas: sesi?.kelas ?? a.siswa_kelas,
        status: a.status,
        keterangan: a.keterangan || "-",
      }
    })
  }, [siswaAbsensi])

  const columns: Column<AbsensiRow>[] = [
    {
      key: "no",
      header: "No",
    },
    {
      key: "tanggal",
      header: "Tanggal",
      render: (item) => formatDateID(String(item.tanggal)),
    },
    { key: "jam", header: "Jam" },
    { key: "mata_pelajaran", header: "Mata Pelajaran" },
    { key: "guru_nama", header: "Guru" },
    {
      key: "kelas",
      header: "Kelas",
      render: (item) => (
        <Badge className="bg-primary/10 text-primary">
          {String(item.kelas)}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <Badge className={STATUS_KEHADIRAN_COLORS[item.status as StatusKehadiran] ?? ""}>
          {String(item.status)}
        </Badge>
      ),
    },
    { key: "keterangan", header: "Keterangan" },
  ]

  const statCards = [
    {
      label: "Total Hadir",
      value: stats.hadir,
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-100",
    },
    {
      label: "Total Izin",
      value: stats.izin,
      icon: Clock,
      color: "text-blue-500",
      bg: "bg-blue-100",
    },
    {
      label: "Total Sakit",
      value: stats.sakit,
      icon: Heart,
      color: "text-yellow-500",
      bg: "bg-yellow-100",
    },
    {
      label: "Total Alpha",
      value: stats.alpha,
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-100",
    },
    {
      label: "Total Terlambat",
      value: stats.terlambat,
      icon: AlertTriangle,
      color: "text-orange-500",
      bg: "bg-orange-100",
    },
    {
      label: "Persentase Kehadiran",
      value: stats.persentase,
      icon: User,
      color: "text-primary",
      bg: "bg-primary/10",
      isPercent: true,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Absensi Saya"
        description="Riwayat dan statistik kehadiran Anda"
      />

      {/* Section 1: Statistik Kehadiran */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Statistik Kehadiran</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.label}>
              <CardContent>
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full ${stat.bg}`}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {stat.isPercent ? `${stat.value}%` : stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                  {stat.isPercent && (
                    <Progress value={stat.value} className="w-full" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Section 2: Riwayat Absensi */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Riwayat Absensi</h2>
        <DataTable<AbsensiRow>
          columns={columns}
          data={tableData}
          emptyMessage="Belum ada riwayat absensi"
        />
      </div>
    </div>
  )
}
