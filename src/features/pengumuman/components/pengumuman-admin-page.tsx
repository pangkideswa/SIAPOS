"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  Search,
  Pin,
  PinOff,
  Eye,
  Pencil,
  Trash2,
  Send,
} from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Pengumuman } from "../types/pengumuman"
import {
  KATEGORI_PENGUMUMAN_OPTIONS,
  STATUS_PENGUMUMAN_OPTIONS,
  TARGET_OPTIONS,
  KATEGORI_PENGUMUMAN_COLORS,
  STATUS_PENGUMUMAN_COLORS,
} from "../constants/pengumuman.constants"
import { getPengumumanTargetRoles } from "../lib/pengumuman-helpers"
import { pushNotifikasi } from "@/features/notifications/lib/notifikasi-service"
import { PengumumanSummaryCards } from "./pengumuman-summary-cards"
import { PengumumanFormDialog } from "./pengumuman-form-dialog"
import { DataTable, type Column } from "@/components/ui/data-table"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { formatDateID } from "@/features/kalender-akademik/components/kalender-helpers"
import {
  useAnnouncements,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useRemoveAnnouncement,
} from "@/hooks/use-announcements"
import type { AnnouncementFormData } from "@/lib/services/announcement.service"

const PER_PAGE = 10

type Row = Record<string, unknown> & {
  id: number
  judul: string
  kategori: string
  target: string
  penulis: string
  status: string
  tanggal_publish: string
  pinned: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function toFormData({ id, created_at, updated_at, ...rest }: Pengumuman): AnnouncementFormData {
  return rest
}

export function PengumumanAdminPage() {
  const router = useRouter()
  const {
    data: items = [],
    isLoading,
    isError,
    refetch,
  } = useAnnouncements()
  const createMutation = useCreateAnnouncement()
  const updateMutation = useUpdateAnnouncement()
  const removeMutation = useRemoveAnnouncement()
  const [search, setSearch] = useState("")
  const [kategoriFilter, setKategoriFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [targetFilter, setTargetFilter] = useState("all")
  const [pinnedFilter, setPinnedFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Pengumuman | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const filteredData = useMemo(() => {
    let data = [...items]
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(
        (d) =>
          d.judul.toLowerCase().includes(q) ||
          d.kategori.toLowerCase().includes(q) ||
          d.penulis.toLowerCase().includes(q)
      )
    }
    if (kategoriFilter !== "all") data = data.filter((d) => d.kategori === kategoriFilter)
    if (statusFilter !== "all") data = data.filter((d) => d.status === statusFilter)
    if (targetFilter !== "all") data = data.filter((d) => d.target === targetFilter)
    if (pinnedFilter === "pinned") data = data.filter((d) => d.pinned)
    if (pinnedFilter === "not-pinned") data = data.filter((d) => !d.pinned)
    return data.sort(
      (a, b) =>
        Number(b.pinned) - Number(a.pinned) ||
        b.tanggal_publish.localeCompare(a.tanggal_publish)
    )
  }, [items, search, kategoriFilter, statusFilter, targetFilter, pinnedFilter])

  const totalPages = Math.ceil(filteredData.length / PER_PAGE)
  const paginatedData = filteredData.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const handleCreate = () => {
    setEditingItem(null)
    setFormOpen(true)
  }

  const handleEdit = (item: Pengumuman) => {
    setEditingItem(item)
    setFormOpen(true)
  }

  const handleDelete = (id: number) => {
    setDeletingId(id)
    setDeleteOpen(true)
  }

  const confirmDelete = () => {
    if (deletingId !== null) {
      removeMutation.mutate(deletingId, {
        onSuccess: () => {
          setDeleteOpen(false)
          setDeletingId(null)
        },
      })
    }
  }

  const handleSave = (data: Pengumuman) => {
    if (editingItem) {
      updateMutation.mutate(
        { id: data.id, data: toFormData(data) },
        {
          onSuccess: () => {
            setFormOpen(false)
            setEditingItem(null)
          },
        }
      )
    } else {
      createMutation.mutate(toFormData(data), {
        onSuccess: () => {
          setFormOpen(false)
        },
      })
    }
    if (data.status === "Dipublikasikan") {
      pushNotifikasi({
        tipe: "pengumuman",
        judul: `Pengumuman Baru: ${data.judul}`,
        pesan: `Pengumuman "${data.judul}" telah dipublikasikan.`,
        href: "/siswa/pengumuman",
        target_roles: getPengumumanTargetRoles(data.target),
      })
    }
  }

  const togglePin = (id: number) => {
    const target = items.find((d) => d.id === id)
    if (!target) return
    updateMutation.mutate({
      id,
      data: toFormData({ ...target, pinned: !target.pinned }),
    })
  }

  const togglePublish = (id: number) => {
    const target = items.find((d) => d.id === id)
    if (!target) return
    const nextStatus =
      target.status === "Dipublikasikan" ? "Draft" : "Dipublikasikan"
    updateMutation.mutate({
      id,
      data: toFormData({ ...target, status: nextStatus }),
    })
    if (target && nextStatus === "Dipublikasikan") {
      pushNotifikasi({
        tipe: "pengumuman",
        judul: `Pengumuman Baru: ${target.judul}`,
        pesan: `Pengumuman "${target.judul}" telah dipublikasikan.`,
        href: "/siswa/pengumuman",
        target_roles: getPengumumanTargetRoles(target.target),
      })
    }
  }

  const openDetail = (id: number) => {
    router.push(`/admin/pengumuman/${id}`)
  }

  const columns: Column<Row>[] = [
    {
      key: "judul",
      header: "Judul",
      render: (item) => (
        <div className="flex items-center gap-2">
          {item.pinned && <Pin className="h-3.5 w-3.5 text-red-500 shrink-0" />}
          <span className="font-medium">{item.judul}</span>
        </div>
      ),
    },
    {
      key: "kategori",
      header: "Kategori",
      render: (item) => (
        <Badge className={KATEGORI_PENGUMUMAN_COLORS[item.kategori as keyof typeof KATEGORI_PENGUMUMAN_COLORS] ?? ""}>
          {item.kategori}
        </Badge>
      ),
    },
    { key: "target", header: "Target" },
    { key: "penulis", header: "Penulis" },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <Badge className={STATUS_PENGUMUMAN_COLORS[item.status as keyof typeof STATUS_PENGUMUMAN_COLORS] ?? ""}>
          {item.status}
        </Badge>
      ),
    },
    {
      key: "tanggal_publish",
      header: "Tanggal Publish",
      render: (item) => formatDateID(item.tanggal_publish),
    },
    {
      key: "aksi",
      header: "Aksi",
      className: "w-[260px]",
      render: (item) => (
        <div className="flex gap-1 flex-wrap">
          <Button
            variant="ghost"
            size="xs"
            onClick={(e) => { e.stopPropagation(); togglePin(item.id) }}
            title={item.pinned ? "Lepas pin" : "Pin pengumuman"}
          >
            {item.pinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={(e) => { e.stopPropagation(); togglePublish(item.id) }}
            title={item.status === "Dipublikasikan" ? "Tarik dari publikasi" : "Publikasikan"}
          >
            <Send className="h-3 w-3" />
            {item.status === "Dipublikasikan" ? "Unpublish" : "Publish"}
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={(e) => { e.stopPropagation(); openDetail(item.id) }}
          >
            <Eye className="h-3 w-3" />
            Lihat
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={(e) => { e.stopPropagation(); handleEdit(items.find((d) => d.id === item.id)!) }}
          >
            <Pencil className="h-3 w-3" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="xs"
            className="text-destructive"
            onClick={(e) => { e.stopPropagation(); handleDelete(item.id) }}
          >
            <Trash2 className="h-3 w-3" />
            Hapus
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengumuman"
        description="Kelola pengumuman dan informasi sekolah"
        action={
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-1" />
            Buat Pengumuman
          </Button>
        }
      />

      <PengumumanSummaryCards data={items} />

      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari judul, kategori, atau penulis..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="pl-9"
          />
        </div>
        <Select value={kategoriFilter} onValueChange={(v) => { setKategoriFilter(v ?? "all"); setPage(1) }}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {KATEGORI_PENGUMUMAN_OPTIONS.map((k) => (
              <SelectItem key={k} value={k}>{k}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v ?? "all"); setPage(1) }}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            {STATUS_PENGUMUMAN_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={targetFilter} onValueChange={(v) => { setTargetFilter(v ?? "all"); setPage(1) }}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Target" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Target</SelectItem>
            {TARGET_OPTIONS.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={pinnedFilter} onValueChange={(v) => { setPinnedFilter(v ?? "all"); setPage(1) }}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Pin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Pin</SelectItem>
            <SelectItem value="pinned">Dipin</SelectItem>
            <SelectItem value="not-pinned">Tidak Dipin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable<Row>
        columns={columns}
        data={paginatedData as unknown as Row[]}
        loading={isLoading}
        emptyMessage={
          isError
            ? "Gagal memuat data pengumuman"
            : "Tidak ada data pengumuman"
        }
        onRowClick={(item) => openDetail(item.id)}
      />
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Menampilkan {(page - 1) * PER_PAGE + 1}-
            {Math.min(page * PER_PAGE, filteredData.length)} dari{" "}
            {filteredData.length} data
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm rounded-md border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 text-sm rounded-md border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 py-4 px-4 text-center text-sm text-destructive">
          Terjadi kesalahan saat memuat data pengumuman.{" "}
          <button onClick={() => refetch()} className="underline font-medium">
            Muat ulang
          </button>
        </div>
      )}

      <PengumumanFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        data={editingItem}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Hapus Pengumuman"
        description="Apakah Anda yakin ingin menghapus pengumuman ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={confirmDelete}
      />
    </div>
  )
}
