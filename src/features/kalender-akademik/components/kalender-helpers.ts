export function formatDateID(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function formatDateRange(mulai: string, selesai: string): string {
  if (mulai === selesai) return formatDateID(mulai)
  const d1 = new Date(mulai + "T00:00:00")
  const d2 = new Date(selesai + "T00:00:00")
  const sameMonth = d1.getMonth() === d2.getMonth()
  const sameYear = d1.getFullYear() === d2.getFullYear()
  if (sameMonth && sameYear) {
    return `${d1.getDate()} - ${d2.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}`
  }
  return `${formatDateID(mulai)} - ${formatDateID(selesai)}`
}

export function getMonthDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPad = firstDay.getDay()
  const days: Date[] = []
  for (let i = 0; i < startPad; i++) {
    const d = new Date(year, month, -startPad + i + 1)
    days.push(d)
  }
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i))
  }
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push(new Date(year, month + 1, i))
  }
  return days
}

export function getWeekDays(date: Date): Date[] {
  const start = new Date(date)
  start.setDate(start.getDate() - start.getDay())
  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    days.push(d)
  }
  return days
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function isDateInRange(date: Date, startStr: string, endStr: string): boolean {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const s = new Date(startStr + "T00:00:00")
  const e = new Date(endStr + "T00:00:00")
  return d >= s && d <= e
}

export const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]

export const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
]
