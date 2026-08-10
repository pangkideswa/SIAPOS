"use client"

import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Video,
  Image as ImageIcon,
  Link2,
  HardDrive,
  Type,
  File,
  type LucideIcon,
} from "lucide-react"
import type { JenisMateri } from "@/features/materi/types/materi"

const JENIS_META: Record<
  JenisMateri,
  { icon: LucideIcon; className: string }
> = {
  PDF: { icon: FileText, className: "bg-red-100 text-red-700" },
  DOCX: { icon: FileText, className: "bg-blue-100 text-blue-700" },
  PPTX: { icon: File, className: "bg-orange-100 text-orange-700" },
  Gambar: { icon: ImageIcon, className: "bg-pink-100 text-pink-700" },
  Video: { icon: Video, className: "bg-red-100 text-red-700" },
  Drive: { icon: HardDrive, className: "bg-yellow-100 text-yellow-700" },
  URL: { icon: Link2, className: "bg-indigo-100 text-indigo-700" },
  Lainnya: { icon: Type, className: "bg-muted text-foreground" },
}

interface MateriJenisBadgeProps {
  jenis: JenisMateri
}

export function MateriJenisBadge({ jenis }: MateriJenisBadgeProps) {
  const meta = JENIS_META[jenis] ?? JENIS_META.Lainnya
  const Icon = meta.icon
  return (
    <Badge variant="outline" className="gap-1.5 font-normal">
      <span
        className={`flex h-4 w-4 items-center justify-center rounded ${meta.className}`}
      >
        <Icon className="h-2.5 w-2.5" />
      </span>
      {jenis}
    </Badge>
  )
}
