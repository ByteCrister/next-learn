// types/next-auth.d.ts
import  { DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
    remember?: boolean
  }

  interface JWT {
    id?: string
    email?: string // add email so we can fetch id if missing
    remember?: boolean
  }

  // Optionally extend User type if needed
  interface User extends DefaultUser {
    id?: string
  }
}
