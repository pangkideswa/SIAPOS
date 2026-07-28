"use client"

import { useState } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { AnalyticsSummaryCards, AnalyticsSecondaryCards } from "./analytics-summary-cards"
import { AnalyticsCharts } from "./analytics-charts"
import { AnalyticsAnalysisTables } from "./analytics-analysis-tables"
import { AnalyticsInsightPanel } from "./analytics-insight-panel"
import { AnalyticsFilterBar } from "./analytics-filter-bar"
import {
  DUMMY_ANALYTICS_SUMMARY,
  DUMMY_ANALYTICS_BY_SUBJECT,
  DUMMY_ANALYTICS_BY_EXAM_TYPE,
  DUMMY_ANALYTICS_BY_CLASS,
  DUMMY_ANALYTICS_TIMELINE,
  DUMMY_TOP_PERFORMERS,
  DUMMY_STUDENTS_NEEDING_ATTENTION,
  DUMMY_ANALYTICS_INSIGHTS,
} from "../dummy/analitik.data"
import { EMPTY_FILTER } from "../constants/analitik.constants"
import type { AnalyticsFilterState } from "../types/analitik"

export function AnalyticsPage() {
  const [filters, setFilters] = useState<AnalyticsFilterState>(EMPTY_FILTER)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analitik Penilaian"
        description="Dashboard analitik untuk memantau performa penilaian siswa secara keseluruhan"
      />

      {/* Filter Bar */}
      <AnalyticsFilterBar filters={filters} onFilterChange={setFilters} />

      {/* Summary Cards */}
      <AnalyticsSummaryCards summary={DUMMY_ANALYTICS_SUMMARY} />

      {/* Charts */}
      <AnalyticsCharts
        bySubject={DUMMY_ANALYTICS_BY_SUBJECT}
        byExamType={DUMMY_ANALYTICS_BY_EXAM_TYPE}
        byClass={DUMMY_ANALYTICS_BY_CLASS}
        timeline={DUMMY_ANALYTICS_TIMELINE}
      />

      {/* Analysis Tables */}
      <AnalyticsAnalysisTables
        topPerformers={DUMMY_TOP_PERFORMERS}
        studentsNeedingAttention={DUMMY_STUDENTS_NEEDING_ATTENTION}
        byExamType={DUMMY_ANALYTICS_BY_EXAM_TYPE}
      />

      {/* Secondary Summary Cards */}
      <AnalyticsSecondaryCards summary={DUMMY_ANALYTICS_SUMMARY} />

      {/* Insight Panel */}
      <AnalyticsInsightPanel insights={DUMMY_ANALYTICS_INSIGHTS} />
    </div>
  )
}
