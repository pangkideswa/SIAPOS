"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Eye, Search, Users } from "lucide-react"
import { useClasses } from "@/hooks/use-classes"
import { useTeachers } from "@/hooks/use-teachers"
import { STATUS_TUGAS_COLORS } from "@/features/tugas/constants/tugas.constants"
import { useAssignments } from "@/hooks/use-assignments"
import { useSubmissions } from "@/hooks/use-submissions"

interface TugasWithCount {
  id: number
  judul: string
  mata_pelajaran: string
  kelas: string
  guru_nama: string
  tenggat_waktu: string
  status: string
  jumlah_pengumpul: number
  total_siswa: number
}

export function PengumpulanListPage() {
  const router = useRouter()
  const {
    data: assignments = [],
    isLoading: isTableLoading,
    isError,
    refetch,
  } = useAssignments()

  const { data: classesData } = useClasses({ per_page: 200 })
  const classes = classesData?.data ?? []
  const { data: teachers } = useTeachers()
  const { data: submissions = [] } = useSubmissions()
  const [search, setSearch] = useState("")
  const [guruFilter, setGuruFilter] = useState<string>("semua")
  const [kelasFilter, setKelasFilter] = useState<string>("semua")
  const [statusFilter, setStatusFilter] = useState<string>("semua")
  const [page, setPage] = useState(1)

  const perPage = 10

  const tugasData: TugasWithCount[] = useMemo(() => {
    return assignments.map((t) => {
      const itemSubmissions = submissions.filter(
        (p) => p.tugas_id === t.id
      )
      const submitted = itemSubmissions.filter(
        (p) => p.status === "Sudah Mengumpulkan" || p.status === "Terlambat"
      ).length
      return {
        id: t.id,
        judul: t.judul,
        mata_pelajaran: t.mata_pelajaran,
        kelas: t.kelas,
        guru_nama: t.guru_nama,
        tenggat_waktu: t.tenggat_waktu,
        status: t.status,
        jumlah_pengumpul: submitted,
        total_siswa: itemSubmissions.length,
      }
    })
  }, [assignments, submissions])

  const filteredData = tugasData.filter((item) => {
    const matchesSearch =
      !search ||
      item.judul.toLowerCase().includes(search.toLowerCase()) ||
      item.mata_pelajaran.toLowerCase().includes(search.toLowerCase()) ||
      item.guru_nama.toLowerCase().includes(search.toLowerCase())
    const matchesGuru =
      guruFilter === "semua" || item.guru_nama === guruFilter
    const matchesKelas =
      kelasFilter === "semua" || item.kelas === kelasFilter
    const matchesStatus =
      statusFilter === "semua" || item.status === statusFilter
    return matchesSearch && matchesGuru && matchesKelas && matchesStatus
  })

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
      key: "judul",
      header: "Judul Tugas",
      render: (item) => (
        <div>
          <p className="font-medium">{String(item.judul)}</p>
          <p className="text-xs text-muted-foreground">
            {String(item.mata_pelajaran)} — {String(item.kelas)}
          </p>
        </div>
      ),
    },
    {
      key: "guru_nama",
      header: "Guru",
      render: (item) => String(item.guru_nama),
    },
    {
      key: "jumlah_pengumpul",
      header: "Pengumpul",
      render: (item) => {
        const submitted = Number(item.jumlah_pengumpul)
        const total = Number(item.total_siswa)
        return (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {submitted}/{total}
            </span>
          </div>
        )
      },
    },
    {
      key: "tenggat_waktu",
      header: "Tenggat",
      render: (item) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(String(item.tenggat_waktu))}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => {
        const status = String(item.status)
        return (
          <Badge className={STATUS_TUGAS_COLORS[status] ?? ""}>
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
            title="Lihat Pengumpulan"
            onClick={() =>
              router.push(`/guru/pengumpulan/${String(item.id)}`)
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
        title="Pengumpulan Tugas"
        description="Lihat dan kelola pengumpulan tugas dari siswa."
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari judul tugas, guru, atau mapel..."
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
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Dipublikasikan">Dipublikasikan</SelectItem>
            <SelectItem value="Ditutup">Ditutup</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={paginatedData as unknown as Record<string, unknown>[]}
        loading={isTableLoading}
        emptyMessage={
          isError ? "Gagal memuat data pengumpulan" : "Tidak ada pengumpulan ditemukan"
        }
        onRowClick={(item) =>
          router.push(`/guru/pengumpulan/${String(item.id)}`)
        }
      />

      {isError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 py-4 px-4 text-center text-sm text-destructive">
          Terjadi kesalahan saat memuat data pengumpulan.{" "}
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
