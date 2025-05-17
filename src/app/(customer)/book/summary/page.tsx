'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ChevronLeft } from 'lucide-react';
import { formatPrice, formatDuration } from '@/lib/utils';

interface BookingSummary {
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
    description?: string;
  };
  staff: {
    id: string;
    name: string;
    role: string;
  };
  datetime: {
    date: string;
    time: string;
  };
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    preferredContact: string;
    notes?: string;
  };
}

export default function BookingSummaryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [summary, setSummary] = useState<BookingSummary | null>(null);
  const serviceId = searchParams.get('serviceId');

  useEffect(() => {
    // Retrieve all booking information from session storage
    const storedDate = sessionStorage.getItem('selectedDate');
    const storedTime = sessionStorage.getItem('selectedTime');
    const storedStaffId = sessionStorage.getItem('selectedStaff');
    const storedCustomerDetails = sessionStorage.getItem('customerDetails');

    if (!serviceId || !storedDate || !storedTime || !storedStaffId || !storedCustomerDetails) {
      toast({
        title: 'Error',
        description: 'Missing booking information. Please start over.',
        variant: 'destructive',
      });
      router.push('/book');
      return;
    }

    async function fetchBookingSummary() {
      try {
        // Fetch service and staff details
        const [serviceResponse, staffResponse] = await Promise.all([
          fetch(`/api/services/${serviceId}`),
          fetch(`/api/staff/${storedStaffId}`),
        ]);

        if (!serviceResponse.ok || !staffResponse.ok) {
          throw new Error('Failed to fetch booking details');
        }

        const [serviceData, staffData] = await Promise.all([
          serviceResponse.json(),
          staffResponse.json(),
        ]);

        // Ensure we have valid data before setting the summary
        if (!serviceData || !staffData) {
          throw new Error('Invalid service or staff data');
        }

        setSummary({
          service: serviceData,
          staff: staffData,
          datetime: {
            date: storedDate,
            time: storedTime,
          },
          customer: JSON.parse(storedCustomerDetails),
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load booking summary. Please try again.',
          variant: 'destructive',
        });
        router.push('/book');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBookingSummary();
  }, [serviceId, router, toast]);

  const handleConfirmBooking = async () => {
    if (!summary) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: summary.service.id,
          staffId: summary.staff.id,
          date: summary.datetime.date,
          time: summary.datetime.time,
          customerDetails: summary.customer,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      // Clear session storage
      sessionStorage.removeItem('selectedDate');
      sessionStorage.removeItem('selectedTime');
      sessionStorage.removeItem('selectedStaff');
      sessionStorage.removeItem('customerDetails');

      // Navigate to success page
      router.push('/book/success');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to confirm booking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !summary) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Booking Summary</h1>
        <p className="text-gray-600">Please review your booking details</p>
      </div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Service Details */}
        <Card className="p-4">
          <h2 className="font-semibold mb-3">Service</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{summary.service.name}</span>
              <span className="font-medium">{formatPrice(summary.service.price)}</span>
            </div>
            <div className="text-sm text-gray-500">
              <span>Duration: {formatDuration(summary.service.duration)}</span>
            </div>
            {summary.service.description && (
              <p className="text-sm text-gray-600">{summary.service.description}</p>
            )}
          </div>
        </Card>

        {/* Staff Details */}
        <Card className="p-4">
          <h2 className="font-semibold mb-3">Provider</h2>
          <div className="space-y-1">
            <p>{summary.staff.name}</p>
            <p className="text-sm text-gray-500">{summary.staff.role}</p>
          </div>
        </Card>

        {/* Date & Time */}
        <Card className="p-4">
          <h2 className="font-semibold mb-3">Date & Time</h2>
          <div className="space-y-1">
            <p>{format(new Date(summary.datetime.date), 'MMMM d, yyyy')}</p>
            <p className="text-sm text-gray-500">
              {format(new Date(`2000-01-01T${summary.datetime.time}`), 'h:mm a')}
            </p>
          </div>
        </Card>

        {/* Customer Details */}
        <Card className="p-4">
          <h2 className="font-semibold mb-3">Your Details</h2>
          <div className="space-y-2">
            <p>{`${summary.customer.firstName} ${summary.customer.lastName}`}</p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>Email: {summary.customer.email}</p>
              <p>Phone: {summary.customer.phone}</p>
              <p>Preferred Contact: {summary.customer.preferredContact}</p>
              {summary.customer.notes && (
                <div className="mt-2">
                  <p className="text-gray-700">Notes:</p>
                  <p className="text-gray-600">{summary.customer.notes}</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Total */}
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-bold">{formatPrice(summary.service.price)}</span>
          </div>
        </Card>

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
            onClick={handleConfirmBooking}
            disabled={isSubmitting}
            className="min-w-[150px]"
          >
            {isSubmitting ? 'Confirming...' : 'Confirm & Pay'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
} 