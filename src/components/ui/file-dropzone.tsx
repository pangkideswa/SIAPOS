import { useRef } from "react"
import { UploadCloud } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileDropzoneProps {
  title?: string
  hint?: string
  accept?: string
  multiple?: boolean
  disabled?: boolean
  onFiles: (files: FileList) => void
  className?: string
}

export function FileDropzone({
  title = "Klik untuk upload file",
  hint,
  accept,
  multiple = true,
  disabled = false,
  onFiles,
  className,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-4 text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        <UploadCloud className="h-5 w-5" />
        <span className="text-sm font-medium">{title}</span>
        {hint && <span className="text-xs">{hint}</span>}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files) onFiles(e.target.files)
          e.target.value = ""
        }}
      />
    </>
  )
}
