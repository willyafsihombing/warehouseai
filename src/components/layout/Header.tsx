'use client'

import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { UserMenu } from '@/src/components/layout/UserMenu'

interface HeaderProps {
  user: {
    email: string
    id: string
    fullName: string
  }
  onMobileMenuToggle: () => void
}

export function Header({ user, onMobileMenuToggle }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm md:px-6">
      {/* Kiri */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMobileMenuToggle}
          aria-label="Buka menu navigasi"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <span className="font-bold text-blue-950 md:hidden">Warehouse AI</span>
      </div>

      {/* Kanan */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 md:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Powered by Groq AI
        </div>

        <UserMenu user={user} />
      </div>
    </header>
  )
}