'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Clock, MapPin, Plus, History } from 'lucide-react';

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  service: {
    name: string;
    duration: number;
  };
  staff: {
    name: string;
  };
  business: {
    name: string;
  };
}

interface Activity {
  id: string;
  type: 'APPOINTMENT_BOOKED' | 'APPOINTMENT_COMPLETED' | 'APPOINTMENT_CANCELLED';
  date: string;
  description: string;
}

export default function ClientDashboard() {
  const { data: session } = useSession();
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchUpcomingAppointments(),
      fetchRecentActivity()
    ]).finally(() => setIsLoading(false));
  }, []);

  const fetchUpcomingAppointments = async () => {
    try {
      const response = await fetch('/api/client/appointments/upcoming');
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      setUpcomingAppointments(data);
    } catch (error) {
      setError('Failed to load upcoming appointments');
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch('/api/client/activity');
      if (!response.ok) throw new Error('Failed to fetch activity');
      const data = await response.json();
      setRecentActivity(data);
    } catch (error) {
      setError('Failed to load recent activity');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/book">
              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Book New Appointment
              </Button>
            </Link>
            <Link href="/client/appointments">
              <Button variant="outline" className="w-full">
                <History className="w-4 h-4 mr-2" />
                View All Appointments
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              {upcomingAppointments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No upcoming appointments
                </p>
              ) : (
                upcomingAppointments.slice(0, 3).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 border rounded-lg space-y-2"
                  >
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
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              ) : (
                recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-gray-500">
                        {format(parseISO(activity.date), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 