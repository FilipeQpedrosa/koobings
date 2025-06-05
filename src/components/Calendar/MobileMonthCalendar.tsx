import React, { useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  parseISO,
} from 'date-fns';
import { AppointmentStatus } from '@prisma/client';

interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  client: { name: string };
  service: { name: string };
  staff: { name: string };
}

interface MobileMonthCalendarProps {
  appointments: Appointment[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onEventSelect: (appointment: Appointment) => void;
}

export default function MobileMonthCalendar({
  appointments,
  selectedDate,
  onDateSelect,
  onEventSelect,
}: MobileMonthCalendarProps) {
  // Calculate all days in the visible month grid
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  // Group appointments by day (yyyy-MM-dd)
  const eventsByDay = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    appointments.forEach((apt) => {
      const day = format(parseISO(apt.startTime), 'yyyy-MM-dd');
      if (!map[day]) map[day] = [];
      map[day].push(apt);
    });
    return map;
  }, [appointments]);

  const selectedDayKey = format(selectedDate, 'yyyy-MM-dd');
  const selectedEvents = eventsByDay[selectedDayKey] || [];

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Month header */}
      <div className="flex items-center justify-between py-2 px-2">
        <span className="text-lg font-semibold">{format(selectedDate, 'MMMM yyyy')}</span>
        {/* Navigation can be added here if needed */}
      </div>
      {/* Month grid */}
      <div className="grid grid-cols-7 gap-1 bg-gray-100 rounded-lg p-2">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="text-xs text-center text-gray-500 font-medium pb-1">
            {format(days[i], 'EEE')}
          </div>
        ))}
        {days.map((day) => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const hasEvents = !!eventsByDay[dayKey]?.length;
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, selectedDate);
          return (
            <button
              key={dayKey}
              className={`w-9 h-9 flex flex-col items-center justify-center rounded-full border-2 transition-all
                ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent'}
                ${!isCurrentMonth ? 'opacity-40' : ''}
              `}
              onClick={() => onDateSelect(day)}
            >
              <span className="text-sm font-medium">{format(day, 'd')}</span>
              {hasEvents && <span className="w-2 h-2 mt-1 rounded-full bg-blue-500" />}
            </button>
          );
        })}
      </div>
      {/* Event list for selected day */}
      <div className="mt-4">
        <h3 className="text-base font-semibold mb-2">Events for {format(selectedDate, 'PPP')}</h3>
        {selectedEvents.length === 0 ? (
          <div className="text-gray-500 text-sm">No events</div>
        ) : (
          <ul className="space-y-2">
            {selectedEvents.map((apt) => (
              <li
                key={apt.id}
                className="bg-white rounded-lg shadow p-3 flex flex-col gap-1 border-l-4 border-blue-400"
                onClick={() => onEventSelect(apt)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-blue-700">
                    {format(parseISO(apt.startTime), 'HH:mm')} - {format(parseISO(apt.endTime), 'HH:mm')}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : apt.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : apt.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{apt.status}</span>
                </div>
                <div className="text-sm font-semibold">{apt.service.name}</div>
                <div className="text-xs text-gray-500">{apt.client.name}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 