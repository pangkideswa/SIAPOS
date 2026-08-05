import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { authService } from "@/services/auth.service"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const email = user.email
        if (!email) return false

        try {
          const dbUser = await authService.googleLogin({
            email,
            name: user.name,
            image: user.image,
            providerId: account.providerAccountId,
          })
          user.id = String(dbUser.id)
          user.role = dbUser.role
          user.image = dbUser.image ?? user.image
          return true
        } catch {
          return false
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.userId = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role as string
      session.user.id = token.userId as string
      return session
    },
  },
  pages: {
    signIn: "/masuk",
    error: "/masuk",
  },
})
