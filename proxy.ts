import { NextResponse, type NextRequest } from 'next/server'

import { verifyToken, type JwtPayload } from '@/src/lib/auth/jwt'

const PUBLIC_ROUTES = ['/', '/login', '/register']

const AUTH_ROUTES = ['/login', '/register']

const PROTECTED_ROUTES_PREFIX = ['/dashboard', '/products', '/warehouses', '/stock', '/chat']


const API_PROTECTED_PREFIX = ['/api/products', '/api/warehouses', '/api/stock', '/api/ai']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = request.cookies.get('auth-token')?.value

  let user: JwtPayload | null = null
  if (token) {
    try {
      user = await verifyToken(token)
    } catch {
      user = null
    }
  }

  const isAuthRoute = AUTH_ROUTES.includes(pathname)
  const isProtectedRoute = PROTECTED_ROUTES_PREFIX.some((prefix) => pathname.startsWith(prefix))
  const isProtectedApi = API_PROTECTED_PREFIX.some((prefix) => pathname.startsWith(prefix))

  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!user && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (!user && isProtectedApi) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}