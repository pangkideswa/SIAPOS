/**
 * Standard Indonesian Date & Time Utilities with strict 24-Hour WIB formatting.
 * Prevents AM/PM confusion and guarantees uniform localization.
 */

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
]

const MONTHS_LONG = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
]

const DAYS_LONG = [
  "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"
]

export interface FormatDateTimeWIBOptions {
  includeSeconds?: boolean
  monthFormat?: "short" | "long"
  includeYear?: boolean
  includeDayName?: boolean
}

/**
 * Format a date & time input into standardized 24-hour Indonesian format with "WIB".
 * Example output:
 * - "14 Nov 2026, 14:30 WIB"
 * - "Sabtu, 14 November 2026, 14:30:00 WIB"
 */
export function formatDateTimeWIB(
  dateInput: string | number | Date | null | undefined,
  options?: FormatDateTimeWIBOptions
): string {
  if (!dateInput) return "—"
  const date = typeof dateInput === "object" ? dateInput : new Date(dateInput)
  if (isNaN(date.getTime())) return "—"

  const d = date.getDate()
  const m = options?.monthFormat === "long" ? MONTHS_LONG[date.getMonth()] : MONTHS_SHORT[date.getMonth()]
  const y = date.getFullYear()

  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")
  const seconds = date.getSeconds().toString().padStart(2, "0")

  const timeStr = options?.includeSeconds
    ? `${hours}:${minutes}:${seconds} WIB`
    : `${hours}:${minutes} WIB`

  const dayName = options?.includeDayName ? `${DAYS_LONG[date.getDay()]}, ` : ""

  if (options?.includeYear === false) {
    return `${dayName}${d} ${m}, ${timeStr}`
  }

  return `${dayName}${d} ${m} ${y}, ${timeStr}`
}

/**
 * Format pure time in 24-hour format with "WIB".
 * Example: "14:30 WIB" or "14:30:15 WIB"
 */
export function formatTimeWIB(
  dateInput: string | number | Date | null | undefined,
  includeSeconds = false
): string {
  if (!dateInput) return "—"
  const date = typeof dateInput === "object" ? dateInput : new Date(dateInput)
  if (isNaN(date.getTime())) return "—"

  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")

  if (includeSeconds) {
    const seconds = date.getSeconds().toString().padStart(2, "0")
    return `${hours}:${minutes}:${seconds} WIB`
  }

  return `${hours}:${minutes} WIB`
}

/**
 * Format pure 24-hour time string without "WIB" suffix (useful for timers / inputs).
 * Example: "14:30:00"
 */
export function to24HourTime(
  dateInput: string | number | Date | null | undefined,
  includeSeconds = true
): string {
  if (!dateInput) return "00:00:00"
  const date = typeof dateInput === "object" ? dateInput : new Date(dateInput)
  if (isNaN(date.getTime())) return "00:00:00"

  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")

  if (includeSeconds) {
    const seconds = date.getSeconds().toString().padStart(2, "0")
    return `${hours}:${minutes}:${seconds}`
  }

  return `${hours}:${minutes}`
}

/**
 * Format date only in Indonesian.
 * Example: "14 November 2026" or "14 Nov 2026"
 */
export function formatDateID(
  dateInput: string | number | Date | null | undefined,
  monthFormat: "short" | "long" = "long"
): string {
  if (!dateInput) return "—"
  const date = typeof dateInput === "object" ? dateInput : new Date(dateInput)
  if (isNaN(date.getTime())) return "—"

  const d = date.getDate()
  const m = monthFormat === "short" ? MONTHS_SHORT[date.getMonth()] : MONTHS_LONG[date.getMonth()]
  const y = date.getFullYear()

  return `${d} ${m} ${y}`
}
