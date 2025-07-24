'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, isToday, isTomorrow, isThisWeek, isThisMonth, startOfDay, endOfDay, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2, Plus, X, Search, Filter, CalendarDays, User, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

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

function BookingModal({ isOpen, onClose, onBookingCreated }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [clients, setClients] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form state
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clientSearch, setClientSearch] = useState("");
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "", notes: "" });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (isOpen && step === 1) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const timestamp = Date.now();
      
      const [clientsRes, staffRes] = await Promise.all([
        fetch(`/api/staff/clients?t=${timestamp}`, {
          credentials: 'include',
          cache: 'no-store'
        }),
        fetch(`/api/business/staff?t=${timestamp}`, {
          credentials: 'include',
          cache: 'no-store'
        })
      ]);
      
      if (clientsRes.ok) {
        const clientsData = await clientsRes.json();
        setClients(clientsData.data || []);
      }
      
      if (staffRes.ok) {
        const staffData = await staffRes.json();
        setStaffList(staffData.data || []);
      }

      // Try to load services
      try {
        const servicesRes = await fetch(`/api/services?t=${timestamp}`, {
          credentials: 'include',
          cache: 'no-store'
        });
        
        if (servicesRes.ok) {
          const servicesData = await servicesRes.json();
          setServices(servicesData.data || []);
        }
      } catch (error) {
        setServices([]);
      }
    } catch (error) {
      console.error('❌ BookingModal: Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = async () => {
    if (!selectedClient || !selectedServices.length || !selectedStaff || !selectedDate || !selectedTime) {
      return;
    }

    setSaving(true);
    setErrorMessage("");
    
    try {
      const response = await fetch('/api/business/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          clientId: selectedClient.id,
          serviceIds: selectedServices,
          staffId: selectedStaff,
          scheduledFor: `${selectedDate}T${selectedTime}:00`,
          notes: notes,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        onBookingCreated();
        handleClose();
      } else {
        const errorMsg = result.error?.message || `Erro ${response.status}: ${response.statusText}`;
        setErrorMessage(errorMsg);
      }
    } catch (error) {
      setErrorMessage('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedClient(null);
    setClientSearch("");
    setShowAddClient(false);
    setNewClient({ name: "", email: "", phone: "", notes: "" });
    setSelectedServices([]);
    setSelectedStaff("");
    setSelectedDate("");
    setSelectedTime("");
    setNotes("");
    setErrorMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Novo Agendamento</h2>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Client Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Cliente *</label>
              <div className="relative">
                <Input
                  placeholder="Procurar cliente..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                />
                {clientSearch && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto">
                    {clients
                      .filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()))
                      .map(client => (
                        <div
                          key={client.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSelectedClient(client);
                            setClientSearch(client.name);
                          }}
                        >
                          {client.name} - {client.email}
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
              {selectedClient && (
                <p className="text-sm text-green-600 mt-1">✓ {selectedClient.name}</p>
              )}
            </div>

            {/* Staff Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Funcionário *</label>
              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar funcionário" />
                </SelectTrigger>
                <SelectContent>
                  {staffList.map(staff => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Service Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Serviço *</label>
              <Select 
                value={selectedServices[0] || ""} 
                onValueChange={(value) => setSelectedServices(value ? [value] : [])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar serviço" />
                </SelectTrigger>
                <SelectContent>
                  {services.map(service => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Data *</label>
              <Input
                type="date"
                value={selectedDate}
                min={format(new Date(), 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Hora *</label>
              <Input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-2">Notas</label>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notas adicionais..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={saving || !selectedClient || !selectedStaff || !selectedDate || !selectedTime}
            >
              {saving ? 'Criando...' : 'Criar Agendamento'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
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

const AppointmentCard = React.memo(({ apt, onStatusChange, updatingId }: {
  apt: Appointment;
  onStatusChange: (id: string, status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED') => void;
  updatingId: string | null;
}) => {
  
  // Get available next statuses based on current status
  const availableStatuses = useMemo(() => {
    const statusOptions = [
      { value: 'PENDING', label: 'Pendente' },
      { value: 'ACCEPTED', label: 'Aceite' },
      { value: 'REJECTED', label: 'Rejeitado' },
      { value: 'COMPLETED', label: 'Concluído' },
      { value: 'CANCELLED', label: 'Cancelado' }
    ];

    return statusOptions;
  }, [apt.status]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-2 gap-2">
        <h3 className="font-bold text-lg text-gray-900 break-words overflow-hidden flex-1 min-w-0">
          {apt.client.name}
        </h3>
        <Badge className={cn(getStatusColor(apt.status), "text-xs whitespace-nowrap flex-shrink-0")}>
          {getStatusLabel(apt.status)}
        </Badge>
      </div>
      <div className="text-gray-700 break-words overflow-hidden">{apt.services?.[0]?.name}</div>
      <div className="text-sm text-gray-500 mt-1">{format(new Date(apt.scheduledFor), 'PP p', { locale: ptBR })}</div>
      <div className="text-sm text-gray-500">{apt.duration} min</div>
      {apt.staff && (
        <div className="text-sm text-gray-500">Staff: {apt.staff.name}</div>
      )}
      {apt.notes && apt.notes.trim() !== "" && (
        <div className="mt-2 p-2 bg-blue-50 rounded-md">
          <p className="text-xs font-medium text-blue-800">Notas:</p>
          <p className="text-sm text-blue-700 break-words overflow-hidden">{apt.notes}</p>
        </div>
      )}
      <div className="mt-4">
        <select
          className="w-full border rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          value={apt.status}
          disabled={updatingId === apt.id || availableStatuses.length === 1}
          onChange={e => onStatusChange(apt.id, e.target.value as 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED')}
        >
          {availableStatuses.map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
});
AppointmentCard.displayName = 'AppointmentCard';

interface RecentAppointmentsProps {
  businessSlug?: string | null;
}

export default function RecentAppointments({ businessSlug }: RecentAppointmentsProps = {}) {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('upcoming');
  const [staffFilter, setStaffFilter] = useState('all');
  const [sortBy, setSortBy] = useState('upcoming');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch appointments and staff from API
  useEffect(() => {
    async function fetchData() {
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
                   apt.status?.toLowerCase() === 'rejected' ? 'REJECTED' :
                   apt.status?.toLowerCase() === 'completed' ? 'COMPLETED' : 
                   apt.status?.toLowerCase() === 'cancelled' ? 'CANCELLED' : 'PENDING',
            notes: apt.notes,
            staff: apt.staff ? {
              id: apt.staff.id,
              name: apt.staff.name
            } : undefined
          }));
          
          setAppointments(formattedAppointments);
        } else {
          console.error('❌ RecentAppointments: Failed to fetch appointments:', appointmentsResponse.status);
          setAppointments([]);
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
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [businessSlug]);

  // Enhanced filtering and sorting logic
  const filteredAndSortedAppointments = useMemo(() => {
    let filtered = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.scheduledFor);
      const now = new Date();
      
      // Search filter
      const matchesSearch = 
        appointment.client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.services.some(service => service.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        appointment.staff?.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
      
      // Staff filter
      const matchesStaff = staffFilter === 'all' || appointment.staff?.id === staffFilter;
      
      // Date filter
      let matchesDate = true;
      switch (dateFilter) {
        case 'today':
          matchesDate = isToday(appointmentDate);
          break;
        case 'tomorrow':
          matchesDate = isTomorrow(appointmentDate);
          break;
        case 'upcoming':
          matchesDate = appointmentDate >= startOfDay(now);
          break;
        case 'past':
          matchesDate = appointmentDate < startOfDay(now);
          break;
        case 'this-week':
          matchesDate = isThisWeek(appointmentDate, { locale: ptBR });
          break;
        case 'this-month':
          matchesDate = isThisMonth(appointmentDate);
          break;
        case 'next-7-days':
          const next7Days = addDays(now, 7);
          matchesDate = appointmentDate >= startOfDay(now) && appointmentDate <= endOfDay(next7Days);
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

  const handleStatusChange = useCallback(async (id: string, newStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED') => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } catch (err) {
      alert('Falha ao atualizar status');
    } finally {
      setUpdatingId(null);
    }
  }, []);

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
                   apt.status?.toLowerCase() === 'rejected' ? 'REJECTED' :
                   apt.status?.toLowerCase() === 'completed' ? 'COMPLETED' : 
                   apt.status?.toLowerCase() === 'cancelled' ? 'CANCELLED' : 'PENDING',
            notes: apt.notes,
            staff: apt.staff ? {
              id: apt.staff.id,
              name: apt.staff.name
            } : undefined
          }));
          
          setAppointments(formattedAppointments);
        }
      } catch (error) {
        console.error('❌ RecentAppointments: Error refreshing appointments:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointmentsAsync();
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
                filteredAndSortedAppointments.map((apt) => (
                  <AppointmentCard 
                    key={apt.id} 
                    apt={apt} 
                    onStatusChange={handleStatusChange} 
                    updatingId={updatingId}
                  />
                ))
              )}
            </div>
            
            {/* Desktop Table View */}
            <div className="hidden sm:block w-full">
              <div className="w-full">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cliente</th>
                      <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Serviço</th>
                      <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Data</th>
                      <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-16">Dur.</th>
                      <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-32">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedAppointments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500">
                          {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' || staffFilter !== 'all' 
                            ? 'Nenhum agendamento encontrado com os filtros atuais.' 
                            : 'Nenhum agendamento encontrado.'
                          }
                        </td>
                      </tr>
                    ) : (
                      filteredAndSortedAppointments.map((apt) => {
                        const appointmentDate = new Date(apt.scheduledFor);
                        const isUpcoming = appointmentDate >= new Date();
                        
                        return (
                          <tr key={apt.id} className={`border-b last:border-b-0 hover:bg-gray-50 transition-colors ${
                            isUpcoming ? 'bg-blue-50/30' : ''
                          }`}>
                            <td className="px-2 py-4 text-sm max-w-[180px]">
                              <div className="font-medium break-words overflow-hidden">{apt.client.name}</div>
                              {apt.staff && (
                                <div className="text-xs text-gray-500">Staff: {apt.staff.name}</div>
                              )}
                            </td>
                            <td className="px-2 py-4 text-sm max-w-[120px]">
                              <div className="break-words overflow-hidden">{apt.services?.[0]?.name}</div>
                            </td>
                            <td className="px-2 py-4 text-sm whitespace-nowrap">
                              {isToday(appointmentDate) ? (
                                <div className="text-xs font-medium text-blue-600">Hoje</div>
                              ) : isTomorrow(appointmentDate) ? (
                                <div className="text-xs font-medium text-blue-600">Amanhã</div>
                              ) : (
                                <div className="text-xs">{format(appointmentDate, 'dd/MM', { locale: ptBR })}</div>
                              )}
                              <div className="text-xs text-gray-500">{format(appointmentDate, 'HH:mm', { locale: ptBR })}</div>
                            </td>
                            <td className="px-2 py-4 text-xs text-gray-600">{apt.duration}m</td>
                            <td className="px-2 py-4">
                              <Badge className={cn(getStatusColor(apt.status), "text-xs whitespace-nowrap")}>
                                {getStatusLabel(apt.status)}
                              </Badge>
                            </td>
                            <td className="px-2 py-4">
                              {(() => {
                                // Get available next statuses based on current status
                                const statusOptions = [
                                  { value: 'PENDING', label: 'Pendente' },
                                  { value: 'ACCEPTED', label: 'Aceite' },
                                  { value: 'REJECTED', label: 'Rejeitado' },
                                  { value: 'COMPLETED', label: 'Concluído' },
                                  { value: 'CANCELLED', label: 'Cancelado' }
                                ];

                                const availableStatuses = statusOptions;

                                return (
                                  <select
                                    className="border rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs w-full"
                                    value={apt.status}
                                    disabled={availableStatuses.length === 1}
                                    onChange={e => handleStatusChange(apt.id, e.target.value as 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED')}
                                  >
                                    {availableStatuses.map(status => (
                                      <option key={status.value} value={status.value}>
                                        {status.label}
                                      </option>
                                    ))}
                                  </select>
                                );
                              })()}
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
