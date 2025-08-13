// utils/session.ts
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/utils/auth/authOptions"
import { NextResponse } from "next/server"

/**
 * Retrieves the user ID from the NextAuth session.
 * Throws a 401 NextResponse if there's no valid session.
 */
export async function getUserIdFromSession(): Promise<string> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new NextResponse(
      JSON.stringify({ message: "Unauthorized" }),
      { status: 401 }
    )
  }
  return session.user.id
}
