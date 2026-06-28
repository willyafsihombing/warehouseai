import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { PageContainer } from '@/src/components/layout/PageContainer'
import { PageHeader } from '@/src/components/layout/PageHeader'
import { ProductForm } from '@/src/components/products/productForm'
import { Button } from '@/components/ui/button'

// Server Component — tidak perlu cek auth manual di sini, karena
// layout.tsx di (dashboard) sudah melakukan itu untuk semua halaman
// di bawahnya, termasuk halaman ini.
export default function NewProductPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Tambah Produk Baru"
        description="Isi detail produk yang ingin kamu tambahkan ke warehouse."
        action={
          <Button variant="ghost" asChild>
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
            </Link>
          </Button>
        }
      />

      <div className="mx-auto w-full max-w-3xl">
        <ProductForm />
      </div>
    </PageContainer>
  )
}