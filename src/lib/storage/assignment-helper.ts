import { deleteFile, BUCKETS } from "./supabase-server"

export function extractAssignmentStoragePath(urlOrPath: string): string | null {
  if (urlOrPath.includes(`/storage/v1/object/public/${BUCKETS.ASSIGNMENTS}/`)) {
    return urlOrPath.split(`/storage/v1/object/public/${BUCKETS.ASSIGNMENTS}/`)[1]
  }
  
  if (urlOrPath.includes(`/storage/v1/object/sign/${BUCKETS.ASSIGNMENTS}/`)) {
     return urlOrPath.split(`/storage/v1/object/sign/${BUCKETS.ASSIGNMENTS}/`)[1].split('?')[0]
  }

  if (urlOrPath.startsWith(`${BUCKETS.ASSIGNMENTS}/`)) {
    return urlOrPath
  }

  return null
}

export async function deleteAssignmentFileIfStorage(urlOrPath: string): Promise<boolean> {
  const storagePath = extractAssignmentStoragePath(urlOrPath)
  if (storagePath) {
     await deleteFile(BUCKETS.ASSIGNMENTS, storagePath)
     return true
  }
  return false
}
