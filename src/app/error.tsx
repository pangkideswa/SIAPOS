"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RotateCcw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[global-error]", error)
  }, [error])

  return (
    <html lang="id">
      <body className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 mx-auto">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Terjadi Kesalahan
            </h1>
            <p className="text-sm text-muted-foreground">
              Maaf, terjadi kesalahan yang tidak terduga. Silakan muat ulang
              halaman atau coba lagi beberapa saat.
            </p>
          </div>
          <Button onClick={reset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Muat Ulang
          </Button>
        </div>
      </body>
    </html>
  )
}
