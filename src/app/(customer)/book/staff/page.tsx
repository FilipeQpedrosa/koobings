'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ChevronLeft, ChevronRight, Star, Clock, Calendar } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string | null;
  bio: string | null;
  rating: number;
  reviewCount: number;
  specialties: string[];
}

export default function StaffSelectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const serviceId = searchParams.get('serviceId');

  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve date and time from session storage
    const storedDate = sessionStorage.getItem('selectedDate');
    const storedTime = sessionStorage.getItem('selectedTime');
    setSelectedDate(storedDate);
    setSelectedTime(storedTime);

    if (!serviceId || !storedDate || !storedTime) {
      toast({
        title: 'Error',
        description: 'Missing booking information. Please start over.',
        variant: 'destructive'
      });
      router.push('/book');
      return;
    }

    async function fetchAvailableStaff() {
      try {
        const response = await fetch(
          `/api/staff/available?serviceId=${serviceId}&date=${storedDate}&time=${storedTime}`
        );
        if (!response.ok) throw new Error('Failed to fetch available staff');
        const data = await response.json();
        setStaffMembers(data);
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
  }, [serviceId, toast, router]);

  const handleContinue = () => {
    if (!selectedStaff) return;

    // Store selection in session storage
    sessionStorage.setItem('selectedStaff', selectedStaff);

    // Navigate to next step
    router.push(`/book/details?serviceId=${serviceId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Choose Your Provider</h1>
        <p className="text-gray-600">Select who you'd like to provide the service</p>
      </div>

      {selectedDate && selectedTime && (
        <Card className="p-4 bg-gray-50">
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              {format(new Date(selectedDate), 'MMMM d, yyyy')}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              {format(new Date(`2000-01-01T${selectedTime}`), 'h:mm a')}
            </div>
          </div>
        </Card>
      )}

      <AnimatePresence>
        {staffMembers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-center py-8"
          >
            <p className="text-gray-500">No staff members available at the selected time.</p>
            <Button
              variant="link"
              onClick={() => router.push('/book/datetime')}
              className="mt-2"
            >
              Choose a different time
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {staffMembers.map((staff) => (
              <motion.div
                key={staff.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <Card
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedStaff === staff.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedStaff(staff.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      {staff.imageUrl ? (
                        <Image
                          src={staff.imageUrl}
                          alt={staff.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          {staff.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{staff.name}</h3>
                          <p className="text-sm text-gray-600">{staff.role}</p>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{staff.rating}</span>
                          <span className="text-sm text-gray-500 ml-1">
                            ({staff.reviewCount})
                          </span>
                        </div>
                      </div>
                      {staff.bio && (
                        <p className="text-sm text-gray-600 mt-2">{staff.bio}</p>
                      )}
                      {staff.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {staff.specialties.map((specialty) => (
                            <span
                              key={specialty}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

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
          disabled={!selectedStaff}
          className="flex items-center"
        >
          Continue
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
} 