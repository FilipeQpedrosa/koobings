import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DashboardStats from '@/components/staff/dashboard/DashboardStats';
import RecentAppointments from '@/components/staff/dashboard/RecentAppointments';

export const metadata: Metadata = {
  title: 'Staff Dashboard | Service Scheduler',
  description: 'View your appointments, schedule, and performance metrics.',
};

export default async function StaffDashboardPage() {
  const session = await getServerSession(authOptions);
  
  // Fetch today's appointments
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [todayAppointments, upcomingAppointments, completedAppointments] = await Promise.all([
    // Today's appointments
    prisma.appointment.count({
      where: {
        staffId: session?.user?.id,
        startTime: {
          gte: today,
          lt: tomorrow,
        },
      },
    }),
    // Upcoming appointments (excluding today)
    prisma.appointment.count({
      where: {
        staffId: session?.user?.id,
        startTime: {
          gte: tomorrow,
        },
        status: 'PENDING',
      },
    }),
    // Completed appointments this month
    prisma.appointment.count({
      where: {
        staffId: session?.user?.id,
        status: 'COMPLETED',
        startTime: {
          gte: new Date(today.getFullYear(), today.getMonth(), 1),
        },
      },
    }),
  ]);

  // Fetch recent appointments
  const recentAppointments = await prisma.appointment.findMany({
    where: {
      staffId: session?.user?.id,
      startTime: {
        gte: today,
      },
    },
    include: {
      service: true,
      patient: true,
    },
    orderBy: {
      startTime: 'asc',
    },
    take: 5,
  });

  const stats = [
    { name: "Today's Appointments", value: todayAppointments },
    { name: 'Upcoming Appointments', value: upcomingAppointments },
    { name: 'Completed This Month', value: completedAppointments },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Staff Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's an overview of your schedule and appointments.
        </p>
      </div>

      <DashboardStats stats={stats} />

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium leading-6 text-gray-900">
            Recent Appointments
          </h2>
          <RecentAppointments appointments={recentAppointments} />
        </div>
      </div>
    </div>
  );
} 