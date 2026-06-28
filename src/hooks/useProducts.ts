'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import type { ApiResponse, Product } from '@/src/types'

interface DeleteResult {
  success: boolean
  error?: string
}

export function useProducts(initialProducts: Product[] = []) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  // Mengabaikan response dari request lama kalau ada request baru yang
  // menyusul lebih cepat (race condition saat user ngetik cepat di search).
  const requestIdRef = useRef(0)

  const isFirstRender = useRef(true)

  const fetchProducts = useCallback(async () => {
    const currentRequestId = ++requestIdRef.current
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (category) params.set('category', category)

      const res = await fetch(`/api/products?${params.toString()}`)

      if (res.status === 401) {
        window.location.href = '/login'
        return
      }

      const json: ApiResponse<Product[]> = await res.json()

      // Buang hasil ini kalau sudah ada request lain yang lebih baru
      if (currentRequestId !== requestIdRef.current) return

      if (!json.success) {
        setError(json.error ?? 'Gagal memuat data produk')
        return
      }

      setProducts(json.data ?? [])
    } catch {
      if (currentRequestId !== requestIdRef.current) return
      setError('Gagal memuat data produk')
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setIsLoading(false)
      }
    }
  }, [search, category])

  // Fetch awal saat mount, lalu setiap filter berubah — search di-debounce
  // 300ms supaya tidak fetch di setiap ketikan, category langsung trigger.
  useEffect(() => {
    if (isFirstRender.current) {
        isFirstRender.current = false
        return
    }

    const timeoutId = setTimeout(
      () => {
        fetchProducts()
      },
      search ? 300 : 0
    )

    return () => clearTimeout(timeoutId)
  }, [fetchProducts, search])

  const deleteProduct = useCallback(
    async (id: string): Promise<DeleteResult> => {
      try {
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })

        if (res.status === 401) {
          window.location.href = '/login'
          return { success: false, error: 'Sesi kamu sudah berakhir' }
        }

        const json: ApiResponse<never> = await res.json()

        if (!json.success) {
          return { success: false, error: json.error ?? 'Gagal menghapus produk' }
        }

        await fetchProducts()
        return { success: true }
      } catch {
        return { success: false, error: 'Gagal menghapus produk' }
      }
    },
    [fetchProducts]
  )

  return {
    products,
    isLoading,
    error,
    search,
    category,
    setSearch,
    setCategory,
    deleteProduct,
    refetch: fetchProducts,
  }
}