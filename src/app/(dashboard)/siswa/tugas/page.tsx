"use client"

import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { ClipboardList } from "lucide-react"

export default function TugasSiswaPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Tugas" description="Daftar tugas yang harus dikerjakan" />
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Tugas</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Halaman ini akan segera tersedia.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
