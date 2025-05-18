import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay } from 'date-fns';

export const metadata: Metadata = {
  title: 'Business Dashboard | Service Scheduler',
  description: 'Manage your business operations, appointments, and staff.',
};

async function getBusinessDashboardData(businessId: string) {
  const today = new Date();
  const [
    appointmentsToday,
    totalStaff,
    totalServices,
    recentAppointments
  ] = await Promise.all([
    prisma.appointment.count({
      where: {
        businessId,
        startTime: {
          gte: startOfDay(today),
          lte: endOfDay(today)
        }
      }
    }),
    prisma.staff.count({
      where: { businessId }
    }),
    prisma.service.count({
      where: { businessId }
    }),
    prisma.appointment.findMany({
      where: { businessId },
      take: 5,
      orderBy: { startTime: 'desc' },
      include: {
        client: {
          select: {
            name: true,
            email: true
          }
        },
        service: {
          select: {
            name: true,
            duration: true
          }
        },
        staff: {
          select: {
            name: true
          }
        }
      }
    })
  ]);

  return {
    stats: {
      appointmentsToday,
      totalStaff,
      totalServices
    },
    recentAppointments
  };
}

export default async function BusinessDashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.businessId) {
    throw new Error('No business ID found in session');
  }

  const data = await getBusinessDashboardData(session.user.businessId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Business Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your business operations and appointments.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Today's Appointments
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {data.stats.appointmentsToday}
            </dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Total Staff
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {data.stats.totalStaff}
            </dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Available Services
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {data.stats.totalServices}
            </dd>
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">Recent Appointments</h2>
          <div className="mt-4 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                        Client
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Service
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Staff
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.recentAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                          {appointment.client.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {appointment.service.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {appointment.staff.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(appointment.startTime).toLocaleDateString()}
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
  );
} 