"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, ArrowLeft, Plus, ChevronLeft, ChevronRight, X, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface AppointmentEvent {
  id: string;
  clientName: string;
  service: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  phone?: string;
  notes?: string;
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
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [clients, setClients] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClientData, setNewClientData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [creatingClient, setCreatingClient] = useState(false);
  const primaryColor = 'blue';

  const primaryColorClasses = {
    blue: 'text-blue-600 bg-blue-600 hover:bg-blue-700',
  };

  useEffect(() => {
    if (loading) return;
    
    if (!authenticated || !user) {
      router.push('/auth/signin');
      return;
    }
    
    loadAppointments();
  }, [user, loading, authenticated, router, selectedDate]);

  const loadAppointments = useCallback(() => {
    setIsLoading(true);
    
    const dateStr = selectedDate.toISOString().split('T')[0];
    
    const mockAppointments: AppointmentEvent[] = [
      {
        id: '1',
        clientName: 'João Silva',
        service: 'Serviço Premium',
        startTime: `${dateStr}T09:00:00`,
        endTime: `${dateStr}T10:00:00`,
        duration: 60,
        status: 'confirmed',
        phone: '+351 912 345 678',
        notes: 'Cliente regular'
      },
      {
        id: '2',
        clientName: 'Pedro Santos',
        service: 'Serviço Básico',
        startTime: `${dateStr}T10:30:00`,
        endTime: `${dateStr}T11:00:00`,
        duration: 30,
        status: 'confirmed',
        phone: '+351 963 789 012'
      },
      {
        id: '3',
        clientName: 'Miguel Costa',
        service: 'Consulta',
        startTime: `${dateStr}T11:00:00`,
        endTime: `${dateStr}T11:30:00`,
        duration: 30,
        status: 'pending',
        phone: '+351 987 654 321'
      },
      {
        id: '4',
        clientName: 'Carlos Oliveira',
        service: 'Serviço Completo',
        startTime: `${dateStr}T14:00:00`,
        endTime: `${dateStr}T15:30:00`,
        duration: 90,
        status: 'confirmed',
        phone: '+351 911 222 333'
      },
      {
        id: '5',
        clientName: 'António Ferreira',
        service: 'Serviço Rápido',
        startTime: `${dateStr}T15:30:00`,
        endTime: `${dateStr}T16:00:00`,
        duration: 30,
        status: 'completed',
        phone: '+351 933 444 555'
      }
    ];
    
    setAppointments(mockAppointments);
    setIsLoading(false);
  }, [selectedDate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'border-green-500 bg-green-50';
      case 'pending': return 'border-yellow-500 bg-yellow-50';
      case 'completed': return 'border-blue-500 bg-blue-50';
      case 'cancelled': return 'border-red-500 bg-red-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'pending': return 'Pendente';
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
    setSelectedTimeSlot(timeSlot);
    setShowBookingModal(true);
    loadBookingData();
  };

  const loadBookingData = async () => {
    setLoadingData(true);
    try {
      const clientsRes = await fetch('/api/business/clients?_t=' + Date.now(), {
        credentials: 'include',
        cache: 'no-store'
      });
      if (clientsRes.ok) {
        const clientsData = await clientsRes.json();
        setClients(clientsData.data?.clients || []);
      }

      try {
        const servicesRes = await fetch('/api/services');
        if (servicesRes.ok) {
          const servicesData = await servicesRes.json();
          setServices(servicesData.data || []);
        } else {
          console.error('Failed to fetch services:', servicesRes.status, servicesRes.statusText);
          // Leave services empty instead of hardcoded fallback
          setServices([]);
        }
      } catch (error) {
        console.error('Services loading failed:', error);
        // Leave services empty instead of hardcoded fallback
        setServices([]);
      }
    } catch (error) {
      console.error('Failed to load booking data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const filteredClients = clients.filter(client => 
    client.name?.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.email?.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.phone?.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const handleCreateNewClient = async () => {
    if (!newClientData.name.trim() || !newClientData.email.trim()) {
      alert('Nome e email são obrigatórios');
      return;
    }

    setCreatingClient(true);
    try {
      const response = await fetch('/api/staff/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newClientData),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const newClient = result.data;
          // Add to clients list
          setClients(prev => [...prev, newClient]);
          // Select the new client
          setSelectedClient(newClient);
          // Reset form
          setNewClientData({ name: '', email: '', phone: '', notes: '' });
          setShowNewClientForm(false);
          setClientSearch('');
          alert('Cliente criado com sucesso!');
        } else {
          alert('Erro ao criar cliente: ' + (result.error || 'Erro desconhecido'));
        }
      } else {
        const errorData = await response.json();
        alert('Erro ao criar cliente: ' + (errorData.error || 'Erro do servidor'));
      }
    } catch (error) {
      console.error('Failed to create client:', error);
      alert('Erro ao criar cliente. Tente novamente.');
    } finally {
      setCreatingClient(false);
    }
  };

  const closeModals = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setShowBookingModal(false);
    setSelectedAppointment(null);
    setSelectedTimeSlot('');
    setSelectedClient(null);
    setClientSearch('');
    setShowNewClientForm(false);
    setNewClientData({ name: '', email: '', phone: '', notes: '' });
  };

  // Handle body scroll lock
  useEffect(() => {
    if (showViewModal || showEditModal || showBookingModal) {
      // Lock scroll
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup function
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [showViewModal, showEditModal, showBookingModal]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Agenda</h1>
          </div>
          <p className="text-gray-600 mt-1">Agenda de {user?.businessName}</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-5 w-5 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      {/* Date Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold text-gray-900">
                {formatDate(selectedDate)}
              </h2>
              <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant={view === 'day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('day')}
                className={view === 'day' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Dia
              </Button>
              <Button
                variant={view === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('week')}
                className={view === 'week' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Semana
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button variant="outline" onClick={() => setSelectedDate(new Date())}>
              Hoje
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Hoje</p>
                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Confirmados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(a => a.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(a => a.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-100">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Concluídos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(a => a.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Horários de {formatDate(selectedDate)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {timeSlots.map((timeSlot) => {
              const appointment = appointments.find(apt => {
                const aptTime = new Date(apt.startTime).toTimeString().slice(0, 5);
                return aptTime === timeSlot;
              });

              return (
                <div key={timeSlot} className="flex items-center gap-4 p-2 border-b border-gray-100">
                  <div className="w-16 text-sm font-medium text-gray-600">
                    {timeSlot}
                  </div>
                  <div className="flex-1">
                    {appointment ? (
                      <div className={`p-3 rounded-lg border-l-4 ${getStatusColor(appointment.status)}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900">{appointment.clientName}</h4>
                            <p className="text-sm text-gray-600">{appointment.service}</p>
                            <p className="text-xs text-gray-500">
                              {appointment.duration} min • {getStatusText(appointment.status)}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewAppointment(appointment)}
                            >
                              Ver
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditAppointment(appointment)}
                            >
                              Editar
                            </Button>
                          </div>
                        </div>
                        {appointment.notes && (
                          <p className="text-xs text-gray-600 mt-2">
                            <span className="font-medium">Nota:</span> {appointment.notes}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 border-2 border-dashed border-gray-200 rounded-lg text-center">
                        <p className="text-sm text-gray-500">Horário disponível</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-1"
                          onClick={() => handleNewBooking(timeSlot)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Agendar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* View Appointment Modal */}
      {showViewModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div 
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl"
            style={{
              position: 'fixed',
              top: '64px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 60
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Detalhes do Agendamento</h3>
              <Button variant="ghost" size="sm" onClick={closeModals}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Cliente</label>
                <p className="text-sm">{selectedAppointment.clientName}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Serviço</label>
                <p className="text-sm">{selectedAppointment.service}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Data e Hora</label>
                <p className="text-sm">
                  {new Date(selectedAppointment.startTime).toLocaleDateString('pt-PT')} às{' '}
                  {new Date(selectedAppointment.startTime).toLocaleTimeString('pt-PT', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Duração</label>
                <p className="text-sm">{selectedAppointment.duration} minutos</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Estado</label>
                <p className="text-sm">{getStatusText(selectedAppointment.status)}</p>
              </div>
              
              {selectedAppointment.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Telefone</label>
                  <p className="text-sm">{selectedAppointment.phone}</p>
                </div>
              )}
              
              {selectedAppointment.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Notas</label>
                  <p className="text-sm">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={closeModals}>
                Fechar
              </Button>
              <Button onClick={() => {
                setShowViewModal(false);
                setShowEditModal(true);
              }}>
                Editar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Appointment Modal */}
      {showEditModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div 
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl"
            style={{
              position: 'fixed',
              top: '64px',
              left: '50%',
              transform: 'translateX(-50%)',
              maxHeight: 'calc(100vh - 128px)',
              overflowY: 'auto',
              zIndex: 60
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Editar Agendamento</h3>
              <Button variant="ghost" size="sm" onClick={closeModals}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                <input
                  type="text"
                  defaultValue={selectedAppointment.clientName}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Serviço</label>
                <input
                  type="text"
                  defaultValue={selectedAppointment.service}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                <input
                  type="date"
                  defaultValue={new Date(selectedAppointment.startTime).toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                <input
                  type="time"
                  defaultValue={new Date(selectedAppointment.startTime).toTimeString().slice(0, 5)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  defaultValue={selectedAppointment.status}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pendente</option>
                  <option value="confirmed">Confirmado</option>
                  <option value="completed">Concluído</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input
                  type="tel"
                  defaultValue={selectedAppointment.phone || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                <textarea
                  rows={3}
                  defaultValue={selectedAppointment.notes || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </form>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={closeModals}>
                Cancelar
              </Button>
              <Button onClick={() => {
                // Here you would handle the save logic
                alert('Agendamento atualizado com sucesso!');
                closeModals();
              }}>
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div 
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl"
            style={{
              position: 'fixed',
              top: '64px',
              left: '50%',
              transform: 'translateX(-50%)',
              maxHeight: 'calc(100vh - 128px)',
              overflowY: 'auto',
              zIndex: 60
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Novo Agendamento</h3>
              <Button variant="ghost" size="sm" onClick={closeModals}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {loadingData ? (
              <div className="flex justify-center items-center h-32">
                <div className="text-sm text-gray-500">Carregando dados...</div>
              </div>
            ) : (
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
                  {selectedClient ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 border rounded-md">
                      <div>
                        <div className="font-medium">{selectedClient.name}</div>
                        <div className="text-sm text-gray-500">{selectedClient.email}</div>
                        {selectedClient.phone && (
                          <div className="text-sm text-gray-500">{selectedClient.phone}</div>
                        )}
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedClient(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : showNewClientForm ? (
                    <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-blue-900">Criar Novo Cliente</h4>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setShowNewClientForm(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                        <Input
                          type="text"
                          placeholder="Nome completo"
                          value={newClientData.name}
                          onChange={(e) => setNewClientData(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <Input
                          type="email"
                          placeholder="email@exemplo.com"
                          value={newClientData.email}
                          onChange={(e) => setNewClientData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                        <Input
                          type="tel"
                          placeholder="+351 912 345 678"
                          value={newClientData.phone}
                          onChange={(e) => setNewClientData(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={2}
                          placeholder="Notas adicionais sobre o cliente..."
                          value={newClientData.notes}
                          onChange={(e) => setNewClientData(prev => ({ ...prev, notes: e.target.value }))}
                        />
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button 
                          type="button"
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowNewClientForm(false)}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          type="button"
                          size="sm"
                          onClick={handleCreateNewClient}
                          disabled={creatingClient || !newClientData.name.trim() || !newClientData.email.trim()}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {creatingClient ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Criando...
                            </>
                          ) : (
                            'Criar Cliente'
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Buscar cliente por nome, email ou telefone..."
                          value={clientSearch}
                          onChange={(e) => setClientSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      
                      <div className="mt-2">
                        <Button 
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowNewClientForm(true)}
                          className="w-full border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Criar Novo Cliente
                        </Button>
                      </div>
                      
                      {clientSearch && filteredClients.length > 0 && (
                        <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                          {filteredClients.slice(0, 5).map((client) => (
                            <div 
                              key={client.id} 
                              className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                              onClick={() => {
                                setSelectedClient(client);
                                setClientSearch('');
                              }}
                            >
                              <div className="font-medium">{client.name}</div>
                              <div className="text-sm text-gray-500">{client.email}</div>
                              {client.phone && <div className="text-sm text-gray-500">{client.phone}</div>}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {clientSearch && filteredClients.length === 0 && (
                        <div className="mt-2 p-3 text-sm text-gray-500 border border-gray-200 rounded-md text-center">
                          <p>Nenhum cliente encontrado</p>
                          <Button 
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setNewClientData(prev => ({ ...prev, name: clientSearch }));
                              setShowNewClientForm(true);
                            }}
                            className="mt-1 text-blue-600"
                          >
                            Criar cliente "{clientSearch}"
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serviço</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Selecione um serviço</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} {service.duration && `(${service.duration} min)`} {service.price && `- €${service.price}`}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                  <input
                    type="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                  <input
                    type="time"
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                  <textarea
                    rows={3}
                    placeholder="Notas adicionais sobre o agendamento..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
              </form>
            )}
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={closeModals}>
                Cancelar
              </Button>
              <Button 
                onClick={() => {
                  if (!selectedClient) {
                    alert('Por favor selecione um cliente ou crie um novo');
                    return;
                  }
                  alert('Agendamento criado com sucesso!');
                  closeModals();
                }}
                disabled={!selectedClient || loadingData}
              >
                Agendar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 