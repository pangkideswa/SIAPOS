import { Button } from "./button"

interface PaginationControlsProps {
  page: number
  total: number
  perPage: number
  onPageChange: (page: number) => void
  itemName?: string
}

export function PaginationControls({ page, total, perPage, onPageChange, itemName = "data" }: PaginationControlsProps) {
  const totalPages = Math.ceil(total / perPage)
  if (total <= perPage) return null

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <p className="text-sm text-muted-foreground text-center sm:text-left">
        Menampilkan {(page - 1) * perPage + 1} - {Math.min(page * perPage, total)} dari {total} {itemName}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          Sebelumnya
        </Button>
        <div className="text-sm font-medium">
          Halaman {page} dari {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  )
}
