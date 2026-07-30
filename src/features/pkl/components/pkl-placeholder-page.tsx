"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Briefcase } from "lucide-react"

export function PklPlaceholderPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Briefcase className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Modul PKL</h3>
          <p className="text-sm text-muted-foreground text-center">
            Modul PKL akan segera tersedia.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
