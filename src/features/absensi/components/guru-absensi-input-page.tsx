"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, CheckCircle, Loader2 } from "lucide-react"
import {
  STATUS_KEHADIRAN_OPTIONS,
} from "@/features/absensi/constants/absensi.constants"
import {
  useAttendanceDetail,
  useSaveAttendanceRecords,
} from "@/hooks/use-attendance"
import { useClassroom } from "@/hooks/use-classroom"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { StatusKehadiran } from "@/features/absensi/types/absensi"

interface RosterSiswa {
  id: number
  nama_lengkap: string
  kelas: string
}

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

  const {
    data: detail,
    isLoading,
    isError,
  } = useAttendanceDetail(sesiId)

  const classroom = useClassroom()

  const roster = useMemo<RosterSiswa[]>(() => {
    if (!detail) return []
    const fromClass = classroom.getAnggotaKelas(detail.kelas)
    if (fromClass.length > 0) return fromClass
    return detail.records.map((r) => ({
      id: r.siswa_id,
      nama_lengkap: r.siswa_nama,
      kelas: r.siswa_kelas,
    }))
  }, [detail, classroom])

  const [attendance, setAttendance] = useState<Map<number, StatusKehadiran>>(
    new Map()
  )
  const [loadedId, setLoadedId] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (detail && detail.id !== loadedId) {
      const map = new Map<number, StatusKehadiran>()
      for (const rec of detail.records) {
        map.set(rec.siswa_id, rec.status)
      }
      const defaultForMissing: StatusKehadiran =
        detail.records.length > 0 ? "Alpha" : "Hadir"
      for (const siswa of roster) {
        if (!map.has(siswa.id)) {
          map.set(siswa.id, defaultForMissing)
        }
      }
      setAttendance(map)
      setLoadedId(detail.id)
    }
  }, [detail, loadedId, roster])

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
      for (const siswa of roster) {
        next.set(siswa.id, "Hadir")
      }
      return next
    })
  }

  const saveMutation = useSaveAttendanceRecords(sesiId)

  const handleSave = async () => {
    const records = roster.map((siswa) => ({
      student_id: siswa.id,
      status: attendance.get(siswa.id) ?? "Hadir",
      keterangan: null,
    }))
    if (records.length === 0) {
      toast.error("Tidak ada data siswa untuk disimpan")
      return
    }
    setIsSaving(true)
    try {
      await saveMutation.mutateAsync(records)
      router.push("/guru/absensi")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Input Absensi" />
        <Card>
          <CardContent>
            <p className="text-center text-muted-foreground py-8">
              Memuat data sesi absensi...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!detail) {
    return (
      <div className="space-y-6">
        <PageHeader title="Input Absensi" />
        <Card>
          <CardContent>
            <p className="text-center text-muted-foreground py-8">
              {isError
                ? "Gagal memuat data sesi absensi."
                : "Sesi absensi tidak ditemukan."}
            </p>
            <div className="flex justify-center pb-4">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Kembali
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const sesi = detail

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
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-1.5" />
              )}
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
          {roster.length} siswa
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
            {roster.map((siswa, index) => {
              const currentStatus =
                attendance.get(siswa.id) ?? "Hadir"
              return (
                <tr
                  key={siswa.id}
                  className={
                    index < roster.length - 1
                      ? "border-b border-border"
                      : ""
                  }
                >
                  <td className="px-4 py-3 text-muted-foreground">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{siswa.nama_lengkap}</p>
                    <p className="text-xs text-muted-foreground sm:hidden">
                      {siswa.kelas}
                    </p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Badge variant="outline">{siswa.kelas}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {STATUS_KEHADIRAN_OPTIONS.map((status) => (
                        <button
                          key={status}
                          onClick={() => updateStatus(siswa.id, status)}
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
            {roster.length === 0 && (
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
        <Button onClick={handleSave} size="lg" disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-1.5" />
          )}
          Simpan Absensi
        </Button>
      </div>
    </div>
  )
}
