// utils/session.ts
import { NextResponse } from "next/server"
import { auth } from "@/utils/auth/authConfig"

/**
 * Retrieves the user ID from the NextAuth session.
 * Throws a 401 NextResponse if there's no valid session.
 */
export async function getUserIdFromSession(): Promise<string> {
  const session = await auth()

  if (!session?.user?.id) {
    throw new NextResponse(
      JSON.stringify({ message: "Unauthorized" }),
      { status: 401 }
    )
  }
  return session.user.id
}