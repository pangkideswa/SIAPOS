"use client"

import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen } from "lucide-react"

export default function LaporanPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Laporan" description="Laporan akademik siswa" />
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Laporan</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Halaman ini akan segera tersedia.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
