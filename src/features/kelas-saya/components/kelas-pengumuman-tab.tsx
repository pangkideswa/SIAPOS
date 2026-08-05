"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EmptyState } from "@/components/ui/empty-state"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import {
  Megaphone,
  Plus,
  Pencil,
  Trash2,
  Pin,
  PinOff,
  Clock,
  Search,
} from "lucide-react"
import { PengumumanFormDialog } from "@/features/pengumuman/components/pengumuman-form-dialog"
import { STATUS_PENGUMUMAN_COLORS } from "@/features/pengumuman/constants/pengumuman.constants"
import { getPengumumanTargetRoles } from "@/features/pengumuman/lib/pengumuman-helpers"
import { pushNotifikasi } from "@/features/notifications/lib/notifikasi-service"
import {
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useRemoveAnnouncement,
} from "@/hooks/use-announcements"
import { useClassroom } from "@/hooks/use-classroom"
import { formatTanggalPendek } from "@/features/kelas-saya/lib/kelas-saya-helpers"
import type { AnnouncementFormData } from "@/lib/services/announcement.service"
import type { KelasMengajar } from "@/features/kelas-mengajar/types/kelas-mengajar"
import type { Pengumuman } from "@/features/pengumuman/types/pengumuman"

interface KelasPengumumanTabProps {
  kelasMengajar: KelasMengajar
}

export function KelasPengumumanTab({ kelasMengajar }: KelasPengumumanTabProps) {
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Pengumuman | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingItem, setDeletingItem] = useState<Pengumuman | null>(null)

  const classroom = useClassroom()
  const createAnnouncement = useCreateAnnouncement()
  const updateAnnouncement = useUpdateAnnouncement()
  const removeAnnouncement = useRemoveAnnouncement()

  const pengumumanAll = classroom
    .getKelasPengumumanAll(kelasMengajar.kelas)
    .filter(
      (p) =>
        !search ||
        p.judul.toLowerCase().includes(search.toLowerCase()) ||
        p.ringkasan.toLowerCase().includes(search.toLowerCase())
    )

  function toFormData(data: Pengumuman): AnnouncementFormData {
    return {
      judul: data.judul,
      ringkasan: data.ringkasan,
      isi: data.isi,
      kategori: data.kategori,
      target: data.target,
      kelas: data.kelas,
      status: data.status,
      penulis: data.penulis,
      pinned: data.pinned,
      lampiran: data.lampiran,
      tanggal_publish: data.tanggal_publish,
    }
  }

  function handleSave(data: Pengumuman) {
    if (editingItem) {
      updateAnnouncement.mutate({
        id: editingItem.id,
        data: toFormData(data),
      })
    } else {
      createAnnouncement.mutate(toFormData(data))
    }
    if (data.status === "Dipublikasikan") {
      pushNotifikasi({
        tipe: "pengumuman",
        judul: `Pengumuman Kelas: ${data.judul}`,
        pesan: `Pengumuman baru di kelas ${kelasMengajar.mata_pelajaran} — ${kelasMengajar.kelas}.`,
        href: `/siswa/kelas/${kelasMengajar.id}`,
        target_roles: getPengumumanTargetRoles(data.target),
      })
    }
    setFormOpen(false)
    setEditingItem(null)
  }

  function togglePin(item: Pengumuman) {
    updateAnnouncement.mutate({
      id: item.id,
      data: { ...toFormData(item), pinned: !item.pinned },
    })
  }

  function confirmDelete() {
    if (!deletingItem) return
    removeAnnouncement.mutate(deletingItem.id)
    setDeleteOpen(false)
    setDeletingItem(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari pengumuman..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          onClick={() => {
            setEditingItem(null)
            setFormOpen(true)
          }}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Buat Pengumuman
        </Button>
      </div>

      {pengumumanAll.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title={
            search ? "Pengumuman tidak ditemukan" : "Belum Ada Pengumuman"
          }
          description={
            search
              ? "Tidak ada pengumuman yang cocok dengan pencarian."
              : "Klik 'Buat Pengumuman' untuk mulai membuat pengumuman."
          }
        />
      ) : (
        <div className="space-y-3">
          {pengumumanAll.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {p.pinned && (
                      <Pin className="h-3.5 w-3.5 text-primary shrink-0" />
                    )}
                    <h4 className="font-semibold text-sm">{p.judul}</h4>
                    <Badge
                      className={
                        STATUS_PENGUMUMAN_COLORS[p.status] ?? ""
                      }
                    >
                      {p.status}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {p.kategori}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {p.ringkasan}
                  </p>
                  <p className="flex items-center gap-1 text-[11px] text-muted-foreground/80 mt-1.5">
                    <Clock className="h-3 w-3" />
                    {formatTanggalPendek(p.tanggal_publish)} · {p.penulis}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title={p.pinned ? "Lepas Pin" : "Pin"}
                    onClick={() => togglePin(p)}
                  >
                    {p.pinned ? (
                      <PinOff className="h-4 w-4 text-primary" />
                    ) : (
                      <Pin className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title="Edit"
                    onClick={() => {
                      setEditingItem(p)
                      setFormOpen(true)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title="Hapus"
                    onClick={() => {
                      setDeletingItem(p)
                      setDeleteOpen(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <PengumumanFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        data={editingItem}
        onSave={handleSave}
        teacherMode
        allowedKelas={[kelasMengajar.kelas]}
        defaultTarget="Kelas Tertentu"
        defaultKelas={kelasMengajar.kelas}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Hapus Pengumuman"
        description={`Apakah Anda yakin ingin menghapus pengumuman "${deletingItem?.judul}"?`}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
