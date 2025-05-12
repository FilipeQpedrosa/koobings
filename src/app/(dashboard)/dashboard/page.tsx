'use client';

import { useState } from 'react';
import { Clock, User } from 'lucide-react';
import Calendar from '@/components/Calendar';
import { EventInput } from '@fullcalendar/core';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Placeholder data - will be replaced with real data from Supabase
  const appointments: EventInput[] = [
    {
      id: '1',
      title: 'João Silva - Corte de Cabelo',
      start: '2024-02-20T09:00:00',
      end: '2024-02-20T09:30:00',
    },
    {
      id: '2',
      title: 'Maria Santos - Manicure',
      start: '2024-02-20T10:00:00',
      end: '2024-02-20T10:45:00',
    },
  ];

  const handleEventClick = (info: any) => {
    console.log('Event clicked:', info.event);
  };

  const handleDateSelect = (selectInfo: any) => {
    console.log('Date range selected:', selectInfo);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Agenda</h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Novo Agendamento
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Calendário</h2>
          </div>
          <div className="h-[600px]">
            <Calendar
              events={appointments}
              onEventClick={handleEventClick}
              onDateSelect={handleDateSelect}
            />
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Agendamentos do Dia
          </h2>
          <div className="text-sm text-gray-500 mb-4">
            {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
          </div>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-center text-gray-500 mb-2">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>
                    {format(new Date(appointment.start as string), 'HH:mm')}
                  </span>
                  <span className="mx-2">•</span>
                  <span>
                    {format(new Date(appointment.end as string), 'HH:mm')}
                  </span>
                </div>
                <div className="flex items-center text-gray-900 mb-1">
                  <User className="h-4 w-4 mr-2" />
                  <span className="font-medium">{appointment.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 