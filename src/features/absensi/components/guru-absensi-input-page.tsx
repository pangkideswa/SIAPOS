"use client"

import { useState, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, CheckCircle } from "lucide-react"
import {
  STATUS_KEHADIRAN_OPTIONS,
} from "@/features/absensi/constants/absensi.constants"
import {
  DUMMY_SESI_ABSENSI,
  DUMMY_ABSENSI_SISWA,
} from "@/features/absensi/dummy/absensi.data"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { StatusKehadiran } from "@/features/absensi/types/absensi"

function formatDateID(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

const STATUS_SOLID_COLORS: Record<StatusKehadiran, string> = {
  Hadir: "bg-green-600 text-white border-green-600 hover:bg-green-700",
  Izin: "bg-blue-600 text-white border-blue-600 hover:bg-blue-700",
  Sakit: "bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600",
  Alpha: "bg-red-600 text-white border-red-600 hover:bg-red-700",
  Terlambat:
    "bg-orange-500 text-white border-orange-500 hover:bg-orange-600",
}

export function GuruAbsensiInputPage() {
  const router = useRouter()
  const params = useParams()
  const sesiId = Number(params.id)

  const sesi = DUMMY_SESI_ABSENSI.find((s) => s.id === sesiId)
  const absensiRecords = useMemo(
    () => DUMMY_ABSENSI_SISWA.filter((a) => a.sesi_id === sesiId),
    [sesiId]
  )

  const [attendance, setAttendance] = useState<Map<number, StatusKehadiran>>(
    () => {
      const map = new Map<number, StatusKehadiran>()
      for (const rec of absensiRecords) {
        map.set(rec.siswa_id, rec.status)
      }
      return map
    }
  )

  const updateStatus = (siswaId: number, status: StatusKehadiran) => {
    setAttendance((prev) => {
      const next = new Map(prev)
      next.set(siswaId, status)
      return next
    })
  }

  const markAllHadir = () => {
    setAttendance((prev) => {
      const next = new Map(prev)
      for (const [key] of prev) {
        next.set(key, "Hadir")
      }
      return next
    })
  }

  const handleSave = () => {
    toast.success("Absensi berhasil disimpan!")
  }

  if (!sesi) {
    return (
      <div className="space-y-6">
        <PageHeader title="Input Absensi" />
        <Card>
          <CardContent>
            <p className="text-center text-muted-foreground py-8">
              Sesi absensi tidak ditemukan.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title="Input Absensi"
          description={`${sesi.mata_pelajaran} - ${sesi.kelas}`}
          action={
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-1.5" />
              Simpan Absensi
            </Button>
          }
        />
      </div>

      <Card>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Mata Pelajaran</p>
              <p className="text-sm font-semibold">{sesi.mata_pelajaran}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Guru</p>
              <p className="text-sm font-semibold">{sesi.guru_nama}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Kelas</p>
              <Badge className="bg-primary/10 text-primary">
                {sesi.kelas}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Jam</p>
              <p className="text-sm font-semibold">
                {sesi.jam_mulai} - {sesi.jam_selesai}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Hari / Tanggal</p>
              <p className="text-sm font-semibold">
                {formatDateID(sesi.tanggal)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {absensiRecords.length} siswa
        </p>
        <Button variant="outline" size="sm" onClick={markAllHadir}>
          <CheckCircle className="h-4 w-4 mr-1.5" />
          Tandai Semua Hadir
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground w-12">
                No
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Nama
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                Kelas
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {absensiRecords.map((record, index) => {
              const currentStatus = attendance.get(record.siswa_id) ?? "Hadir"
              return (
                <tr
                  key={record.siswa_id}
                  className={
                    index < absensiRecords.length - 1
                      ? "border-b border-border"
                      : ""
                  }
                >
                  <td className="px-4 py-3 text-muted-foreground">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{record.siswa_nama}</p>
                    <p className="text-xs text-muted-foreground sm:hidden">
                      {record.siswa_kelas}
                    </p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Badge variant="outline">{record.siswa_kelas}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {STATUS_KEHADIRAN_OPTIONS.map((status) => (
                        <button
                          key={status}
                          onClick={() =>
                            updateStatus(record.siswa_id, status)
                          }
                          className={cn(
                            "px-2 py-1 rounded-lg text-xs font-medium border transition-all",
                            currentStatus === status
                              ? STATUS_SOLID_COLORS[status]
                              : "border-border text-muted-foreground hover:bg-muted"
                          )}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              )
            })}
            {absensiRecords.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Tidak ada data siswa untuk sesi ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="h-4 w-4 mr-1.5" />
          Simpan Absensi
        </Button>
      </div>
    </div>
  )
}
