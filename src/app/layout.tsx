import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { QueryProvider } from '@/providers/query-provider'
import { ThemeProvider } from "@/components/theme-provider"
import { SettingsProvider } from "@/contexts/settings-context"
import { getCachedSettings } from "@/lib/settings"
import "./globals.css"
import { SpeedInsights } from "@vercel/speed-insights/next"
const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

export async function generateMetadata(): Promise<Metadata> {
  // Fetch app settings for metadata
  let appName = "SIAPOS - Education Operating System"
  const description = "SIAPOS adalah Education Operating System yang mengintegrasikan pembelajaran, penilaian, administrasi akademik, dan komunikasi sekolah dalam satu platform."
  let favicon = "/favicon.png"

  try {
    const settingsData = await getCachedSettings()
    
    settingsData.forEach((s: { key: string; value: string }) => {
      if (s.key === 'pengaturan_sistem') {
        const val = JSON.parse(s.value)
        if (val.nama_aplikasi) appName = val.nama_aplikasi
      }
      if (s.key === 'logo') {
        const val = JSON.parse(s.value)
        if (val.favicon) favicon = val.favicon
      }
    })
  } catch {
    // Ignore db connection issues during build
  }

  return {
    title: {
      default: appName,
      template: `%s | ${appName}`,
    },
    description,
    keywords: ["education", "academic", "SIAPOS", "EduOS", "pembelajaran", "digital", "sekolah", "e-learning"],
    manifest: "/manifest.json",
    icons: {
      icon: [
        { url: favicon, type: favicon.startsWith('data:image/svg+xml') ? "image/svg+xml" : "image/png" },
        { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
        { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
      ],
      shortcut: favicon,
      apple: "/apple-touch-icon.png",
    },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let initialSettings = undefined
  try {
    const settings = await getCachedSettings()
    const config: Record<string, unknown> = {}
    settings.forEach((s: { key: string; value: string }) => {
      try {
        config[s.key] = JSON.parse(s.value)
      } catch {
        config[s.key] = s.value
      }
    })
    if (Object.keys(config).length > 0) initialSettings = config
  } catch {
    // Ignore errors
  }

  return (
    <html lang="id" className={`${jakartaSans.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <SettingsProvider initialSettings={initialSettings}>
            <QueryProvider>{children}</QueryProvider>
          </SettingsProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
