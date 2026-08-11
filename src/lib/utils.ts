import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name?: string | null): string {
  if (!name) return "U"
  
  const cleanName = name.trim()
  if (!cleanName) return "U"

  const words = cleanName.split(/\s+/)
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase()
  }
  
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
}
