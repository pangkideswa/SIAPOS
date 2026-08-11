"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FileText,
  GraduationCap,
  Inbox,
  MessageSquareText,
} from "lucide-react"
import { toast } from "sonner"
import { EmptyState } from "@/components/ui/empty-state"
import { JawabanDetailDialog } from "@/features/pengumpulan/components/jawaban-detail-dialog"
import { pushNotifikasi } from "@/features/notifications/lib/notifikasi-service"
import {
  formatWaktuPengumpulan,
} from "@/features/kelas-saya/lib/kelas-saya-helpers"
import { getInitials } from "@/lib/utils"
import { useClassroom } from "@/hooks/use-classroom"
import type { PengumpulanTugas } from "@/features/pengumpulan/types/pengumpulan"
import type { KelasMengajar } from "@/features/kelas-mengajar/types/kelas-mengajar"
import type { Siswa } from "@/features/siswa/types/siswa"
import { cn } from "@/lib/utils"

interface KelasPengumpulanTabProps {
  kelasMengajar: KelasMengajar
}

type FilterStatus = "Semua" | "Sudah Mengumpulkan" | "Belum Mengumpulkan" | "Terlambat"

const FILTER_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: "Semua", label: "Semua" },
  { value: "Sudah Mengumpulkan", label: "Sudah" },
  { value: "Belum Mengumpulkan", label: "Belum" },
  { value: "Terlambat", label: "Terlambat" },
]

const STATUS_BADGE_CLASS: Record<string, string> = {
  "Belum Mengumpulkan": "bg-muted text-foreground",
  "Sudah Mengumpulkan": "bg-green-100 text-green-800",
  Terlambat: "bg-red-100 text-red-800",
}

interface NilaiRow {
  siswa: Siswa
  submission: PengumpulanTugas
  isVirtual: boolean
}

export function KelasPengumpulanTab({ kelasMengajar }: KelasPengumpulanTabProps) {
  const classroom = useClassroom()
  const tugasList = classroom.getKelasTugas(kelasMengajar.id)
  const [selectedTugasId, setSelectedTugasId] = useState<number>(
    () => tugasList[0]?.id ?? 0
  )
  const [filter, setFilter] = useState<FilterStatus>("Semua")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<NilaiRow | null>(null)

  const selectedTugas = tugasList.find((t) => t.id === selectedTugasId) ?? null

  const rows = useMemo<NilaiRow[]>(() => {
    if (!selectedTugas) return []
    const roster = classroom.getAnggotaKelas(kelasMengajar.kelas)
    const submissions = classroom.getTugasPengumpulan(selectedTugas.id)
    return roster.map((siswa) => {
      const sub = submissions.find((p) => p.siswa_id === siswa.id)
      if (sub) {
        return { siswa, submission: sub, isVirtual: false }
      }
      return {
        siswa,
        submission: {
          id: -1,
          tugas_id: selectedTugas.id,
          siswa_id: siswa.id,
          siswa_nama: siswa.nama_lengkap,
          siswa_kelas: siswa.kelas,
          file_jawaban: null,
          catatan: "",
          waktu_pengumpulan: null,
          status: "Belum Mengumpulkan" as const,
          nilai: null,
          created_at: "",
          updated_at: "",
        },
        isVirtual: true,
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTugas, kelasMengajar.kelas, classroom.submissions])

  const filteredRows = rows.filter(
    (r) => filter === "Semua" || r.submission.status === filter
  )

  const sudahCount = rows.filter(
    (r) => r.submission.status === "Sudah Mengumpulkan"
  ).length
  const belumCount = rows.filter(
    (r) => r.submission.status === "Belum Mengumpulkan"
  ).length
  const terlambatCount = rows.filter(
    (r) => r.submission.status === "Terlambat"
  ).length
  const dinilaiCount = rows.filter(
    (r) => r.submission.nilai !== null
  ).length

  function openDetail(row: NilaiRow) {
    setSelectedRow(row)
    setDialogOpen(true)
  }

  function handleGraded(submission: PengumpulanTugas) {
    pushNotifikasi({
      tipe: "penilaian",
      judul: `Tugas kamu sudah dinilai`,
      pesan: `Tugas "${selectedTugas?.judul ?? "Tugas"}" telah dinilai: ${submission.nilai}.`,
      href: `/siswa/kelas/${kelasMengajar.id}`,
      target_roles: ["siswa"],
    })
    toast.success(
      `Nilai ${submission.siswa_nama} disimpan dan siswa dinotifikasi`
    )
  }

  function handleReturned(submission: PengumpulanTugas) {
    pushNotifikasi({
      tipe: "penilaian",
      judul: `Tugas kamu dikembalikan`,
      pesan: `Tugas "${selectedTugas?.judul ?? "Tugas"}" dikembalikan oleh guru. Silakan periksa dan perbaiki jawabanmu.`,
      href: `/siswa/kelas/${kelasMengajar.id}`,
      target_roles: ["siswa"],
    })
    toast.success(
      `Tugas ${submission.siswa_nama} dikembalikan dan siswa dinotifikasi`
    )
  }

  if (tugasList.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="Belum Ada Tugas"
        description="Buat tugas terlebih dahulu di tab Tugas untuk mulai menilai."
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="w-full sm:w-72">
          <Select
            value={selectedTugasId ? String(selectedTugasId) : ""}
            onValueChange={(v: string | null) => {
              setSelectedTugasId(Number(v))
              setSelectedRow(null)
              setDialogOpen(false)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih tugas" />
            </SelectTrigger>
            <SelectContent>
              {tugasList.map((t) => (
                <SelectItem key={t.id} value={String(t.id)}>
                  {t.judul}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">
            {sudahCount} sudah · {belumCount} belum · {terlambatCount}{" "}
            terlambat · {dinilaiCount} dinilai
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors border",
              filter === opt.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:bg-muted"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {filteredRows.length === 0 ? (
        <EmptyState
          title="Tidak Ada Siswa"
          description="Tidak ada siswa yang sesuai dengan filter ini."
        />
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="hidden md:grid grid-cols-[minmax(0,1.5fr)_1fr_1fr_1fr_0.8fr_0.6fr] gap-3 bg-muted/50 px-4 py-2.5 text-xs font-medium text-muted-foreground">
            <span>Siswa</span>
            <span>Status</span>
            <span>Waktu</span>
            <span>File</span>
            <span>Nilai</span>
            <span className="text-right">Aksi</span>
          </div>
          <div className="divide-y divide-border">
            {filteredRows.map((row) => (
              <div
                key={row.siswa.id}
                className="grid grid-cols-1 md:grid-cols-[minmax(0,1.5fr)_1fr_1fr_1fr_0.8fr_0.6fr] gap-2 md:gap-3 px-4 py-3 items-center"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">
                    {getInitials(row.siswa.nama_lengkap)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {row.siswa.nama_lengkap}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {row.siswa.nis}
                    </p>
                  </div>
                </div>

                <div>
                  <Badge
                    className={
                      STATUS_BADGE_CLASS[row.submission.status] ?? ""
                    }
                  >
                    {row.submission.status}
                  </Badge>
                </div>

                <div>
                  {row.submission.waktu_pengumpulan ? (
                    <span className="text-xs text-muted-foreground">
                      {formatWaktuPengumpulan(
                        row.submission.waktu_pengumpulan
                      )}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      -
                    </span>
                  )}
                </div>

                <div>
                  {row.submission.file_jawaban ? (
                    <Button variant="ghost" size="icon-sm" title="Unduh">
                      <FileText className="h-4 w-4 text-primary" />
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {row.submission.nilai !== null ? (
                    <>
                      <Badge variant="secondary" className="font-semibold">
                        {row.submission.nilai}
                      </Badge>
                      {row.submission.feedback && (
                        <MessageSquareText
                          className="h-3.5 w-3.5 text-muted-foreground"
                          aria-label="Ada umpan balik"
                        />
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </div>

                <div className="md:text-right">
                  <Button
                    size="sm"
                    variant={
                      row.submission.nilai !== null ? "outline" : "default"
                    }
                    className={
                      row.submission.nilai === null
                        ? "bg-primary hover:bg-primary/90"
                        : undefined
                    }
                    disabled={row.isVirtual}
                    onClick={() => openDetail(row)}
                  >
                    <GraduationCap className="mr-1.5 h-3.5 w-3.5" />
                    {row.submission.nilai !== null ? "Detail" : "Nilai"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <JawabanDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        submission={
          selectedRow && !selectedRow.isVirtual
            ? selectedRow.submission
            : null
        }
        nilaiMaksimal={selectedTugas?.nilai_maksimal ?? 100}
        onGraded={handleGraded}
        onReturned={handleReturned}
      />
    </div>
  )
}
