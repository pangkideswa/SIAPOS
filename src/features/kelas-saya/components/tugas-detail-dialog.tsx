"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Download,
  Calendar,
  ClipboardList,
  Users,
} from "lucide-react"
import { STATUS_TUGAS_COLORS } from "@/features/tugas/constants/tugas.constants"
import { formatTanggal } from "@/features/kelas-saya/lib/kelas-saya-helpers"
import { useClassroom } from "@/hooks/use-classroom"
import type { Tugas } from "@/features/tugas/types/tugas"

interface TugasDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tugas: Tugas | null
}

export function TugasDetailDialog({
  open,
  onOpenChange,
  tugas,
}: TugasDetailDialogProps) {
  const classroom = useClassroom()

  if (!tugas) return null

  const pengumpulan = classroom.getTugasPengumpulan(tugas.id)
  const sudah = pengumpulan.filter(
    (p) => p.status !== "Belum Mengumpulkan"
  ).length
  const terlambat = pengumpulan.filter((p) => p.status === "Terlambat").length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 flex-wrap">
            <DialogTitle>{tugas.judul}</DialogTitle>
            <Badge className={STATUS_TUGAS_COLORS[tugas.status] ?? ""}>
              {tugas.status}
            </Badge>
          </div>
          <DialogDescription className="flex items-center gap-2 flex-wrap">
            <span>{tugas.mata_pelajaran}</span>
            <Badge variant="outline">{tugas.kelas}</Badge>
            <span>{tugas.guru_nama}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {tugas.deskripsi && (
            <p className="text-sm text-muted-foreground">{tugas.deskripsi}</p>
          )}

          <div className="grid grid-cols-2 gap-3 rounded-lg border border-border p-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Tanggal Dibuka</p>
              <p className="font-medium mt-0.5">
                {formatTanggal(tugas.tanggal_dibuka)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tenggat Waktu</p>
              <p className="font-medium mt-0.5">
                {formatTanggal(tugas.tenggat_waktu)}
                {tugas.tenggat_jam ? ` ${tugas.tenggat_jam} WIB` : ""}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Nilai Maksimal</p>
              <p className="font-medium mt-0.5">{tugas.nilai_maksimal}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pengumpulan</p>
              <p className="font-medium mt-0.5">
                {sudah} siswa{" "}
                {terlambat > 0 && (
                  <span className="text-xs text-destructive">
                    ({terlambat} terlambat)
                  </span>
                )}
              </p>
            </div>
          </div>

          {tugas.lampiran.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold">Lampiran Tugas</p>
              {tugas.lampiran.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-orange-500/10 shrink-0">
                      <FileText className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.nama}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {file.ukuran}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon-sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm font-semibold flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              Ringkasan Pengumpulan
            </p>
            {pengumpulan.length === 0 ? (
              <p className="text-sm text-muted-foreground py-3 text-center border border-dashed rounded-lg">
                Belum ada siswa yang mengumpulkan.
              </p>
            ) : (
              <div className="max-h-48 overflow-y-auto space-y-1.5">
                {pengumpulan.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-lg border border-border p-2.5"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                      <p className="text-sm truncate">{p.siswa_nama}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {p.nilai !== null && (
                        <Badge variant="secondary">{p.nilai}</Badge>
                      )}
                      <Badge
                        className={
                          p.status === "Sudah Mengumpulkan"
                            ? "bg-green-100 text-green-800"
                            : p.status === "Terlambat"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                        }
                      >
                        {p.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            Dibuat pada {formatTanggal(tugas.created_at)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
