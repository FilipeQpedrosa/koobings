'use client';

import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, isSameDay } from 'date-fns';
import { AppointmentStatus } from '@prisma/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

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
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ clientName: '', serviceName: '', time: '' });

  // Mock data for appointments
  const mockAppointments = appointments || [];

  // Function to get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    return mockAppointments.filter((appointment) =>
      isSameDay(new Date(appointment.dateTime), date)
    );
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

  // Placeholder handlers
  const handleAddBooking = () => {
    setShowModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false);
    setFormData({ clientName: '', serviceName: '', time: '' });
  };
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call API to create booking
    setShowModal(false);
  };
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      // TODO: Call API to delete booking
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Schedule</CardTitle>
          <Button onClick={handleAddBooking} variant="default">Add Booking</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          className="rounded-md border"
          components={{
            Day: ({ day }) => renderDay('date' in day ? day.date : day),
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
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{format(new Date(appointment.dateTime), 'h:mm a')}</span>
                    <Button size="icon" variant="ghost" onClick={handleDelete}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
              {getAppointmentsForDate(selectedDate).length === 0 && (
                <p className="text-sm text-gray-500">No appointments scheduled</p>
              )}
            </div>
          </div>
        )}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Booking</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="clientName" value={formData.clientName} onChange={handleFormChange} placeholder="Client Name" required />
              <Input name="serviceName" value={formData.serviceName} onChange={handleFormChange} placeholder="Service" required />
              <Input name="time" value={formData.time} onChange={handleFormChange} type="time" required />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleModalClose}>Cancel</Button>
                <Button type="submit" variant="default">Create Booking</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
} 