'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  service: {
    name: string;
    duration: number;
    price: number;
  };
  staff: {
    name: string;
  };
  business: {
    name: string;
    address: string;
  };
}

export default function ClientAppointments() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/client/appointments');
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      setError('Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      const response = await fetch(`/api/client/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'CANCELLED' }),
      });

      if (!response.ok) throw new Error('Failed to cancel appointment');

      // Refresh appointments list
      fetchAppointments();
    } catch (error) {
      setError('Failed to cancel appointment');
    }
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50';
      case 'CONFIRMED':
        return 'text-green-600 bg-green-50';
      case 'CANCELLED':
        return 'text-red-600 bg-red-50';
      case 'COMPLETED':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED'
  );
  const pastAppointments = appointments.filter(
    (apt) => apt.status === 'CANCELLED' || apt.status === 'COMPLETED'
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>My Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              <div className="space-y-4">
                {upcomingAppointments.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No upcoming appointments
                  </p>
                ) : (
                  upcomingAppointments.map((appointment) => (
                    <Card key={appointment.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3 className="font-medium">{appointment.service.name}</h3>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="w-4 h-4 mr-2" />
                              {format(parseISO(appointment.date), 'MMMM d, yyyy')}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-2" />
                              {appointment.time} ({appointment.service.duration} min)
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="w-4 h-4 mr-2" />
                              {appointment.business.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              With {appointment.staff.name}
                            </div>
                          </div>
                          <div className="space-y-2 text-right">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                appointment.status
                              )}`}
                            >
                              {appointment.status}
                            </span>
                            {appointment.status !== 'CANCELLED' && (
                              <div>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleCancelAppointment(appointment.id)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="past">
              <div className="space-y-4">
                {pastAppointments.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No past appointments
                  </p>
                ) : (
                  pastAppointments.map((appointment) => (
                    <Card key={appointment.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3 className="font-medium">{appointment.service.name}</h3>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="w-4 h-4 mr-2" />
                              {format(parseISO(appointment.date), 'MMMM d, yyyy')}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-2" />
                              {appointment.time}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="w-4 h-4 mr-2" />
                              {appointment.business.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              With {appointment.staff.name}
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              appointment.status
                            )}`}
                          >
                            {appointment.status}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 