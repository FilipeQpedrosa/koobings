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
  slotInfo?: {
    startTime: string;
    endTime: string;
    slotIndex: number;
    capacity?: number;
  };
}

interface EventGroup {
  id: string; // service_date_slot
  serviceName: string;
  startTime: string;
  endTime: string;
  duration: number;
  isSlotBased: boolean;
  capacity?: number;
  participants: AppointmentEvent[];
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
  const [eventGroups, setEventGroups] = useState<EventGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'day' | 'week'>('day');
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentEvent | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Group appointments into events (for slot-based services)
  const groupAppointmentsIntoEvents = useCallback((appointments: AppointmentEvent[]): EventGroup[] => {
    const groups: { [key: string]: EventGroup } = {};
    
    appointments.forEach(apt => {
      let groupKey: string;
      
      if (apt.slotInfo) {
        // Slot-based service: group by service + slot
        groupKey = `${apt.service}_${apt.slotInfo.startTime}_${apt.slotInfo.endTime}_${apt.slotInfo.slotIndex}`;
      } else {
        // Traditional service: each appointment is its own event
        groupKey = apt.id;
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = {
          id: groupKey,
          serviceName: apt.service,
          startTime: apt.slotInfo ? apt.slotInfo.startTime : apt.startTime,
          endTime: apt.slotInfo ? apt.slotInfo.endTime : apt.endTime,
          duration: apt.duration,
          isSlotBased: !!apt.slotInfo,
          capacity: apt.slotInfo?.capacity,
          participants: []
        };
      }
      
      groups[groupKey].participants.push(apt);
    });
    
    return Object.values(groups);
  }, []);

  // Load appointments for the entire week when in week view
  const loadWeekAppointments = useCallback(async () => {
    if (view !== 'week') return;
    
    setIsLoading(true);
    
    try {
      const weekStart = getWeekStartDate(selectedDate);
      const weekDays = getWeekDays(weekStart);
      
      console.log('📅 Schedule: Fetching week appointments for:', weekDays.map(d => d.toISOString().split('T')[0]));
      
      // Fetch appointments for all days in the week
      const weekAppointments: { [key: string]: AppointmentEvent[] } = {};
      
      for (const day of weekDays) {
        const timestamp = Date.now();
        const dayStr = day.toISOString().split('T')[0];
        const apiUrl = `/api/business/appointments?date=${dayStr}&t=${timestamp}`;
        
        const response = await fetch(apiUrl, { 
          credentials: 'include',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const appointmentsArray = data?.data?.appointments || [];
          
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
              notes: apt.notes,
              slotInfo: apt.slotInfo || undefined
            };
          });
          
          weekAppointments[dayStr] = formattedAppointments;
        }
      }
      
      console.log('📅 Schedule: Week appointments loaded:', Object.keys(weekAppointments).length, 'days');
      setWeekAppointments(weekAppointments);
      
    } catch (error) {
      console.error('❌ Schedule: Error fetching week appointments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, view]);

  // Add state for week appointments
  const [weekAppointments, setWeekAppointments] = useState<{ [key: string]: AppointmentEvent[] }>({});

  // Add state for business hours
  const [businessHours, setBusinessHours] = useState<any[]>([]);

  // Load business hours
  const loadBusinessHours = useCallback(async () => {
    try {
      const response = await fetch('/api/business/hours', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBusinessHours(data.data || []);
          console.log('📅 Schedule: Business hours loaded:', data.data);
        }
      }
    } catch (error) {
      console.error('❌ Schedule: Error loading business hours:', error);
    }
  }, []);

  useEffect(() => {
    if (loading) return;
    
    if (!authenticated || !user) {
      router.push('/auth/signin');
      return;
    }
    
    loadBusinessHours(); // Load business hours on mount

    if (view === 'week') {
      loadWeekAppointments();
    } else {
      loadAppointments();
    }
  }, [user, loading, authenticated, router, selectedDate, view, loadWeekAppointments, loadBusinessHours]);

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
            notes: apt.notes,
            slotInfo: apt.slotInfo || undefined
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
        
        // Group appointments into events
        const groups = groupAppointmentsIntoEvents(filteredAppointments);
        console.log('📅 Schedule: Event groups:', groups.length);
        setEventGroups(groups);
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
    
    // Get today's day of week (0 = Sunday, 6 = Saturday)
    const today = selectedDate.getDay();
    const todayHours = businessHours.find(h => h.day === today);
    
    if (!todayHours || !todayHours.isOpen) {
      console.log('📅 Schedule: Business is closed today');
      return [];
    }
    
    if (!todayHours.start || !todayHours.end) {
      console.log('📅 Schedule: No hours defined for today, using default 8-19');
      // Fallback to default hours
      for (let hour = 8; hour <= 19; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          slots.push(timeStr);
        }
      }
      return slots;
    }
    
    // Parse business hours
    const startParts = todayHours.start.split(':');
    const endParts = todayHours.end.split(':');
    const startHour = parseInt(startParts[0]);
    const startMinute = parseInt(startParts[1]);
    const endHour = parseInt(endParts[0]);
    const endMinute = parseInt(endParts[1]);
    
    console.log(`📅 Schedule: Business hours for today: ${todayHours.start} - ${todayHours.end}`);
    
    // Generate slots within business hours
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      slots.push(timeStr);
      
      // Increment by 30 minutes
      currentMinute += 30;
      if (currentMinute >= 60) {
        currentMinute = 0;
        currentHour++;
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

  const formatWeekRange = (startDate: Date) => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    
    const startStr = startDate.toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'short'
    });
    const endStr = endDate.toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    
    return `${startStr} - ${endStr}`;
  };

  const getWeekDays = (startDate: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getWeekStartDate = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
    start.setDate(diff);
    return start;
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

  const getEventForTimeSlot = (timeSlot: string) => {
    return eventGroups.find(event => {
      // For slot-based events, use the slot time
      if (event.isSlotBased) {
        return event.startTime === timeSlot;
      } else {
        // For traditional events, use the appointment time
        const startTime = new Date(event.startTime).toLocaleTimeString('pt-PT', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        return startTime === timeSlot;
      }
    });
  };

  const getAppointmentForDayAndTime = (day: Date, timeSlot: string) => {
    const dayStr = day.toISOString().split('T')[0];
    const dayAppointments = weekAppointments[dayStr] || [];
    
    return dayAppointments.find(apt => {
      const aptTime = new Date(apt.startTime).toLocaleTimeString('pt-PT', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      return aptTime === timeSlot;
    });
  };

  const getStatusColorWeek = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 border-green-300 text-green-800';
      case 'pending': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'accepted': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'rejected': return 'bg-red-100 border-red-300 text-red-800';
      case 'completed': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'cancelled': return 'bg-red-100 border-red-300 text-red-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Modern Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Agenda</h1>
              <p className="text-gray-600">Gerir os seus agendamentos</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="bg-gray-100 rounded-lg p-1 flex">
                <Button
                  variant={view === 'day' ? 'default' : 'ghost'}
                  onClick={() => setView('day')}
                  size="sm"
                  className={view === 'day' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}
                >
                  Dia
                </Button>
                <Button
                  variant={view === 'week' ? 'default' : 'ghost'}
                  onClick={() => setView('week')}
                  size="sm"
                  className={view === 'week' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}
                >
                  Semana
                </Button>
              </div>
              
              {/* New Appointment Button */}
              <Button 
                onClick={() => setShowBookingModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Marcação
              </Button>
            </div>
          </div>
        </div>

        {/* Modern Date Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={() => navigateDate('prev')}
              className="border-gray-300 hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {view === 'day' ? formatDate(selectedDate) : formatWeekRange(getWeekStartDate(selectedDate))}
              </h2>
              {view === 'day' && (
                <p className="text-sm text-gray-500 mt-1">
                  {selectedDate.toLocaleDateString('pt-PT', { weekday: 'long' })}
                </p>
              )}
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => navigateDate('next')}
              className="border-gray-300 hover:bg-gray-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Modern Schedule Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {view === 'day' ? (
            // Modern Day View
            <div className="divide-y divide-gray-200">
              {timeSlots.map((timeSlot) => {
                const event = getEventForTimeSlot(timeSlot);
                
                return (
                  <div
                    key={timeSlot}
                    className="flex items-center hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="w-24 py-4 px-6 text-sm font-medium text-gray-500 bg-gray-50">
                      {timeSlot}
                    </div>
                    
                    <div className="flex-1 p-4">
                      {event ? (
                        <div
                          className={`p-4 rounded-lg border-l-4 cursor-pointer transition-all duration-200 hover:shadow-md ${getStatusColor(event.participants[0]?.status || 'confirmed')}`}
                          onClick={() => handleViewAppointment(event.participants[0])}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 mb-1">
                                {event.isSlotBased ? (
                                  <>
                                    {event.serviceName}
                                    <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {event.participants.length}{event.capacity ? `/${event.capacity}` : ''} pessoas
                                    </span>
                                  </>
                                ) : (
                                  event.participants[0]?.clientName || 'Cliente Desconhecido'
                                )}
                              </div>
                              
                              <div className="text-sm text-gray-600 mb-2">
                                {event.isSlotBased ? (
                                  <div className="space-y-1">
                                    {event.participants.map((participant, idx) => (
                                      <div key={participant.id} className="flex items-center">
                                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                        <span>{participant.clientName}</span>
                                      </div>
                                    ))}
                                    {event.capacity && event.participants.length < event.capacity && (
                                      <div className="text-gray-400 italic">
                                        {event.capacity - event.participants.length} vagas disponíveis
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {event.serviceName} • {event.duration}min
                                  </div>
                                )}
                              </div>
                              
                              {!event.isSlotBased && (
                                <div className="flex items-center">
                                  <Badge variant={
                                    event.participants[0]?.status === 'confirmed' ? 'default' :
                                    event.participants[0]?.status === 'pending' ? 'secondary' :
                                    event.participants[0]?.status === 'cancelled' ? 'destructive' : 'outline'
                                  }>
                                    {getStatusText(event.participants[0]?.status || 'confirmed')}
                                  </Badge>
                                </div>
                              )}
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditAppointment(event.participants[0]);
                              }}
                              className="ml-4 hover:bg-white hover:shadow-sm"
                            >
                              {event.isSlotBased ? 'Gerir' : 'Ver Detalhes'}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-200"
                          onClick={() => handleNewBooking(timeSlot)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Horário disponível - Click para agendar
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Modern Week View
            <div className="overflow-x-auto">
              <div className="min-w-full">
                {/* Week header with days */}
                <div className="grid grid-cols-8 gap-px bg-gray-200">
                  <div className="bg-gray-50 p-4 text-sm font-medium text-gray-900">
                    Hora
                  </div>
                  {getWeekDays(getWeekStartDate(selectedDate)).map((day, index) => {
                    const isToday = isSameDay(day, new Date());
                    return (
                      <div 
                        key={index} 
                        className={cn(
                          "bg-white p-4 text-center border-b-2",
                          isToday ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        )}
                      >
                        <div className={cn(
                          "text-sm font-semibold",
                          isToday ? "text-blue-900" : "text-gray-900"
                        )}>
                          {day.toLocaleDateString('pt-PT', { weekday: 'short' })}
                        </div>
                        <div className={cn(
                          "text-lg font-bold mt-1",
                          isToday ? "text-blue-600" : "text-gray-700"
                        )}>
                          {day.getDate()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {day.toLocaleDateString('pt-PT', { month: 'short' })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Week grid with time slots */}
                <div className="grid grid-cols-8 gap-px bg-gray-200">
                  {timeSlots.map((timeSlot) => (
                    <React.Fragment key={timeSlot}>
                      <div className="bg-gray-50 p-3 text-xs font-medium text-gray-600 border-r border-gray-200">
                        {timeSlot}
                      </div>
                      {getWeekDays(getWeekStartDate(selectedDate)).map((day, dayIndex) => {
                        const isToday = isSameDay(day, new Date());
                        const isPast = day < startOfDay(new Date());
                        const appointment = getAppointmentForDayAndTime(day, timeSlot);
                        
                        return (
                          <div 
                            key={dayIndex} 
                            className={cn(
                              "bg-white min-h-[80px] p-2 cursor-pointer transition-all duration-200 hover:bg-blue-50 border-b border-gray-100",
                              isToday && "bg-blue-25",
                              isPast && "bg-gray-50"
                            )}
                            onClick={() => {
                              if (appointment) {
                                handleViewAppointment(appointment);
                              } else {
                                setSelectedDate(day);
                                setView('day');
                              }
                            }}
                          >
                            {isToday && (
                              <div className="text-xs text-blue-600 font-semibold mb-1">Hoje</div>
                            )}
                            {appointment ? (
                              <div className={cn(
                                "p-2 rounded-md text-xs font-medium",
                                getStatusColorWeek(appointment.status)
                              )}>
                                {appointment.clientName}
                              </div>
                            ) : (
                              <div className="text-xs text-gray-400 text-center mt-4">
                                Click para ver
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals remain the same */}
      {showViewModal && selectedAppointment && (
        <AppointmentDetailsModal
          isOpen={showViewModal}
          onClose={closeModals}
          appointment={{
            id: selectedAppointment.id,
            clientName: selectedAppointment.clientName,
            clientEmail: selectedAppointment.phone || '',
            clientId: '',
            serviceName: selectedAppointment.service,
            staffName: 'Staff',
            scheduledFor: selectedAppointment.startTime,
            duration: selectedAppointment.duration,
            status: selectedAppointment.status.toUpperCase(),
            notes: selectedAppointment.notes
          }}
          onNoteAdded={() => {
            closeModals();
            loadAppointments();
          }}
        />
      )}

      {showBookingModal && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          onBookingCreated={() => {
            setShowBookingModal(false);
            loadAppointments();
          }}
          businessSlug={businessSlug}
        />
      )}
    </div>
  );
} 