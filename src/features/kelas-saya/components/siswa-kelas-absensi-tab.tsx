"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import {
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Loader2,
  Play,
  UserCheck,
} from "lucide-react"
import { STATUS_SESI_COLORS } from "@/features/absensi/constants/absensi.constants"
import {
  useAttendanceByClass,
  useMarkPresent,
} from "@/hooks/use-attendance"
import type { KelasMengajar } from "@/features/kelas-mengajar/types/kelas-mengajar"

interface SiswaKelasAbsensiTabProps {
  kelasMengajar: KelasMengajar
}

function formatTanggalID(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function SiswaKelasAbsensiTab({
  kelasMengajar,
}: SiswaKelasAbsensiTabProps) {
  const {
    data: sessions = [],
    isLoading,
    isError,
    refetch,
  } = useAttendanceByClass(kelasMengajar.id)
  const markPresent = useMarkPresent()
  const [submittingId, setSubmittingId] = useState<number | null>(null)

  const sortedSessions = [...sessions].sort((a, b) =>
    b.tanggal.localeCompare(a.tanggal)
  )

  async function handleAbsen(id: number) {
    setSubmittingId(id)
    try {
      await markPresent.mutateAsync(id)
    } finally {
      setSubmittingId(null)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold">
          Absensi Kelas {kelasMengajar.kelas}
        </h3>
        <p className="text-sm text-muted-foreground">
          Tekan tombol Absen ketika guru membuka sesi absensi.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : sortedSessions.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title="Belum Ada Sesi Absensi"
          description="Guru akan membuat sesi absensi pada kelas ini."
        />
      ) : (
        <div className="space-y-3">
          {sortedSessions.map((session) => {
            const isSubmitting = submittingId === session.id
            const dapatAbsen =
              session.status === "Berlangsung" && session.metode === "Siswa"
            return (
              <Card key={session.id}>
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
                          <span>{session.mata_pelajaran}</span>
                          <span>·</span>
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

                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                      {dapatAbsen ? (
                        session.saya_absen ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                            Sudah Absen
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleAbsen(session.id)}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                            ) : (
                              <Play className="mr-1.5 h-4 w-4" />
                            )}
                            Absen Sekarang
                          </Button>
                        )
                      ) : session.status === "Berlangsung" ? (
                        <Badge variant="outline" className="text-muted-foreground">
                          <UserCheck className="mr-1 h-3.5 w-3.5" />
                          Guru sedang mengabsen
                        </Badge>
                      ) : session.status === "Selesai" ? (
                        session.status_saya ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                            {session.status_saya}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            Belum tercatat
                          </Badge>
                        )
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          Belum dibuka
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
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
    </div>
  )
}
