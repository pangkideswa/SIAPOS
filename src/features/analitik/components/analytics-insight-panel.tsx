"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Info, Lightbulb } from "lucide-react"
import type { AnalyticsInsight } from "../types/analitik"
import { INSIGHT_TYPE_STYLES } from "../constants/analitik.constants"

interface AnalyticsInsightPanelProps {
  insights: AnalyticsInsight[]
}

const insightIcons = {
  peringatan: AlertTriangle,
  informasi: Info,
  rekomendasi: Lightbulb,
}

export function AnalyticsInsightPanel({ insights }: AnalyticsInsightPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Insight & Rekomendasi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight) => {
            const styles = INSIGHT_TYPE_STYLES[insight.tipe]
            const Icon = insightIcons[insight.tipe]
            return (
              <div
                key={insight.id}
                className={`flex gap-3 p-3 rounded-lg border ${styles.bg} ${styles.border}`}
              >
                <div className="shrink-0 mt-0.5">
                  <Icon className={`h-5 w-5 ${styles.icon}`} />
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold ${styles.text}`}>
                    {insight.judul}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {insight.deskripsi}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
