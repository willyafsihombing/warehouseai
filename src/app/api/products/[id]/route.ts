import { NextResponse } from 'next/server'

import { supabaseAdmin } from '@/src/lib/supabase/admin'
import { getCurrentUser } from '@/src/lib/auth/get-current-user'
import type { ApiResponse, Product } from '@/src/types'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.sub)
      .maybeSingle()

    if (error) throw error

    if (!product) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Produk tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse<Product>>({ success: true, data: product })
  } catch (err) {
    console.error('GET /api/products/[id] error:', err)
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Gagal mengambil data produk' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    // Pastikan produk memang ada dan milik user ini SEBELUM update —
    // supaya bisa kasih 404 yang jelas, bukan "0 rows updated" yang ambigu
    // (bisa berarti tidak ada, atau ada tapi bukan milik user ini).
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('id, sku')
      .eq('id', id)
      .eq('user_id', user.sub)
      .maybeSingle()

    if (fetchError) throw fetchError

    if (!existing) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Produk tidak ditemukan' },
        { status: 404 }
      )
    }

    // Build partial update — hanya field yang benar-benar dikirim
    const updates: Record<string, unknown> = {}

    if (body.name !== undefined) {
      const name = String(body.name).trim()
      if (!name) {
        return NextResponse.json<ApiResponse<never>>(
          { success: false, error: 'Nama produk tidak boleh kosong' },
          { status: 400 }
        )
      }
      updates.name = name
    }

    if (body.sku !== undefined) {
      const sku = String(body.sku).trim()
      if (!sku) {
        return NextResponse.json<ApiResponse<never>>(
          { success: false, error: 'SKU tidak boleh kosong' },
          { status: 400 }
        )
      }
      // Cek duplikat SKU cuma kalau memang berubah dari sebelumnya
      if (sku !== existing.sku) {
        const { data: duplicate } = await supabaseAdmin
          .from('products')
          .select('id')
          .eq('user_id', user.sub)
          .eq('sku', sku)
          .neq('id', id)
          .maybeSingle()

        if (duplicate) {
          return NextResponse.json<ApiResponse<never>>(
            { success: false, error: 'SKU ini sudah digunakan' },
            { status: 409 }
          )
        }
      }
      updates.sku = sku
    }

    if (body.category !== undefined) {
      updates.category = body.category ? String(body.category).trim() : null
    }

    if (body.price !== undefined) {
      updates.price = body.price === null ? null : Number(body.price)
    }

    if (body.unit !== undefined) {
      updates.unit = String(body.unit).trim() || 'pcs'
    }

    if (body.description !== undefined) {
      updates.description = body.description ? String(body.description).trim() : null
    }

    updates.updated_at = new Date().toISOString()

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.sub)
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
    console.error('PATCH /api/products/[id] error:', err)
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Gagal memperbarui produk' },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.sub)
      .select('id')
      .maybeSingle()

    if (error) throw error

    if (!product) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Produk tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse<never>>({ success: true })
  } catch (err) {
    console.error('DELETE /api/products/[id] error:', err)
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Gagal menghapus produk' },
      { status: 500 }
    )
  }
}