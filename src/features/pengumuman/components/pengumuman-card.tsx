"use client"

import { Pin, CalendarDays, User, Target, Paperclip } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Pengumuman } from "../types/pengumuman"
import {
  KATEGORI_PENGUMUMAN_COLORS,
  TARGET_COLORS,
} from "../constants/pengumuman.constants"
import { formatDateID } from "@/features/kalender-akademik/components/kalender-helpers"

interface AnnouncementCardProps {
  data: Pengumuman
  onClick?: () => void
}

export function AnnouncementCard({ data, onClick }: AnnouncementCardProps) {
  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          {data.pinned && (
            <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
              <Pin className="h-3 w-3" />
              Penting
            </Badge>
          )}
          <Badge className={KATEGORI_PENGUMUMAN_COLORS[data.kategori]}>
            {data.kategori}
          </Badge>
          <Badge className={TARGET_COLORS[data.target]}>
            <Target className="h-3 w-3 mr-0.5" />
            {data.target}
            {data.target === "Kelas Tertentu" && data.kelas ? ` · ${data.kelas}` : ""}
          </Badge>
        </div>

        <div>
          <h3 className="font-semibold text-sm leading-snug line-clamp-2">
            {data.judul}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {data.ringkasan}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            {data.penulis}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDateID(data.tanggal_publish)}
          </span>
          {data.lampiran.length > 0 && (
            <span className="flex items-center gap-1">
              <Paperclip className="h-3.5 w-3.5" />
              {data.lampiran.length} lampiran
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
