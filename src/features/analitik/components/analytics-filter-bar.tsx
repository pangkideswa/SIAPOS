"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  KELAS_ANALITIK_OPTIONS,
  MATA_PELAJARAN_ANALITIK_OPTIONS,
  JENIS_UJIAN_ANALITIK_OPTIONS,
  EMPTY_FILTER,
} from "../constants/analitik.constants"
import type { AnalyticsFilterState } from "../types/analitik"

interface AnalyticsFilterBarProps {
  filters: AnalyticsFilterState
  onFilterChange: (filters: AnalyticsFilterState) => void
}

export function AnalyticsFilterBar({ filters, onFilterChange }: AnalyticsFilterBarProps) {
  const hasActiveFilters =
    filters.kelas !== EMPTY_FILTER.kelas ||
    filters.mata_pelajaran !== EMPTY_FILTER.mata_pelajaran ||
    filters.jenis_ujian !== EMPTY_FILTER.jenis_ujian ||
    filters.tanggal_mulai !== EMPTY_FILTER.tanggal_mulai ||
    filters.tanggal_akhir !== EMPTY_FILTER.tanggal_akhir

  function handleReset() {
    onFilterChange(EMPTY_FILTER)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <Select
          value={filters.kelas}
          onValueChange={(v: string | null) =>
            onFilterChange({ ...filters, kelas: v ?? EMPTY_FILTER.kelas })
          }
        >
          <SelectTrigger className="w-full sm:w-[170px]">
            <SelectValue placeholder="Semua Kelas" />
          </SelectTrigger>
          <SelectContent>
            {KELAS_ANALITIK_OPTIONS.map((kelas) => (
              <SelectItem key={kelas} value={kelas}>
                {kelas}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.mata_pelajaran}
          onValueChange={(v: string | null) =>
            onFilterChange({ ...filters, mata_pelajaran: v ?? EMPTY_FILTER.mata_pelajaran })
          }
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Semua Mata Pelajaran" />
          </SelectTrigger>
          <SelectContent>
            {MATA_PELAJARAN_ANALITIK_OPTIONS.map((mapel) => (
              <SelectItem key={mapel} value={mapel}>
                {mapel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.jenis_ujian}
          onValueChange={(v: string | null) =>
            onFilterChange({ ...filters, jenis_ujian: v ?? EMPTY_FILTER.jenis_ujian })
          }
        >
          <SelectTrigger className="w-full sm:w-[170px]">
            <SelectValue placeholder="Semua Jenis" />
          </SelectTrigger>
          <SelectContent>
            {JENIS_UJIAN_ANALITIK_OPTIONS.map((jenis) => (
              <SelectItem key={jenis} value={jenis}>
                {jenis}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Input
            type="date"
            value={filters.tanggal_mulai}
            onChange={(e) =>
              onFilterChange({ ...filters, tanggal_mulai: e.target.value })
            }
            className="w-full sm:w-[150px]"
            placeholder="Dari tanggal"
          />
          <Input
            type="date"
            value={filters.tanggal_akhir}
            onChange={(e) =>
              onFilterChange({ ...filters, tanggal_akhir: e.target.value })
            }
            className="w-full sm:w-[150px]"
            placeholder="Sampai tanggal"
          />
        </div>
      </div>
      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground">
            <X className="h-4 w-4 mr-1" />
            Reset Filter
          </Button>
        </div>
      )}
    </div>
  )
}
