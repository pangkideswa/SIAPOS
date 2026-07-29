"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, BookOpen, Tag } from "lucide-react"
import type { KalenderEvent } from "../types/kalender-akademik"
import {
  KATEGORI_COLORS,
  STATUS_EVENT_COLORS,
} from "../constants/kalender-akademik.constants"
import { formatDateRange } from "./kalender-helpers"

interface DetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: KalenderEvent | null
}

export function KalenderEventDetailDialog({
  open,
  onOpenChange,
  event,
}: DetailDialogProps) {
  if (!event) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{event.nama_event}</DialogTitle>
          <DialogDescription>Detail event kalender akademik</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {event.deskripsi && (
            <p className="text-sm text-muted-foreground">{event.deskripsi}</p>
          )}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={KATEGORI_COLORS[event.kategori]}>
                  {event.kategori}
                </Badge>
                <Badge className={STATUS_EVENT_COLORS[event.status]}>
                  {event.status}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm">
                {formatDateRange(event.tanggal_mulai, event.tanggal_selesai)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm">
                {event.tahun_ajaran} - {event.semester}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
