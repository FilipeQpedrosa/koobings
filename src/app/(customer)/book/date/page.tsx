'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Service } from '@prisma/client';

export default function DateSelectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const serviceId = searchParams.get('serviceId');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchService() {
      if (!serviceId) return;

      try {
        const response = await fetch(`/api/client/services/${serviceId}`);
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

    fetchService();
  }, [serviceId, toast]);

  const handleContinue = () => {
    if (!selectedDate || !serviceId) {
      toast({
        title: 'Error',
        description: 'Please select a date to continue.',
        variant: 'destructive'
      });
      return;
    }

    // Store the selected date in session storage
    sessionStorage.setItem('bookingDate', selectedDate.toISOString());

    // Navigate to the next step
    router.push(`/book/staff?serviceId=${serviceId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center">
        <p className="text-red-600 mb-4">Service not found</p>
        <Button onClick={() => router.push('/book')}>
          Start Over
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Select a Date</h1>
        <p className="text-gray-600">Choose your preferred appointment date</p>
      </div>

      <div className="flex flex-col items-center space-y-6">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
          disabled={(date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < today;
          }}
        />
        {selectedDate && (
          <p className="text-sm text-gray-600">
            Selected date: {format(selectedDate, 'EEEE, MMMM do, yyyy')}
          </p>
        )}
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
          disabled={!selectedDate}
        >
          Continue
        </Button>
      </div>
    </div>
  );
} 