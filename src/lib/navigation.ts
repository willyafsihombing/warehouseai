import {
  ClipboardList,
  LayoutDashboard,
  MessageSquare,
  Package,
  Settings,
  Warehouse,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Produk', href: '/products', icon: Package },
  { label: 'Gudang', href: '/warehouses', icon: Warehouse },
  { label: 'Manajemen Stok', href: '/stock', icon: ClipboardList },
  { label: 'AI Chat', href: '/chat', icon: MessageSquare },
]

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { label: 'Pengaturan', href: '/settings', icon: Settings },
]

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}