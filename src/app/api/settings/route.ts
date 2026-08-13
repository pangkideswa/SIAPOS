import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getCachedSettings } from "@/lib/settings"
import { revalidateTag } from "next/cache"
import { deleteFile, BUCKETS } from "@/lib/storage/supabase-server"
import { assertValidSettingsPath } from "@/lib/storage/path-validator"

// Helper to extract bucket path from a public URL
function extractStoragePath(url: string, bucket: string): string | null {
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

export async function GET() {
  try {
    const settings = await getCachedSettings()
    const config: Record<string, unknown> = {}
    
    settings.forEach((setting) => {
      try {
        config[setting.key] = JSON.parse(setting.value)
      } catch {
        config[setting.key] = setting.value
      }
    })
    
    return NextResponse.json(config)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Gagal mengambil pengaturan" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || !["super_admin", "admin"].includes(session.user?.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    
    // --- PHASE 2: HANDLE LOGO & FAVICON UPLOAD ---
    let oldLogo: Record<string, unknown> = {}
    if (body.logo) {
      const oldSettingsRaw = await prisma.appSetting.findUnique({ where: { key: 'logo' } })
      if (oldSettingsRaw) {
        try { oldLogo = JSON.parse(oldSettingsRaw.value) } catch {}
      }

      for (const key of ['logo_sekolah', 'favicon']) {
        const val = body.logo[key]
        if (typeof val === 'string' && val.startsWith('http') && val !== oldLogo[key]) {
           // validate path
           const path = extractStoragePath(val, BUCKETS.SCHOOL)
           if (path && !assertValidSettingsPath(path)) {
              return NextResponse.json({ error: "Invalid settings storage path" }, { status: 400 })
           }
        } else if (typeof val === 'string' && val.startsWith('data:image/')) {
           return NextResponse.json({ error: "Base64 upload is no longer supported. Use Direct Upload." }, { status: 400 })
        }
      }
    }
    // ---------------------------------------------

    try {
      const upsertPromises = Object.entries(body).map(([key, value]) => {
        const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value)
        return prisma.appSetting.upsert({
          where: { key },
          update: { value: stringValue },
          create: { key, value: stringValue },
        })
      })

      await Promise.all(upsertPromises)
      
      // Cleanup old files on success
      if (body.logo) {
         for (const key of ['logo_sekolah', 'favicon']) {
            const val = body.logo[key]
            if (val !== oldLogo[key] && oldLogo[key]) {
               const oldPath = extractStoragePath(String(oldLogo[key]), BUCKETS.SCHOOL)
               if (oldPath) {
                  deleteFile(BUCKETS.SCHOOL, oldPath).catch(err => {
                     console.error("Failed to delete old file from storage:", err)
                  })
               }
            }
         }
      }
      
      revalidateTag("settings")
      return NextResponse.json({ message: "Pengaturan berhasil disimpan" })
    } catch (dbError) {
      // Orphan cleanup on DB failure
      if (body.logo) {
         for (const key of ['logo_sekolah', 'favicon']) {
            const val = body.logo[key]
            if (typeof val === 'string' && val.startsWith('http') && val !== oldLogo[key]) {
               const path = extractStoragePath(val, BUCKETS.SCHOOL)
               if (path) {
                  deleteFile(BUCKETS.SCHOOL, path).catch(err => {
                     console.error("Failed to delete new file on DB failure:", err)
                  })
               }
            }
         }
      }
      throw dbError
    }
  } catch (error: unknown) {
    console.error("Error saving settings:", error)
    const msg = error instanceof Error && error.message.includes("exceeds") ? error.message : "Gagal menyimpan pengaturan"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
