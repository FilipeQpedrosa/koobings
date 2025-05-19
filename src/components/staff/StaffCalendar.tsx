'use client';

import React from 'react';
import { Calendar } from '@/components/ui/Calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { addDays, format, isSameDay } from 'date-fns';
import { AppointmentStatus } from '@prisma/client';

interface Appointment {
  id: string;
  dateTime: Date;
  clientName: string;
  serviceName: string;
  status: AppointmentStatus;
}

interface StaffCalendarProps {
  appointments: Appointment[];
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
}

export default function StaffCalendar({
  appointments,
  selectedDate,
  onDateSelect,
}: StaffCalendarProps) {
  // Function to get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter((appointment) =>
      isSameDay(new Date(appointment.dateTime), date)
    );
  };

  // Function to determine if a date has appointments
  const hasAppointments = (date: Date) => {
    return getAppointmentsForDate(date).length > 0;
  };

  // Custom day render to show appointment indicators
  const renderDay = (day: Date) => {
    const dayAppointments = getAppointmentsForDate(day);
    const hasAppointment = dayAppointments.length > 0;

    return (
      <div className="relative w-full h-full">
        <div className={`w-full h-full p-2 ${
          hasAppointment ? 'font-bold' : ''
        }`}>
          {format(day, 'd')}
          {hasAppointment && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
              <div className="h-1 w-1 rounded-full bg-primary" />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          className="rounded-md border"
          components={{
            Day: ({ date }) => renderDay(date),
          }}
          disabled={{ before: new Date() }}
          initialFocus
        />
        {selectedDate && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">
              Appointments for {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            <div className="space-y-2">
              {getAppointmentsForDate(selectedDate).map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-2 border rounded-md flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{appointment.clientName}</p>
                    <p className="text-sm text-gray-500">{appointment.serviceName}</p>
                  </div>
                  <div className="text-sm">
                    {format(new Date(appointment.dateTime), 'h:mm a')}
                  </div>
                </div>
              ))}
              {getAppointmentsForDate(selectedDate).length === 0 && (
                <p className="text-sm text-gray-500">No appointments scheduled</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 