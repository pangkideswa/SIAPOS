"use client"

import { useRouter } from "next/navigation"
import {
  Bell,
  CheckCheck,
  BookOpen,
  ClipboardList,
  GraduationCap,
  Megaphone,
  Info,
  type LucideIcon,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useNotifikasi } from "@/features/notifications/contexts/notifikasi-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Notifikasi, NotifikasiTipe } from "@/features/notifications/types/notifikasi"
import { cn } from "@/lib/utils"

const TIPE_ICON: Record<NotifikasiTipe, { icon: LucideIcon; className: string; label: string }> = {
  materi: { icon: BookOpen, className: "bg-blue-100 text-blue-700", label: "Materi" },
  tugas: { icon: ClipboardList, className: "bg-orange-100 text-orange-700", label: "Tugas" },
  penilaian: { icon: GraduationCap, className: "bg-green-100 text-green-700", label: "Penilaian" },
  pengumuman: { icon: Megaphone, className: "bg-purple-100 text-purple-700", label: "Pengumuman" },
  sistem: { icon: Info, className: "bg-gray-100 text-gray-700", label: "Sistem" },
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function NotificationBell() {
  const { user } = useAuth()
  const { notifications, markRead, markListRead } = useNotifikasi()
  const router = useRouter()

  const visible = user
    ? notifications.filter(
        (n) =>
          user.role === "super_admin" || n.target_roles.includes(user.role)
      )
    : []

  const visibleUnread = visible.filter((n) => !n.is_read)
  const visibleUnreadCount = visibleUnread.length

  function handleClick(n: Notifikasi) {
    markRead(n.id)
    if (n.href) router.push(n.href)
  }

  function handleMarkAllRead() {
    markListRead(visibleUnread.map((n) => n.id))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-sm" className="relative" aria-label="Notifikasi">
            <Bell className="h-4 w-4 text-muted-foreground" />
            {visibleUnreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-semibold text-white">
                {visibleUnreadCount > 9 ? "9+" : visibleUnreadCount}
              </span>
            )}
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-80 max-w-[calc(100vw-2rem)] p-0">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <DropdownMenuLabel className="p-0 text-sm font-semibold text-foreground">
            Notifikasi
          </DropdownMenuLabel>
          {visibleUnreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Tandai dibaca
            </button>
          )}
        </div>

        <div className="max-h-[26rem] overflow-y-auto py-1">
          {visible.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Tidak ada notifikasi
            </div>
          )}
          {visible.map((n) => {
            const meta = TIPE_ICON[n.tipe]
            const Icon = meta.icon
            return (
              <DropdownMenuItem
                key={n.id}
                onClick={() => handleClick(n)}
                className={cn(
                  "flex items-start gap-3 rounded-none px-3 py-2.5",
                  !n.is_read && "bg-muted/50"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    meta.className
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">
                      {n.judul}
                    </span>
                    {!n.is_read && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                    )}
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">
                    {n.pesan}
                  </span>
                  <span className="mt-1 block text-[11px] text-muted-foreground/80">
                    {formatDateTime(n.created_at)}
                  </span>
                </span>
              </DropdownMenuItem>
            )
          })}
        </div>

        <DropdownMenuSeparator />
        <div className="px-3 py-2">
          <Badge variant="secondary" className="text-[11px] font-normal">
            {visibleUnreadCount} belum dibaca
          </Badge>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
