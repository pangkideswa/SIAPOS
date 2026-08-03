"use client"

import * as React from "react"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  Heading2,
  Type,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: number
  className?: string
}

type ToolButton = {
  label: string
  icon: React.ComponentType<{ className?: string }>
  command: string
  value?: string
  activeKey?: string
}

const TOOL_BUTTONS: ToolButton[] = [
  { label: "Undo", icon: Undo2, command: "undo" },
  { label: "Redo", icon: Redo2, command: "redo" },
  { label: "Judul", icon: Heading2, command: "formatBlock", value: "h3" },
  { label: "Paragraf", icon: Type, command: "formatBlock", value: "p" },
  { label: "Tebal", icon: Bold, command: "bold", activeKey: "bold" },
  { label: "Miring", icon: Italic, command: "italic", activeKey: "italic" },
  { label: "Garis Bawah", icon: Underline, command: "underline", activeKey: "underline" },
  { label: "Coret", icon: Strikethrough, command: "strikeThrough", activeKey: "strikeThrough" },
  { label: "List Berpoin", icon: List, command: "insertUnorderedList", activeKey: "insertUnorderedList" },
  { label: "List Angka", icon: ListOrdered, command: "insertOrderedList", activeKey: "insertOrderedList" },
  { label: "Rata Kiri", icon: AlignLeft, command: "justifyLeft", activeKey: "justifyLeft" },
  { label: "Rata Tengah", icon: AlignCenter, command: "justifyCenter", activeKey: "justifyCenter" },
  { label: "Rata Kanan", icon: AlignRight, command: "justifyRight", activeKey: "justifyRight" },
]

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Tulis isi pengumuman di sini...",
  minHeight = 180,
  className,
}: RichTextEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null)
  const [activeState, setActiveState] = React.useState<Record<string, boolean>>({})

  const syncContent = React.useCallback(() => {
    const el = editorRef.current
    if (!el) return
    const html = el.innerHTML
    if (html !== value) onChange(html)
  }, [onChange, value])

  const updateActiveState = React.useCallback(() => {
    const state: Record<string, boolean> = {}
    for (const btn of TOOL_BUTTONS) {
      if (btn.activeKey) state[btn.activeKey] = document.queryCommandState(btn.activeKey)
    }
    setActiveState(state)
  }, [])

  React.useEffect(() => {
    const el = editorRef.current
    if (!el) return
    if (el.innerHTML !== value) el.innerHTML = value
  }, [value])

  const exec = (command: string, cmdValue?: string) => {
    const el = editorRef.current
    if (!el) return
    el.focus()
    document.execCommand(command, false, cmdValue)
    updateActiveState()
    syncContent()
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text/plain")
    document.execCommand("insertText", false, text)
    syncContent()
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-input bg-transparent transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-0.5 border-b border-input bg-muted/50 px-1.5 py-1">
        {TOOL_BUTTONS.map((btn) => {
          const Icon = btn.icon
          const isActive = btn.activeKey ? activeState[btn.activeKey] : false
          return (
            <button
              key={btn.label}
              type="button"
              title={btn.label}
              aria-label={btn.label}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => exec(btn.command, btn.value)}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                isActive && "bg-muted text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          )
        })}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        onInput={syncContent}
        onKeyUp={updateActiveState}
        onMouseUp={updateActiveState}
        onBlur={() => {
          updateActiveState()
          syncContent()
        }}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        className="rich-text-content min-h-[180px] w-full cursor-text overflow-y-auto px-3 py-2 text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
        style={{ minHeight }}
      />
    </div>
  )
}

export function RichTextContent({ html }: { html: string }) {
  const isEmpty = html.replace(/<[^>]*>/g, "").trim().length === 0
  if (isEmpty) return <p className="text-sm text-muted-foreground italic">Tidak ada isi pengumuman.</p>
  return <div className="rich-text-content text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
}
