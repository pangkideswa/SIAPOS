import { deleteFile, BUCKETS } from "./supabase-server"

export function extractSubmissionStoragePath(urlOrPath: string): string | null {
  if (urlOrPath.includes(`/storage/v1/object/public/${BUCKETS.SUBMISSIONS}/`)) {
    return urlOrPath.split(`/storage/v1/object/public/${BUCKETS.SUBMISSIONS}/`)[1]
  }
  
  if (urlOrPath.includes(`/storage/v1/object/sign/${BUCKETS.SUBMISSIONS}/`)) {
     return urlOrPath.split(`/storage/v1/object/sign/${BUCKETS.SUBMISSIONS}/`)[1].split('?')[0]
  }

  if (urlOrPath.startsWith(`${BUCKETS.SUBMISSIONS}/`)) {
    return urlOrPath
  }

  return null
}

export async function deleteSubmissionFileIfStorage(urlOrPath: string): Promise<boolean> {
  const storagePath = extractSubmissionStoragePath(urlOrPath)
  if (storagePath) {
     await deleteFile(BUCKETS.SUBMISSIONS, storagePath)
     return true
  }
  return false
}
