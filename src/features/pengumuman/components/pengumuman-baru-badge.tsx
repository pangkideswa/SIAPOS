"use client"

import Link from "next/link"
import { Megaphone } from "lucide-react"
import { getRolePengumuman } from "../lib/pengumuman-helpers"

export function PengumumanBaruBadge({ role }: { role: "admin" | "guru" | "siswa" }) {
  const count = getRolePengumuman(role).length

  return (
    <Link
      href={`/${role}/pengumuman`}
      className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-100 transition-colors"
    >
      <Megaphone className="h-4 w-4" />
      <span className="font-medium">Pengumuman Baru</span>
      <span className="inline-flex items-center justify-center min-w-5 h-5 rounded-full bg-red-600 text-white text-xs font-semibold px-1">
        {count}
      </span>
    </Link>
  )
}
