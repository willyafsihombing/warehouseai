import { NextResponse } from 'next/server'

import { supabaseAdmin } from '@/src/lib/supabase/admin'
import { getCurrentUser } from '@/src/lib/auth/get-current-user'
import type { ApiResponse } from '@/src/types'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .select('category')
      .eq('user_id', user.sub)
      .eq('is_active', true)
      .not('category', 'is', null)

    if (error) throw error

    // Distinct + sort, buang null/duplikat
    const categories = Array.from(
      new Set((data ?? []).map((row) => row.category).filter(Boolean))
    ).sort() as string[]

    return NextResponse.json<ApiResponse<string[]>>({ success: true, data: categories })
  } catch (err) {
    console.error('GET /api/products/categories error:', err)
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Gagal mengambil daftar kategori' },
      { status: 500 }
    )
  }
}