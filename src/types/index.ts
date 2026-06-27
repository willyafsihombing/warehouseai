export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface User {
  id: string
  email: string
  fullname:string
  created_at: string
}

export interface Product {
  id: string
  uid: string
  user_id: string
  name: string
  sku: string
  category: string | null
  price: number | null
  unit: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Warehouse {
  id: string
  user_id: string
  name: string
  location: string | null
  max_capacity: number
  created_at: string
}

export interface Stock {
  id: string
  product_id: string
  warehouse_id: string
  quantity: number
  updated_at: string
}

export interface StockWithDetails extends Stock {
  product: Product
  warehouse: Warehouse
}

/**
 * AiInsight
 * Hasil analisis AI (Groq/LLaMA) terhadap data stok/gudang.
 * Dipakai di fitur "Warehouse AI" untuk menampilkan ringkasan
 * dan rekomendasi ke user.
 */
export interface AiInsight {
  summary: string
  items: InsightItem[]
  generated_at: string
  model: string
}

/**
 * InsightItem
 * Satu poin insight/rekomendasi spesifik dari hasil analisis AI.
 * Dipakai sebagai item di dalam AiInsight.items, biasanya dirender
 * sebagai card dengan badge warna sesuai priority.
 */
export interface InsightItem {
  title: string
  description: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  action: string | null
}

/**
 * ChatMessage
 * Satu pesan dalam percakapan chat dengan AI assistant.
 * Dipakai di komponen chat (streaming SSE / useAIStream hook)
 * untuk menyimpan history percakapan user dan assistant.
 */
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}