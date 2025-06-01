'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Clock, Users, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [collapsed, setCollapsed] = useState(true);

  // Mobile summary bar
  const summary = (
    <div className="sm:hidden flex items-center justify-between bg-white rounded-lg shadow px-4 py-3 mb-2 border">
      <div className="flex flex-col text-sm">
        <span className="font-semibold">{upcomingAppointments} Upcoming</span>
        <span className="text-xs text-gray-500">{totalAppointments} Total • {totalClients} Clients • {completionRate}% Complete</span>
      </div>
      <button
        className="ml-4 p-2 rounded-full hover:bg-gray-100 transition"
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? 'Show stats' : 'Hide stats'}
      >
        {collapsed ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile: summary bar and collapsible grid */}
      {summary}
      {/* Desktop: always show grid; Mobile: show grid if expanded */}
      <div className={collapsed ? 'hidden sm:block' : 'block sm:block'}>
        <div className="grid grid-cols-1 gap-4 gap-y-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
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
      </div>
    </>
  );
} 