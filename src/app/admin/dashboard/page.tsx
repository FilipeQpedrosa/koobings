import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient, BusinessStatus, VerificationStatus } from '@prisma/client';
import Link from 'next/link';
import { AdminActivityWithAdmin } from '@/types/admin';

const prisma = new PrismaClient();

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // Verify if user is admin
  const admin = await prisma.systemAdmin.findUnique({
    where: { email: session.user?.email }
  });

  if (!admin) {
    redirect('/auth/signin');
  }

  // Get dashboard metrics
  const [
    totalBusinesses,
    activeBusinesses,
    pendingVerification,
    inReview,
    recentActivities
  ] = await prisma.$transaction([
    prisma.business.count(),
    prisma.business.count({
      where: {
        status: BusinessStatus.ACTIVE
      }
    }),
    prisma.business.count({
      where: {
        verification: {
          status: VerificationStatus.PENDING
        }
      }
    }),
    prisma.business.count({
      where: {
        verification: {
          status: VerificationStatus.IN_REVIEW
        }
      }
    }),
    prisma.adminActivity.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        admin: {
          select: {
            name: true
          }
        }
      }
    })
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {admin.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Total Businesses</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{totalBusinesses}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Active Businesses</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{activeBusinesses}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Pending Verification</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">{pendingVerification}</p>
          <Link href="/admin/businesses?filter=pending" className="mt-4 text-sm text-yellow-600 hover:text-yellow-800 block">
            Review pending →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">In Review</h3>
          <p className="mt-2 text-3xl font-bold text-orange-600">{inReview}</p>
          <Link href="/admin/businesses?filter=in-review" className="mt-4 text-sm text-orange-600 hover:text-orange-800 block">
            Continue reviews →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-4">
            <Link
              href="/admin/businesses/new"
              className="block w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md"
            >
              Register New Business
            </Link>
            <Link
              href="/admin/businesses"
              className="block w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md"
            >
              Manage Businesses
            </Link>
            <Link
              href="/admin/settings"
              className="block w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md"
            >
              System Settings
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity: AdminActivityWithAdmin) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">
                      by {activity.admin.name} • {new Date(activity.createdAt).toLocaleDateString()}
                    </p>
                    {activity.details && (
                      <p className="mt-1 text-sm text-gray-600">
                        {JSON.stringify(activity.details)}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 