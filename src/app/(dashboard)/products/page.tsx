import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Plus } from 'lucide-react'

import { verifyToken } from '@/src/lib/auth/jwt'
import { supabaseAdmin } from '@/src/lib/supabase/admin'
import { PageContainer } from '@/src/components/layout/PageContainer'
import { PageHeader } from '@/src/components/layout/PageHeader'
import { ProductsTable } from '@/src/components/products/ProductTable'
import { Button } from '@/components/ui/button'
import type { Product } from '@/src/types'

// Server Component — user diambil dari cookie auth-token + verifyToken()
// (JWT custom), bukan createClient/supabase.auth.getUser() (Supabase Auth)
export default async function ProductsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) {
    redirect('/login')
  }

  let user
  try {
    user = await verifyToken(token)
  } catch {
    redirect('/login')
  }

  const { data: products, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('user_id', user.sub)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Fetch products error:', error)
  }

  const productList: Product[] = products ?? []

  // Query count terpisah, tanpa limit 50, supaya angkanya akurat untuk
  // SEMUA produk milik user, bukan cuma 50 yang tampil di tabel
  const { count: totalCount } = await supabaseAdmin
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.sub)

  const { count: activeCount } = await supabaseAdmin
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.sub)
    .eq('is_active', true)

  // Kategori unik tetap berbasis 50 produk pertama (limit query tabel di
  // atas) — beda dari totalCount/activeCount yang sudah akurat lewat
  // count query terpisah
  const uniqueCategories = new Set(
    productList.map((p) => p.category).filter(Boolean)
  ).size

  return (
    <PageContainer>
      <PageHeader
        title="Produk"
        description="Kelola semua produk yang ada di warehouse kamu."
        action={
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/products/new">
              <Plus className="mr-2 h-4 w-4" /> Tambah Produk
            </Link>
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
          Total: <span className="font-medium text-foreground">{totalCount ?? 0}</span> produk
        </span>
        <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
          Aktif: <span className="font-medium text-foreground">{activeCount ?? 0}</span> produk
        </span>
        <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
          Kategori: <span className="font-medium text-foreground">{uniqueCategories}</span> kategori
        </span>
      </div>

      <ProductsTable initialProducts={productList} />
    </PageContainer>
  )
}