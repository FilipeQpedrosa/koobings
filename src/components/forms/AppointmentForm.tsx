import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AppointmentStatus } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { formatDate, formatTime, generateTimeSlots } from '@/lib/utils';
import type { Service, Staff } from '@prisma/client';

interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

interface AppointmentFormProps {
  services: Service[];
  staff: Staff[];
  onSubmit: (data: AppointmentFormData) => void;
  initialData?: Partial<AppointmentFormData>;
  mode?: 'create' | 'edit';
}

const appointmentSchema = z.object({
  serviceId: z.string().min(1, 'Service is required'),
  staffId: z.string().min(1, 'Staff member is required'),
  date: z.date({
    required_error: 'Date is required',
    invalid_type_error: 'Invalid date format',
  }),
  time: z.string().min(1, 'Time is required'),
  notes: z.string().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

export function AppointmentForm({
  services,
  staff,
  onSubmit,
  initialData,
  mode = 'create',
}: AppointmentFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialData?.date || null
  );
  const [selectedService, setSelectedService] = useState<Service | null>(
    services.find((s) => s.id === initialData?.serviceId) || null
  );
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(
    staff.find((s) => s.id === initialData?.staffId) || null
  );
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: initialData,
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
  };

  const handleStaffChange = (staffId: string) => {
    const staffMember = staff.find((s) => s.id === staffId);
    setSelectedStaff(staffMember || null);
    setValue('staffId', staffId);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setValue('date', date);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Service Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Service
        </label>
        <select
          {...register('serviceId')}
          onChange={(e) => handleServiceChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a service</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} ({service.duration} min) - ${service.price}
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a staff member</option>
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
              : timeSlots.length === 0
              ? 'Select date, service, and staff first'
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

      {/* Status (for edit mode) */}
      {mode === 'edit' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            {...register('status')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {Object.values(AppointmentStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>
      )}

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {mode === 'create' ? 'Create Appointment' : 'Update Appointment'}
        </button>
      </div>
    </form>
  );
} 