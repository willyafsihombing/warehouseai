'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'


import { productSchema, type ProductFormData } from '@/src/lib/validations/product'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { ApiResponse, Product } from '@/src/types'

interface ProductFormProps {
  product?: Product
  onSuccess?: () => void
}

const CATEGORY_OPTIONS = ['Makanan', 'Minuman', 'Kebersihan', 'Snack', 'Lainnya']
const UNIT_OPTIONS = ['pcs', 'kg', 'gram', 'liter', 'ml', 'dus', 'karton', 'lusin']
const DESCRIPTION_MAX_LENGTH = 500

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const router = useRouter()
  const isEditMode = Boolean(product)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? '',
      sku: product?.sku ?? '',
      category: product?.category ?? '',
      unit: product?.unit ?? 'pcs',
      description: product?.description ?? '',
    },
  })

  const descriptionValue = form.watch('description') ?? ''

  async function onSubmit(values: ProductFormData) {
    setServerError(null)
    setIsSubmitting(true)

    try {
      const url = isEditMode ? `/api/products/${product!.id}` : '/api/products'
      const method = isEditMode ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      const json: ApiResponse<Product> = await res.json()

      if (res.status === 401) {
        window.location.href = '/login'
        return
      }

      if (!res.ok || !json.success) {
        const message = json.error ?? ''
        if (message.toLowerCase().includes('duplicate') || message.includes('SKU')) {
          setServerError('SKU sudah digunakan produk lain.')
        } else {
          setServerError('Terjadi kesalahan. Silakan coba lagi.')
        }
        return
      }

      toast.success(isEditMode ? 'Produk berhasil diperbarui.' : 'Produk berhasil ditambahkan.')

      onSuccess?.()
      router.push('/products')
    } catch {
      setServerError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Produk' : 'Tambah Produk Baru'}</CardTitle>
        <CardDescription>
          {isEditMode ? 'Perbarui informasi produk.' : 'Isi detail produk baru.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Row 1 — full width */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>
                      Nama Produk <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Mie Instan Rasa Ayam Bawang" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Row 2 */}
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      SKU <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: MKN-001" {...field} />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      SKU akan otomatis diubah ke huruf kapital
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Row 3 — cuma Satuan, karena field Harga ditiadakan (di luar scope project) */}
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Satuan</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="md:w-1/2">
                          <SelectValue placeholder="Pilih satuan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {UNIT_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Row 4 — full width */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="Deskripsi produk (opsional)"
                        maxLength={DESCRIPTION_MAX_LENGTH}
                        {...field}
                      />
                    </FormControl>
                    <p className="text-right text-xs text-muted-foreground">
                      {descriptionValue.length} / {DESCRIPTION_MAX_LENGTH}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {serverError && (
              <Alert variant="destructive">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push('/products')}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting
                  ? 'Menyimpan...'
                  : isEditMode
                    ? 'Simpan Perubahan'
                    : 'Tambah Produk'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}