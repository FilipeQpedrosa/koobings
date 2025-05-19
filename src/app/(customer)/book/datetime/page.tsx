'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar } from '@/components/ui/Calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export default function BookingDateTime() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if we have client info in session
    const clientId = sessionStorage.getItem('bookingClientId');
    if (!clientId) {
      router.push('/book/client');
    }
  }, [router]);

  useEffect(() => {
    if (selectedDate) {
      fetchTimeSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchTimeSlots = async (date: Date) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/appointments/availability?date=${format(date, 'yyyy-MM-dd')}`
      );
      if (!response.ok) throw new Error('Failed to fetch time slots');
      const data = await response.json();
      setTimeSlots(data);
    } catch (error) {
      setError('Failed to load available time slots');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      setError('Please select both date and time');
      return;
    }

    const clientId = sessionStorage.getItem('bookingClientId');
    if (!clientId) {
      router.push('/book/client');
      return;
    }

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId,
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: selectedTime,
        }),
      });

      if (!response.ok) throw new Error('Failed to book appointment');

      // Clear booking session
      sessionStorage.removeItem('bookingClientId');

      // Redirect to success page
      router.push('/book/success');
    } catch (error) {
      setError('Failed to book appointment');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Select Date & Time</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Date Selection */}
              <div>
                <h3 className="text-sm font-medium mb-2">Select Date</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  disabled={{ before: new Date() }}
                />
              </div>

              {/* Time Selection */}
              <div>
                <h3 className="text-sm font-medium mb-2">Select Time</h3>
                <Select
                  value={selectedTime}
                  onValueChange={setSelectedTime}
                  disabled={!selectedDate || isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={
                      isLoading
                        ? 'Loading time slots...'
                        : !selectedDate
                        ? 'Select a date first'
                        : 'Select a time'
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots
                      .filter((slot) => slot.available)
                      .map((slot) => (
                        <SelectItem key={slot.startTime} value={slot.startTime}>
                          {slot.startTime} - {slot.endTime}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={!selectedDate || !selectedTime || isLoading}
              >
                {isLoading ? 'Booking...' : 'Book Appointment'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 