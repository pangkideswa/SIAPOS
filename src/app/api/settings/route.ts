import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const settings = await prisma.appSetting.findMany()
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
    const session = await getServerSession(authOptions)
    if (!session || !["super_admin", "admin"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    
    const upsertPromises = Object.entries(body).map(([key, value]) => {
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value)
      return prisma.appSetting.upsert({
        where: { key },
        update: { value: stringValue },
        create: { key, value: stringValue },
      })
    })

    await Promise.all(upsertPromises)

    return NextResponse.json({ message: "Pengaturan berhasil disimpan" })
  } catch (error) {
    console.error("Error saving settings:", error)
    return NextResponse.json({ error: "Gagal menyimpan pengaturan" }, { status: 500 })
  }
}
