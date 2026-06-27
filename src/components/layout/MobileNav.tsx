'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles } from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  BOTTOM_NAV_ITEMS,
  MAIN_NAV_ITEMS,
  isNavItemActive,
  type NavItem,
} from '@/src/lib/navigation'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

function MobileNavLink({
  item,
  pathname,
  onClose,
}: {
  item: NavItem
  pathname: string
  onClose: () => void
}) {
  const active = isNavItemActive(pathname, item.href)
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      onClick={onClose}
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

// Client Component — navigasi mobile, dibuka dari hamburger di Header.
export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname()

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="left"
        className="w-72 border-blue-900 bg-blue-950 p-0 text-white [&>button]:text-blue-200"
      >
        {/* SheetTitle wajib ada untuk aksesibilitas (dibaca screen reader),
            visually-hidden karena nama app sudah ditampilkan di bawah */}
        <SheetHeader className="sr-only">
          <SheetTitle>Menu Navigasi</SheetTitle>
        </SheetHeader>

        <div className="flex h-full flex-col">
          {/* Logo / app name — sama persis dengan Sidebar */}
          <div className="flex flex-col gap-1 border-b border-blue-900 px-4 py-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-400" />
              <span className="font-bold text-white">Warehouse AI</span>
            </div>
            <span className="text-xs text-blue-400">Powered by AI</span>
          </div>

          {/* Main nav */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
              Menu Utama
            </p>
            {MAIN_NAV_ITEMS.map((item) => (
              <MobileNavLink
                key={item.href}
                item={item}
                pathname={pathname}
                onClose={onClose}
              />
            ))}
          </nav>

          {/* Bottom section */}
          <div className="space-y-1 border-t border-blue-900 px-3 py-4">
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
              Lainnya
            </p>
            {BOTTOM_NAV_ITEMS.map((item) => (
              <MobileNavLink
                key={item.href}
                item={item}
                pathname={pathname}
                onClose={onClose}
              />
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}