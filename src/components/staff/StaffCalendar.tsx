'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface StaffCalendarProps {
  staffId: string;
}

interface Availability {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export default function StaffCalendar({ staffId }: StaffCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability();
    }
  }, [selectedDate]);

  const fetchAvailability = async () => {
    if (!selectedDate) return;

    setIsLoading(true);
    try {
      const startDate = format(selectedDate, 'yyyy-MM-dd');
      const response = await fetch(
        `/api/staff/schedule?staffId=${staffId}&startDate=${startDate}`
      );
      if (!response.ok) throw new Error('Failed to fetch availability');
      const data = await response.json();
      setAvailability(data);
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast.error('Failed to load schedule');
    } finally {
      setIsLoading(false);
    }
  };

  const updateAvailability = async (isAvailable: boolean) => {
    if (!selectedDate) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/staff/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId,
          date: format(selectedDate, 'yyyy-MM-dd'),
          startTime: '09:00',
          endTime: '17:00',
          isAvailable,
        }),
      });

      if (!response.ok) throw new Error('Failed to update availability');
      await fetchAvailability();
      toast.success('Schedule updated successfully');
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Failed to update schedule');
    } finally {
      setIsLoading(false);
    }
  };

  const isDateAvailable = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return availability.some(
      (a) => a.date === dateStr && a.isAvailable
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
          modifiers={{
            available: (date) => isDateAvailable(date),
          }}
          modifiersClassNames={{
            available: 'bg-green-50 font-bold',
          }}
        />
        <div className="space-y-4">
          <div className="rounded-lg border bg-white p-4">
            <h3 className="text-lg font-medium">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
            </h3>
            <div className="mt-4 space-y-2">
              <Button
                onClick={() => updateAvailability(true)}
                disabled={isLoading}
                className="w-full"
              >
                Set as Available
              </Button>
              <Button
                onClick={() => updateAvailability(false)}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                Set as Unavailable
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 