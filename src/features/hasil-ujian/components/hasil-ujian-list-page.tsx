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
  Users,
  TrendingUp,
  Trophy,
  BarChart3,
  GraduationCap,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import {
  KELAS_HASIL_OPTIONS,
  MATA_PELAJARAN_OPTIONS,
  JENIS_UJIAN_OPTIONS,
  STATUS_HASIL_OPTIONS,
  STATUS_HASIL_COLORS,
  JENIS_UJIAN_COLORS,
} from "@/features/hasil-ujian/constants/hasil-ujian.constants"
import { DUMMY_HASIL_UJIAN } from "@/features/hasil-ujian/dummy/hasil-ujian.data"

type SortKey = "siswa_nama" | "nilai" | "tanggal" | "jenis_ujian" | "status"
type SortDir = "asc" | "desc"

export function HasilUjianListPage() {
  const router = useRouter()
  const { user } = useAuth()
  const isSiswa = user?.role === "siswa"

  const [search, setSearch] = useState("")
  const [kelasFilter, setKelasFilter] = useState<string>("all")
  const [mapelFilter, setMapelFilter] = useState<string>("all")
  const [jenisFilter, setJenisFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<SortKey>("tanggal")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  const perPage = 10

  const baseData = useMemo(() => {
    if (isSiswa) {
      return DUMMY_HASIL_UJIAN.filter((h) => h.siswa_nama === "Rizki Pratama")
    }
    return DUMMY_HASIL_UJIAN
  }, [isSiswa])

  const summaryData = useMemo(() => {
    const graded = baseData.filter((h) => h.nilai !== null)
    const total = baseData.length
    const rataRata =
      graded.length > 0
        ? Math.round(
            graded.reduce((s, h) => s + (h.nilai ?? 0), 0) / graded.length
          )
        : 0
    const tertinggi =
      graded.length > 0
        ? Math.max(...graded.map((h) => h.nilai ?? 0))
        : 0
    const terendah =
      graded.length > 0
        ? Math.min(...graded.map((h) => h.nilai ?? 0))
        : 0
    const lulus = graded.filter((h) => h.status === "Lulus").length
    const persentaseLulus =
      graded.length > 0 ? Math.round((lulus / graded.length) * 100) : 0
    return { total, rataRata, tertinggi, terendah, persentaseLulus }
  }, [baseData])

  const filteredData = useMemo(() => {
    const data = baseData.filter((item) => {
      const matchesSearch =
        !search ||
        item.siswa_nama.toLowerCase().includes(search.toLowerCase()) ||
        item.siswa_nis.toLowerCase().includes(search.toLowerCase()) ||
        item.nama_ujian.toLowerCase().includes(search.toLowerCase()) ||
        item.mata_pelajaran.toLowerCase().includes(search.toLowerCase())
      const matchesKelas =
        kelasFilter === "all" || item.siswa_kelas === kelasFilter
      const matchesMapel =
        mapelFilter === "all" || item.mata_pelajaran === mapelFilter
      const matchesJenis =
        jenisFilter === "all" || item.jenis_ujian === jenisFilter
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter
      return (
        matchesSearch && matchesKelas && matchesMapel && matchesJenis && matchesStatus
      )
    })

    data.sort((a, b) => {
      let valA: string | number
      let valB: string | number
      switch (sortKey) {
        case "siswa_nama":
          valA = a.siswa_nama
          valB = b.siswa_nama
          break
        case "nilai":
          valA = a.nilai ?? -1
          valB = b.nilai ?? -1
          break
        case "tanggal":
          valA = a.tanggal
          valB = b.tanggal
          break
        case "jenis_ujian":
          valA = a.jenis_ujian
          valB = b.jenis_ujian
          break
        case "status":
          valA = a.status
          valB = b.status
          break
        default:
          return 0
      }
      if (typeof valA === "string") {
        return sortDir === "asc"
          ? valA.localeCompare(valB as string)
          : (valB as string).localeCompare(valA)
      }
      return sortDir === "asc"
        ? (valA as number) - (valB as number)
        : (valB as number) - (valA as number)
    })

    return data
  }, [baseData, search, kelasFilter, mapelFilter, jenisFilter, statusFilter, sortKey, sortDir])

  const totalPages = Math.ceil(filteredData.length / perPage)
  const paginatedData = filteredData.slice(
    (page - 1) * perPage,
    page * perPage
  )

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "siswa_nama",
      header: "Nama Peserta",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">
            {String(item.siswa_nama)
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">
              {String(item.siswa_nama)}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "siswa_nis",
      header: "NIS",
      render: (item) => (
        <span className="text-sm text-muted-foreground">
          {String(item.siswa_nis)}
        </span>
      ),
    },
    {
      key: "siswa_kelas",
      header: "Kelas",
      render: (item) => (
        <Badge variant="outline">{String(item.siswa_kelas)}</Badge>
      ),
    },
    {
      key: "mata_pelajaran",
      header: "Mata Pelajaran",
      render: (item) => (
        <span className="text-sm">{String(item.mata_pelajaran)}</span>
      ),
    },
    {
      key: "nama_ujian",
      header: "Nama Ujian",
      render: (item) => (
        <p className="text-sm font-medium line-clamp-1 max-w-[200px]">
          {String(item.nama_ujian)}
        </p>
      ),
    },
    {
      key: "jenis_ujian",
      header: "Jenis Ujian",
      render: (item) => {
        const jenis = String(item.jenis_ujian)
        return (
          <Badge className={JENIS_UJIAN_COLORS[jenis] ?? ""}>
            {jenis}
          </Badge>
        )
      },
    },
    {
      key: "nilai",
      header: "Nilai",
      render: (item) => {
        const nilai = item.nilai as number | null
        if (nilai === null) {
          return (
            <span className="text-sm text-muted-foreground">-</span>
          )
        }
        const color =
          nilai >= 80
            ? "text-green-600"
            : nilai >= 70
              ? "text-yellow-600"
              : "text-red-600"
        return (
          <span className={`text-sm font-semibold ${color}`}>{nilai}</span>
        )
      },
    },
    {
      key: "status",
      header: "Status",
      render: (item) => {
        const status = String(item.status)
        return (
          <Badge className={STATUS_HASIL_COLORS[status] ?? ""}>
            {status}
          </Badge>
        )
      },
    },
    {
      key: "tanggal",
      header: "Tanggal",
      render: (item) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(String(item.tanggal))}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-[60px]",
      render: (item) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon-sm"
            title="Lihat Detail"
            aria-label="Lihat Detail"
            onClick={() => {
              const prefix = isSiswa ? "siswa" : "guru"
              router.push(`/${prefix}/hasil-ujian/${String(item.id)}`)
            }}
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
        title="Hasil Ujian"
        description={
          isSiswa
            ? "Lihat hasil ujian dan review jawaban Anda."
            : "Kelola dan lihat seluruh hasil ujian siswa."
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summaryData.total}</p>
                <p className="text-xs text-muted-foreground">Total Peserta</p>
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
                <p className="text-2xl font-bold">{summaryData.rataRata}</p>
                <p className="text-xs text-muted-foreground">
                  Rata-rata Nilai
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100">
                <Trophy className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summaryData.tertinggi}</p>
                <p className="text-xs text-muted-foreground">
                  Nilai Tertinggi
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100">
                <BarChart3 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summaryData.terendah}</p>
                <p className="text-xs text-muted-foreground">
                  Nilai Terendah
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100">
                <GraduationCap className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {summaryData.persentaseLulus}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Persentase Kelulusan
                </p>
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
            placeholder="Cari nama, NIS, ujian, atau mapel..."
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
          onValueChange={(v: string | null) => {
            setKelasFilter(v ?? "all")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Semua Kelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kelas</SelectItem>
            {KELAS_HASIL_OPTIONS.map((kelas: string) => (
              <SelectItem key={kelas} value={kelas}>
                {kelas}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={mapelFilter}
          onValueChange={(v: string | null) => {
            setMapelFilter(v ?? "all")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Semua Mapel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Mapel</SelectItem>
            {MATA_PELAJARAN_OPTIONS.map((mapel: string) => (
              <SelectItem key={mapel} value={mapel}>
                {mapel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={jenisFilter}
          onValueChange={(v: string | null) => {
            setJenisFilter(v ?? "all")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Semua Jenis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Jenis</SelectItem>
            {JENIS_UJIAN_OPTIONS.map((jenis: string) => (
              <SelectItem key={jenis} value={jenis}>
                {jenis}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(v: string | null) => {
            setStatusFilter(v ?? "all")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-[170px]">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            {STATUS_HASIL_OPTIONS.map((status: string) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={`${sortKey}-${sortDir}`}
          onValueChange={(v: string | null) => {
            if (!v) return
            const [key, dir] = v.split("-") as [SortKey, SortDir]
            setSortKey(key)
            setSortDir(dir)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tanggal-desc">Tanggal Terbaru</SelectItem>
            <SelectItem value="tanggal-asc">Tanggal Terlama</SelectItem>
            <SelectItem value="nilai-desc">Nilai Tertinggi</SelectItem>
            <SelectItem value="nilai-asc">Nilai Terendah</SelectItem>
            <SelectItem value="siswa_nama-asc">Nama A-Z</SelectItem>
            <SelectItem value="siswa_nama-desc">Nama Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={paginatedData as unknown as Record<string, unknown>[]}
        loading={false}
        emptyMessage="Tidak ada hasil ujian ditemukan"
        onRowClick={(item) => {
          const prefix = isSiswa ? "siswa" : "guru"
          router.push(`/${prefix}/hasil-ujian/${String(item.id)}`)
        }}
      />

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
