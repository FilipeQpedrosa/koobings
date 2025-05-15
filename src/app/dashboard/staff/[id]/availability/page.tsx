'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { addDays, format, startOfWeek, eachDayOfInterval } from 'date-fns';

interface TimeSlot {
  id?: string;
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  type: 'REGULAR' | 'EXCEPTION';
}

interface StaffMember {
  id: string;
  name: string;
  schedules: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
}

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

export default function StaffAvailability() {
  const router = useRouter();
  const params = useParams();
  const [staffMember, setStaffMember] = useState<StaffMember | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [availabilitySlots, setAvailabilitySlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 0 });
    const dates = eachDayOfInterval({
      start,
      end: addDays(start, 6)
    });
    setWeekDates(dates);
  }, [selectedDate]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [staffResponse, availabilityResponse] = await Promise.all([
          fetch(`/api/business/staff/${params.id}`),
          fetch(`/api/business/staff/${params.id}/availability?week=${format(selectedDate, 'yyyy-MM-dd')}`)
        ]);

        if (!staffResponse.ok || !availabilityResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [staffData, availabilityData] = await Promise.all([
          staffResponse.json(),
          availabilityResponse.json()
        ]);

        setStaffMember(staffData);
        setAvailabilitySlots(availabilityData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    if (params.id) {
      fetchData();
    }
  }, [params.id, selectedDate]);

  const handleSlotToggle = (date: Date, time: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const existingSlot = availabilitySlots.find(
      slot => slot.date === dateStr && slot.startTime === time
    );

    if (existingSlot) {
      setAvailabilitySlots(current =>
        current.map(slot =>
          slot.date === dateStr && slot.startTime === time
            ? { ...slot, isAvailable: !slot.isAvailable }
            : slot
        )
      );
    } else {
      setAvailabilitySlots(current => [
        ...current,
        {
          staffId: params.id as string,
          date: dateStr,
          startTime: time,
          endTime: addHour(time),
          isAvailable: true,
          type: 'EXCEPTION'
        }
      ]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/business/staff/${params.id}/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slots: availabilitySlots }),
      });

      if (!response.ok) {
        throw new Error('Failed to update availability');
      }

      router.push('/dashboard/staff');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const addHour = (time: string): string => {
    const [hours] = time.split(':');
    const nextHour = (parseInt(hours) + 1) % 24;
    return `${nextHour.toString().padStart(2, '0')}:00`;
  };

  const isSlotAvailable = (date: Date, time: string): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const slot = availabilitySlots.find(
      s => s.date === dateStr && s.startTime === time
    );
    return slot ? slot.isAvailable : true;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Availability Management</h1>
        <p className="text-gray-600 mt-2">
          Manage availability for {staffMember?.name}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b w-20"></th>
              {weekDates.map(date => (
                <th
                  key={date.toString()}
                  className="py-2 px-4 border-b text-center"
                >
                  <div className="font-medium">{format(date, 'EEE')}</div>
                  <div className="text-sm text-gray-500">
                    {format(date, 'MMM d')}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map(time => (
              <tr key={time}>
                <td className="py-1 px-4 border-b text-sm font-medium">
                  {time}
                </td>
                {weekDates.map(date => {
                  const isAvailable = isSlotAvailable(date, time);
                  return (
                    <td
                      key={date.toString()}
                      className="py-1 px-1 border-b text-center"
                    >
                      <button
                        onClick={() => handleSlotToggle(date, time)}
                        className={`w-full h-8 rounded ${
                          isAvailable
                            ? 'bg-green-100 hover:bg-green-200'
                            : 'bg-red-100 hover:bg-red-200'
                        }`}
                      >
                        <span className="sr-only">
                          {isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 ${
            isSaving ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
} 