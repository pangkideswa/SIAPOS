"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RotateCcw } from "lucide-react"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[dashboard-error]", error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 mx-auto">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Terjadi Kesalahan
          </h1>
          <p className="text-sm text-muted-foreground">
            Maaf, halaman ini mengalami kendala. Silakan muat ulang atau coba
            lagi beberapa saat.
          </p>
        </div>
        <Button onClick={reset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Muat Ulang
        </Button>
      </div>
    </div>
  )
}
