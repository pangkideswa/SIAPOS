import "server-only"
import { NextRequest, NextResponse } from "next/server"
import { apiError } from "@/lib/api-utils"
import { requireApiUser, assertMaterialAccess } from "@/auth/api-authorization"
import { materialService } from "@/services/material.service"
import { getWebViewLink } from "@/lib/storage/google-drive"
import { createSignedUrl, BUCKETS } from "@/lib/storage/supabase-server"
import { notFound } from "@/lib/api-utils"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser()
    const { id } = await context.params
    const materialId = Number(id)
    
    // 1. Authorization
    await assertMaterialAccess(user, materialId)

    const type = request.nextUrl.searchParams.get("type") // "thumbnail" or "attachment"
    const storagePath = request.nextUrl.searchParams.get("path")
    
    // 2. Load material
    const material = await materialService.getById(materialId)
    if (!material) {
      return notFound("Material tidak ditemukan")
    }

    const lampiranId = request.nextUrl.searchParams.get("lampiranId")

    let actualPathToDownload = ""

    if (type === "thumbnail") {
       if (!material.thumbnail_url) return apiError(new Error("No thumbnail"), 404)
       actualPathToDownload = material.thumbnail_url
    } else if (lampiranId) {
       const lampiranArray = Array.isArray(material.lampiran) ? material.lampiran : [];
       const lamp = (lampiranArray as { id: string | number, storage_path: string }[]).find(l => String(l.id) === String(lampiranId))
       if (!lamp) return apiError(new Error("Lampiran not found"), 404)
       actualPathToDownload = lamp.storage_path
    } else if (type === "attachment") {
       if (!storagePath) return apiError(new Error("Missing path parameter for attachment"), 400)
       
       // Verify requested path is actually part of this material's attachments
       const isPathValid = material.lampiran?.some(l => l.storage_path === storagePath)
       if (!isPathValid) {
          return apiError(new Error("Storage path mismatch. Access denied."), 403)
       }
       actualPathToDownload = storagePath
    } else {
       return apiError(new Error("Invalid type parameter"), 400)
    }

    if (actualPathToDownload.includes("../") || actualPathToDownload.includes("..\\")) {
       return apiError(new Error("Invalid path"), 400)
    }

    if (actualPathToDownload.includes("/")) {
      // Legacy Supabase Storage (path contains a slash e.g. "materials/...")
      try {
        const link = await createSignedUrl(BUCKETS.MATERIALS, actualPathToDownload, 60 * 60) // 1 hour
        return NextResponse.redirect(link)
      } catch (e) {
         console.warn("Supabase signed url failed, falling back to public url for legacy file", e)
         const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
         if (!supabaseUrl) throw new Error("Missing Supabase URL")
         const finalUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKETS.MATERIALS}/${actualPathToDownload}`
         return NextResponse.redirect(finalUrl)
      }
    } else {
      // Google Drive (path is an ID without slashes)
      const webViewLink = await getWebViewLink(actualPathToDownload)
      if (!webViewLink) {
         return apiError(new Error("Failed to get file link"), 500)
      }
      return NextResponse.redirect(webViewLink)
    }
  } catch (error) {
    return apiError(error)
  }
}
