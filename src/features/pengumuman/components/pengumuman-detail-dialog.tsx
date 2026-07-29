"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  CalendarDays,
  User,
  Target,
  Pin,
} from "lucide-react"
import type { Pengumuman } from "../types/pengumuman"
import {
  KATEGORI_PENGUMUMAN_COLORS,
  STATUS_PENGUMUMAN_COLORS,
  TARGET_COLORS,
} from "../constants/pengumuman.constants"
import { formatDateID } from "@/features/kalender-akademik/components/kalender-helpers"

interface DetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: Pengumuman | null
}

export function PengumumanDetailDialog({
  open,
  onOpenChange,
  data,
}: DetailDialogProps) {
  if (!data) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 flex-wrap">
            <DialogTitle>{data.judul}</DialogTitle>
            {data.pinned && (
              <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                <Pin className="h-3 w-3" />
                Pengumuman Penting
              </Badge>
            )}
          </div>
          <DialogDescription>Detail pengumuman</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge className={KATEGORI_PENGUMUMAN_COLORS[data.kategori]}>
              {data.kategori}
            </Badge>
            <Badge className={STATUS_PENGUMUMAN_COLORS[data.status]}>
              {data.status}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {data.penulis}
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {formatDateID(data.tanggal_publish)}
            </div>
            <div className="flex items-center gap-1.5">
              <Target className="h-4 w-4" />
              <Badge className={TARGET_COLORS[data.target]}>
                {data.target}
              </Badge>
            </div>
          </div>

          {data.ringkasan && (
            <p className="text-sm font-medium text-muted-foreground bg-muted/30 rounded-lg p-3">
              {data.ringkasan}
            </p>
          )}

          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {data.isi}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
