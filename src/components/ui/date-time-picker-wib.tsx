"use client"

import { useMemo } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface DateTimePickerWIBProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
  id?: string
}

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"))

export function DateTimePickerWIB({
  value,
  onChange,
  disabled = false,
  className,
}: DateTimePickerWIBProps) {
  // Parse value: expected format "YYYY-MM-DDTHH:mm" or ISO string
  const { datePart, hourPart, minutePart } = useMemo(() => {
    if (!value) {
      return { datePart: "", hourPart: "08", minutePart: "00" }
    }
    try {
      const separator = value.includes("T") ? "T" : " "
      const parts = value.split(separator)
      const date = parts[0] || ""
      const time = parts[1] || "08:00"
      const [h = "08", m = "00"] = time.split(":")
      const cleanH = h.padStart(2, "0").slice(0, 2)
      const cleanM = m.padStart(2, "0").slice(0, 2)
      return {
        datePart: date,
        hourPart: HOURS.includes(cleanH) ? cleanH : "08",
        minutePart: MINUTES.includes(cleanM) ? cleanM : "00",
      }
    } catch {
      return { datePart: "", hourPart: "08", minutePart: "00" }
    }
  }, [value])

  const handleDateChange = (newDate: string) => {
    if (!newDate) {
      onChange("")
      return
    }
    onChange(`${newDate}T${hourPart}:${minutePart}`)
  }

  const handleHourChange = (newHour: string | null) => {
    if (!newHour) return
    const d = datePart || new Date().toISOString().slice(0, 10)
    onChange(`${d}T${newHour}:${minutePart}`)
  }

  const handleMinuteChange = (newMinute: string | null) => {
    if (!newMinute) return
    const d = datePart || new Date().toISOString().slice(0, 10)
    onChange(`${d}T${hourPart}:${newMinute}`)
  }

  return (
    <div className={cn("flex flex-col sm:flex-row gap-2 items-stretch sm:items-center", className)}>
      {/* Date Picker (Calendar only, no AM/PM) */}
      <div className="relative flex-1 min-w-[140px]">
        <Input
          type="date"
          value={datePart}
          onChange={(e) => handleDateChange(e.target.value)}
          disabled={disabled}
          className="h-10 text-xs sm:text-sm font-medium bg-background"
        />
      </div>

      {/* 24-Hour Time Selector in WIB */}
      <div className="flex items-center gap-1.5 shrink-0 justify-between sm:justify-start">
        {/* Hour (00 - 23) */}
        <Select
          value={hourPart}
          onValueChange={handleHourChange}
          disabled={disabled}
        >
          <SelectTrigger
            className="w-[66px] h-10 text-xs sm:text-sm font-bold font-mono text-center px-1 bg-background"
            aria-label="Pilih Jam (24 Jam WIB)"
          >
            <SelectValue placeholder="Jam" />
          </SelectTrigger>
          <SelectContent className="max-h-56">
            {HOURS.map((h) => (
              <SelectItem key={h} value={h} className="font-mono font-medium">
                {h}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="font-bold text-muted-foreground select-none">:</span>

        {/* Minute (00 - 59) */}
        <Select
          value={minutePart}
          onValueChange={handleMinuteChange}
          disabled={disabled}
        >
          <SelectTrigger
            className="w-[66px] h-10 text-xs sm:text-sm font-bold font-mono text-center px-1 bg-background"
            aria-label="Pilih Menit"
          >
            <SelectValue placeholder="Menit" />
          </SelectTrigger>
          <SelectContent className="max-h-56">
            {MINUTES.map((m) => (
              <SelectItem key={m} value={m} className="font-mono font-medium">
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Dedicated WIB Badge */}
        <span className="inline-flex items-center justify-center h-10 px-2.5 rounded-xl bg-primary/10 text-primary font-black text-xs border border-primary/20 select-none shrink-0 tracking-wider">
          WIB
        </span>
      </div>
    </div>
  )
}
