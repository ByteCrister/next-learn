// utils/session.ts
import { auth } from "@/utils/auth/authConfig"

/**
 * Retrieves the user ID from the NextAuth session.
 */

export async function getUserIdFromSession(): Promise<string | null> {
  const session = await auth()
  return session?.user?.id ?? null
}