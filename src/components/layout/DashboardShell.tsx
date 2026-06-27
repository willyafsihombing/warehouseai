'use client'

import { useState } from 'react'

import { Sidebar } from '@/src/components/layout/Sidebar'
import { MobileNav } from '@/src/components/layout/MobileNav'
import { Header } from '@/src/components/layout/Header'

interface DashboardShellProps {
  user: {
    email: string
    id: string
    fullName:string
  }
  children: React.ReactNode
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className="hidden md:flex md:shrink-0">
        <Sidebar />
      </div>

      {/* Mobile nav overlay */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Area konten utama */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          user={user}
          onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}