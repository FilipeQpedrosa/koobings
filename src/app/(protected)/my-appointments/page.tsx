'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

interface Appointment {
  id: string;
  startTime: string;
  status: string;
  service: {
    name: string;
    duration: number;
  };
  staff: {
    name: string;
  };
}

export default function MyAppointmentsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=/my-appointments');
      return;
    }

    fetchAppointments();
  }, [session, router]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/client/appointments');
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load appointments. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.startTime) > new Date()
  );

  const pastAppointments = appointments.filter(
    (apt) => new Date(apt.startTime) <= new Date()
  );

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card key={appointment.id} className="mb-4">
      <CardHeader>
        <CardTitle>{appointment.service.name}</CardTitle>
        <CardDescription>with {appointment.staff.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(appointment.startTime), 'MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{format(new Date(appointment.startTime), 'h:mm a')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{appointment.staff.name}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Appointments</h1>
        <Button onClick={() => router.push('/book')}>Book New Appointment</Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastAppointments.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No upcoming appointments. 
              <Button variant="link" onClick={() => router.push('/book')}>
                Book one now!
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="past">
          {pastAppointments.length > 0 ? (
            pastAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No past appointments.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 