import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle, BarChart3, Package, Sparkles, Warehouse } from 'lucide-react'

import { verifyToken } from '@/src/lib/auth/jwt'
import { supabaseAdmin } from '@/src/lib/supabase/admin'
import { formatNumber } from '@/src/lib/utils'
import { PageContainer } from '@/src/components/layout/PageContainer'
import { PageHeader } from '@/src/components/layout/PageHeader'
import { StatCard } from '@/src/components/dashboard/StatCard'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface StockWithMinQuantity {
  quantity: number
  products: {
    min_quantity: number
  } | null
}

export default async function DashboardPage() {
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

  // Total Produk aktif
  const { count: totalProducts } = await supabaseAdmin
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.sub)
    .eq('is_active', true)

  // Total Gudang
  const { count: totalWarehouses } = await supabaseAdmin
    .from('warehouses')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.sub)

  // Semua baris stock + min_quantity produk terkait (cuma produk aktif
  // milik user ini). "products!inner" supaya filter user_id di tabel
  // products ikut membatasi hasil join, bukan cuma di tabel stock.
  const { data: stockRows, error: stockError } = await supabaseAdmin
    .from('stock')
    .select('quantity, products!inner(min_quantity)')
    .eq('products.user_id', user.sub)
    .eq('products.is_active', true)
    .returns<StockWithMinQuantity[]>()

  if (stockError) {
    console.error('Fetch stock for dashboard error:', stockError)
  }

  const rows = stockRows ?? []

  const lowStockCount = rows.filter(
    (row) => row.products && row.quantity < row.products.min_quantity
  ).length

  const totalStockUnits = rows.reduce((sum, row) => sum + row.quantity, 0)

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Selamat datang kembali. Ini ringkasan warehouse kamu hari ini."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Total Produk"
          value={formatNumber(totalProducts)}
          description="produk terdaftar"
          icon={<Package className="h-4 w-4" />}
        />
        <StatCard
          title="Total Gudang"
          value={formatNumber(totalWarehouses)}
          description="gudang aktif"
          icon={<Warehouse className="h-4 w-4" />}
        />
        <StatCard
          title="Item Stok Rendah"
          value={formatNumber(lowStockCount)}
          description="perlu perhatian"
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        <StatCard
          title="Total Stok"
          value={formatNumber(totalStockUnits)}
          description="unit di semua gudang"
          icon={<BarChart3 className="h-4 w-4" />}
        />
      </div>

      <Card className="border-2 border-dashed bg-transparent shadow-none">
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <Sparkles className="h-10 w-10 text-blue-400" />
          <h3 className="text-lg font-semibold text-foreground">
            AI Insight Dashboard
          </h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            AI insight akan muncul di sini setelah kamu menambahkan data
            produk dan gudang.
          </p>
          <Button asChild className="mt-2 bg-blue-600 hover:bg-blue-700">
            <Link href="/products">Tambah Produk Pertama</Link>
          </Button>
        </CardContent>
      </Card>
    </PageContainer>
  )
}