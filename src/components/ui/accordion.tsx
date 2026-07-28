"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface AccordionContextValue {
  openItems: Set<string>
  toggle: (value: string) => void
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null)

function useAccordion() {
  const ctx = React.useContext(AccordionContext)
  if (!ctx)
    throw new Error("Accordion components must be used within <Accordion>")
  return ctx
}

interface AccordionItemContextValue {
  value: string
}

const AccordionItemContext =
  React.createContext<AccordionItemContextValue | null>(null)

function useAccordionItem() {
  const ctx = React.useContext(AccordionItemContext)
  if (!ctx)
    throw new Error(
      "AccordionTrigger/Content must be used within <AccordionItem>"
    )
  return ctx
}

function Accordion({
  type = "single",
  defaultValue,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  type?: "single" | "multiple"
  defaultValue?: string
}) {
  const [openItems, setOpenItems] = React.useState<Set<string>>(
    () => new Set(defaultValue ? [defaultValue] : [])
  )

  const toggle = React.useCallback(
    (value: string) => {
      setOpenItems((prev) => {
        const next = new Set(prev)
        if (next.has(value)) {
          next.delete(value)
        } else {
          if (type === "single") next.clear()
          next.add(value)
        }
        return next
      })
    },
    [type]
  )

  return (
    <AccordionContext.Provider value={{ openItems, toggle }}>
      <div className={cn("space-y-1", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

function AccordionItem({
  value,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { value: string }) {
  const { openItems } = useAccordion()
  const isOpen = openItems.has(value)

  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div
        className={cn(
          "border border-border rounded-lg overflow-hidden",
          className
        )}
        data-state={isOpen ? "open" : "closed"}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

function AccordionTrigger({
  children,
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { openItems, toggle } = useAccordion()
  const item = useAccordionItem()
  const isOpen = openItems.has(item.value)

  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center justify-between py-3 px-4 text-sm font-medium text-left hover:bg-muted/50 transition-colors",
        className
      )}
      onClick={() => toggle(item.value)}
      aria-expanded={isOpen}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      />
    </button>
  )
}

function AccordionContent({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { openItems } = useAccordion()
  const item = useAccordionItem()
  const isOpen = openItems.has(item.value)

  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-200",
        isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
      )}
      {...props}
    >
      <div className={cn("px-4 pb-3 pt-0 text-sm", className)}>
        {children}
      </div>
    </div>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
