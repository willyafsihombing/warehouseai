import { cookies } from 'next/headers'

import { verifyToken, type JwtPayload } from '@/src/lib/auth/jwt'

// Helper terpusat untuk semua API route yang butuh user yang sedang login.
// Return null kalau belum login / token invalid / expired — caller yang
// memutuskan mau response 401 seperti apa.
export async function getCurrentUser(): Promise<JwtPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) return null

  try {
    return await verifyToken(token)
  } catch {
    return null
  }
}