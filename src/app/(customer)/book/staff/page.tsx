'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Staff } from '@prisma/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface StaffWithAvailability extends Staff {
  isAvailable: boolean;
}

export default function StaffSelectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const serviceId = searchParams.get('serviceId');
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [staff, setStaff] = useState<StaffWithAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAvailableStaff() {
      if (!serviceId) return;

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
          `/api/client/staff/available?serviceId=${serviceId}&date=${bookingDate}`
        );
        if (!response.ok) throw new Error('Failed to fetch available staff');
        const data = await response.json();
        setStaff(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load available staff. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchAvailableStaff();
  }, [serviceId, router, toast]);

  const handleContinue = () => {
    if (!selectedStaff || !serviceId) {
      toast({
        title: 'Error',
        description: 'Please select a staff member to continue.',
        variant: 'destructive'
      });
      return;
    }

    // Store the selected staff in session storage
    sessionStorage.setItem('selectedStaff', selectedStaff);

    // Navigate to the next step
    router.push(`/book/time?serviceId=${serviceId}&staffId=${selectedStaff}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Choose Your Provider</h1>
        <p className="text-gray-600">Select a staff member for your appointment</p>
      </div>

      <div className="grid gap-4">
        {staff.map((member) => (
          <Card
            key={member.id}
            className={`p-4 cursor-pointer transition-all ${
              !member.isAvailable ? 'opacity-50 cursor-not-allowed' :
              selectedStaff === member.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
            }`}
            onClick={() => {
              if (member.isAvailable) {
                setSelectedStaff(member.id);
              }
            }}
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={`/staff/${member.id}.jpg`} alt={member.name} />
                <AvatarFallback>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-medium">{member.name}</h3>
                {!member.isAvailable && (
                  <p className="text-sm text-red-500">Not available on selected date</p>
                )}
              </div>
              <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-300">
                {selectedStaff === member.id && (
                  <div className="w-3 h-3 rounded-full bg-primary" />
                )}
              </div>
            </div>
          </Card>
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
          disabled={!selectedStaff}
        >
          Continue
        </Button>
      </div>
    </div>
  );
} 