import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface FormSectionProps {
  title: string
  description?: string
  className?: string
  children: ReactNode
}

export function FormSection({
  title,
  description,
  className,
  children,
}: FormSectionProps) {
  return (
    <section
      aria-label={title}
      className={cn("space-y-4 border-b border-border/60 pb-5", className)}
    >
      <div className="space-y-1">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}
