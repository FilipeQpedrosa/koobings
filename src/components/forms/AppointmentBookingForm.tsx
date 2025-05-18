'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Service, Staff } from '@prisma/client';
import { useRouter } from 'next/navigation';

interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

interface AppointmentBookingFormProps {
  services: Service[];
  staff: Staff[];
  clientId: string;
}

const bookingSchema = z.object({
  serviceId: z.string().min(1, 'Service is required'),
  staffId: z.string().min(1, 'Staff member is required'),
  date: z.date({
    required_error: 'Date is required',
    invalid_type_error: 'Invalid date format',
  }),
  time: z.string().min(1, 'Time is required'),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export function AppointmentBookingForm({
  services,
  staff,
  clientId,
}: AppointmentBookingFormProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  // Fetch available time slots when date, service, or staff changes
  useEffect(() => {
    async function fetchTimeSlots() {
      if (!selectedDate || !selectedService?.id || !selectedStaff?.id) {
        setTimeSlots([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/appointments/availability?date=${format(
            selectedDate,
            'yyyy-MM-dd'
          )}&serviceId=${selectedService.id}&staffId=${selectedStaff.id}`
        );
        const data = await response.json();
        setTimeSlots(data);
      } catch (error) {
        console.error('Error fetching time slots:', error);
        setTimeSlots([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTimeSlots();
  }, [selectedDate, selectedService, selectedStaff]);

  const handleServiceChange = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    setSelectedService(service || null);
    setValue('serviceId', serviceId);
    // Reset staff and time when service changes
    setSelectedStaff(null);
    setValue('staffId', '');
    setValue('time', '');
  };

  const handleStaffChange = (staffId: string) => {
    const staffMember = staff.find((s) => s.id === staffId);
    setSelectedStaff(staffMember || null);
    setValue('staffId', staffId);
    // Reset time when staff changes
    setValue('time', '');
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setValue('date', date);
    // Reset time when date changes
    setValue('time', '');
  };

  const onSubmit = async (data: BookingFormData) => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          clientId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to book appointment');
      }

      const appointment = await response.json();
      router.push('/book/success');
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Service Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Service</label>
        <select
          {...register('serviceId')}
          onChange={(e) => handleServiceChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a service</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} ({service.duration} min) - ${service.price.toString()}
            </option>
          ))}
        </select>
        {errors.serviceId && (
          <p className="mt-1 text-sm text-red-600">{errors.serviceId.message}</p>
        )}
      </div>

      {/* Staff Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Staff Member
        </label>
        <select
          {...register('staffId')}
          onChange={(e) => handleStaffChange(e.target.value)}
          disabled={!selectedService}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">
            {selectedService ? 'Select a staff member' : 'Select a service first'}
          </option>
          {staff.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
        {errors.staffId && (
          <p className="mt-1 text-sm text-red-600">{errors.staffId.message}</p>
        )}
      </div>

      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          {...register('date')}
          onChange={(e) => handleDateChange(new Date(e.target.value))}
          min={format(new Date(), 'yyyy-MM-dd')}
          disabled={!selectedStaff}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
        )}
      </div>

      {/* Time Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Time</label>
        <select
          {...register('time')}
          disabled={isLoading || timeSlots.length === 0}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">
            {isLoading
              ? 'Loading time slots...'
              : !selectedDate
              ? 'Select a date first'
              : timeSlots.length === 0
              ? 'No available time slots'
              : 'Select a time'}
          </option>
          {timeSlots
            .filter((slot) => slot.available)
            .map((slot) => (
              <option key={slot.startTime} value={slot.startTime}>
                {slot.startTime} - {slot.endTime}
              </option>
            ))}
        </select>
        {errors.time && (
          <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          {...register('notes')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Add any special notes or requests..."
        />
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Book Appointment'}
        </button>
      </div>
    </form>
  );
} 