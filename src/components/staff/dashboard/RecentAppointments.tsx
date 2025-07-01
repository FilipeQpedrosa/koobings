'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Appointment {
  id: string;
  client: {
    name: string;
    image?: string;
  };
  services: { name: string }[];
  scheduledFor: string;
  duration: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}

function getStatusColor(status: Appointment['status']) {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-200 text-green-800';
    case 'CANCELLED':
      return 'bg-red-200 text-red-800';
    case 'PENDING':
      return 'bg-yellow-200 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getStatusLabel(status: Appointment['status']) {
  switch (status) {
    case 'COMPLETED':
      return 'Concluído';
    case 'CANCELLED':
      return 'Cancelado';
    case 'PENDING':
      return 'Pendente';
    default:
      return status;
  }
}

export default function RecentAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAppointments() {
      setIsLoading(true);
      let url = '/api/business/appointments?limit=10';
      
      // Calculate date range based on dateFilter
      const now = new Date();
      let startDate: string | undefined;
      let endDate: string | undefined;
      
      switch (dateFilter) {
        case 'TODAY':
          startDate = format(now, 'yyyy-MM-dd');
          endDate = format(now, 'yyyy-MM-dd');
          break;
        case 'TOMORROW':
          const tomorrow = new Date(now);
          tomorrow.setDate(tomorrow.getDate() + 1);
          startDate = format(tomorrow, 'yyyy-MM-dd');
          endDate = format(tomorrow, 'yyyy-MM-dd');
          break;
        case 'THIS_WEEK':
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          startDate = format(startOfWeek, 'yyyy-MM-dd');
          endDate = format(endOfWeek, 'yyyy-MM-dd');
          break;
        case 'NEXT_WEEK':
          const nextWeekStart = new Date(now);
          nextWeekStart.setDate(now.getDate() + (7 - now.getDay()));
          const nextWeekEnd = new Date(nextWeekStart);
          nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
          startDate = format(nextWeekStart, 'yyyy-MM-dd');
          endDate = format(nextWeekEnd, 'yyyy-MM-dd');
          break;
        case 'THIS_MONTH':
          startDate = format(new Date(now.getFullYear(), now.getMonth(), 1), 'yyyy-MM-dd');
          endDate = format(new Date(now.getFullYear(), now.getMonth() + 1, 0), 'yyyy-MM-dd');
          break;
        default:
          // ALL - no date filter
          break;
      }
      
      if (startDate) {
        url = `/api/business/appointments?startDate=${startDate}`;
        if (endDate) {
          url += `&endDate=${endDate}`;
        }
      }
      
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch appointments');
        const data = await res.json();
        setAppointments(data?.data?.appointments || []);
      } catch (err) {
        // Handle error silently for now, or use a toast notification
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAppointments();
  }, [dateFilter]);

  const filteredAppointments = statusFilter === 'ALL'
    ? appointments
    : Array.isArray(appointments) ? appointments.filter(a => a.status === statusFilter) : [];

  async function handleStatusChange(id: string, newStatus: 'PENDING' | 'COMPLETED' | 'CANCELLED') {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } catch (err) {
      alert('Falha ao atualizar status');
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-full border-2 border-gray-200">
      <h2 className="text-2xl sm:text-3xl font-black mb-6 text-gray-900">Agendamentos Recentes</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Status Filter */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <label htmlFor="status-filter" className="font-bold text-gray-800 whitespace-nowrap">Status:</label>
          <select
            id="status-filter"
            className="border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full max-w-[150px] bg-white text-gray-800 font-semibold"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Todos</option>
            <option value="PENDING">Pendente</option>
            <option value="CONFIRMED">Confirmado</option>
            <option value="COMPLETED">Concluído</option>
            <option value="CANCELLED">Cancelado</option>
            <option value="NO_SHOW">Não Compareceu</option>
          </select>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <label htmlFor="date-filter" className="font-bold text-gray-800 whitespace-nowrap">Período:</label>
          <select
            id="date-filter"
            className="border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full max-w-[150px] bg-white text-gray-800 font-semibold"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
          >
            <option value="ALL">Todos</option>
            <option value="TODAY">Hoje</option>
            <option value="TOMORROW">Amanhã</option>
            <option value="THIS_WEEK">Esta Semana</option>
            <option value="NEXT_WEEK">Próxima Semana</option>
            <option value="THIS_MONTH">Este Mês</option>
          </select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-4">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Nenhum agendamento encontrado com os filtros atuais.</div>
            ) : (
              filteredAppointments.map((apt) => (
                <div key={apt.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{apt.client.name}</h3>
                    <Badge className={cn(getStatusColor(apt.status), "text-xs")}>
                      {getStatusLabel(apt.status)}
                    </Badge>
                  </div>
                  <div className="text-gray-700">{apt.services?.[0]?.name}</div>
                  <div className="text-sm text-gray-500 mt-1">{format(new Date(apt.scheduledFor), 'PP p', { locale: ptBR })}</div>
                  <div className="text-sm text-gray-500">{apt.duration} min</div>
                  <div className="mt-4">
                     <select
                        className="w-full border rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        value={apt.status}
                        disabled={updatingId === apt.id}
                        onChange={e => handleStatusChange(apt.id, e.target.value as 'PENDING' | 'COMPLETED' | 'CANCELLED')}
                      >
                        <option value="PENDING">Pendente</option>
                        <option value="COMPLETED">Concluído</option>
                        <option value="CANCELLED">Cancelado</option>
                      </select>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Desktop Table View */}
          <div className="hidden sm:block w-full">
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Cliente</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Serviço</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Data & Hora</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Duração</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">Nenhum agendamento encontrado com os filtros atuais.</td>
                    </tr>
                  ) : (
                    filteredAppointments.map((apt) => (
                      <tr key={apt.id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="px-4 py-4 font-medium text-sm">{apt.client.name}</td>
                        <td className="px-4 py-4 text-sm">{apt.services?.[0]?.name}</td>
                        <td className="px-4 py-4 text-sm whitespace-nowrap">{format(new Date(apt.scheduledFor), 'dd/MM HH:mm', { locale: ptBR })}</td>
                        <td className="px-4 py-4 text-sm">{apt.duration}min</td>
                        <td className="px-4 py-4">
                          <Badge className={cn(getStatusColor(apt.status), "text-xs whitespace-nowrap")}>
                            {getStatusLabel(apt.status)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm min-w-[120px]"
                            value={apt.status}
                            disabled={updatingId === apt.id}
                            onChange={e => handleStatusChange(apt.id, e.target.value as 'PENDING' | 'COMPLETED' | 'CANCELLED')}
                          >
                            <option value="PENDING">Pendente</option>
                            <option value="COMPLETED">Concluído</option>
                            <option value="CANCELLED">Cancelado</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
} /* Cache buster 1751397005 */
