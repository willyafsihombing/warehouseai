'use client'

import { useEffect, useState } from 'react'

import type { ApiResponse } from '@/src/types'

export function useProductCategories() {
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    let isMounted = true

    fetch('/api/products/categories')
      .then((res) => res.json())
      .then((json: ApiResponse<string[]>) => {
        if (isMounted && json.success) {
          setCategories(json.data ?? [])
        }
      })
      .catch(() => {
        // Diamkan saja — dropdown filter cuma jadi kosong, bukan blocking error
      })

    return () => {
      isMounted = false
    }
  }, [])

  return categories
}