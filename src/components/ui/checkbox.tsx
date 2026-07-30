"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface CheckboxProps extends Omit<React.ComponentProps<"button">, "type"> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: React.ReactNode
}

function Checkbox({
  className,
  checked = false,
  onCheckedChange,
  label,
  disabled,
  ...props
}: CheckboxProps) {
  return (
    <label
      className={cn(
        "flex items-start gap-2.5 cursor-pointer select-none",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          "peer shrink-0 size-4 rounded-sm border border-primary ring-offset-background transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          checked
            ? "bg-primary text-primary-foreground"
            : "bg-transparent",
          className
        )}
        {...props}
      >
        {checked && <Check className="size-3" />}
      </button>
      {label && (
        <span className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 pt-px">
          {label}
        </span>
      )}
    </label>
  )
}

export { Checkbox }
