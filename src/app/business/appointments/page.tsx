'use client';

import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar } from '@/components/ui/Calendar';
import { 
  Clock, 
  User, 
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  Clock4,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import AppointmentDetailsModal from '@/components/appointments/AppointmentDetailsModal';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  provider: {
    id: string;
    name: string;
  };
}

export default function BusinessAppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const fetchAppointments = async () => {
    if (!selectedDate) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/business/appointments?date=${format(selectedDate, 'yyyy-MM-dd')}`);
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

  const handleStatusUpdate = async (appointmentId: string, newStatus: Appointment['status']) => {
    try {
      // Optimistic update
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        )
      );

      const response = await fetch(`/api/business/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      toast({
        title: 'Success',
        description: 'Appointment status updated successfully.',
      });
      
      router.refresh();
    } catch (error) {
      // Revert optimistic update
      fetchAppointments();
      toast({
        title: 'Error',
        description: 'Failed to update appointment status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };

  const handleNewAppointment = () => {
    router.push('/business/appointments/new');
  };

  const filteredAppointments = appointments.filter(
    (apt) => format(parseISO(apt.date), 'yyyy-MM-dd') === format(selectedDate!, 'yyyy-MM-dd')
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
        <Button onClick={handleNewAppointment}>
          + New Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Calendar */}
        <div className="md:col-span-4 bg-white p-6 rounded-lg shadow">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </div>

        {/* Appointments List */}
        <div className="md:col-span-8 bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:px-6 border-b">
            <h3 className="text-lg font-medium text-gray-900">
              {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Select a date'}
            </h3>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <li
                    key={appointment.id}
                    className="px-4 py-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleAppointmentClick(appointment)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <User className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900">
                            {appointment.patientName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {appointment.provider.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {appointment.time}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(
                              appointment.id,
                              appointment.status === 'PENDING' ? 'CONFIRMED' : 'COMPLETED'
                            );
                          }}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-8 text-center text-gray-500">
                  No appointments scheduled for this day
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      {selectedAppointment && (
        <AppointmentDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          appointment={selectedAppointment}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
} 