"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { PaginationControls } from "@/components/ui/pagination-controls"

export interface Column<T> {
  key: string
  header: React.ReactNode
  className?: string
  render?: (item: T, index: number) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (item: T) => void
  page?: number
  perPage?: number
  total?: number
  onPageChange?: (page: number) => void
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  emptyMessage = "Tidak ada data",
  onRowClick,
  page,
  perPage,
  total,
  onPageChange,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    )
  }

  const hasPagination = page !== undefined && perPage !== undefined && total !== undefined && onPageChange;
  const totalPages = total && perPage ? Math.ceil(total / perPage) : 1;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, i) => (
                <TableRow
                  key={String(item.id ?? i)}
                  className={onRowClick ? "cursor-pointer hover:bg-muted/30" : ""}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.render
                        ? col.render(item, i)
                        : String(item[col.key] ?? "-")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {hasPagination && (
        <PaginationControls
          page={page!}
          total={total!}
          perPage={perPage!}
          onPageChange={onPageChange!}
        />
      )}
    </div>
  )
}
