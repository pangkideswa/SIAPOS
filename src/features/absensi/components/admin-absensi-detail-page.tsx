"use client"

import { useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  STATUS_KEHADIRAN_COLORS,
  STATUS_SESI_COLORS,
} from "@/features/absensi/constants/absensi.constants"
import {
  DUMMY_SESI_ABSENSI,
  DUMMY_ABSENSI_SISWA,
} from "@/features/absensi/dummy/absensi.data"

type AbsensiRow = Record<string, unknown> & {
  siswa_nama: string
  siswa_kelas: string
  status: string
  keterangan: string
}

const DAYS = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
]

export function AdminAbsensiDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = Number(params.id)

  const sesi = useMemo(
    () => DUMMY_SESI_ABSENSI.find((s) => s.id === id),
    [id]
  )

  const absensiList = useMemo(
    () => DUMMY_ABSENSI_SISWA.filter((a) => a.sesi_id === id),
    [id]
  )

  const summary = useMemo(() => {
    const s = { hadir: 0, izin: 0, sakit: 0, alpha: 0, terlambat: 0, total: 0 }
    for (const a of absensiList) {
      s.total++
      if (a.status === "Hadir") s.hadir++
      else if (a.status === "Izin") s.izin++
      else if (a.status === "Sakit") s.sakit++
      else if (a.status === "Alpha") s.alpha++
      else if (a.status === "Terlambat") s.terlambat++
    }
    return s
  }, [absensiList])

  if (!sesi) {
    return (
      <div className="space-y-6">
        <PageHeader title="Detail Absensi" />
        <Card>
          <CardContent>
            <div className="flex flex-col items-center gap-4 py-12">
              <p className="text-muted-foreground">
                Sesi absensi tidak ditemukan
              </p>
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const d = new Date(sesi.tanggal + "T00:00:00")
  const hari = DAYS[d.getDay()]
  const tanggalFormatted = d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const tableData: AbsensiRow[] = absensiList.map((a) => ({
    ...a,
    id: a.id,
  }))

  const columns: Column<AbsensiRow>[] = [
    {
      key: "no",
      header: "No",
      render: (item) => {
        const idx = tableData.findIndex((r) => r.id === item.id)
        return idx >= 0 ? idx + 1 : "-"
      },
    },
    { key: "siswa_nama", header: "Nama Siswa" },
    { key: "siswa_kelas", header: "Kelas" },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <Badge
          className={
            STATUS_KEHADIRAN_COLORS[
              item.status as keyof typeof STATUS_KEHADIRAN_COLORS
            ] ?? ""
          }
        >
          {item.status}
        </Badge>
      ),
    },
    {
      key: "keterangan",
      header: "Keterangan",
      render: (item) => item.keterangan || "-",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader title="Detail Absensi" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent>
              <h3 className="text-base font-semibold mb-4">
                Informasi Jadwal
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Mata Pelajaran
                  </p>
                  <p className="font-medium">{sesi.mata_pelajaran}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Guru</p>
                  <p className="font-medium">{sesi.guru_nama}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kelas</p>
                  <p className="font-medium">{sesi.kelas}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Jam</p>
                  <p className="font-medium">
                    {sesi.jam_mulai} - {sesi.jam_selesai}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hari</p>
                  <p className="font-medium">
                    {hari}, {tanggalFormatted}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Tahun Ajaran / Semester
                  </p>
                  <p className="font-medium">
                    {sesi.tahun_ajaran} / {sesi.semester}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    className={
                      STATUS_SESI_COLORS[sesi.status] ?? ""
                    }
                  >
                    {sesi.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardContent>
              <h3 className="text-base font-semibold mb-4">
                Ringkasan Kehadiran
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {summary.hadir}
                  </p>
                  <p className="text-sm text-muted-foreground">Hadir</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {summary.izin}
                  </p>
                  <p className="text-sm text-muted-foreground">Izin</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {summary.sakit}
                  </p>
                  <p className="text-sm text-muted-foreground">Sakit</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {summary.alpha}
                  </p>
                  <p className="text-sm text-muted-foreground">Alpha</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {summary.terlambat}
                  </p>
                  <p className="text-sm text-muted-foreground">Terlambat</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{summary.total}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <DataTable<AbsensiRow>
          columns={columns}
          data={tableData}
          emptyMessage="Tidak ada data absensi"
        />
      </div>
    </div>
  )
}
