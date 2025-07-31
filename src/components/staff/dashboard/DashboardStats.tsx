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
  <Card className="bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardTitle className="text-sm font-bold text-gray-800">{title}</CardTitle>
      <div className="text-blue-600">
        {icon}
      </div>
    </CardHeader>
    <CardContent className="pt-4">
      <div className="text-3xl font-black text-gray-900 mb-1">{value}</div>
      <p className="text-sm text-gray-600 font-medium">{description}</p>
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
    <div className="sm:hidden flex items-center justify-between bg-white rounded-xl shadow-lg px-4 py-4 mb-4 border-2 border-gray-200">
      <div className="flex flex-col text-sm">
        <span className="font-black text-lg text-gray-900">{upcomingAppointments} Próximos</span>
        <span className="text-sm text-gray-700 font-semibold">{totalAppointments} Total • {totalClients} Clientes • {completionRate}% Completos</span>
      </div>
      <button
        className="ml-4 p-3 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors border border-blue-200"
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? 'Mostrar estatísticas' : 'Ocultar estatísticas'}
      >
        {collapsed ? <ChevronDown className="h-6 w-6 text-blue-600" /> : <ChevronUp className="h-6 w-6 text-blue-600" />}
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile: summary bar and collapsible grid */}
      {summary}
      {/* Desktop: always show grid; Mobile: show grid if expanded */}
      <div className={collapsed ? 'hidden sm:block' : 'block sm:block'}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
      <StatsCard
        title="Total de Agendamentos"
        value={totalAppointments}
        description="Todos os agendamentos"
        icon={<CalendarDays className="h-5 w-5" />}
      />
      <StatsCard
        title="Próximos"
        value={upcomingAppointments}
        description="Próximos 7 dias"
        icon={<Clock className="h-5 w-5" />}
      />
      <StatsCard
        title="Total de Clientes"
        value={totalClients}
        description="Clientes únicos criados"
        icon={<Users className="h-5 w-5" />}
      />
      <StatsCard
        title="Taxa de Conclusão"
        value={`${completionRate}%`}
        description="Últimos 30 dias"
        icon={<CheckCircle className="h-5 w-5" />}
      />
    </div>
      </div>
    </>
  );
} 