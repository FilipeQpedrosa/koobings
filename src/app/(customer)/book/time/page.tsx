'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format, parse } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function TimeSelectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const serviceId = searchParams.get('serviceId');
  const staffId = searchParams.get('staffId');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTimeSlots() {
      if (!serviceId || !staffId) return;

      const bookingDate = sessionStorage.getItem('bookingDate');
      if (!bookingDate) {
        toast({
          title: 'Error',
          description: 'No date selected. Please start over.',
          variant: 'destructive'
        });
        router.push('/book');
        return;
      }

      try {
        const response = await fetch(
          `/api/client/availability?serviceId=${serviceId}&staffId=${staffId}&date=${bookingDate}`
        );
        if (!response.ok) throw new Error('Failed to fetch time slots');
        const data = await response.json();
        setTimeSlots(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load available time slots. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchTimeSlots();
  }, [serviceId, staffId, router, toast]);

  const handleContinue = () => {
    if (!selectedTime || !serviceId || !staffId) {
      toast({
        title: 'Error',
        description: 'Please select a time slot to continue.',
        variant: 'destructive'
      });
      return;
    }

    // Store the selected time in session storage
    sessionStorage.setItem('selectedTime', selectedTime);

    // Navigate to the next step
    router.push(`/book/summary?serviceId=${serviceId}&staffId=${staffId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  // Group time slots by morning/afternoon/evening
  const groupedTimeSlots = timeSlots.reduce((acc, slot) => {
    const hour = parseInt(slot.time.split(':')[0], 10);
    let period = 'morning';
    if (hour >= 12 && hour < 17) period = 'afternoon';
    else if (hour >= 17) period = 'evening';
    
    if (!acc[period]) acc[period] = [];
    acc[period].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Choose a Time</h1>
        <p className="text-gray-600">Select your preferred appointment time</p>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedTimeSlots).map(([period, slots]) => (
          <div key={period} className="space-y-3">
            <h2 className="text-lg font-semibold capitalize">{period}</h2>
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot) => {
                const time = format(parse(slot.time, 'HH:mm', new Date()), 'h:mm a');
                return (
                  <Card
                    key={slot.time}
                    className={`p-3 text-center cursor-pointer transition-all ${
                      !slot.available ? 'opacity-50 cursor-not-allowed' :
                      selectedTime === slot.time ? 'ring-2 ring-primary' : 'hover:shadow-md'
                    }`}
                    onClick={() => {
                      if (slot.available) {
                        setSelectedTime(slot.time);
                      }
                    }}
                  >
                    <span className={`text-sm ${selectedTime === slot.time ? 'font-medium' : ''}`}>
                      {time}
                    </span>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selectedTime}
        >
          Continue
        </Button>
      </div>
    </div>
  );
} 