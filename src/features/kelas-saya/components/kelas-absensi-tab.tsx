"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EmptyState } from "@/components/ui/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  Plus,
  Loader2,
  Save,
  CalendarDays,
  Play,
  Square,
  CheckCircle2,
  XCircle,
  UserCheck,
  ClipboardCheck,
} from "lucide-react"
import {
  STATUS_KEHADIRAN_OPTIONS,
  STATUS_SESI_COLORS,
} from "@/features/absensi/constants/absensi.constants"
import {
  useAttendanceByClass,
  useAttendanceDetail,
  useCreateAttendanceForClass,
  useSaveAttendanceRecords,
  useUpdateAttendanceSessionStatus,
} from "@/hooks/use-attendance"
import { useClassroom } from "@/hooks/use-classroom"
import type { KelasMengajar } from "@/features/kelas-mengajar/types/kelas-mengajar"
import type {
  MetodeAbsensi,
  SesiAbsensi,
  StatusKehadiran,
} from "@/features/absensi/types/absensi"
import type { AttendanceSessionDetail } from "@/lib/services/attendance.service"
import type { Siswa } from "@/features/siswa/types/siswa"

interface KelasAbsensiTabProps {
  kelasMengajar: KelasMengajar
}

function formatTanggalID(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function todayStr(): string {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${d.getFullYear()}-${m}-${day}`
}

const METODE_COLORS: Record<MetodeAbsensi, string> = {
  Guru: "bg-indigo-100 text-indigo-800",
  Siswa: "bg-cyan-100 text-cyan-800",
}

const STATUS_SOLID_COLORS: Record<StatusKehadiran, string> = {
  Hadir: "bg-green-600 text-white border-green-600 hover:bg-green-700",
  Izin: "bg-blue-600 text-white border-blue-600 hover:bg-blue-700",
  Sakit: "bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600",
  Alpha: "bg-red-600 text-white border-red-600 hover:bg-red-700",
  Terlambat:
    "bg-orange-500 text-white border-orange-500 hover:bg-orange-600",
}

export function KelasAbsensiTab({ kelasMengajar }: KelasAbsensiTabProps) {
  const classroom = useClassroom()
  const roster = classroom.getAnggotaKelas(kelasMengajar.kelas)

  const {
    data: sessions = [],
    isLoading,
    isError,
    refetch,
  } = useAttendanceByClass(kelasMengajar.id)

  const [createOpen, setCreateOpen] = useState(false)
  const [method, setMethod] = useState<MetodeAbsensi>("Guru")
  const [tanggal, setTanggal] = useState(todayStr)
  const [jamMulai, setJamMulai] = useState("")
  const [jamSelesai, setJamSelesai] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const createForClass = useCreateAttendanceForClass()
  const updateStatus = useUpdateAttendanceSessionStatus()

  const expandedSession = sessions.find((s) => s.id === expandedId) ?? null

  async function handleCreate() {
    if (!tanggal) {
      toast.error("Tanggal wajib diisi")
      return
    }
    setIsSubmitting(true)
    try {
      const session = await createForClass.mutateAsync({
        teaching_class_id: kelasMengajar.id,
        metode: method,
        tanggal,
        jam_mulai: jamMulai || null,
        jam_selesai: jamSelesai || null,
      })
      setCreateOpen(false)
      setJamMulai("")
      setJamSelesai("")
      setExpandedId(session.id)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleOpenSession(session: SesiAbsensi) {
    setExpandedId(session.id)
    await updateStatus.mutateAsync({ id: session.id, status: "Berlangsung" })
  }

  async function handleCloseSession(session: SesiAbsensi) {
    await updateStatus.mutateAsync({ id: session.id, status: "Selesai" })
  }

  const sortedSessions = [...sessions].sort((a, b) =>
    b.tanggal.localeCompare(a.tanggal)
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">
            Absensi Kelas {kelasMengajar.kelas}
          </h3>
          <p className="text-sm text-muted-foreground">
            {roster.length} siswa · kelola absensi setiap pertemuan
          </p>
        </div>
        <Button
          onClick={() => {
            setMethod("Guru")
            setTanggal(todayStr())
            setCreateOpen(true)
          }}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Mulai Pertemuan
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : sortedSessions.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title="Belum Ada Pertemuan"
          description="Klik 'Mulai Pertemuan' untuk memulai absensi kelas ini."
        />
      ) : (
        <div className="space-y-3">
          {sortedSessions.map((session) => (
            <div key={session.id}>
              <Card className="hover:border-primary/40 transition-colors">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                        <CalendarDays className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold">
                          {formatTanggalID(session.tanggal)}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                          <span>
                            {session.jam_mulai
                              ? `${session.jam_mulai}${session.jam_selesai ? ` - ${session.jam_selesai}` : ""}`
                              : "Jam fleksibel"}
                          </span>
                          <span>·</span>
                          <Badge className={METODE_COLORS[session.metode]}>
                            {session.metode === "Guru"
                              ? "Guru Mengabsen"
                              : "Siswa Absen Sendiri"}
                          </Badge>
                          <Badge
                            className={
                              STATUS_SESI_COLORS[session.status] ?? ""
                            }
                          >
                            {session.status}
                          </Badge>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="text-right mr-1">
                        <p className="text-lg font-bold leading-none">
                          {session.hadir}
                          <span className="text-sm text-muted-foreground font-normal">
                            /{roster.length}
                          </span>
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Hadir
                        </p>
                      </div>

                      {session.status === "Belum" &&
                        session.metode === "Siswa" && (
                          <Button
                            size="sm"
                            onClick={() => handleOpenSession(session)}
                          >
                            <Play className="mr-1.5 h-4 w-4" />
                            Buka Absensi
                          </Button>
                        )}

                      {session.status === "Berlangsung" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setExpandedId(
                              expandedId === session.id
                                ? null
                                : session.id
                            )
                          }
                        >
                          <UserCheck className="mr-1.5 h-4 w-4 text-green-600" />
                          Lihat Status
                        </Button>
                      )}

                      {session.status === "Berlangsung" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleCloseSession(session)}
                        >
                          <Square className="mr-1.5 h-4 w-4" />
                          Tutup Absensi
                        </Button>
                      )}

                      {(session.status === "Selesai" ||
                        (session.status === "Belum" &&
                          session.metode === "Guru")) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setExpandedId(
                              expandedId === session.id
                                ? null
                                : session.id
                            )
                          }
                        >
                          {session.status === "Selesai" ? (
                            <>
                              <CheckCircle2 className="mr-1.5 h-4 w-4 text-green-600" />
                              Detail & Edit
                            </>
                          ) : (
                            <>
                              <ClipboardCheck className="mr-1.5 h-4 w-4 text-primary" />
                              Input Absensi
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {expandedId === session.id && expandedSession && (
                <AbsensiPanel
                  key={session.id}
                  session={expandedSession}
                  roster={roster}
                  onClose={() => setExpandedId(null)}
                  onRefetch={refetch}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 py-4 px-4 text-center text-sm text-destructive">
          Terjadi kesalahan saat memuat data absensi.{" "}
          <button onClick={() => refetch()} className="underline font-medium">
            Muat ulang
          </button>
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mulai Pertemuan</DialogTitle>
            <DialogDescription>
              Pilih metode absensi untuk pertemuan {kelasMengajar.mata_pelajaran}{" "}
              kelas {kelasMengajar.kelas}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Metode Absensi
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod("Guru")}
                  className={cn(
                    "rounded-lg border p-3 text-left transition-colors",
                    method === "Guru"
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:bg-muted"
                  )}
                >
                  <p className="text-sm font-semibold">Guru Mengabsen</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Guru mencatat kehadiran seluruh siswa
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("Siswa")}
                  className={cn(
                    "rounded-lg border p-3 text-left transition-colors",
                    method === "Siswa"
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:bg-muted"
                  )}
                >
                  <p className="text-sm font-semibold">Siswa Absen Sendiri</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Siswa menekan tombol Absen pada kelas ini
                  </p>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label className="text-xs text-muted-foreground">
                  Tanggal
                </Label>
                <Input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Jam Mulai
                </Label>
                <Input
                  type="time"
                  value={jamMulai}
                  onChange={(e) => setJamMulai(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Jam Selesai
                </Label>
                <Input
                  type="time"
                  value={jamSelesai}
                  onChange={(e) => setJamSelesai(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button onClick={handleCreate} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              Mulai Pertemuan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============================================================================
// Expanded panel: live self-attendance status OR editable roster
// ============================================================================

function AbsensiPanel({
  session,
  roster,
  onClose,
  onRefetch,
}: {
  session: SesiAbsensi
  roster: Siswa[]
  onClose: () => void
  onRefetch: () => void
}) {
  const { data: detail, isLoading: detailLoading } = useAttendanceDetail(
    session.id
  )
  const updateStatus = useUpdateAttendanceSessionStatus()

  if (detailLoading || !detail) {
    return (
      <div className="mt-2 rounded-xl border border-border bg-card p-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-6 w-full mt-3" />
      </div>
    )
  }

  // -- Self-attendance live view (session open) ---------------------------
  if (session.status === "Berlangsung") {
    const recordStatus = new Map(
      detail.records.map((r) => [r.siswa_id, r.status])
    )
    const sudah = detail.records.filter((r) => r.status === "Hadir").length
    const belum = roster.length - sudah

    return (
      <div className="mt-2 rounded-xl border border-primary/30 bg-primary/5 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              </span>
              Absensi Sedang Berlangsung
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {sudah} siswa sudah absen · {belum} belum absen
            </p>
          </div>
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive"
            onClick={() => updateStatus.mutateAsync({ id: session.id, status: "Selesai" })}
          >
            <Square className="mr-1.5 h-4 w-4" />
            Tutup Absensi
          </Button>
        </div>

        <div className="mt-3 rounded-lg border border-border bg-background overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-3 py-2 font-medium text-muted-foreground w-10">
                  No
                </th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                  Nama Siswa
                </th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {roster.map((siswa, index) => {
                const status = recordStatus.get(siswa.id)
                return (
                  <tr key={siswa.id} className="border-t border-border">
                    <td className="px-3 py-2 text-muted-foreground">
                      {index + 1}
                    </td>
                    <td className="px-3 py-2 font-medium">
                      {siswa.nama_lengkap}
                    </td>
                    <td className="px-3 py-2">
                      {status ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Sudah Absen
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          <XCircle className="mr-1 h-3 w-3" />
                          Belum Absen
                        </Badge>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // -- Editable roster (teacher mode in progress OR closed session) -------
  return (
    <EditableRoster
      session={session}
      detail={detail}
      roster={roster}
      onClose={onClose}
      onRefetch={onRefetch}
    />
  )
}

function EditableRoster({
  session,
  detail,
  roster,
  onClose,
  onRefetch,
}: {
  session: SesiAbsensi
  detail: AttendanceSessionDetail
  roster: Siswa[]
  onClose: () => void
  onRefetch: () => void
}) {
  const saveMutation = useSaveAttendanceRecords(session.id)
  const [isSaving, setIsSaving] = useState(false)

  const statusMap = new Map<number, StatusKehadiran>()
  for (const rec of detail.records) {
    statusMap.set(rec.siswa_id, rec.status)
  }
  const defaultForMissing: StatusKehadiran =
    detail.records.length > 0 ? "Alpha" : "Hadir"
  for (const siswa of roster) {
    if (!statusMap.has(siswa.id)) {
      statusMap.set(siswa.id, defaultForMissing)
    }
  }
  const [localStatus, setLocalStatus] = useState<Map<number, StatusKehadiran>>(
    () => new Map(statusMap)
  )

  const updateStatusFor = (siswaId: number, status: StatusKehadiran) => {
    setLocalStatus((prev) => {
      const next = new Map(prev)
      next.set(siswaId, status)
      return next
    })
  }

  const markAllHadir = () => {
    setLocalStatus((prev) => {
      const next = new Map(prev)
      for (const siswa of roster) next.set(siswa.id, "Hadir")
      return next
    })
  }

  async function handleSave() {
    const records = roster.map((siswa) => ({
      student_id: siswa.id,
      status: localStatus.get(siswa.id) ?? "Hadir",
      keterangan: null,
    }))
    if (records.length === 0) {
      toast.error("Tidak ada data siswa untuk disimpan")
      return
    }
    setIsSaving(true)
    try {
      await saveMutation.mutateAsync(records)
      onClose()
      onRefetch()
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="mt-2 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-primary" />
          <div>
            <p className="font-semibold">
              {session.status === "Selesai"
                ? "Perbaiki Status Absensi"
                : "Input Status Absensi"}
            </p>
            <p className="text-xs text-muted-foreground">
              Semua siswa otomatis Hadir. Ubah jika diperlukan.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={markAllHadir}>
            <UserCheck className="mr-1.5 h-4 w-4 text-green-600" />
            Tandai Semua Hadir
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left px-3 py-2 font-medium text-muted-foreground w-10">
                No
              </th>
              <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                Nama Siswa
              </th>
              <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {roster.map((siswa, index) => {
              const current = localStatus.get(siswa.id) ?? "Hadir"
              return (
                <tr key={siswa.id} className="border-t border-border">
                  <td className="px-3 py-2 text-muted-foreground">
                    {index + 1}
                  </td>
                  <td className="px-3 py-2 font-medium">
                    {siswa.nama_lengkap}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1 flex-wrap">
                      {STATUS_KEHADIRAN_OPTIONS.map((status) => (
                        <button
                          key={status}
                          onClick={() => updateStatusFor(siswa.id, status)}
                          className={cn(
                            "px-2 py-1 rounded-lg text-xs font-medium border transition-all",
                            current === status
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
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-1.5 h-4 w-4" />
          )}
          Simpan Absensi
        </Button>
      </div>
    </div>
  )
}
