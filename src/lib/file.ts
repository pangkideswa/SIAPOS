export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

export const MAX_THUMBNAIL_SIZE_MB = 2
export const MAX_MATERI_FILE_SIZE_MB = 20
export const MAX_TUGAS_FILE_SIZE_MB = 20
export const MAX_PENGUMUMAN_ATTACHMENT_SIZE_MB = 10

export function validateFileSize(
  file: File,
  maxMb: number
): { ok: true } | { ok: false; error: string } {
  const maxBytes = maxMb * 1024 * 1024
  if (file.size > maxBytes) {
    return {
      ok: false,
      error: `Ukuran file "${file.name}" melebihi batas maksimal ${maxMb} MB.`,
    }
  }
  return { ok: true }
}
