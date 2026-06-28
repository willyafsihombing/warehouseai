'use client'

import { useRouter } from 'next/navigation'
import { Package, Pencil, Search, SearchX, Trash2 } from 'lucide-react'

import { useProducts } from '@/src/hooks/useProducts'
import { useProductCategories } from '@/src/hooks/useProductCategories'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TableSkeleton } from '@/src/components/layout/TableSkeleton'
import type { Product } from '@/src/types'

interface ProductsTableProps {
  initialProducts: Product[]
}

// formatRupiah() DIHAPUS — harga tidak dipakai sama sekali di project ini

export function ProductsTable({ initialProducts }: ProductsTableProps) {
  const router = useRouter()
  const categoryOptions = useProductCategories()
  const {
    products,
    isLoading,
    error,
    search,
    category,
    setSearch,
    setCategory,
    deleteProduct,
  } = useProducts(initialProducts)

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(
      `Hapus produk ${product.name}? Stok produk ini juga akan dihapus.`
    )
    if (!confirmed) return

    const result = await deleteProduct(product.id)
    if (!result.success) {
      window.alert(result.error ?? 'Gagal menghapus produk')
    }
  }

  function handleResetFilter() {
    setSearch('')
    setCategory('')
  }

  const hasActiveFilter = search !== '' || category !== ''
  const showNoProductsAtAll = !isLoading && products.length === 0 && !hasActiveFilter
  const showNoSearchResults = !isLoading && products.length === 0 && hasActiveFilter

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau SKU produk..."
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={category || 'all'}
            onValueChange={(value) => setCategory(value === 'all' ? '' : value)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categoryOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produk</TableHead>
              <TableHead className="hidden sm:table-cell">Kategori</TableHead>
              {/* Kolom "Harga" DIHAPUS dari sini */}
              <TableHead>Unit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // colSpan dan jumlah kolom skeleton diturunkan dari 6 → 5
              <TableSkeleton rows={5} columns={5} />
            ) : showNoProductsAtAll ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Package className="h-10 w-10 text-muted-foreground" />
                    <p className="font-medium text-foreground">Belum ada produk</p>
                    <p className="max-w-xs text-sm text-muted-foreground">
                      Mulai tambahkan produk untuk melacak stok di gudang kamu.
                    </p>
                    <Button
                      className="mt-2 bg-blue-600 hover:bg-blue-700"
                      onClick={() => router.push('/products/new')}
                    >
                      Tambah Produk Pertama
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : showNoSearchResults ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <SearchX className="h-10 w-10 text-muted-foreground" />
                    <p className="font-medium text-foreground">Produk tidak ditemukan</p>
                    <p className="max-w-xs text-sm text-muted-foreground">
                      Coba ubah kata kunci pencarian atau reset filter.
                    </p>
                    <Button variant="outline" className="mt-2" onClick={handleResetFilter}>
                      Reset Filter
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sku}</p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {product.category ? (
                      <Badge variant="outline">{product.category}</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  {/* TableCell harga DIHAPUS dari sini */}
                  <TableCell>{product.unit}</TableCell>
                  <TableCell>
                    {product.is_active && (
                      <Badge className="border-transparent bg-green-100 text-green-700">
                        Aktif
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/products/${product.id}/edit`)}
                        aria-label={`Edit ${product.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDelete(product)}
                        aria-label={`Hapus ${product.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}