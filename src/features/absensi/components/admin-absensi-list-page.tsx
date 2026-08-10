"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  STATUS_SESI_COLORS,
} from "@/features/absensi/constants/absensi.constants"
import { useAttendanceList } from "@/hooks/use-attendance"
import { useClasses } from "@/hooks/use-classes"
import { useTeachers } from "@/hooks/use-teachers"
import { useSubjects } from "@/hooks/use-subjects"

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

export function AdminAbsensiListPage() {
  const router = useRouter()
  const {
    data: sesiList = [],
    isLoading,
    isError,
    refetch,
  } = useAttendanceList()

  const { data: classesData } = useClasses({ per_page: 200 })
  const classes = useMemo(() => classesData?.data ?? [], [classesData])
  const { data: teachers } = useTeachers()
  const { data: subjectsData } = useSubjects({ per_page: 200 })
  const subjects = useMemo(() => subjectsData?.data ?? [], [subjectsData])

  const [search, setSearch] = useState("")
  const [kelasFilter, setKelasFilter] = useState("all")
  const [guruFilter, setGuruFilter] = useState("all")
  const [mapelFilter, setMapelFilter] = useState("all")
  const [tanggalFilter, setTanggalFilter] = useState("")
  const [page, setPage] = useState(1)

  const totalSesi = sesiList.length
  const sesiSelesai = sesiList.filter(
    (s) => s.status === "Selesai"
  ).length
  const totalHadir = sesiList.reduce((acc, s) => acc + s.hadir, 0)
  const totalSiswaAll = sesiList.reduce(
    (acc, s) => acc + s.total_siswa,
    0
  )
  const rataRataKehadiran =
    totalSiswaAll > 0 ? Math.round((totalHadir / totalSiswaAll) * 100) : 0

  const filteredData = useMemo(() => {
    let data = [...sesiList]

    if (search) {
      const q = search.toLowerCase()
      data = data.filter(
        (s) =>
          s.mata_pelajaran.toLowerCase().includes(q) ||
          s.guru_nama.toLowerCase().includes(q) ||
          s.kelas.toLowerCase().includes(q)
      )
    }

    if (kelasFilter !== "all") {
      data = data.filter((s) => s.kelas === kelasFilter)
    }

    if (guruFilter !== "all") {
      data = data.filter((s) => s.guru_nama === guruFilter)
    }

    if (mapelFilter !== "all") {
      data = data.filter((s) => s.mata_pelajaran === mapelFilter)
    }

    if (tanggalFilter) {
      data = data.filter((s) => s.tanggal === tanggalFilter)
    }

    return data
  }, [sesiList, search, kelasFilter, guruFilter, mapelFilter, tanggalFilter])

  const totalPages = Math.ceil(filteredData.length / PER_PAGE)
  const paginatedData = filteredData.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  )

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
    { key: "guru_nama", header: "Guru" },
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
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Absensi"
        description="Kelola data absensi siswa"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Total Sesi</p>
            <p className="text-2xl font-bold">{totalSesi}</p>
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
            placeholder="Cari mata pelajaran, guru, atau kelas..."
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
            setKelasFilter(v ?? "all")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Semua Kelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kelas</SelectItem>
            {classes.map((k) => (
              <SelectItem key={k.id} value={k.name}>
                {k.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={guruFilter}
          onValueChange={(v) => {
            setGuruFilter(v ?? "all")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Semua Guru" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Guru</SelectItem>
            {teachers?.map((g) => (
              <SelectItem key={g.id} value={g.nama_lengkap}>
                {g.nama_lengkap}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={mapelFilter}
          onValueChange={(v) => {
            setMapelFilter(v ?? "all")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Semua Mapel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Mapel</SelectItem>
            {subjects.map((m) => (
              <SelectItem key={m.id} value={m.name}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={tanggalFilter}
          onChange={(e) => {
            setTanggalFilter(e.target.value)
            setPage(1)
          }}
          className="w-full sm:w-[160px]"
        />
      </div>

      <div>
        <DataTable<SesiRow>
          columns={columns}
          data={paginatedData as unknown as SesiRow[]}
          loading={isLoading}
          onRowClick={(item) => router.push(`/admin/absensi/${item.id}`)}
          emptyMessage={
            isError
              ? "Gagal memuat data sesi absensi"
              : "Tidak ada data sesi absensi"
          }
        />
        {isError && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 py-4 px-4 text-center text-sm text-destructive mt-4">
            Terjadi kesalahan saat memuat data absensi.{" "}
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
