'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Clock, Users, CheckCircle } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}

const StatsCard = ({ title, value, description, icon }: StatsCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

interface DashboardStatsProps {
  totalAppointments: number;
  upcomingAppointments: number;
  totalClients: number;
  completionRate: number;
}

export default function DashboardStats({
  totalAppointments,
  upcomingAppointments,
  totalClients,
  completionRate,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Appointments"
        value={totalAppointments}
        description="All time appointments"
        icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Upcoming"
        value={upcomingAppointments}
        description="Next 7 days"
        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Total Clients"
        value={totalClients}
        description="Unique clients served"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Completion Rate"
        value={`${completionRate}%`}
        description="Last 30 days"
        icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
} 