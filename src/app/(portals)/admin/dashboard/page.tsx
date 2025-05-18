import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Service Scheduler',
  description: 'Manage businesses, monitor system health, and oversee operations.',
}

async function getAdminDashboardData() {
  const [
    businessCount,
    activeBusinessCount,
    pendingVerifications,
    recentBusinesses
  ] = await Promise.all([
    prisma.business.count(),
    prisma.business.count({
      where: { status: 'ACTIVE' }
    }),
    prisma.businessVerification.count({
      where: { status: 'PENDING' }
    }),
    prisma.business.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        verification: true,
        _count: {
          select: {
            staff: true,
            services: true
          }
        }
      }
    })
  ])

  return {
    stats: {
      totalBusinesses: businessCount,
      activeBusinesses: activeBusinessCount,
      pendingVerifications
    },
    recentBusinesses
  }
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)
  const data = await getAdminDashboardData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor and manage the service scheduling platform.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Total Businesses
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {data.stats.totalBusinesses}
            </dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Active Businesses
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {data.stats.activeBusinesses}
            </dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Pending Verifications
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {data.stats.pendingVerifications}
            </dd>
          </div>
        </div>
      </div>

      {/* Recent Businesses */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">Recent Businesses</h2>
          <div className="mt-4 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                        Business Name
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Staff
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Services
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.recentBusinesses.map((business) => (
                      <tr key={business.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                          {business.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {business.verification?.status || 'UNVERIFIED'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {business._count.staff}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {business._count.services}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 