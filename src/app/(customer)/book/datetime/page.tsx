'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format, addDays, isSameDay, startOfDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { generateTimeSlots } from '@/lib/utils';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface ServiceDetails {
  id: string;
  name: string;
  duration: number;
  price: number;
}

export default function DateTimeSelectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const serviceId = searchParams.get('serviceId');

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [service, setService] = useState<ServiceDetails | null>(null);

  // Fetch service details and initial availability
  useEffect(() => {
    async function fetchServiceDetails() {
      if (!serviceId) {
        toast({
          title: 'Error',
          description: 'No service selected. Please start over.',
          variant: 'destructive'
        });
        router.push('/book');
        return;
      }

      try {
        const response = await fetch(`/api/services/${serviceId}`);
        if (!response.ok) throw new Error('Failed to fetch service details');
        const data = await response.json();
        setService(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load service details. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchServiceDetails();
  }, [serviceId, toast, router]);

  // Fetch time slots when date changes
  useEffect(() => {
    async function fetchTimeSlots() {
      if (!selectedDate || !serviceId) return;

      try {
        const response = await fetch(
          `/api/availability/slots?serviceId=${serviceId}&date=${format(selectedDate, 'yyyy-MM-dd')}`
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
      }
    }

    fetchTimeSlots();
  }, [selectedDate, serviceId, toast]);

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) return;

    // Store selections in session storage
    sessionStorage.setItem('selectedDate', selectedDate.toISOString());
    sessionStorage.setItem('selectedTime', selectedTime);

    // Navigate to next step
    router.push(`/book/staff?serviceId=${serviceId}`);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time selection when date changes
  };

  // Group time slots by period (morning, afternoon, evening)
  const groupedTimeSlots = timeSlots.reduce((acc, slot) => {
    const hour = parseInt(slot.time.split(':')[0], 10);
    let period = 'Morning';
    if (hour >= 12 && hour < 17) period = 'Afternoon';
    else if (hour >= 17) period = 'Evening';
    
    if (!acc[period]) acc[period] = [];
    acc[period].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-[350px] bg-gray-200 animate-pulse rounded-lg" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-6 bg-gray-200 animate-pulse rounded-md w-1/4" />
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-12 bg-gray-200 animate-pulse rounded-md" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Choose Date & Time</h1>
        <p className="text-gray-600">Select your preferred appointment date and time</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card className="p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => date < startOfDay(new Date()) || date > addDays(new Date(), 30)}
            className="rounded-md"
          />
        </Card>

        {/* Time Slots */}
        <div className="space-y-4">
          {selectedDate ? (
            <AnimatePresence mode="wait">
              {Object.entries(groupedTimeSlots).length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center py-8"
                >
                  <Clock className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-500">No available time slots for this date.</p>
                  <p className="text-sm text-gray-400 mt-1">Please select another date.</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {Object.entries(groupedTimeSlots).map(([period, slots]) => (
                    <div key={period} className="space-y-2">
                      <h3 className="font-medium text-gray-700">{period}</h3>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {slots.map((slot) => (
                          <Button
                            key={slot.time}
                            variant={selectedTime === slot.time ? 'default' : 'outline'}
                            className={`w-full ${!slot.available && 'opacity-50 cursor-not-allowed'}`}
                            onClick={() => slot.available && setSelectedTime(slot.time)}
                            disabled={!slot.available}
                          >
                            {format(new Date(`2000-01-01T${slot.time}`), 'h:mm a')}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-500">Please select a date to view available time slots.</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selectedDate || !selectedTime}
          className="flex items-center"
        >
          Continue
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
} 