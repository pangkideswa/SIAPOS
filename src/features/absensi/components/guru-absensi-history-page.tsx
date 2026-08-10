"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Eye, BarChart3 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useAttendanceList } from "@/hooks/use-attendance"
import { STATUS_SESI_COLORS } from "@/features/absensi/constants/absensi.constants"

const PER_PAGE = 10

type SesiRow = Record<string, unknown> & {
  id: number
  tanggal: string
  jam_mulai: string
  jam_selesai: string
  mata_pelajaran: string
  guru_nama: string
  kelas: string
  total_siswa: number
  hadir: number
  status: string
}

function formatDateID(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function GuruAbsensiHistoryPage() {
  const router = useRouter()
  const { user } = useAuth()
  const guruName = user?.name ?? ""

  const [search, setSearch] = useState("")
  const [kelasFilter, setKelasFilter] = useState("semua")
  const [page, setPage] = useState(1)

  const {
    data: sesiList = [],
    isLoading,
    isError,
    refetch,
  } = useAttendanceList({ guru: guruName })

  const guruSesi = useMemo(() => (guruName ? sesiList : []), [guruName, sesiList])

  const filteredData = useMemo(() => {
    let data = [...guruSesi]

    if (search) {
      const q = search.toLowerCase()
      data = data.filter(
        (s) =>
          s.mata_pelajaran.toLowerCase().includes(q) ||
          s.kelas.toLowerCase().includes(q)
      )
    }

    if (kelasFilter !== "semua") {
      data = data.filter((s) => s.kelas === kelasFilter)
    }

    return data
  }, [guruSesi, search, kelasFilter])

  const totalPages = Math.ceil(filteredData.length / PER_PAGE)
  const paginatedData = filteredData.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  )

  const uniqueKelas = useMemo(() => {
    const kelasSet = new Set(guruSesi.map((s) => s.kelas))
    return Array.from(kelasSet).sort()
  }, [guruSesi])

  const columns: Column<SesiRow>[] = [
    {
      key: "tanggal",
      header: "Tanggal",
      render: (item) => formatDateID(item.tanggal),
    },
    {
      key: "jam",
      header: "Jam",
      render: (item) => `${item.jam_mulai} - ${item.jam_selesai}`,
    },
    { key: "mata_pelajaran", header: "Mata Pelajaran" },
    {
      key: "kelas",
      header: "Kelas",
      render: (item) => (
        <Badge className="bg-primary/10 text-primary">{item.kelas}</Badge>
      ),
    },
    {
      key: "hadir",
      header: "Hadir",
      render: (item) => `${item.hadir}/${item.total_siswa}`,
    },
    {
      key: "tidak_hadir",
      header: "Tidak Hadir",
      render: (item) => `${item.total_siswa - item.hadir}`,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <Badge className={STATUS_SESI_COLORS[item.status] ?? ""}>
          {item.status}
        </Badge>
      ),
    },
    {
      key: "aksi",
      header: "Aksi",
      render: () => (
        <Eye className="h-4 w-4 text-muted-foreground" />
      ),
    },
  ]

  const sesiSelesai = guruSesi.filter((s) => s.status === "Selesai").length
  const totalHadir = guruSesi.reduce((acc, s) => acc + s.hadir, 0)
  const totalSiswaAll = guruSesi.reduce((acc, s) => acc + s.total_siswa, 0)
  const rataRataKehadiran =
    totalSiswaAll > 0 ? Math.round((totalHadir / totalSiswaAll) * 100) : 0

  return (
    <div className="space-y-6">
      <PageHeader
        title="Riwayat Absensi"
        description="Riwayat pengambilan absensi kelas Anda"
        action={
          <Button
            variant="outline"
            onClick={() => router.push("/guru/absensi/rekap")}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Lihat Rekap
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Total Sesi</p>
            <p className="text-2xl font-bold">{guruSesi.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Sesi Selesai</p>
            <p className="text-2xl font-bold">{sesiSelesai}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Total Kehadiran</p>
            <p className="text-2xl font-bold">{totalHadir}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Rata-rata Kehadiran
            </p>
            <p className="text-2xl font-bold">{rataRataKehadiran}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari mata pelajaran atau kelas..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={kelasFilter}
          onValueChange={(v) => {
            setKelasFilter(v ?? "semua")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Semua Kelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Kelas</SelectItem>
            {uniqueKelas.map((k) => (
              <SelectItem key={k} value={k}>
                {k}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <DataTable<SesiRow>
          columns={columns}
          data={paginatedData as unknown as SesiRow[]}
          loading={isLoading}
          onRowClick={(item) => router.push(`/guru/absensi/${item.id}`)}
          emptyMessage={
            isError
              ? "Gagal memuat riwayat absensi"
              : "Tidak ada riwayat absensi"
          }
        />
        {isError && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 py-4 px-4 text-center text-sm text-destructive mt-4">
            Terjadi kesalahan saat memuat riwayat absensi.{" "}
            <button onClick={() => refetch()} className="underline font-medium">
              Muat ulang
            </button>
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Menampilkan {(page - 1) * PER_PAGE + 1}-
              {Math.min(page * PER_PAGE, filteredData.length)} dari{" "}
              {filteredData.length} data
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm rounded-md border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 text-sm rounded-md border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
