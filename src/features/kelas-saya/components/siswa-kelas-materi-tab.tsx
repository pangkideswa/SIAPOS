"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText, Video, Type, Globe, Eye } from "lucide-react"
import { MateriViewDialog } from "@/features/kelas-saya/components/materi-view-dialog"
import { MateriJenisBadge } from "@/features/materi/components/materi-jenis-badge"
import { EmptyState } from "@/components/ui/empty-state"
import { getKelasMateri } from "@/features/kelas-saya/lib/kelas-saya-helpers"
import type { Materi } from "@/features/materi/types/materi"
import type { KelasMengajar } from "@/features/kelas-mengajar/types/kelas-mengajar"

interface SiswaKelasMateriTabProps {
  kelasMengajar: KelasMengajar
}

function getJenisIkon(materi: Materi) {
  if (materi.jenis_materi === "Video" || materi.video_url)
    return { icon: Video, label: "Video", className: "text-red-500 bg-red-500/10" }
  if (materi.jenis_materi === "Drive")
    return { icon: Globe, label: "Drive", className: "text-yellow-600 bg-yellow-600/10" }
  if (materi.jenis_materi === "URL")
    return { icon: Globe, label: "URL", className: "text-indigo-600 bg-indigo-600/10" }
  if (materi.jenis_materi !== "Lainnya")
    return { icon: FileText, label: materi.jenis_materi, className: "text-blue-600 bg-blue-600/10" }
  if (materi.lampiran.length > 0)
    return { icon: FileText, label: "File", className: "text-blue-600 bg-blue-600/10" }
  if (materi.isi_materi)
    return { icon: Type, label: "Teks", className: "text-purple-600 bg-purple-600/10" }
  return { icon: Globe, label: "Lainnya", className: "text-gray-600 bg-gray-600/10" }
}

export function SiswaKelasMateriTab({
  kelasMengajar,
}: SiswaKelasMateriTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [viewingItem, setViewingItem] = useState<Materi | null>(null)

  const materiList = getKelasMateri(kelasMengajar.id).filter(
    (m) => m.status === "Publish"
  )

  if (materiList.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Belum Ada Materi"
        description="Materi dari guru belum dipublikasikan pada kelas ini."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {materiList.map((materi) => {
        const jenis = getJenisIkon(materi)
        const JenisIcon = jenis.icon
        return (
          <Card
            key={materi.id}
            className="group flex flex-col hover:ring-primary/40 transition-all"
          >
            <CardContent className="p-4 flex flex-col flex-1 gap-3">
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${jenis.className}`}
                >
                  <JenisIcon className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  {materi.pertemuan && (
                    <Badge variant="secondary">
                      Pertemuan {materi.pertemuan}
                    </Badge>
                  )}
                  <MateriJenisBadge jenis={materi.jenis_materi} />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold leading-snug group-hover:text-primary transition-colors">
                  {materi.judul}
                </h4>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {materi.deskripsi || "Tidak ada deskripsi."}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(materi.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  {materi.lampiran.length > 0 &&
                    ` · ${materi.lampiran.length} lampiran`}
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                onClick={() => {
                  setViewingItem(materi)
                  setDialogOpen(true)
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                Baca Materi
              </Button>
            </CardContent>
          </Card>
        )
      })}

      <MateriViewDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        materi={viewingItem}
      />
    </div>
  )
}
