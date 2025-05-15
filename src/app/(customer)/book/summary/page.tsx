'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format, parse } from 'date-fns';
import { Service, Staff } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BookingSummary {
  service: Service;
  staff: Staff;
  date: string;
  time: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function BookingSummaryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { toast } = useToast();
  
  const [summary, setSummary] = useState<BookingSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    async function fetchSummaryData() {
      const serviceId = searchParams.get('serviceId');
      const staffId = searchParams.get('staffId');
      const bookingDate = sessionStorage.getItem('bookingDate');
      const selectedTime = sessionStorage.getItem('selectedTime');
      const customerInfo = sessionStorage.getItem('bookingInfo');

      if (!serviceId || !staffId || !bookingDate || !selectedTime || !customerInfo) {
        toast({
          title: 'Error',
          description: 'Missing booking information. Please start over.',
          variant: 'destructive'
        });
        router.push('/book');
        return;
      }

      try {
        const [serviceResponse, staffResponse] = await Promise.all([
          fetch(`/api/client/services/${serviceId}`),
          fetch(`/api/client/staff/${staffId}`)
        ]);

        if (!serviceResponse.ok || !staffResponse.ok) {
          throw new Error('Failed to fetch booking details');
        }

        const [service, staff] = await Promise.all([
          serviceResponse.json(),
          staffResponse.json()
        ]);

        setSummary({
          service,
          staff,
          date: bookingDate,
          time: selectedTime,
          customerInfo: JSON.parse(customerInfo)
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load booking summary. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchSummaryData();
  }, [searchParams, router, toast]);

  const handleConfirmBooking = async () => {
    if (!summary) return;

    // If service requires recurring appointments and user is not logged in
    if (summary.service.recurring && !session) {
      setShowAuthDialog(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/client/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: summary.service.id,
          staffId: summary.staff.id,
          date: summary.date,
          time: summary.time,
          customerInfo: summary.customerInfo
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      const booking = await response.json();
      
      // Clear booking data from session storage
      sessionStorage.removeItem('bookingDate');
      sessionStorage.removeItem('selectedTime');
      sessionStorage.removeItem('bookingInfo');
      sessionStorage.removeItem('selectedStaff');

      // Navigate to success page
      router.push(`/book/success?bookingId=${booking.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to confirm booking. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !summary) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  const bookingDateTime = new Date(summary.date);
  const [hours, minutes] = summary.time.split(':');
  bookingDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Booking Summary</h1>
        <p className="text-gray-600">Review your appointment details</p>
      </div>

      <Card className="p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Service Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Service</p>
              <p className="font-medium">{summary.service.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Duration</p>
              <p className="font-medium">{summary.service.duration} minutes</p>
            </div>
            <div>
              <p className="text-gray-600">Price</p>
              <p className="font-medium">${Number(summary.service.price).toFixed(2)}</p>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h2 className="text-lg font-semibold mb-2">Appointment Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Date</p>
              <p className="font-medium">{format(bookingDateTime, 'EEEE, MMMM do, yyyy')}</p>
            </div>
            <div>
              <p className="text-gray-600">Time</p>
              <p className="font-medium">{format(bookingDateTime, 'h:mm a')}</p>
            </div>
            <div>
              <p className="text-gray-600">Staff Member</p>
              <p className="font-medium">{summary.staff.name}</p>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h2 className="text-lg font-semibold mb-2">Your Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-medium">{summary.customerInfo.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{summary.customerInfo.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Phone</p>
              <p className="font-medium">{summary.customerInfo.phone}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Back
        </Button>
        <Button
          onClick={handleConfirmBooking}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
        </Button>
      </div>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in Required</DialogTitle>
            <DialogDescription>
              This service requires an account for recurring appointments. Would you like to sign in or create an account?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setShowAuthDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => router.push('/auth/signin')}>
              Sign In
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 