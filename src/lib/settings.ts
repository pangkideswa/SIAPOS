import { unstable_cache } from "next/cache"
import { prisma } from "./prisma"

export const getCachedSettings = unstable_cache(
  async () => {
    return prisma.appSetting.findMany()
  },
  ['app-settings-all'],
  { revalidate: 3600, tags: ['settings'] }
)
