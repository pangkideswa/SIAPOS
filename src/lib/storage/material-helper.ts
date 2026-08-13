import { deleteFile, BUCKETS } from "./supabase-server"

export function extractMaterialStoragePath(urlOrPath: string): string | null {
  if (urlOrPath.includes(`/storage/v1/object/public/materials/`)) {
    return urlOrPath.split(`/storage/v1/object/public/materials/`)[1]
  }
  if (!urlOrPath.startsWith("http") && urlOrPath.includes("/")) {
     return urlOrPath
  }
  return null
}

export function validateMaterialStoragePath(path: string, materialId: string | number): boolean {
  return path.startsWith(`materials/${materialId}/`)
}

export async function deleteMaterialFileIfStorage(urlOrPath: string | null | undefined) {
  if (!urlOrPath) return
  const path = extractMaterialStoragePath(urlOrPath)
  if (path) {
    await deleteFile(BUCKETS.MATERIALS, path).catch(err => {
      console.error("Failed to delete old material file from storage:", err)
    })
  }
}
