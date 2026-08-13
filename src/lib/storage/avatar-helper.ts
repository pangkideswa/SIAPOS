import { uploadFile, deleteFile, getPublicUrl } from "./supabase-server"
import type { BUCKETS } from "./supabase-server"

type BucketName = typeof BUCKETS[keyof typeof BUCKETS]

export function extractStoragePath(url: string, bucket: string): string | null {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const base = supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl
    const searchString = `/storage/v1/object/public/${bucket}/`
    if (url.includes(base) && url.includes(searchString)) {
      return url.split(searchString)[1]
    }
  } catch (_e) {
    // Ignore error
  }
  return null
}

export async function processAvatarUpload(
  base64String: string,
  bucket: string,
  prefix: string,
  oldUrl?: string | null
): Promise<string | null> {
  if (!base64String.startsWith('data:image/')) return null
  
  const match = base64String.match(/^data:(image\/\w+(\+\w+)?);base64,(.+)$/)
  if (!match) {
    throw new Error("Format gambar tidak valid")
  }
  
  const mimeType = match[1]
  const base64Data = match[3]
  const buffer = Buffer.from(base64Data, 'base64')
  
  const extMap: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/svg+xml': '.svg'
  }
  const ext = extMap[mimeType]
  if (!ext) {
    throw new Error(`Tipe file ${mimeType} tidak didukung`)
  }
  
  const fileName = `${prefix}/avatar-${Date.now()}${ext}`
  const file = new File([buffer], fileName.split('/').pop() || 'avatar', { type: mimeType })
  
  // Upload to Supabase
  const uploadResult = await uploadFile(bucket as BucketName, fileName, file)
  const publicUrl = getPublicUrl(bucket as BucketName, uploadResult.path)
  
  // Clean up old avatar if it was from Supabase Storage
  if (oldUrl) {
    const oldPath = extractStoragePath(oldUrl, bucket)
    if (oldPath) {
      deleteFile(bucket as BucketName, oldPath).catch(err => {
        console.error("Failed to delete old avatar from storage:", err)
      })
    }
  }
  
  return publicUrl
}

export async function deleteAvatarIfFromStorage(url: string | null, bucket: string) {
  if (!url) return
  const oldPath = extractStoragePath(url, bucket)
  if (oldPath) {
    await deleteFile(bucket as BucketName, oldPath).catch(err => {
      console.error("Failed to delete old avatar from storage:", err)
    })
  }
}
