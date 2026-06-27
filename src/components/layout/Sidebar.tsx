'use client'

import { Sparkles } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
BOTTOM_NAV_ITEMS,
MAIN_NAV_ITEMS,
isNavItemActive,
type NavItem,
} from '@/src/lib/navigation'

 function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
 const active = isNavItemActive(pathname, item.href)
 const Icon = item.icon

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150 ${
        active
          ? 'bg-blue-600 font-medium text-white'
          : 'text-blue-200 hover:bg-blue-900 hover:text-white'
      }`}
    >
      <Icon className="h-5 w-5" />
      {item.label}
    </Link>
  )
}

// Client Component — butuh usePathname() untuk active state.
export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-64 flex-col bg-blue-950">
      {/* Logo / app name */}
      <div className="flex flex-col gap-1 border-b border-blue-900 px-4 py-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-400" />
          <span className="font-bold text-white">Warehouse AI</span>
        </div>
        <span className="text-xs text-blue-400">Powered by Groq AI</span>
      </div>

      {/* Main nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
          Menu Utama
        </p>
        {MAIN_NAV_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="space-y-1 border-t border-blue-900 px-3 py-4">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
          Lainnya
        </p>
        {BOTTOM_NAV_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}
      </div>
    </aside>
  )
}