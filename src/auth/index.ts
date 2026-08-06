import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { authConfig } from "@/auth/config"
import { prismaAdapter } from "@/auth/adapter"
import { authService } from "@/services/auth.service"
import { loginSchema } from "@/lib/validations/auth.schemas"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: prismaAdapter,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        identifier: { label: "Email / NIP / NISN", type: "text" },
        password: { label: "Kata Sandi", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null
        const user = await authService.validateCredentials(
          parsed.data.identifier,
          parsed.data.password
        )
        if (!user) return null
        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image ?? null,
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const email = user.email
        if (!email) return false
        try {
          await authService.googleLogin({
            email,
            name: user.name,
            image: user.image,
            providerId: account.providerAccountId,
          })
          return true
        } catch {
          return false
        }
      }
      return true
    },
  },
})
