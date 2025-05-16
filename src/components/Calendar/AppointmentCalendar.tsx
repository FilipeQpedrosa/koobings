import React, { useState, useEffect } from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  addWeeks,
  subWeeks,
} from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { AppointmentStatus } from '@prisma/client';

interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  patient: {
    name: string;
  };
  service: {
    name: string;
  };
  staff: {
    name: string;
  };
}

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onDateSelect: (date: Date) => void;
  onAppointmentSelect: (appointment: Appointment) => void;
  selectedDate?: Date;
}

export function AppointmentCalendar({
  appointments,
  onDateSelect,
  onAppointmentSelect,
  selectedDate = new Date(),
}: AppointmentCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(selectedDate);
  const [weekDays, setWeekDays] = useState<Date[]>([]);

  useEffect(() => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Start on Monday
    const end = endOfWeek(currentWeek, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });
    setWeekDays(days);
  }, [currentWeek]);

  const nextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const previousWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter((appointment) =>
      isSameDay(parseISO(appointment.startTime), date)
    );
  };

  const getAppointmentColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 border-yellow-500';
      case 'CONFIRMED':
        return 'bg-green-100 border-green-500';
      case 'CANCELLED':
        return 'bg-red-100 border-red-500';
      case 'COMPLETED':
        return 'bg-blue-100 border-blue-500';
      default:
        return 'bg-gray-100 border-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">
          {format(currentWeek, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={previousWeek}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={nextWeek}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {/* Day Headers */}
        {weekDays.map((day) => (
          <div
            key={day.toString()}
            className="bg-gray-50 p-2 text-center text-sm font-medium"
          >
            {format(day, 'EEE')}
          </div>
        ))}

        {/* Day Cells */}
        {weekDays.map((day) => {
          const dayAppointments = getAppointmentsForDay(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          return (
            <div
              key={day.toString()}
              className={`bg-white min-h-[200px] p-2 ${
                isSelected ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => onDateSelect(day)}
            >
              <div className="text-right text-sm text-gray-500">
                {format(day, 'd')}
              </div>
              <div className="space-y-1 mt-2">
                {dayAppointments.map((appointment) => (
                  <button
                    key={appointment.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAppointmentSelect(appointment);
                    }}
                    className={`w-full text-left p-2 text-xs rounded border ${getAppointmentColor(
                      appointment.status
                    )}`}
                  >
                    <div className="font-medium truncate">
                      {format(parseISO(appointment.startTime), 'HH:mm')} -{' '}
                      {appointment.patient.name}
                    </div>
                    <div className="truncate text-gray-600">
                      {appointment.service.name}
                    </div>
                    <div className="truncate text-gray-500">
                      {appointment.staff.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 