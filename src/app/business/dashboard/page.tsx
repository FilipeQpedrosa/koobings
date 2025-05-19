import { Metadata } from 'next'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import DashboardMetrics from '@/components/business/dashboard/DashboardMetrics'
import AppointmentsList from '@/components/business/dashboard/AppointmentsList'
import StaffOverview from '@/components/business/dashboard/StaffOverview'

export const metadata: Metadata = {
  title: 'Business Dashboard',
  description: 'Manage your business operations, appointments, and staff',
}

export default function BusinessDashboardPage() {
  redirect('/business/portal/dashboard')
} 