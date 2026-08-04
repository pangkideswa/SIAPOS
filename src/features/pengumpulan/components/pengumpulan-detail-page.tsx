"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable, type Column } from "@/components/ui/data-table"
import {
  ArrowLeft,
  User,
  BookOpen,
  School,
  Calendar,
  Eye,
} from "lucide-react"
import { JawabanDetailDialog } from "./jawaban-detail-dialog"
import { STATUS_PENGUMPULAN_COLORS } from "@/features/pengumpulan/constants/pengumpulan.constants"
import { STATUS_TUGAS_COLORS } from "@/features/tugas/constants/tugas.constants"
import { useAssignment } from "@/hooks/use-assignments"
import { useSubmissions } from "@/hooks/use-submissions"
import type { PengumpulanTugas } from "@/features/pengumpulan/types/pengumpulan"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value || "-"}</p>
      </div>
    </div>
  )
}

export function PengumpulanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [jawabanDialogOpen, setJawabanDialogOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] =
    useState<PengumpulanTugas | null>(null)

  const assignmentId = Number(resolvedParams.id)
  const {
    data: tugas,
    isLoading: isTugasLoading,
    isError,
    refetch,
  } = useAssignment(assignmentId)
  const { data: submissions = [], isLoading: isSubmissionsLoading } =
    useSubmissions(assignmentId)

  const submittedCount = submissions.filter(
    (p) => p.status === "Sudah Mengumpulkan" || p.status === "Terlambat"
  ).length

  function openJawaban(item: PengumpulanTugas) {
    setSelectedSubmission(item)
    setJawabanDialogOpen(true)
  }

  if (isTugasLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    )
  }

  if (!tugas) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Pengumpulan Tugas"
          description={isError ? "Terjadi kesalahan saat memuat tugas." : "Tugas tidak ditemukan."}
          action={
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push("/guru/pengumpulan")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
              {isError && (
                <Button variant="outline" onClick={() => refetch()}>
                  Muat Ulang
                </Button>
              )}
            </div>
          }
        />
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground py-12">
            {isError
              ? `Terjadi kesalahan saat memuat tugas dengan ID ${resolvedParams.id}.`
              : `Tugas dengan ID ${resolvedParams.id} tidak ditemukan.`}
          </CardContent>
        </Card>
      </div>
    )
  }

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "siswa_nama",
      header: "Nama Siswa",
      render: (item) => {
        const p = item as unknown as PengumpulanTugas
        return (
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">
              {p.siswa_nama
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div>
              <p className="font-medium text-sm">{p.siswa_nama}</p>
              <p className="text-xs text-muted-foreground">
                {p.siswa_kelas}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      key: "waktu_pengumpulan",
      header: "Waktu Kirim",
      render: (item) => {
        const p = item as unknown as PengumpulanTugas
        return p.waktu_pengumpulan ? (
          <span className="text-sm">
            {formatDateTime(p.waktu_pengumpulan)}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        )
      },
    },
    {
      key: "status",
      header: "Status",
      render: (item) => {
        const p = item as unknown as PengumpulanTugas
        return (
          <Badge className={STATUS_PENGUMPULAN_COLORS[p.status] ?? ""}>
            {p.status}
          </Badge>
        )
      },
    },
    {
      key: "nilai",
      header: "Nilai",
      render: (item) => {
        const p = item as unknown as PengumpulanTugas
        return p.nilai !== null ? (
          <span className="text-sm font-semibold">
            {p.nilai}/{tugas.nilai_maksimal}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        )
      },
    },
    {
      key: "actions",
      header: "",
      className: "w-[80px]",
      render: (item) => {
        const p = item as unknown as PengumpulanTugas
        return (
          <div onClick={(e) => e.stopPropagation()}>
            {p.status !== "Belum Mengumpulkan" && (
              <Button
                variant="ghost"
                size="icon-sm"
                title="Lihat Jawaban"
                onClick={() => openJawaban(p)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengumpulan Tugas"
        description={tugas.judul}
        action={
          <Button
            variant="outline"
            onClick={() => router.push("/guru/pengumpulan")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tugas Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Informasi Tugas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              <InfoRow icon={User} label="Guru" value={tugas.guru_nama} />
              <InfoRow
                icon={BookOpen}
                label="Mata Pelajaran"
                value={tugas.mata_pelajaran}
              />
              <InfoRow icon={School} label="Kelas" value={tugas.kelas} />
              <InfoRow
                icon={Calendar}
                label="Tenggat Waktu"
                value={formatDate(tugas.tenggat_waktu)}
              />
            </div>
            <div className="mt-4 space-y-2">
              <Badge className={STATUS_TUGAS_COLORS[tugas.status]}>
                {tugas.status}
              </Badge>
              <div className="text-sm text-muted-foreground">
                Pengumpul:{" "}
                <span className="font-semibold text-foreground">
                  {submittedCount}/{submissions.length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submissions Table */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Daftar Pengumpulan ({submissions.length} siswa)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={submissions as unknown as Record<string, unknown>[]}
                loading={isSubmissionsLoading}
                emptyMessage="Belum ada pengumpulan."
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <JawabanDetailDialog
        open={jawabanDialogOpen}
        onOpenChange={setJawabanDialogOpen}
        submission={selectedSubmission}
        nilaiMaksimal={tugas.nilai_maksimal}
      />
    </div>
  )
}
