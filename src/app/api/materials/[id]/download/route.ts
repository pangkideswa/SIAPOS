import "server-only"
import { NextRequest, NextResponse } from "next/server"
import { materialService } from "@/services/material.service"
import { apiError, notFound } from "@/lib/api-utils"
import { assertMaterialAccess, requireApiUser } from "@/auth/api-authorization"
import { createSignedUrl, BUCKETS } from "@/lib/storage/supabase-server"
import { extractMaterialStoragePath } from "@/lib/storage/material-helper"
import type { Materi } from "@/features/materi/types/materi"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser()
    const { id } = await context.params
    const materialId = Number(id)
    
    // AuthZ
    await assertMaterialAccess(user, materialId)
    
    const material = await materialService.getById(materialId) as Materi | null
    if (!material) return notFound("Materi tidak ditemukan")
    
    const searchParams = request.nextUrl.searchParams
    const lampiranId = searchParams.get("lampiranId")
    const type = searchParams.get("type") // "thumbnail" or "lampiran"
    
    let targetPath: string | null = null
    let fallbackUrl: string | null = null

    if (type === "thumbnail") {
       if (!material.thumbnail_url) return notFound("Thumbnail tidak ada")
       targetPath = extractMaterialStoragePath(material.thumbnail_url)
       fallbackUrl = material.thumbnail_url
    } else {
       if (!lampiranId) return apiError(new Error("Missing lampiranId"), 400)
       const lampiran = material.lampiran.find(l => l.id === Number(lampiranId))
       if (!lampiran) return notFound("Lampiran tidak ditemukan")
       
       targetPath = lampiran.storage_path || (lampiran.url ? extractMaterialStoragePath(lampiran.url) : null)
       fallbackUrl = lampiran.url || null
    }

    if (!targetPath) {
      if (fallbackUrl && fallbackUrl.startsWith("http")) {
         return NextResponse.redirect(fallbackUrl)
      }
      return notFound("Storage path tidak ditemukan atau file tidak kompatibel")
    }
    
    // Generate signed URL (expires in 1 hour)
    const signedUrl = await createSignedUrl(BUCKETS.MATERIALS, targetPath, 3600)
    return NextResponse.redirect(signedUrl)
  } catch (error) {
    return apiError(error)
  }
}

