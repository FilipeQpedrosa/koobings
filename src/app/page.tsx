'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (!session) {
      // Not authenticated, redirect to signin
      router.push('/auth/signin')
      return
    }

    // Check user type and redirect accordingly
    const userEmail = session.user?.email

    // Check if it's the super admin
    if (userEmail === 'f.queirozpedrosa@gmail.com') {
      router.push('/admin/dashboard')
      return
    }

    // For business owners and staff, redirect to their respective dashboards
    // We'll determine this based on the session data or make an API call
    if (session.user) {
      // Default redirect to business dashboard for now
      // This can be enhanced later to check user role from database
      router.push('/staff/dashboard')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
} 