"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, Users, BookOpen, AlertTriangle, Clock, Heart, TrendingUp, Download } from "lucide-react"
import { toast } from "sonner"
import { exportAbsensiToExcel } from "@/features/absensi/utils/export"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAttendanceRekap } from "@/hooks/use-attendance"
import type { RekapAbsensi } from "@/features/absensi/types/absensi"

interface RekapRow extends RekapAbsensi, Record<string, unknown> {}

export function GuruAbsensiRekapPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [kelasFilter, setKelasFilter] = useState<string>("semua")
  const [isExporting, setIsExporting] = useState(false)
  const [page, setPage] = useState(1)
  const perPage = 15

  const {
    data: rekapData = [],
    isLoading,
    isError,
    refetch,
  } = useAttendanceRekap()

  const summaryData = useMemo(() => {
    const totalPertemuan = Math.max(...rekapData.map((r) => r.total_pertemuan), 0)
    const totalHadir = rekapData.reduce((sum, r) => sum + r.hadir, 0)
    const totalAlpha = rekapData.reduce((sum, r) => sum + r.alpha, 0)
    const totalIzin = rekapData.reduce((sum, r) => sum + r.izin, 0)
    const totalSakit = rekapData.reduce((sum, r) => sum + r.sakit, 0)
    const avgPersentase = rekapData.length > 0
      ? Math.round(rekapData.reduce((sum, r) => sum + r.persentase, 0) / rekapData.length)
      : 0
    return { totalPertemuan, totalHadir, totalAlpha, totalIzin, totalSakit, avgPersentase }
  }, [rekapData])

  const uniqueKelas = useMemo(() => {
    const kelasSet = new Set(rekapData.map((r) => r.siswa_kelas))
    return Array.from(kelasSet).sort()
  }, [rekapData])

  const filteredData = useMemo(() => {
    return rekapData.filter((item) => {
      const matchesSearch = !search ||
        item.siswa_nama.toLowerCase().includes(search.toLowerCase())
      const matchesKelas = kelasFilter === "semua" || item.siswa_kelas === kelasFilter
      return matchesSearch && matchesKelas
    })
  }, [rekapData, search, kelasFilter])

  const totalPages = Math.ceil(filteredData.length / perPage)
  const paginatedData = filteredData.slice((page - 1) * perPage, page * perPage)

  const columns: Column<RekapRow>[] = [
    {
      key: "no",
      header: "No",
      render: (_item: RekapRow, index?: number) => (
        <span className="text-muted-foreground">{(page - 1) * perPage + (index ?? 0) + 1}</span>
      ),
    },
    {
      key: "siswa_nama",
      header: "Nama",
      render: (item: RekapRow) => <span className="font-medium">{item.siswa_nama}</span>,
    },
    {
      key: "siswa_kelas",
      header: "Kelas",
      render: (item: RekapRow) => (
        <Badge className="bg-primary/10 text-primary">{item.siswa_kelas}</Badge>
      ),
    },
    {
      key: "hadir",
      header: "Hadir",
      render: (item: RekapRow) => <span className="text-green-600 font-semibold">{item.hadir}</span>,
    },
    {
      key: "izin",
      header: "Izin",
      render: (item: RekapRow) => <span className="text-blue-600 font-semibold">{item.izin}</span>,
    },
    {
      key: "sakit",
      header: "Sakit",
      render: (item: RekapRow) => <span className="text-yellow-600 font-semibold">{item.sakit}</span>,
    },
    {
      key: "alpha",
      header: "Alpha",
      render: (item: RekapRow) => <span className="text-red-600 font-semibold">{item.alpha}</span>,
    },
    {
      key: "terlambat",
      header: "Terlambat",
      render: (item: RekapRow) => <span className="text-orange-600 font-semibold">{item.terlambat}</span>,
    },
    {
      key: "persentase",
      header: "Kehadiran",
      render: (item: RekapRow) => (
        <div className="flex items-center gap-2 min-w-[120px]">
          <Progress value={item.persentase} className="h-2 flex-1" />
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{item.persentase}%</span>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => router.push("/guru/absensi")}
          aria-label="Kembali ke Riwayat Absensi"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title="Rekap Absensi"
          description="Rekapitulasi kehadiran siswa pada kelas Anda"
        />
        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            className="hidden sm:flex"
            onClick={async () => {
              try {
                setIsExporting(true)
                await exportAbsensiToExcel({ kelas: kelasFilter }, "Rekap_Absensi_Guru")
                toast.success("Data berhasil diexport")
              } catch {
                toast.error("Gagal mengexport data")
              } finally {
                setIsExporting(false)
              }
            }}
            disabled={isExporting || rekapData.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Mengekspor..." : "Export Excel"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summaryData.totalPertemuan}</p>
                <p className="text-xs text-muted-foreground">Total Pertemuan</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summaryData.totalHadir}</p>
                <p className="text-xs text-muted-foreground">Total Hadir</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summaryData.totalAlpha}</p>
                <p className="text-xs text-muted-foreground">Total Alpha</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summaryData.totalIzin}</p>
                <p className="text-xs text-muted-foreground">Total Izin</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Heart className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summaryData.totalSakit}</p>
                <p className="text-xs text-muted-foreground">Total Sakit</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summaryData.avgPersentase}%</p>
                <p className="text-xs text-muted-foreground">Rata-rata Kehadiran</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama siswa..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="pl-9"
          />
        </div>
        <Select
          value={kelasFilter}
          onValueChange={(v) => { setKelasFilter(v ?? "semua"); setPage(1) }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Semua Kelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Kelas</SelectItem>
            {uniqueKelas.map((k) => (
              <SelectItem key={k} value={k}>{k}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="text-sm text-muted-foreground">
        Menampilkan {paginatedData.length} dari {filteredData.length} siswa
      </div>

      <DataTable
        columns={columns}
        data={paginatedData as RekapRow[]}
        loading={isLoading}
        emptyMessage={
          isError
            ? "Gagal memuat data rekap absensi"
            : "Tidak ada data rekap absensi"
        }
      />

      {isError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 py-4 px-4 text-center text-sm text-destructive">
          Terjadi kesalahan saat memuat data rekap absensi.{" "}
          <button onClick={() => refetch()} className="underline font-medium">
            Muat ulang
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Halaman {page} dari {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
