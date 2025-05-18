import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import DashboardStats from '@/components/Staff/dashboard/DashboardStats';
import RecentAppointments from '@/components/Staff/dashboard/RecentAppointments';
import { addDays, startOfDay, endOfDay } from 'date-fns';

export const metadata: Metadata = {
  title: 'Staff Dashboard',
  description: 'View your appointments and manage your schedule',
};

async function getStaffDashboardData(email: string) {
  const now = new Date();
  const weekFromNow = addDays(now, 7);

  const staff = await prisma.staff.findUnique({
    where: { email },
    include: {
      appointments: {
        where: {
          dateTime: {
            gte: startOfDay(now),
            lte: endOfDay(weekFromNow),
          },
        },
        include: {
          client: true,
          service: true,
        },
        orderBy: {
          dateTime: 'asc',
        },
      },
      _count: {
        select: {
          appointments: {
            where: {
              status: 'COMPLETED',
            },
          },
          clients: true,
        },
      },
    },
  });

  if (!staff) {
    return null;
  }

  const upcomingAppointments = staff.appointments.map(apt => ({
    id: apt.id,
    clientName: apt.client.name,
    serviceName: apt.service.name,
    dateTime: apt.dateTime,
    status: apt.status,
    duration: apt.duration,
  }));

  const totalAppointments = await prisma.appointment.count({
    where: {
      staffId: staff.id,
    },
  });

  const completedAppointments = await prisma.appointment.count({
    where: {
      staffId: staff.id,
      status: 'COMPLETED',
      dateTime: {
        gte: addDays(now, -30),
      },
    },
  });

  const completionRate = totalAppointments > 0
    ? Math.round((completedAppointments / totalAppointments) * 100)
    : 0;

  return {
    stats: {
      totalAppointments,
      upcomingAppointments: upcomingAppointments.length,
      totalClients: staff._count.clients,
      completionRate,
    },
    appointments: upcomingAppointments,
  };
}

export default async function StaffDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const dashboardData = await getStaffDashboardData(session.user.email);

  if (!dashboardData) {
    return <div>Staff not found</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your schedule
          </p>
        </div>

        <DashboardStats {...dashboardData.stats} />
        
        <RecentAppointments appointments={dashboardData.appointments} />
      </div>
    </div>
  );
} 