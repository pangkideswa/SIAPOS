import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { STATUS_NILAI_COLORS } from "../constants/nilai-akademik.constants"
import type { NilaiAkademik } from "../types/nilai-akademik"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: NilaiAkademik | null
}

export function NilaiAkademikDetailDialog({ open, onOpenChange, data }: Props) {
  if (!data) return null

  const grades = [
    { label: "Nilai Tugas", value: data.tugas },
    { label: "Nilai Praktik", value: data.praktik },
    { label: "Nilai UTS", value: data.uts },
    { label: "Nilai UAS", value: data.uas },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detail Nilai Akademik</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Nama Siswa</p>
              <p className="font-medium text-sm">{data.siswa_nama}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Kelas</p>
              <p className="font-medium text-sm">{data.siswa_kelas}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Mata Pelajaran</p>
              <p className="font-medium text-sm">{data.mata_pelajaran}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Guru</p>
              <p className="font-medium text-sm">{data.guru_nama}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tahun Ajaran</p>
              <p className="font-medium text-sm">{data.tahun_ajaran}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Semester</p>
              <p className="font-medium text-sm">{data.semester}</p>
            </div>
          </div>

          <div className="border-t pt-3">
            <p className="text-xs text-muted-foreground mb-2">Komponen Nilai</p>
            <div className="grid grid-cols-2 gap-3">
              {grades.map((g) => (
                <div key={g.label} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <span className="text-sm">{g.label}</span>
                  <span className="font-semibold text-sm">
                    {g.value !== null ? g.value : "-"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-3">
            <p className="text-xs text-muted-foreground">Status</p>
            <Badge className={STATUS_NILAI_COLORS[data.status]}>
              {data.status}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
