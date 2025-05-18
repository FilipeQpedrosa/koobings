import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay, addDays } from 'date-fns';
import type { Appointment, Service, Client } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Staff Dashboard | Service Scheduler',
  description: 'View your appointments and manage your schedule.',
};

type AppointmentWithRelations = Appointment & {
  client: Pick<Client, 'name' | 'email'>;
  service: Pick<Service, 'name' | 'duration'>;
};

async function getStaffDashboardData(staffId: string) {
  const today = new Date();
  const tomorrow = addDays(today, 1);

  const [
    appointmentsToday,
    appointmentsTomorrow,
    upcomingAppointments,
    completedAppointments
  ] = await Promise.all([
    prisma.appointment.count({
      where: {
        staffId,
        startTime: {
          gte: startOfDay(today),
          lte: endOfDay(today)
        }
      }
    }),
    prisma.appointment.count({
      where: {
        staffId,
        startTime: {
          gte: startOfDay(tomorrow),
          lte: endOfDay(tomorrow)
        }
      }
    }),
    prisma.appointment.findMany({
      where: {
        staffId,
        startTime: {
          gte: startOfDay(today)
        },
        status: 'PENDING'
      },
      take: 5,
      orderBy: { startTime: 'asc' },
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
        }
      }
    }),
    prisma.appointment.findMany({
      where: {
        staffId,
        status: 'COMPLETED'
      },
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
        }
      }
    })
  ]);

  return {
    stats: {
      appointmentsToday,
      appointmentsTomorrow
    },
    upcomingAppointments,
    completedAppointments
  };
}

export default async function StaffDashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id || session.user.role !== 'STAFF') {
    throw new Error('Invalid staff session');
  }

  const data = await getStaffDashboardData(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Staff Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          View your appointments and manage your schedule.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
              Tomorrow's Appointments
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {data.stats.appointmentsTomorrow}
            </dd>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">Upcoming Appointments</h2>
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
                        Date & Time
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.upcomingAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                          {appointment.client.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {appointment.service.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(appointment.startTime).toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {appointment.service.duration} min
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

      {/* Completed Appointments */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">Recently Completed</h2>
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
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.completedAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                          {appointment.client.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {appointment.service.name}
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