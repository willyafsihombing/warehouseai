import { NextResponse } from 'next/server'

import { supabaseAdmin } from '@/src/lib/supabase/admin'
import { verifyPassword } from '@/src/lib/auth/password'
import { signToken } from '@/src/lib/auth/jwt'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = String(body.email ?? '').trim().toLowerCase()
    const password = String(body.password ?? '')

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email dan password wajib diisi' },
        { status: 400 }
      )
    }

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, password_hash, full_name, role')
      .eq('email', email)
      .maybeSingle()

    if (error) throw error

    // Pesan error digeneralisasi (tidak bedakan "email tidak ada" vs
    // "password salah") supaya tidak bisa dipakai untuk enumerasi email.
    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return NextResponse.json(
        { success: false, error: 'Email atau password salah' },
        { status: 401 }
      )
    }

    const token = await signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      fullName: user.full_name,
    })

    const response = NextResponse.json({
      success: true,
      data: {
        token, // dikembalikan juga di body — untuk Bearer token di app Flutter nanti
        user: { id: user.id, email: user.email, fullName: user.full_name, role: user.role },
      },
    })

    // Untuk web: simpan token di httpOnly cookie (tidak bisa diakses JS,
    // lebih aman dari XSS dibanding localStorage).
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 jam, samakan dengan masa berlaku JWT
      path: '/',
    })

    return response
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json(
      { success: false, error: 'Gagal login, coba lagi' },
      { status: 500 }
    )
  }
}