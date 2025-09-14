'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, isToday, isTomorrow, isThisWeek, isThisMonth, startOfDay, endOfDay, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatAppointmentTime, formatTimeOnly, formatDateOnly, formatRelativeDate, formatPortugueseDate, getPortugueseTime } from '@/lib/utils/date';
import { Loader2, Plus, X, Search, Filter, CalendarDays, User, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import BookingModal from '@/components/BookingModal';
import AppointmentDetailsModal from '@/components/AppointmentDetailsModal';

interface Appointment {
  id: string;
  client: {
    name: string;
    image?: string;
  };
  services: { name: string }[];
  scheduledFor: string;
  duration: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  staff?: {
    id: string;
    name: string;
  };
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
  participants: Appointment[];
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
}

interface StaffMember {
  id: string;
  name: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingCreated: () => void;
}

function getStatusLabel(status: Appointment['status']) {
  switch (status) {
    case 'PENDING':
      return 'Pendente';
    case 'ACCEPTED':
      return 'Aceite';
    case 'REJECTED':
      return 'Rejeitado';
    case 'COMPLETED':
      return 'Concluído';
    case 'CANCELLED':
      return 'Cancelado';
    default:
      return status;
  }
}

function getStatusColor(status: Appointment['status']) {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'ACCEPTED':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'REJECTED':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'COMPLETED':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'CANCELLED':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

const EventCard = React.memo(({ event, onStatusChange, updatingId, onClick }: {
  event: EventGroup;
  onStatusChange: (id: string, status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED') => void;
  updatingId: string | null;
  onClick?: (appointment: Appointment) => void;
}) => {
  
  const eventDate = new Date(event.startTime);
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onClick?.(event.participants[0])}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 mb-1">
            {event.serviceName}
            {event.isSlotBased && event.participants[0]?.slotInfo && (
              <span className="text-sm text-blue-600 ml-2">
                ({event.participants[0].slotInfo.startTime} - {event.participants[0].slotInfo.endTime})
              </span>
            )}
          </h3>
          
          {event.isSlotBased ? (
            <>
              <div className="text-sm text-blue-600 font-medium mb-2">
                {event.participants.length}{event.capacity ? `/${event.capacity}` : ''} participantes
              </div>
              <div className="space-y-1">
                {event.participants.map((participant, idx) => (
                  <div key={participant.id} className="flex items-center text-sm text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    {participant.client?.name}
                    <Badge className={cn(getStatusColor(participant.status), "text-xs ml-2")}>
                      {getStatusLabel(participant.status)}
                    </Badge>
                  </div>
                ))}
                {event.capacity && event.participants.length < event.capacity && (
                  <div className="text-gray-400 italic text-sm">
                    {event.capacity - event.participants.length} vagas disponíveis
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-gray-700 text-sm">
              {event.participants[0]?.client?.name}
            </div>
          )}
        </div>
        
        <div className="text-right ml-4">
          <div className="text-sm text-gray-600">
            {isToday(eventDate) ? (
              <span className="text-blue-600 font-medium">Hoje</span>
            ) : isTomorrow(eventDate) ? (
              <span className="text-blue-600 font-medium">Amanhã</span>
            ) : (
              formatPortugueseDate(eventDate, 'dd/MM')
            )}
          </div>
          <div className="text-xs text-gray-500">
            {event.isSlotBased && event.participants[0]?.slotInfo ? 
              `${event.participants[0].slotInfo.startTime} - ${event.participants[0].slotInfo.endTime}` : 
              formatTimeOnly(eventDate)
            }
          </div>
          <div className="text-xs text-gray-500 mt-1">{event.duration}min</div>
        </div>
      </div>
      
      {event.participants[0]?.staff && (
        <div className="text-sm text-gray-500 mb-2">
          Staff: {event.participants[0].staff.name}
        </div>
      )}
      
      {event.participants[0]?.notes && event.participants[0].notes.trim() !== "" && (
        <div className="mt-2 p-2 bg-blue-50 rounded-md">
          <p className="text-xs font-medium text-blue-800">Notas:</p>
          <p className="text-sm text-blue-700">{event.participants[0].notes}</p>
        </div>
      )}
      
      {!event.isSlotBased && (
        <div className="mt-3 pt-3 border-t">
          <Badge className={cn(getStatusColor(event.status), "text-xs")}>
            {getStatusLabel(event.status)}
          </Badge>
        </div>
      )}
    </div>
  );
});

EventCard.displayName = 'EventCard';

interface RecentAppointmentsProps {
  businessSlug?: string | null;
  refreshStats?: () => Promise<void>;
}

export default function RecentAppointments({ businessSlug, refreshStats }: RecentAppointmentsProps = {}) {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [eventGroups, setEventGroups] = useState<EventGroup[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showAppointmentDetailsModal, setShowAppointmentDetailsModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all'); // Changed from 'upcoming' to 'all' for debugging
  const [staffFilter, setStaffFilter] = useState('all');
  const [sortBy, setSortBy] = useState('upcoming');
  const [showFilters, setShowFilters] = useState(false);

  // Group appointments into events (for slot-based services)
  const groupAppointmentsIntoEvents = useCallback((appointments: Appointment[]): EventGroup[] => {
    console.log('🔄 Grouping appointments:', appointments.length);
    const groups: { [key: string]: EventGroup } = {};
    
    appointments.forEach(apt => {
      console.log('📋 Processing appointment:', {
        id: apt.id,
        client: apt.client?.name,
        service: apt.services[0]?.name,
        slotInfo: apt.slotInfo,
        scheduledFor: apt.scheduledFor
      });
      
      let groupKey: string;
      
      if (apt.slotInfo) {
        // Slot-based service: group by service + slot + date
        const appointmentDate = new Date(apt.scheduledFor).toISOString().split('T')[0];
        groupKey = `${apt.services[0]?.name}_${appointmentDate}_${apt.slotInfo.startTime}_${apt.slotInfo.endTime}_${apt.slotInfo.slotIndex}`;
        console.log('🎯 Slot-based grouping key:', groupKey);
      } else {
        // Traditional service: each appointment is its own event
        groupKey = apt.id;
        console.log('📅 Traditional grouping key:', groupKey);
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = {
          id: groupKey,
          serviceName: apt.services[0]?.name || 'Serviço Desconhecido',
          startTime: apt.slotInfo ? apt.scheduledFor : apt.scheduledFor, // Use full date for both slot-based and traditional
          endTime: apt.slotInfo ? new Date(new Date(apt.scheduledFor).getTime() + apt.duration * 60000).toISOString() : new Date(new Date(apt.scheduledFor).getTime() + apt.duration * 60000).toISOString(),
          duration: apt.duration,
          isSlotBased: !!apt.slotInfo,
          capacity: apt.slotInfo?.capacity,
          participants: [],
          status: apt.status
        };
        console.log('✨ Created new group:', groups[groupKey]);
      }
      
      groups[groupKey].participants.push(apt);
      console.log('👥 Added participant to group:', groupKey, 'Total participants:', groups[groupKey].participants.length);
      
      // Update group status to worst case (CANCELLED > REJECTED > PENDING > ACCEPTED > COMPLETED)
      const statusPriority = { 'CANCELLED': 5, 'REJECTED': 4, 'PENDING': 3, 'ACCEPTED': 2, 'COMPLETED': 1 };
      if (statusPriority[apt.status] > statusPriority[groups[groupKey].status]) {
        groups[groupKey].status = apt.status;
      }
    });
    
    const result = Object.values(groups);
    console.log('🎯 Final event groups:', result.length, result);
    return result;
  }, []);

  // Functions for appointment details modal
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetailsModal(true);
  };

  const closeAppointmentDetailsModal = () => {
    setShowAppointmentDetailsModal(false);
    setSelectedAppointment(null);
  };

  const handleNoteAdded = () => {
    closeAppointmentDetailsModal();
    // Reload appointments to reflect changes
    fetchData();
  };

  // Fetch appointments and staff from API
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      console.log('📅 RecentAppointments: Fetching appointments and staff...');
      
      // Fetch both appointments and staff members
      const [appointmentsResponse, staffResponse] = await Promise.all([
        fetch(`/api/business/appointments?t=${Date.now()}`, { 
          credentials: 'include',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        }),
        fetch(`/api/business/staff?t=${Date.now()}`, {
          credentials: 'include',
          cache: 'no-store'
        })
      ]);
      
      console.log('📅 RecentAppointments: Response status:', appointmentsResponse.status, staffResponse.status);
      
      if (appointmentsResponse.ok) {
        const data = await appointmentsResponse.json();
        const appointmentsArray = data?.data?.appointments || [];
        
        console.log('📅 RecentAppointments: Received appointments:', appointmentsArray.length);
        
        const formattedAppointments: Appointment[] = appointmentsArray.map((apt: any) => ({
          id: apt.id,
          client: {
            name: apt.client?.name || 'Cliente sem nome',
            image: apt.client?.image
          },
          services: apt.services || [],
          scheduledFor: apt.scheduledFor,
          duration: apt.duration || 60,
          status: apt.status?.toLowerCase() === 'pending' ? 'PENDING' : 
                 apt.status?.toLowerCase() === 'accepted' ? 'ACCEPTED' :
                 apt.status?.toLowerCase() === 'confirmed' ? 'ACCEPTED' : // Map CONFIRMED to ACCEPTED for UI
                 apt.status?.toLowerCase() === 'rejected' ? 'REJECTED' :
                 apt.status?.toLowerCase() === 'completed' ? 'COMPLETED' : 
                 apt.status?.toLowerCase() === 'cancelled' ? 'CANCELLED' : 'PENDING',
          notes: apt.notes,
          staff: apt.staff ? {
            id: apt.staff.id,
            name: apt.staff.name
          } : undefined,
          slotInfo: apt.slotInfo // Add slotInfo to the appointment object
        }));
        
        setAppointments(formattedAppointments);
        setEventGroups(groupAppointmentsIntoEvents(formattedAppointments));
      } else {
        console.error('❌ RecentAppointments: Failed to fetch appointments:', appointmentsResponse.status);
        setAppointments([]);
        setEventGroups([]);
      }

      if (staffResponse.ok) {
        const staffData = await staffResponse.json();
        if (staffData.success && staffData.data) {
          setStaffMembers(staffData.data);
        }
      }
    } catch (error) {
      console.error('❌ RecentAppointments: Error fetching data:', error);
      setAppointments([]);
      setEventGroups([]);
    } finally {
      setLoading(false);
    }
  }, [businessSlug, groupAppointmentsIntoEvents]);

  // Fetch appointments and staff from API
  useEffect(() => {
    fetchData();
    
    // Set up periodic refresh to catch new appointments created from customer portal
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing appointments and stats...');
      fetchData();
      refreshStats?.(); // Also refresh dashboard stats
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [businessSlug, fetchData, refreshStats]);

  // Enhanced filtering and sorting logic
  const filteredAndSortedAppointments = useMemo(() => {
    let filtered = eventGroups.filter(group => {
      const groupDate = new Date(group.startTime);
      const now = new Date();
      
      // Search filter
      const matchesSearch = 
        group.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.participants.some(apt => apt.client?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        group.participants.some(apt => apt.staff?.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || group.status === statusFilter;
      
      // Staff filter
      const matchesStaff = staffFilter === 'all' || group.participants.some(apt => apt.staff?.id === staffFilter);
      
      // Date filter
      let matchesDate = true;
      switch (dateFilter) {
        case 'today':
          matchesDate = isToday(groupDate);
          break;
        case 'tomorrow':
          matchesDate = isTomorrow(groupDate);
          break;
        case 'upcoming':
          matchesDate = groupDate >= startOfDay(now);
          break;
        case 'past':
          matchesDate = groupDate < startOfDay(now);
          break;
        case 'this-week':
          matchesDate = isThisWeek(groupDate, { locale: ptBR });
          break;
        case 'this-month':
          matchesDate = isThisMonth(groupDate);
          break;
        case 'next-7-days':
          const next7Days = addDays(now, 7);
          matchesDate = groupDate >= startOfDay(now) && groupDate <= endOfDay(next7Days);
          break;
        case 'all':
        default:
          matchesDate = true;
      }
      
      return matchesSearch && matchesStatus && matchesStaff && matchesDate;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      const dateA = new Date(a.startTime);
      const dateB = new Date(b.startTime);
      const now = new Date();
      
      switch (sortBy) {
        case 'upcoming':
          // Show upcoming appointments first, then sort by date
          const aIsUpcoming = dateA >= now;
          const bIsUpcoming = dateB >= now;
          if (aIsUpcoming && !bIsUpcoming) return -1;
          if (!aIsUpcoming && bIsUpcoming) return 1;
          return dateA.getTime() - dateB.getTime();
          
        case 'date-asc':
          return dateA.getTime() - dateB.getTime();
          
        case 'date-desc':
          return dateB.getTime() - dateA.getTime();
          
        case 'client':
          const nameA = a.participants[0]?.client?.name || '';
          const nameB = b.participants[0]?.client?.name || '';
          return nameA.localeCompare(nameB);
          
        default:
          return dateA.getTime() - dateB.getTime();
      }
    });

    return filtered;
  }, [eventGroups, searchTerm, statusFilter, dateFilter, staffFilter, sortBy]);

  const handleStatusChange = useCallback(async (id: string, newStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED') => {
    setUpdatingId(id);
    try {
      // Find if this is a group ID or individual appointment ID
      const targetGroup = eventGroups.find(g => g.id === id);
      const targetAppointment = appointments.find(a => a.id === id);
      
      if (targetGroup && targetGroup.participants.length > 0) {
        // This is a group ID - update all participants in the group
        console.log('🎯 Updating group:', id, 'with', targetGroup.participants.length, 'participants');
        
        // Update all participants via API
        const updatePromises = targetGroup.participants.map(participant => 
          fetch(`/api/business/appointments/${participant.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ status: newStatus }),
          })
        );
        
        const results = await Promise.all(updatePromises);
        const failedUpdates = results.filter(res => !res.ok);
        
        if (failedUpdates.length > 0) {
          throw new Error(`Failed to update ${failedUpdates.length} appointments`);
        }
        
        // Update local state for all participants
        setAppointments(prev => prev.map(a => {
          const isParticipant = targetGroup.participants.some(p => p.id === a.id);
          return isParticipant ? { ...a, status: newStatus } : a;
        }));
        
        // Update the group
        setEventGroups(prev => prev.map(g => {
          if (g.id === id) {
            const updatedParticipants = g.participants.map(p => ({ ...p, status: newStatus }));
            return { ...g, status: newStatus, participants: updatedParticipants };
          }
          return g;
        }));
        
      } else if (targetAppointment) {
        // This is an individual appointment ID
        console.log('🎯 Updating individual appointment:', id);
        
        const res = await fetch(`/api/business/appointments/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ status: newStatus }),
        });
        
        if (!res.ok) throw new Error('Failed to update status');
        
        // Update appointments array
        setAppointments(prev => prev.map(a => 
          a.id === id ? { ...a, status: newStatus } : a
        ));
        
        // Update event groups - find groups containing this appointment
        setEventGroups(prev => prev.map(g => {
          const hasParticipant = g.participants.some(p => p.id === id);
          if (hasParticipant) {
            const updatedParticipants = g.participants.map(p => 
              p.id === id ? { ...p, status: newStatus } : p
            );
            return { ...g, status: newStatus, participants: updatedParticipants };
          }
          return g;
        }));
      } else {
        throw new Error('Appointment or group not found');
      }
      
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Falha ao atualizar status');
    } finally {
      setUpdatingId(null);
    }
  }, [eventGroups, appointments]);

  function handleCreateAppointment() {
    setShowBookingModal(true);
  }

  function handleBookingCreated() {
    // Refresh the appointments list
    const fetchAppointmentsAsync = async () => {
      setLoading(true);
      try {
        console.log('📅 RecentAppointments: Refreshing appointments after booking created...');
        
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
        
        if (response.ok) {
          const data = await response.json();
          const appointmentsArray = data?.data?.appointments || [];
          
          const formattedAppointments: Appointment[] = appointmentsArray.map((apt: any) => ({
            id: apt.id,
            client: {
              name: apt.client?.name || 'Cliente sem nome',
              image: apt.client?.image
            },
            services: apt.services || [],
            scheduledFor: apt.scheduledFor,
            duration: apt.duration || 60,
            status: apt.status?.toLowerCase() === 'pending' ? 'PENDING' : 
                   apt.status?.toLowerCase() === 'accepted' ? 'ACCEPTED' :
                   apt.status?.toLowerCase() === 'confirmed' ? 'ACCEPTED' : // Map CONFIRMED to ACCEPTED for UI
                   apt.status?.toLowerCase() === 'rejected' ? 'REJECTED' :
                   apt.status?.toLowerCase() === 'completed' ? 'COMPLETED' : 
                   apt.status?.toLowerCase() === 'cancelled' ? 'CANCELLED' : 'PENDING',
            notes: apt.notes,
            staff: apt.staff ? {
              id: apt.staff.id,
              name: apt.staff.name
            } : undefined,
            slotInfo: apt.slotInfo // Add slotInfo to the appointment object
          }));
          
          setAppointments(formattedAppointments);
          setEventGroups(groupAppointmentsIntoEvents(formattedAppointments));
        }
      } catch (error) {
        console.error('❌ RecentAppointments: Error refreshing appointments:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointmentsAsync();
    refreshStats?.(); // Call refreshStats if provided
  }

  const getStatsForFilter = () => {
    const now = new Date();
    const today = appointments.filter(a => isToday(new Date(a.scheduledFor)));
    const upcoming = appointments.filter(a => new Date(a.scheduledFor) >= startOfDay(now));
    
    return {
      total: appointments.length,
      today: today.length,
      upcoming: upcoming.length,
      pending: appointments.filter(a => a.status === 'PENDING').length,
      accepted: appointments.filter(a => a.status === 'ACCEPTED').length,
      completed: appointments.filter(a => a.status === 'COMPLETED').length
    };
  };

  const stats = getStatsForFilter();

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-full border-2 border-gray-200">
        {/* Header with title and controls */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 sm:gap-0 mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Agendamentos Recentes</h2>
          
          <div className="flex gap-2">
            {/* Toggle Filters Button */}
            <Button 
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="hidden sm:flex"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            
            {/* Desktop CTA */}
            <Button 
              onClick={handleCreateAppointment} 
              className="hidden sm:flex bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 border-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="text-sm">Novo Agendamento</span>
            </Button>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
            <div className="space-y-4">
              {/* Top row - Search and main filters */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Procurar por cliente, serviço ou staff..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[200px]">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">🔜 Próximos</SelectItem>
                    <SelectItem value="today">📅 Hoje</SelectItem>
                    <SelectItem value="tomorrow">➡️ Amanhã</SelectItem>
                    <SelectItem value="next-7-days">📊 Próximos 7 dias</SelectItem>
                    <SelectItem value="this-week">📅 Esta semana</SelectItem>
                    <SelectItem value="this-month">📅 Este mês</SelectItem>
                    <SelectItem value="past">⬅️ Passados</SelectItem>
                    <SelectItem value="all">🔍 Todos</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="PENDING">Pendente</SelectItem>
                    <SelectItem value="ACCEPTED">Aceite</SelectItem>
                    <SelectItem value="COMPLETED">Concluído</SelectItem>
                    <SelectItem value="CANCELLED">Cancelado</SelectItem>
                    <SelectItem value="REJECTED">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bottom row - Staff and sorting */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={staffFilter} onValueChange={setStaffFilter}>
                  <SelectTrigger className="w-[200px]">
                    <User className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Staff" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os staff</SelectItem>
                    {staffMembers.map(staff => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[200px]">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">🔜 Próximos primeiro</SelectItem>
                    <SelectItem value="date-asc">📅 Data (mais cedo)</SelectItem>
                    <SelectItem value="date-desc">📅 Data (mais tarde)</SelectItem>
                    <SelectItem value="client">👤 Nome do cliente</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex-1" />
                
                <div className="text-sm text-gray-600 flex items-center">
                  <Filter className="h-4 w-4 mr-1" />
                  {filteredAndSortedAppointments.length} de {appointments.length} agendamentos
                </div>
              </div>

              {/* Quick Stats - Simplified to 3 most important */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-3 bg-white rounded-lg border shadow-sm">
                  <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
                  <div className="text-sm text-gray-500">Próximos</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border shadow-sm">
                  <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                  <div className="text-sm text-gray-500">Pendentes</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="sm:hidden space-y-4">
              {filteredAndSortedAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' || staffFilter !== 'all' 
                    ? 'Nenhum agendamento encontrado com os filtros atuais.' 
                    : 'Nenhum agendamento encontrado.'
                  }
                </div>
              ) : (
                filteredAndSortedAppointments.map((group) => (
                  <EventCard
                    key={group.id}
                    event={group}
                    onStatusChange={handleStatusChange}
                    updatingId={updatingId}
                    onClick={handleAppointmentClick}
                  />
                ))
              )}
            </div>
            
            {/* Desktop Table View */}
            <div className="hidden sm:block w-full">
              <div className="w-full">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="border-b">
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase w-[25%]">Serviço</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase w-[30%]">Clientes</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase w-[20%]">Data</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase w-[10%]">Dur.</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase w-[15%]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedAppointments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-gray-500">
                          {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' || staffFilter !== 'all' 
                            ? 'Nenhum agendamento encontrado com os filtros atuais.' 
                            : 'Nenhum agendamento encontrado.'
                          }
                        </td>
                      </tr>
                    ) : (
                      filteredAndSortedAppointments.map((group) => {
                        const groupDate = new Date(group.startTime);
                        const isUpcoming = groupDate >= new Date();
                        
                        return (
                          <tr 
                            key={group.id} 
                            className={`border-b last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer ${
                              isUpcoming ? 'bg-blue-50/30' : ''
                            }`}
                            onClick={() => handleAppointmentClick(group.participants[0])}
                          >
                            <td className="px-3 py-3 text-sm">
                              <div className="font-medium text-gray-900 truncate">{group.serviceName}</div>
                              {group.participants[0]?.staff && (
                                <div className="text-xs text-gray-500 truncate">
                                  por {group.participants[0].staff.name}
                                </div>
                              )}
                            </td>
                            <td className="px-3 py-3 text-sm">
                              {group.isSlotBased ? (
                                <div>
                                  <div className="text-xs font-medium text-blue-600 mb-1">
                                    👥 {group.participants.length}{group.capacity ? `/${group.capacity}` : ''} pessoas
                                  </div>
                                  <div className="space-y-0.5">
                                    {group.participants.slice(0, 3).map((participant, idx) => (
                                      <div key={participant.id} className="text-xs text-gray-700 truncate">
                                        • {participant.client?.name}
                                      </div>
                                    ))}
                                    {group.participants.length > 3 && (
                                      <div className="text-xs text-gray-400">
                                        +{group.participants.length - 3} mais...
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="text-sm font-medium text-gray-900 truncate">
                                    {group.participants[0]?.client?.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    👤 Individual
                                  </div>
                                </div>
                              )}
                            </td>
                            <td className="px-3 py-3 text-sm">
                              <div className="text-sm font-medium text-gray-900">
                                {isToday(groupDate) ? (
                                  <span className="text-blue-600">Hoje</span>
                                ) : isTomorrow(groupDate) ? (
                                  <span className="text-blue-600">Amanhã</span>
                                ) : (
                                  formatPortugueseDate(groupDate, 'dd/MM/yy')
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatTimeOnly(groupDate)}
                              </div>
                            </td>
                            <td className="px-3 py-3 text-sm text-gray-600 font-medium">
                              {group.duration}min
                            </td>
                            <td className="px-3 py-3">
                              <Badge className={cn(getStatusColor(group.status), "text-xs font-medium")}>
                                {getStatusLabel(group.status)}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal 
        isOpen={showBookingModal} 
        onClose={() => setShowBookingModal(false)} 
        onBookingCreated={handleBookingCreated}
      />

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <AppointmentDetailsModal
          isOpen={showAppointmentDetailsModal}
          onClose={closeAppointmentDetailsModal}
          appointment={{
            id: selectedAppointment.id,
            clientName: selectedAppointment.client.name,
            clientEmail: '', // Not available in this data structure
            clientId: '', // Not available in this data structure
            serviceName: selectedAppointment.services?.[0]?.name || 'Serviço Desconhecido',
            staffName: selectedAppointment.staff?.name || 'Staff',
            scheduledFor: selectedAppointment.scheduledFor,
            duration: selectedAppointment.duration,
            status: selectedAppointment.status,
            notes: selectedAppointment.notes
          }}
          onNoteAdded={handleNoteAdded}
        />
      )}

      {/* Mobile Floating Action Button */}
      {!showBookingModal && (
        <div className="fixed bottom-6 right-6 sm:hidden z-50">
          <Button
            onClick={handleCreateAppointment}
            className="w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full shadow-2xl hover:shadow-xl transform hover:scale-110 transition-all duration-300 border-0 flex items-center justify-center"
            aria-label="Criar novo agendamento"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      )}
    </>
  );
}
