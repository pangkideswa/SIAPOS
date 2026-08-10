"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  Eye,
  CheckCircle2,
  Clock,
  TrendingUp,
  ClipboardCheck,
} from "lucide-react"
import { useClasses } from "@/hooks/use-classes"
import { useTeachers } from "@/hooks/use-teachers"
import { useSubjects } from "@/hooks/use-subjects"
import {
  STATUS_PENILAIAN_COLORS,
} from "@/features/penilaian/constants/penilaian.constants"
import { usePenilaian } from "@/hooks/use-penilaian"

export function PenilaianListPage() {
  const router = useRouter()
  const {
    data: allPenilaian = [],
    isLoading: isTableLoading,
    isError,
    refetch,
  } = usePenilaian()

  const { data: classesData } = useClasses({ per_page: 200 })
  const classes = classesData?.data ?? []
  const { data: teachers } = useTeachers()
  const { data: subjectsData } = useSubjects({ per_page: 200 })
  const subjects = subjectsData?.data ?? []
  const [search, setSearch] = useState("")
  const [guruFilter, setGuruFilter] = useState<string>("semua")
  const [kelasFilter, setKelasFilter] = useState<string>("semua")
  const [mapelFilter, setMapelFilter] = useState<string>("semua")
  const [statusFilter, setStatusFilter] = useState<string>("semua")
  const [page, setPage] = useState(1)

  const perPage = 10

  const summaryData = useMemo(() => {
    const total = allPenilaian.length
    const sudahDinilai = allPenilaian.filter(
      (p) => p.status_penilaian === "Sudah Dinilai"
    ).length
    const belumDinilai = allPenilaian.filter(
      (p) => p.status_penilaian === "Belum Dinilai"
    ).length
    const graded = allPenilaian.filter(
      (p) => p.status_penilaian === "Sudah Dinilai" && p.nilai !== null
    )
    const rataRata =
      graded.length > 0
        ? Math.round(
            graded.reduce((sum, p) => sum + (p.nilai ?? 0), 0) /
              graded.length
          )
        : 0
    return { total, sudahDinilai, belumDinilai, rataRata }
  }, [allPenilaian])

  const filteredData = allPenilaian.filter((item) => {
    const matchesSearch =
      !search ||
      item.siswa_nama.toLowerCase().includes(search.toLowerCase()) ||
      item.tugas_judul.toLowerCase().includes(search.toLowerCase()) ||
      item.mata_pelajaran.toLowerCase().includes(search.toLowerCase())
    const matchesGuru =
      guruFilter === "semua" || item.guru_nama === guruFilter
    const matchesKelas =
      kelasFilter === "semua" || item.siswa_kelas === kelasFilter
    const matchesMapel =
      mapelFilter === "semua" || item.mata_pelajaran === mapelFilter
    const matchesStatus =
      statusFilter === "semua" || item.status_penilaian === statusFilter
    return matchesSearch && matchesGuru && matchesKelas && matchesMapel && matchesStatus
  })

  const totalPages = Math.ceil(filteredData.length / perPage)
  const paginatedData = filteredData.slice(
    (page - 1) * perPage,
    page * perPage
  )

  function formatTenggat(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "siswa_nama",
      header: "Nama Siswa",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">
            {String(item.siswa_nama)
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div>
            <p className="font-medium text-sm">{String(item.siswa_nama)}</p>
            <p className="text-xs text-muted-foreground">
              {String(item.siswa_kelas)}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "mata_pelajaran",
      header: "Mata Pelajaran",
      render: (item) => (
        <div>
          <p className="text-sm">{String(item.mata_pelajaran)}</p>
          <p className="text-xs text-muted-foreground">
            {String(item.guru_nama)}
          </p>
        </div>
      ),
    },
    {
      key: "tugas_judul",
      header: "Tugas",
      render: (item) => (
        <div>
          <p className="text-sm font-medium line-clamp-1">
            {String(item.tugas_judul)}
          </p>
          <p className="text-xs text-muted-foreground">
            Tenggat: {formatTenggat(String(item.tenggat_waktu))}
          </p>
        </div>
      ),
    },
    {
      key: "nilai",
      header: "Nilai",
      render: (item) => {
        const nilai = item.nilai as number | null
        return nilai !== null ? (
          <span className="text-sm font-semibold">{nilai}</span>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        )
      },
    },
    {
      key: "status_penilaian",
      header: "Status",
      render: (item) => {
        const status = String(item.status_penilaian)
        return (
          <Badge className={STATUS_PENILAIAN_COLORS[status] ?? ""}>
            {status}
          </Badge>
        )
      },
    },
    {
      key: "actions",
      header: "",
      className: "w-[80px]",
      render: (item) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon-sm"
            title="Beri Nilai"
            onClick={() =>
              router.push(`/guru/penilaian/${String(item.id)}`)
            }
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Penilaian"
        description="Kelola nilai dan berikan feedback untuk pengumpulan tugas siswa."
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
                <ClipboardCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summaryData.total}</p>
                <p className="text-xs text-muted-foreground">Total Penilaian</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summaryData.sudahDinilai}</p>
                <p className="text-xs text-muted-foreground">Sudah Dinilai</p>
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
                <p className="text-2xl font-bold">{summaryData.belumDinilai}</p>
                <p className="text-xs text-muted-foreground">Belum Dinilai</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summaryData.rataRata}</p>
                <p className="text-xs text-muted-foreground">Rata-rata Nilai</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama siswa, tugas, atau mapel..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={guruFilter}
          onValueChange={(v: string | null) => {
            setGuruFilter(v ?? "semua")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-[170px]">
            <SelectValue placeholder="Semua Guru" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Guru</SelectItem>
            {teachers?.map((guru) => (
              <SelectItem key={guru.id} value={guru.nama_lengkap}>
                {guru.nama_lengkap}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={kelasFilter}
          onValueChange={(v: string | null) => {
            setKelasFilter(v ?? "semua")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Semua Kelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Kelas</SelectItem>
            {classes.map((kelas) => (
              <SelectItem key={kelas.id} value={kelas.name}>
                {kelas.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={mapelFilter}
          onValueChange={(v: string | null) => {
            setMapelFilter(v ?? "semua")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Semua Mapel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Mapel</SelectItem>
            {subjects.map((mapel) => (
              <SelectItem key={mapel.id} value={mapel.name}>
                {mapel.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(v: string | null) => {
            setStatusFilter(v ?? "semua")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Status</SelectItem>
            <SelectItem value="Belum Dinilai">Belum Dinilai</SelectItem>
            <SelectItem value="Sudah Dinilai">Sudah Dinilai</SelectItem>
            <SelectItem value="Revisi">Revisi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={paginatedData as unknown as Record<string, unknown>[]}
        loading={isTableLoading}
        emptyMessage={
          isError ? "Gagal memuat data penilaian" : "Tidak ada penilaian ditemukan"
        }
        onRowClick={(item) =>
          router.push(`/guru/penilaian/${String(item.id)}`)
        }
      />

      {isError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 py-4 px-4 text-center text-sm text-destructive">
          Terjadi kesalahan saat memuat data penilaian.{" "}
          <button onClick={() => refetch()} className="underline font-medium">
            Muat ulang
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Halaman {page} dari {totalPages} ({filteredData.length} data)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
