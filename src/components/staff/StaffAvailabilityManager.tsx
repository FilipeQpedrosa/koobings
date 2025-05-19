'use client';
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Staff, Schedule, StaffAvailability } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface StaffWithRelations extends Staff {
  schedules: Schedule[];
  availability: StaffAvailability[];
}

interface StaffAvailabilityManagerProps {
  staff: StaffWithRelations[];
}

const scheduleSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
});

const availabilitySchema = z.object({
  date: z.date(),
  isAvailable: z.boolean(),
  reason: z.string().optional(),
});

type ScheduleInput = z.infer<typeof scheduleSchema>;
type AvailabilityInput = z.infer<typeof availabilitySchema>;

export function StaffAvailabilityManager({ staff }: StaffAvailabilityManagerProps) {
  const [selectedStaff, setSelectedStaff] = useState<StaffWithRelations | null>(
    staff[0] || null
  );
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);

  const {
    register: scheduleRegister,
    handleSubmit: handleScheduleSubmit,
    formState: { errors: scheduleErrors },
    reset: resetScheduleForm,
  } = useForm<ScheduleInput>({
    resolver: zodResolver(scheduleSchema),
  });

  const {
    register: availabilityRegister,
    handleSubmit: handleAvailabilitySubmit,
    formState: { errors: availabilityErrors },
    reset: resetAvailabilityForm,
  } = useForm<AvailabilityInput>({
    resolver: zodResolver(availabilitySchema),
  });

  const handleScheduleSave = async (data: ScheduleInput) => {
    if (!selectedStaff) return;

    try {
      const response = await fetch(`/api/staff/availability?staffId=${selectedStaff.id}&type=schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to save schedule');

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  const handleAvailabilitySave = async (data: AvailabilityInput) => {
    if (!selectedStaff) return;

    try {
      const response = await fetch(`/api/staff/availability?staffId=${selectedStaff.id}&type=availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to save availability');

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error saving availability:', error);
    }
  };

  const handleDelete = async (type: 'schedule' | 'availability', id: string) => {
    if (!selectedStaff) return;

    try {
      const response = await fetch(
        `/api/staff/availability?staffId=${selectedStaff.id}&type=${type}&id=${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) throw new Error(`Failed to delete ${type}`);

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  };

  return (
    <div className="space-y-8">
      {/* Staff Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Select Staff Member</label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={selectedStaff?.id || ''}
          onChange={(e) => setSelectedStaff(staff.find((s) => s.id === e.target.value) || null)}
        >
          {staff.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      {selectedStaff && (
        <>
          {/* Regular Schedule */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Regular Schedule</h2>
              <button
                onClick={() => setIsScheduleModalOpen(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Add Schedule
              </button>
            </div>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Day
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hours
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedStaff.schedules.map((schedule) => (
                    <tr key={schedule.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {getDayName(schedule.dayOfWeek)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {schedule.startTime} - {schedule.endTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDelete('schedule', schedule.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Availability Exceptions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Availability Exceptions</h2>
              <button
                onClick={() => setIsAvailabilityModalOpen(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Add Exception
              </button>
            </div>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedStaff.availability.map((exception) => (
                    <tr key={exception.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {format(new Date(exception.date), 'PP')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {exception.isAvailable ? 'Available' : 'Unavailable'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {exception.reason || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDelete('availability', exception.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Schedule Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Add Regular Schedule</h3>
            <form onSubmit={handleScheduleSubmit(handleScheduleSave)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Day of Week</label>
                <select
                  {...scheduleRegister('dayOfWeek')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                    <option key={day} value={day}>
                      {getDayName(day)}
                    </option>
                  ))}
                </select>
                {scheduleErrors.dayOfWeek && (
                  <p className="mt-1 text-sm text-red-600">{scheduleErrors.dayOfWeek.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="time"
                  {...scheduleRegister('startTime')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {scheduleErrors.startTime && (
                  <p className="mt-1 text-sm text-red-600">{scheduleErrors.startTime.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                  type="time"
                  {...scheduleRegister('endTime')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {scheduleErrors.endTime && (
                  <p className="mt-1 text-sm text-red-600">{scheduleErrors.endTime.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsScheduleModalOpen(false);
                    resetScheduleForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Availability Modal */}
      {isAvailabilityModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Add Availability Exception</h3>
            <form onSubmit={handleAvailabilitySubmit(handleAvailabilitySave)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  {...availabilityRegister('date')}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {availabilityErrors.date && (
                  <p className="mt-1 text-sm text-red-600">{availabilityErrors.date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Availability</label>
                <select
                  {...availabilityRegister('isAvailable')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Reason</label>
                <textarea
                  {...availabilityRegister('reason')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  placeholder="Reason for availability exception..."
                />
                {availabilityErrors.reason && (
                  <p className="mt-1 text-sm text-red-600">{availabilityErrors.reason.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAvailabilityModalOpen(false);
                    resetAvailabilityForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 