// types/next-auth.d.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
    remember?: boolean // ✅ Add this to track session lifespan logic
  }

  interface JWT {
    id: string
    remember?: boolean // ✅ Store this flag in the token to use in callbacks
  }
}
