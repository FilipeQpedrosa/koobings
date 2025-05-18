'use client';

import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import {
  BarChart,
  Users,
  Calendar as CalendarIcon,
  DollarSign,
} from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const isBusinessOwner = session?.user?.role === 'BUSINESS_OWNER';

  const stats: StatCard[] = [
    {
      title: 'Total Appointments',
      value: '24',
      icon: CalendarIcon,
      description: 'This month',
    },
    {
      title: isBusinessOwner ? 'Total Revenue' : 'Completed Services',
      value: isBusinessOwner ? '$2,400' : '18',
      icon: isBusinessOwner ? DollarSign : BarChart,
      description: 'This month',
    },
    {
      title: isBusinessOwner ? 'Total Customers' : 'Upcoming Appointments',
      value: isBusinessOwner ? '120' : '6',
      icon: Users,
      description: isBusinessOwner ? 'Active customers' : 'Next 7 days',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {session?.user?.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">{stat.description}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming Schedule</h2>
          <Calendar
            mode="single"
            selected={new Date()}
            className="rounded-md border"
          />
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            {isBusinessOwner ? 'Recent Activity' : 'My Appointments'}
          </h2>
          <div className="space-y-4">
            {/* Placeholder for activity/appointments list */}
            <p className="text-gray-600">No recent activity</p>
          </div>
        </Card>
      </div>
    </div>
  );
} 