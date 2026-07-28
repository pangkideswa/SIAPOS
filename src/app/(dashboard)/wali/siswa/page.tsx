"use client"

import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function SiswaWaliPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Siswa" description="Daftar siswa yang diampu" />
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Siswa</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Halaman ini akan segera tersedia.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
