// import { cookies } from 'next/headers'
// import { redirect } from 'next/navigation'

// import { verifyToken } from '@/src/lib/auth/jwt'
// import { PageContainer } from '@/src/components/layout/PageContainer'
// import { PageHeader } from '@/src/components/layout/PageHeader'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// export default async function DashboardPage() {
//   const cookieStore = await cookies()
//   const token = cookieStore.get('auth-token')?.value

//   if (!token) {
//     redirect('/login')
//   }

//   let user
//   try {
//     user = await verifyToken(token)
//   } catch {
//     redirect('/login')
//   }

//   return (
//     <PageContainer>
//       <PageHeader
//         title="Dashboard"
//         description="Halaman utama Warehouse AI"
//       />

//       <div className="space-y-1">
//         <h2 className="text-2xl font-bold text-blue-600">
//           Selamat datang, {user.email}!
//         </h2>
//         <p className="text-muted-foreground">
//           Dashboard sedang dalam pembangunan.
//         </p>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle className="text-base">Informasi Akun</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-2 text-sm">
//           <div className="flex gap-2">
//             <span className="font-medium text-foreground">Email:</span>
//             <span className="text-muted-foreground">{user.email}</span>
//           </div>
//           <div className="flex gap-2">
//             <span className="font-medium text-foreground">User ID:</span>
//             <span className="text-muted-foreground">{user.sub}</span>
//           </div>
//         </CardContent>
//       </Card>
//     </PageContainer>
//   )
// }

import Link from 'next/link'
import { AlertTriangle, BarChart3, Package, Sparkles, Warehouse } from 'lucide-react'

import { PageContainer } from '@/src/components/layout/PageContainer'
import { PageHeader } from '@/src/components/layout/PageHeader'
import { StatCard } from '@/src/components/dashboard/StatCard'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Selamat datang kembali. Ini ringkasan warehouse kamu hari ini."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Total Produk"
          value="0"
          description="produk terdaftar"
          icon={<Package className="h-4 w-4" />}
        />
        <StatCard
          title="Total Gudang"
          value="0"
          description="gudang aktif"
          icon={<Warehouse className="h-4 w-4" />}
        />
        <StatCard
          title="Item Stok Rendah"
          value="0"
          description="perlu perhatian"
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        <StatCard
          title="Total Stok"
          value="0"
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