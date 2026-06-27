import { NextResponse } from 'next/server'

import { supabaseAdmin } from '@/src/lib/supabase/admin'
import { hashPassword } from '@/src/lib/auth/password'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = String(body.email ?? '').trim().toLowerCase()
    const password = String(body.password ?? '')
    const fullName = String(body.fullName ?? '').trim()

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { success: false, error: 'Email, password, dan nama lengkap wajib diisi' },
        { status: 400 }
      )
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Format email tidak valid' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password minimal 8 karakter' },
        { status: 400 }
      )
    }

    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Email sudah terdaftar' },
        { status: 409 }
      )
    }

    const passwordHash = await hashPassword(password)

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({ email, password_hash: passwordHash, full_name: fullName })
      .select('id, email, full_name, role')
      .single()

    if (error) {
      // Tangani race condition: dua request bersamaan lolos cek "existing"
      // tapi salah satu gagal insert karena unique constraint di database.
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'Email sudah terdaftar' },
          { status: 409 }
        )
      }
      throw error
    }

    return NextResponse.json({ success: true, data: user })
  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json(
      { success: false, error: 'Gagal mendaftar, coba lagi' },
      { status: 500 }
    )
  }
}