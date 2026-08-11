import { Suspense } from "react"
import { LoginForm } from "@/components/auth/login-form"

export default function MasukPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
