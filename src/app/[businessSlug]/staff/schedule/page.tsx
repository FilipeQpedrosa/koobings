"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import BookingModal from '@/components/BookingModal';
import AppointmentDetailsModal from '@/components/AppointmentDetailsModal';
import { format, addDays, startOfDay, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface AppointmentEvent {
  id: string;
  clientName: string;
  service: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  phone?: string;
  notes?: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingCreated: () => void;
}

export default function StaffSchedule() {
  const { user, loading, authenticated } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<AppointmentEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'day' | 'week'>('day');
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentEvent | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    if (loading) return;
    
    if (!authenticated || !user) {
      router.push('/auth/signin');
      return;
    }
    
    loadAppointments();
  }, [user, loading, authenticated, router, selectedDate]);

  const loadAppointments = useCallback(async () => {
    setIsLoading(true);
    
    try {
      console.log('📅 Schedule: Fetching appointments...');
      
      // Add timestamp to prevent cache
      const timestamp = Date.now();
      const apiUrl = `/api/business/appointments?t=${timestamp}`;
      
      const response = await fetch(apiUrl, { 
        credentials: 'include',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      console.log('📅 Schedule: Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        const appointmentsArray = data?.data?.appointments || [];
        
        console.log('📅 Schedule: Received appointments:', appointmentsArray.length);
        
        // Convert API data to AppointmentEvent format
        const formattedAppointments: AppointmentEvent[] = appointmentsArray.map((apt: any) => {
          const startTime = new Date(apt.scheduledFor);
          const endTime = new Date(startTime.getTime() + (apt.duration || 60) * 60000);
          
          return {
            id: apt.id,
            clientName: apt.client?.name || 'Cliente Desconhecido',
            service: apt.services?.[0]?.name || 'Serviço Desconhecido',
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            duration: apt.duration || 60,
            status: apt.status?.toLowerCase() === 'pending' ? 'pending' : 
                   apt.status?.toLowerCase() === 'accepted' ? 'accepted' :
                   apt.status?.toLowerCase() === 'rejected' ? 'rejected' :
                   apt.status?.toLowerCase() === 'completed' ? 'completed' : 
                   apt.status?.toLowerCase() === 'cancelled' ? 'cancelled' : 'confirmed',
            phone: apt.client?.phone,
            notes: apt.notes
          };
        });
        
        // Filter appointments for the selected date
        const dateStr = selectedDate.toISOString().split('T')[0];
        const filteredAppointments = formattedAppointments.filter(apt => {
          const aptDate = new Date(apt.startTime).toISOString().split('T')[0];
          return aptDate === dateStr;
        });
        
        console.log('📅 Schedule: Appointments for', dateStr, ':', filteredAppointments.length);
        setAppointments(filteredAppointments);
      } else {
        console.error('❌ Schedule: Failed to fetch appointments:', response.status);
        setAppointments([]);
      }
    } catch (error) {
      console.error('❌ Schedule: Error fetching appointments:', error);
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'border-green-500 bg-green-50';
      case 'pending': return 'border-yellow-500 bg-yellow-50';
      case 'accepted': return 'border-blue-500 bg-blue-50';
      case 'rejected': return 'border-red-500 bg-red-50';
      case 'completed': return 'border-blue-500 bg-blue-50';
      case 'cancelled': return 'border-red-500 bg-red-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'pending': return 'Pendente';
      case 'accepted': return 'Aceito';
      case 'rejected': return 'Rejeitado';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    }
    setSelectedDate(newDate);
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 19; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeStr);
      }
    }
    return slots;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-PT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const timeSlots = generateTimeSlots();

  const handleViewAppointment = (appointment: AppointmentEvent) => {
    setSelectedAppointment(appointment);
    setShowViewModal(true);
  };

  const handleEditAppointment = (appointment: AppointmentEvent) => {
    setSelectedAppointment(appointment);
    setShowEditModal(true);
  };

  const handleNewBooking = (timeSlot: string) => {
    setShowBookingModal(true);
  };

  const closeModals = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setShowBookingModal(false);
    setSelectedAppointment(null);
  };

  const getAppointmentForTimeSlot = (timeSlot: string) => {
    return appointments.find(apt => {
      const startTime = new Date(apt.startTime).toLocaleTimeString('pt-PT', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      return startTime === timeSlot;
    });
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header with Create Appointment Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
            <p className="text-gray-600 mt-1">Manage your appointments</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant={view === 'day' ? 'default' : 'outline'}
            onClick={() => setView('day')}
            size="sm"
          >
            Day
          </Button>
          <Button
            variant={view === 'week' ? 'default' : 'outline'}
            onClick={() => setView('week')}
            size="sm"
          >
            Week
          </Button>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigateDate('prev')}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-center">
          <h2 className="text-xl font-semibold">{formatDate(selectedDate)}</h2>
        </div>
        
        <Button variant="outline" onClick={() => navigateDate('next')}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Schedule Grid */}
      <div className="space-y-2">
        {timeSlots.map((timeSlot) => {
          const appointment = getAppointmentForTimeSlot(timeSlot);
          
          return (
            <div
              key={timeSlot}
              className="flex items-center border-b border-gray-100 py-2 hover:bg-gray-50 transition-colors"
            >
              <div className="w-20 text-sm text-gray-600 font-medium">
                {timeSlot}
              </div>
              
              <div className="flex-1 ml-4">
                {appointment ? (
                  <div
                    className={`p-3 rounded-lg border-l-4 cursor-pointer ${getStatusColor(appointment.status)}`}
                    onClick={() => handleViewAppointment(appointment)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {appointment.clientName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {appointment.service} ({appointment.duration}min)
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {getStatusText(appointment.status)}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAppointment(appointment);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-400 hover:text-gray-600"
                    onClick={() => handleNewBooking(timeSlot)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Available
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* View Appointment Modal */}
      {showViewModal && selectedAppointment && (
        <AppointmentDetailsModal
          isOpen={showViewModal}
          onClose={closeModals}
          appointment={{
            id: selectedAppointment.id,
            clientName: selectedAppointment.clientName,
            clientEmail: selectedAppointment.phone || '', // Use phone as fallback for email
            clientId: '', // Not available in AppointmentEvent
            serviceName: selectedAppointment.service,
            staffName: 'Staff', // Not available in AppointmentEvent
            scheduledFor: selectedAppointment.startTime,
            duration: selectedAppointment.duration,
            status: selectedAppointment.status.toUpperCase(),
            notes: selectedAppointment.notes
          }}
          onNoteAdded={() => {
            closeModals();
            loadAppointments(); // Reload appointments after adding note
          }}
        />
      )}

      {/* New Booking Modal */}
      {showBookingModal && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          onBookingCreated={() => {
            setShowBookingModal(false);
            loadAppointments(); // Reload appointments after booking is created
          }}
        />
      )}
    </div>
  );
} 