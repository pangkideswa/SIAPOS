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
import { FileText, Download, User, Calendar, HardDrive, Globe } from "lucide-react"
import type { Materi } from "@/features/materi/types/materi"
import { MateriJenisBadge } from "@/features/materi/components/materi-jenis-badge"
import { formatTanggal } from "@/features/kelas-saya/lib/kelas-saya-helpers"

interface MateriViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  materi: Materi | null
}

function getEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`
    }
    const v = parsed.searchParams.get("v")
    if (v) return `https://www.youtube.com/embed/${v}`
  } catch {
    return null
  }
  return null
}

export function MateriViewDialog({
  open,
  onOpenChange,
  materi,
}: MateriViewDialogProps) {
  if (!materi) return null

  const embedUrl = materi.video_url ? getEmbedUrl(materi.video_url) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 flex-wrap">
            <DialogTitle>{materi.judul}</DialogTitle>
            {materi.status !== "Publish" && (
              <Badge className="bg-yellow-100 text-yellow-800">
                Draft
              </Badge>
            )}
          </div>
          <DialogDescription className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {materi.guru_nama}
            </span>
            <span>{materi.mata_pelajaran}</span>
            <Badge variant="outline">{materi.kelas}</Badge>
            {materi.pertemuan && (
              <Badge variant="secondary">Pertemuan {materi.pertemuan}</Badge>
            )}
            <MateriJenisBadge jenis={materi.jenis_materi} />
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatTanggal(materi.created_at)}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {materi.thumbnail_url && (
            <div className="relative w-full h-48 rounded-lg border border-border overflow-hidden bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={materi.thumbnail_url}
                alt={materi.judul}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {materi.deskripsi && (
            <p className="text-sm text-muted-foreground">
              {materi.deskripsi}
            </p>
          )}

          {embedUrl && (
            <div className="aspect-video w-full overflow-hidden rounded-lg border border-border bg-black">
              <iframe
                src={embedUrl}
                title={materi.judul}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {materi.isi_materi && (
            <div
              className="prose prose-sm max-w-none p-4 rounded-lg border border-border bg-muted/30"
              dangerouslySetInnerHTML={{ __html: materi.isi_materi }}
            />
          )}

          {materi.lampiran.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold">Lampiran</p>
              {materi.lampiran.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 shrink-0">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.nama}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {file.ukuran} · {file.tipe}
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

          {(materi.link_drive || materi.link_eksternal) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {materi.link_drive && (
                <a
                  href={materi.link_drive}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-yellow-100 text-yellow-700 shrink-0">
                    <HardDrive className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">Google Drive</p>
                    <p className="text-xs text-muted-foreground truncate">
                      Buka materi di Google Drive
                    </p>
                  </div>
                </a>
              )}
              {materi.link_eksternal && (
                <a
                  href={materi.link_eksternal}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 shrink-0">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">Link Eksternal</p>
                    <p className="text-xs text-muted-foreground truncate">
                      Buka tautan eksternal
                    </p>
                  </div>
                </a>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
