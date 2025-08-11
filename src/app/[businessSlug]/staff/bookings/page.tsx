"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Plus, Search, Filter, SortAsc, User, CalendarDays, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { format, isToday, isTomorrow, isThisWeek, isThisMonth, startOfDay, endOfDay, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AppointmentDetailsModal from '@/components/AppointmentDetailsModal';

interface Booking {
  id: string;
  client: {
    id: string;
    name: string;
    email?: string;
  } | null;
  scheduledFor: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'ACCEPTED' | 'REJECTED';
  duration: number;
  notes?: string;
  staff: {
    id: string;
    name: string;
  } | null;
  services: {
    id: string;
    name: string;
  }[];
}

interface StaffMember {
  id: string;
  name: string;
}

export default function StaffBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const businessSlug = user?.businessSlug;
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('upcoming');
  const [staffFilter, setStaffFilter] = useState('all');
  const [sortBy, setSortBy] = useState('upcoming'); // upcoming, date-asc, date-desc, client
  
  // View states
  const [viewMode, setViewMode] = useState('list');
  
  // Modal states for appointment details
  const [selectedAppointment, setSelectedAppointment] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [filteredStaff, setFilteredStaff] = useState<StaffMember[]>([]);

  useEffect(() => {
    if (authLoading) return;
    
    if (!businessSlug) {
      setError('Business information not available. Please try logging in again.');
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        setError('');
        
        console.log('🔧 DEBUG: Fetching appointments and staff...');
        
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
        
        console.log('🔧 DEBUG: Fetch response status:', appointmentsResponse.status, staffResponse.status);
        
        if (appointmentsResponse.ok) {
          const appointmentsData = await appointmentsResponse.json();
          console.log('🔧 DEBUG: Appointments data:', appointmentsData);
          
          if (appointmentsData.success && appointmentsData.data.appointments) {
            setAppointments(appointmentsData.data.appointments);
          } else {
            setError(appointmentsData.error || 'Failed to load bookings');
          }
        } else {
          setError('Failed to load bookings');
        }

        if (staffResponse.ok) {
          const staffData = await staffResponse.json();
          if (staffData.success && staffData.data) {
            setStaffMembers(staffData.data);
          }
        }
      } catch (err) {
        console.error('🔧 DEBUG: Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [authLoading, businessSlug]);

  // Functions to handle appointment details modal
  const handleAppointmentClick = (booking: Booking) => {
    setSelectedAppointment(booking);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedAppointment(null);
  };

  const handleNoteAdded = () => {
    closeDetailsModal();
    // Optionally reload appointments to reflect any changes
    // fetchAppointments();
  };

  // Enhanced filtering and sorting logic
  const filteredAndSortedBookings = useMemo(() => {
    let filtered = appointments.filter(booking => {
      const bookingDate = new Date(booking.scheduledFor);
      const now = new Date();
      
      // Search filter
      const matchesSearch = 
        booking.client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.services.some(service => service.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        booking.staff?.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      
      // Staff filter
      const matchesStaff = staffFilter === 'all' || booking.staff?.id === staffFilter;
      
      // Date filter
      let matchesDate = true;
      switch (dateFilter) {
        case 'today':
          matchesDate = isToday(bookingDate);
          break;
        case 'tomorrow':
          matchesDate = isTomorrow(bookingDate);
          break;
        case 'upcoming':
          matchesDate = bookingDate >= startOfDay(now);
          break;
        case 'past':
          matchesDate = bookingDate < startOfDay(now);
          break;
        case 'this-week':
          matchesDate = isThisWeek(bookingDate, { locale: ptBR });
          break;
        case 'this-month':
          matchesDate = isThisMonth(bookingDate);
          break;
        case 'next-7-days':
          const next7Days = addDays(now, 7);
          matchesDate = bookingDate >= startOfDay(now) && bookingDate <= endOfDay(next7Days);
          break;
        case 'all':
        default:
          matchesDate = true;
      }
      
      return matchesSearch && matchesStatus && matchesStaff && matchesDate;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      const dateA = new Date(a.scheduledFor);
      const dateB = new Date(b.scheduledFor);
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
          const nameA = a.client?.name || '';
          const nameB = b.client?.name || '';
          return nameA.localeCompare(nameB);
          
        default:
          return dateA.getTime() - dateB.getTime();
      }
    });

    return filtered;
  }, [appointments, searchTerm, statusFilter, dateFilter, staffFilter, sortBy]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': 
      case 'ACCEPTED': 
        return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': 
      case 'REJECTED': 
        return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED': 
      case 'ACCEPTED': 
        return 'Confirmado';
      case 'PENDING': return 'Pendente';
      case 'COMPLETED': return 'Concluído';
      case 'CANCELLED': return 'Cancelado';
      case 'REJECTED': return 'Rejeitado';
      default: return status;
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const dateStr = format(date, 'dd/MM/yyyy', { locale: ptBR });
    const timeStr = format(date, 'HH:mm');
    const dayStr = format(date, 'EEEE', { locale: ptBR });
    
    // Add relative time indicators
    let relativeStr = '';
    if (isToday(date)) relativeStr = 'Hoje';
    else if (isTomorrow(date)) relativeStr = 'Amanhã';
    
    return { dateStr, timeStr, dayStr, relativeStr };
  };

  const getStatsForFilter = () => {
    const now = new Date();
    const today = appointments.filter(a => isToday(new Date(a.scheduledFor)));
    const upcoming = appointments.filter(a => new Date(a.scheduledFor) >= startOfDay(now));
    const thisWeek = appointments.filter(a => isThisWeek(new Date(a.scheduledFor), { locale: ptBR }));
    
    return {
      total: appointments.length,
      today: today.length,
      upcoming: upcoming.length,
      thisWeek: thisWeek.length,
      pending: appointments.filter(a => a.status === 'PENDING').length,
      confirmed: appointments.filter(a => ['CONFIRMED', 'ACCEPTED'].includes(a.status)).length,
      completed: appointments.filter(a => a.status === 'COMPLETED').length
    };
  };

  const stats = getStatsForFilter();

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agendamentos</h1>
          <p className="text-gray-600 mt-1">Gerir agendamentos e reservas</p>
        </div>
        <Link href={`/${businessSlug}/staff/schedule`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Agendamento
          </Button>
        </Link>
      </div>

      {/* Enhanced Filters */}
      <Card>
        <CardContent className="pt-6">
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
                  <SelectItem value="CONFIRMED">Confirmado</SelectItem>
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
                {filteredAndSortedBookings.length} de {appointments.length} agendamentos
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.today}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcoming}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle>Agendamentos</CardTitle>
          <CardDescription>
            {filteredAndSortedBookings.length} agendamento{filteredAndSortedBookings.length !== 1 ? 's' : ''} 
            {dateFilter !== 'all' && ` - ${
              dateFilter === 'upcoming' ? 'Próximos' :
              dateFilter === 'today' ? 'Hoje' :
              dateFilter === 'tomorrow' ? 'Amanhã' :
              dateFilter === 'this-week' ? 'Esta semana' :
              dateFilter === 'this-month' ? 'Este mês' :
              dateFilter === 'past' ? 'Passados' :
              'Período selecionado'
            }`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAndSortedBookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum agendamento encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' || staffFilter !== 'all' 
                  ? 'Tente ajustar os filtros.' 
                  : 'Comece criando o primeiro agendamento.'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && dateFilter === 'all' && staffFilter === 'all' && (
                <div className="mt-6">
                  <Link href={`/${businessSlug}/staff/schedule`}>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Agendamento
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedBookings.map((booking) => {
                const { dateStr, timeStr, dayStr, relativeStr } = formatDateTime(booking.scheduledFor);
                const bookingDate = new Date(booking.scheduledFor);
                const isUpcoming = bookingDate >= new Date();
                
                return (
                  <div 
                    key={booking.id} 
                    className={`flex items-center justify-between p-4 border rounded-lg transition-colors cursor-pointer hover:shadow-md ${
                      isUpcoming ? 'bg-blue-50/30 border-blue-200 hover:bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => handleAppointmentClick(booking)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isUpcoming ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <Calendar className={`h-5 w-5 ${isUpcoming ? 'text-blue-600' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {booking.client?.name || 'Cliente Desconhecido'}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {relativeStr ? (
                              <span className="font-medium text-blue-600">{relativeStr}</span>
                            ) : (
                              <span>{dayStr}, {dateStr}</span>
                            )}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {timeStr}
                          </div>
                          {booking.services.length > 0 && (
                            <div>
                              {booking.services[0].name}
                            </div>
                          )}
                        </div>
                        {booking.staff && (
                          <div className="text-sm text-gray-500">
                            Staff: {booking.staff.name}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(booking.status)}>
                        {getStatusText(booking.status)}
                      </Badge>
                      <div className="text-sm text-gray-500">
                        {booking.duration}min
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <AppointmentDetailsModal
          isOpen={showDetailsModal}
          onClose={closeDetailsModal}
          appointment={{
            id: selectedAppointment.id,
            clientName: selectedAppointment.client?.name || 'Cliente Desconhecido',
            clientEmail: selectedAppointment.client?.email || '',
            clientId: selectedAppointment.client?.id || '',
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

      {/* Floating Action Button - Mobile */}
      <Link href={`/${businessSlug}/staff/schedule`}>
        <Button 
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 md:hidden z-40"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  );
} 