import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

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
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api"}/auth/google`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, name: user.name, avatar: user.image }),
            }
          )

          if (!res.ok) {
            return false
          }

          const data = await res.json()
          user.role = data.role
          user.id = data.user_id
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
