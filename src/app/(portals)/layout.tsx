import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { authOptions } from '@/lib/auth'

type UserRole = 'ADMIN' | 'BUSINESS' | 'STAFF'
type PortalType = 'admin' | 'business' | 'staff'

const roleToPortalMap: Record<UserRole, string> = {
  'ADMIN': '/portals/admin/dashboard',
  'BUSINESS': '/portals/business/dashboard',
  'STAFF': '/portals/staff/dashboard',
}

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  // Get the current path to determine which portal we're in
  const pathname = new URL(headers().get('x-url') || '', 'http://localhost').pathname
  const portalType = pathname.split('/')[2] as PortalType // ['', 'portals', 'admin|business|staff', ...]

  const userRole = session.user.role as UserRole

  // Verify user has access to this portal
  if (
    (portalType === 'admin' && userRole !== 'ADMIN') ||
    (portalType === 'business' && userRole !== 'BUSINESS') ||
    (portalType === 'staff' && userRole !== 'STAFF')
  ) {
    // Redirect to appropriate portal based on role
    const redirectUrl = roleToPortalMap[userRole] || '/'
    redirect(redirectUrl)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 