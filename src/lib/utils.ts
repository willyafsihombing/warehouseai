import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Standar dari shadcn/ui — dipakai hampir di semua komponen untuk
// menggabungkan & resolve konflik className Tailwind (misal saat
// className dari prop override default style komponen)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format angka jadi Rupiah, contoh: 12500 → "Rp 12.500"
 * Sengaja TIDAK pakai Intl.NumberFormat style 'currency' — hasilnya
 * tidak konsisten ada/tidaknya spasi setelah "Rp" antar environment
 * (Node vs browser, beda versi ICU). Format angka pakai Intl,
 * "Rp " ditempel manual supaya hasilnya selalu pasti.
 *
 * Catatan: project ini sengaja TIDAK memakai harga produk di UI manapun
 * (lihat keputusan scope sebelumnya). Fungsi ini dibiarkan ada untuk
 * keperluan lain di masa depan, tapi saat ini tidak dipanggil di mana pun.
 */
export function formatRupiah(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '-'
  return `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`
}

/**
 * Format angka dengan pemisah ribuan, contoh: 12840 → "12.840"
 */
export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return '0'
  return new Intl.NumberFormat('id-ID').format(num)
}

/**
 * Potong teks kalau lebih panjang dari maxLength, tambah "...".
 * Contoh: truncateText("Indomie Goreng Special", 15) → "Indomie Goreng..."
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}...`
}