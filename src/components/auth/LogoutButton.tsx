'use client'

import { useState } from 'react'
import { LogOut } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/login'
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleLogout} disabled={isLoggingOut}>
      <LogOut className="mr-2 h-4 w-4" />
      {isLoggingOut ? 'Keluar...' : 'Keluar'}
    </Button>
  )
}