"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { KATEGORI_PENGUMUMAN_OPTIONS } from "../constants/pengumuman.constants"
import { AnnouncementCard } from "./pengumuman-card"
import { useAnnouncements } from "@/hooks/use-announcements"

export function PengumumanSiswaPage() {
  const router = useRouter()
  const { data = [], isLoading, isError, refetch } = useAnnouncements()
  const items = useMemo(
    () =>
      data.filter(
        (d) =>
          d.status === "Dipublikasikan" &&
          (d.target === "Semua Pengguna" ||
            d.target === "Siswa" ||
            d.target === "Kelas Tertentu")
      ),
    [data]
  )
  const [search, setSearch] = useState("")
  const [kategoriFilter, setKategoriFilter] = useState("all")

  const filteredData = useMemo(() => {
    let data = [...items]
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(
        (d) => d.judul.toLowerCase().includes(q) || d.ringkasan.toLowerCase().includes(q)
      )
    }
    if (kategoriFilter !== "all") data = data.filter((d) => d.kategori === kategoriFilter)
    return data.sort(
      (a, b) =>
        Number(b.pinned) - Number(a.pinned) ||
        b.tanggal_publish.localeCompare(a.tanggal_publish)
    )
  }, [items, search, kategoriFilter])

  const openDetail = (id: number) => {
    router.push(`/siswa/pengumuman/${id}`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengumuman"
        description="Informasi dan pengumuman sekolah"
      />

      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari pengumuman..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={kategoriFilter} onValueChange={(v) => setKategoriFilter(v ?? "all")}>
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
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Memuat data...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 py-8 px-4 text-center text-sm text-destructive">
          Terjadi kesalahan saat memuat data pengumuman.{" "}
          <button onClick={() => refetch()} className="underline font-medium">
            Muat ulang
          </button>
        </div>
      ) : filteredData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredData.map((item) => (
            <AnnouncementCard
              key={item.id}
              data={item}
              onClick={() => openDetail(item.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card py-16 text-center text-muted-foreground">
          Tidak ada pengumuman
        </div>
      )}
    </div>
  )
}
