import Link from 'next/link'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { verifyToken } from '@/src/lib/auth/jwt'
import { supabaseAdmin } from '@/src/lib/supabase/admin'
import { PageContainer } from '@/src/components/layout/PageContainer'
import { PageHeader } from '@/src/components/layout/PageHeader'
import { ProductForm } from '@/src/components/products/productForm'
import { Button } from '@/components/ui/button'

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params

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

  const { data: product, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.sub)
    .eq('is_active', true)
    .single()

  if (error || !product) {
    notFound()
  }

  return (
    <PageContainer>
      <PageHeader
        title="Edit Produk"
        description={`Memperbarui informasi untuk ${product.name}`}
        action={
          <Button variant="ghost" asChild>
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
            </Link>
          </Button>
        }
      />

      <div className="mx-auto w-full max-w-3xl">
        <ProductForm product={product} />
      </div>
    </PageContainer>
  )
}