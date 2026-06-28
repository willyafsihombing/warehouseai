import { NextResponse } from 'next/server'

import { supabaseAdmin } from '@/src/lib/supabase/admin'
import { getCurrentUser } from '@/src/lib/auth/get-current-user'
import type { ApiResponse, Product } from '@/src/types'

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')?.trim()
    const category = searchParams.get('category')?.trim()
    const limit = Number(searchParams.get('limit')) || 50

    let query = supabaseAdmin
      .from('products')
      .select('*', { count: 'exact' })
      .eq('user_id', user.sub)
      .eq('is_active', true)

    if (search) {
      const safeSearch = search.replace(/[%_]/g, '\\$&')
      query = query.or(`name.ilike.%${safeSearch}%,sku.ilike.%${safeSearch}%`)
    }

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return NextResponse.json<ApiResponse<Product[]> & { count: number }>({
      success: true,
      data: data ?? [],
      count: count ?? 0,
    })
  } catch (err) {
    console.error('GET /api/products error:', err)
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Gagal mengambil data produk' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const name = String(body.name ?? '').trim()
    const sku = String(body.sku ?? '').trim()
    const category = body.category ? String(body.category).trim() : null
    const price = body.price !== undefined && body.price !== null ? Number(body.price) : null
    const unit = body.unit ? String(body.unit).trim() : 'pcs'
    const description = body.description ? String(body.description).trim() : null

    if (!name || !sku) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Nama produk dan SKU wajib diisi' },
        { status: 400 }
      )
    }

    const { data: existing } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('user_id', user.sub)
      .eq('sku', sku)
      .maybeSingle()

    if (existing) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'SKU ini sudah digunakan' },
        { status: 409 }
      )
    }

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .insert({
        user_id: user.sub,
        name,
        sku,
        category,
        price,
        unit,
        description,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json<ApiResponse<never>>(
          { success: false, error: 'SKU ini sudah digunakan' },
          { status: 409 }
        )
      }
      throw error
    }

    return NextResponse.json<ApiResponse<Product>>({ success: true, data: product })
  } catch (err) {
    console.error('POST /api/products error:', err)
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Gagal menambahkan produk' },
      { status: 500 }
    )
  }
}