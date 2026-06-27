import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { verifyToken } from '@/src/lib/auth/jwt'
import { DashboardShell } from '@/src/components/layout/DashboardShell'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) {
    redirect('/login')
  }

  let user
  try {
    user = await verifyToken(token)
  } catch {
    redirect('/login')
  }

  return (
    <DashboardShell user={{ email: user.email, id: user.sub, fullName: user.fullName }}>
      {children}
    </DashboardShell>
  )
}