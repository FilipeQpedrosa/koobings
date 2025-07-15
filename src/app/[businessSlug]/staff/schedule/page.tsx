"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ChevronLeft, ChevronRight, Clock, User, Plus, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

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
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [searchDebounce, setSearchDebounce] = useState("");

  // Load data when modal opens
  useEffect(() => {
    if (isOpen && step === 1) {
      fetchData();
    }
  }, [isOpen]);

  // Debounce search input for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(clientSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [clientSearch]);

  // Fetch available time slots when staff and date are selected
  useEffect(() => {
    if (selectedStaff && selectedDate) {
      fetchAvailableSlots();
    } else {
      setAvailableSlots([]);
      setSelectedTime("");
    }
  }, [selectedStaff, selectedDate]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Load clients and staff - these work
      const [clientsRes, staffRes] = await Promise.all([
        fetch('/api/business/clients'),
        fetch('/api/business/staff')
      ]);
      
      if (clientsRes.ok) {
        const clientsData = await clientsRes.json();
        setClients(clientsData.data?.clients || []);
      } else {
        console.error('Failed to fetch clients:', clientsRes.status, clientsRes.statusText);
      }
      
      if (staffRes.ok) {
        const staffData = await staffRes.json();
        setStaffList(staffData.data || []);
      } else {
        console.error('Failed to fetch staff:', staffRes.status, staffRes.statusText);
      }

      // Try to load services, but don't block if it fails
      try {
        const servicesRes = await fetch('/api/business/services');
        if (servicesRes.ok) {
          const servicesData = await servicesRes.json();
          setServices(servicesData.data || []);
        } else {
          console.error('Failed to fetch services:', servicesRes.status, servicesRes.statusText);
          // Leave services empty instead of hardcoded fallback
          setServices([]);
        }
      } catch (error) {
        console.error('Services API error:', error);
        // Leave services empty instead of hardcoded fallback
        setServices([]);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddClient = async () => {
    if (!newClient.name || !newClient.email) return;
    
    // Clear any previous error
    setErrorMessage("");
    setSaving(true);
    
    try {
      console.log('🔄 Creating client:', newClient);
      
      const response = await fetch('/api/staff/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      });
      
      const result = await response.json();
      console.log('📝 Client creation response:', result);
      
      if (response.ok && result.success) {
        const clientData = result.data;
        setClients(prev => [...prev, clientData]);
        setSelectedClient(clientData);
        setNewClient({ name: "", email: "", phone: "", notes: "" });
        setShowAddClient(false);
        setClientSearch("");
        setErrorMessage("");
        console.log('✅ Client created successfully:', clientData.name);
      } else {
        // Handle error response
        const errorMsg = result.error?.message || 'Erro ao criar cliente';
        setErrorMessage(errorMsg);
        console.error('❌ Failed to add client:', result.error);
      }
    } catch (error) {
      console.error('❌ Network error creating client:', error);
      setErrorMessage('Erro de conexão. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedClient || !selectedServices.length || !selectedStaff || !selectedDate || !selectedTime) {
      return;
    }

    setSaving(true);
    setErrorMessage("");
    
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          clientId: selectedClient.id,
          serviceId: selectedServices[0], // Use first selected service
          staffId: selectedStaff, // Include the selected staff ID
          date: selectedDate,
          time: selectedTime,
          notes: notes,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onBookingCreated();
        handleClose();
      } else {
        const errorMessage = data.error?.message || `Failed to create appointment: ${response.status}`;
        console.error('Failed to create appointment:', errorMessage);
        setErrorMessage(errorMessage);
      }
    } catch (error) {
      console.error('Failed to create booking:', error);
      setErrorMessage('Network error. Please try again.');
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
    setAvailableSlots([]);
    setLoadingSlots(false);
    setErrorMessage("");
    onClose();
  };

  const filteredClients = useMemo(() => {
    if (!searchDebounce.trim()) return clients;
    return clients.filter(
      (c: any) =>
        (c.name?.toLowerCase() || '').includes(searchDebounce.toLowerCase()) ||
        (c.email?.toLowerCase() || '').includes(searchDebounce.toLowerCase())
    );
  }, [clients, searchDebounce]);

  const getSelectedServiceDuration = () => {
    if (selectedServices.length === 0) return 30;
    const service = services.find(s => s.id === selectedServices[0]);
    return service?.duration || 30;
  };

  const getBasicTimeSlots = () => {
    const slots = [];
    for (let h = 8; h <= 20; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, '0');
        const min = m.toString().padStart(2, '0');
        slots.push(`${hour}:${min}`);
      }
    }
    if (selectedDate === new Date().toISOString().split('T')[0]) {
      const now = new Date();
      return slots.filter((t) => {
        const [h, m] = t.split(':').map(Number);
        return h > now.getHours() || (h === now.getHours() && m > now.getMinutes());
      });
    }
    return slots;
  };

  const fetchAvailableSlots = useCallback(async () => {
    if (!selectedStaff || !selectedDate) return;
    
    setLoadingSlots(true);
    try {
      const response = await fetch(`/api/staff/${selectedStaff}/availability?date=${selectedDate}&duration=${getSelectedServiceDuration()}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableSlots(data.availableSlots || []);
      } else {
        // Fallback to basic time slots if API fails
        setAvailableSlots(getBasicTimeSlots());
      }
    } catch (error) {
      console.error('Failed to fetch available slots:', error);
      // Fallback to basic time slots
      setAvailableSlots(getBasicTimeSlots());
    } finally {
      setLoadingSlots(false);
    }
  }, [selectedStaff, selectedDate, selectedServices]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[95vh] min-h-[400px] flex flex-col mx-2">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Criar Agendamento</h2>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b flex-shrink-0">
          <div className="flex justify-between items-center">
            {['Cliente', 'Serviço', 'Agendamento'].map((label, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold ${
                  step === idx + 1 ? 'bg-blue-600' : idx + 1 < step ? 'bg-blue-400' : 'bg-gray-300'
                }`}>
                  {idx + 1}
                </div>
                <span className={`mt-2 text-xs font-medium ${
                  step === idx + 1 ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              {/* Step 1: Client Selection */}
              {step === 1 && (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Procurar cliente por nome ou email..."
                    className="border border-gray-300 rounded-lg p-3 w-full bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    value={clientSearch}
                    onChange={e => setClientSearch(e.target.value)}
                  />
                  
                  <button 
                    type="button" 
                    className="flex items-center gap-2 text-blue-600 hover:underline" 
                    onClick={() => setShowAddClient(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar novo cliente
                  </button>

                  {showAddClient && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                      <input 
                        type="text" 
                        placeholder="Nome" 
                        className="w-full border border-gray-300 rounded p-2 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                        value={newClient.name} 
                        onChange={e => {
                          setNewClient(n => ({ ...n, name: e.target.value }));
                          if (errorMessage) setErrorMessage("");
                        }} 
                      />
                      <input 
                        type="email" 
                        placeholder="Email" 
                        className="w-full border border-gray-300 rounded p-2 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                        value={newClient.email} 
                        onChange={e => {
                          setNewClient(n => ({ ...n, email: e.target.value }));
                          if (errorMessage) setErrorMessage("");
                        }} 
                      />
                      <input 
                        type="text" 
                        placeholder="Telefone" 
                        className="w-full border border-gray-300 rounded p-2 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                        value={newClient.phone} 
                        onChange={e => {
                          setNewClient(n => ({ ...n, phone: e.target.value }));
                          if (errorMessage) setErrorMessage("");
                        }} 
                      />
                      <Button onClick={handleAddClient} disabled={saving || !newClient.name || !newClient.email}>
                        {saving ? 'Guardando...' : 'Guardar Cliente'}
                      </Button>
                      {errorMessage && (
                        <p className="text-red-500 text-xs mt-2">{errorMessage}</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {filteredClients.map((client: any) => (
                      <button
                        key={client.id}
                        type="button"
                        className={`flex items-center gap-3 p-3 w-full text-left rounded-lg border transition ${
                          selectedClient?.id === client.id ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedClient(client)}
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {client.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{client.name}</div>
                          <div className="text-sm text-gray-600">{client.email}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Service Selection */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Selecionar Serviço</h3>
                  <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto">
                    {services.map((service: any) => (
                      <button
                        key={service.id}
                        type="button"
                        className={`flex flex-col items-start p-4 rounded-lg border text-left transition ${
                          selectedServices.includes(service.id) 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedServices([service.id])}
                      >
                        <div className="font-semibold flex items-center gap-2 text-gray-900">
                          {service.name}
                          {selectedServices.includes(service.id) && (
                            <span className="text-blue-600">✓</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          Duração: {service.duration} min
                          {service.price && ` • €${service.price}`}
                        </div>
                        {service.description && (
                          <div className="text-sm text-gray-500 mt-1">{service.description}</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Schedule */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Agendar</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {/* Staff Selection - First */}
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Funcionário *
                      </label>
                      <select 
                        className="w-full border border-gray-300 rounded-lg p-2 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                        value={selectedStaff} 
                        onChange={e => {
                          setSelectedStaff(e.target.value);
                          setSelectedTime(""); // Reset time when staff changes
                        }}
                      >
                        <option value="">Selecionar funcionário</option>
                        {staffList.map((staff: any) => (
                          <option key={staff.id} value={staff.id}>{staff.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Date Selection - Second */}
                    {selectedStaff && (
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Data *
                        </label>
                        <input 
                          type="date" 
                          className="w-full border border-gray-300 rounded-lg p-2 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                          value={selectedDate} 
                          min={new Date().toISOString().split('T')[0]} 
                          onChange={e => {
                            setSelectedDate(e.target.value);
                            setSelectedTime(""); // Reset time when date changes
                          }} 
                        />
                      </div>
                    )}

                    {/* Time Selection - Third (only after staff and date) */}
                    {selectedStaff && selectedDate && (
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Hora disponível *
                          {loadingSlots && (
                            <span className="ml-2 text-xs text-blue-600">
                              <Loader2 className="inline h-3 w-3 animate-spin mr-1" />
                              Verificando disponibilidade...
                            </span>
                          )}
                        </label>
                        <select 
                          className="w-full border border-gray-300 rounded-lg p-2 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                          value={selectedTime} 
                          onChange={e => setSelectedTime(e.target.value)}
                          disabled={loadingSlots}
                        >
                          <option value="">
                            {loadingSlots ? "Verificando..." : availableSlots.length === 0 ? "Nenhuma hora disponível" : "Selecionar hora"}
                          </option>
                          {availableSlots.map((time: string) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                        {!loadingSlots && availableSlots.length === 0 && selectedStaff && selectedDate && (
                          <p className="text-sm text-amber-600 mt-1">
                            ⚠️ Não há horários disponíveis para esta data. Tente outra data.
                          </p>
                        )}
                        {!loadingSlots && availableSlots.length > 0 && (
                          <p className="text-sm text-green-600 mt-1">
                            ✅ {availableSlots.length} horário(s) disponível(eis)
                          </p>
                        )}
                      </div>
                    )}

                    {/* Notes - Always visible */}
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">Notas (opcional)</label>
                      <textarea 
                        placeholder="Notas sobre o agendamento..." 
                        className="w-full border border-gray-300 rounded-lg p-2 h-16 resize-none bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                        value={notes} 
                        onChange={e => setNotes(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer - Always visible */}
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 border-t bg-gray-50 rounded-b-2xl flex-shrink-0 gap-3 sm:gap-0">
          {/* Error Message */}
          {errorMessage && (
            <div className="w-full order-first mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errorMessage}</p>
            </div>
          )}
          
          <div className="flex gap-2 order-2 sm:order-1">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="min-w-[80px]">
                Voltar
              </Button>
            )}
          </div>
          
          <div className="flex gap-2 order-1 sm:order-2 w-full sm:w-auto">
            <Button variant="outline" onClick={handleClose} className="flex-1 sm:flex-none min-w-[80px]">
              Cancelar
            </Button>
            
            {step < 3 ? (
              <Button 
                onClick={() => setStep(step + 1)} 
                disabled={
                  (step === 1 && !selectedClient) || 
                  (step === 2 && selectedServices.length === 0)
                }
                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]"
              >
                Continuar
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={saving || !selectedClient || !selectedServices.length || !selectedStaff || !selectedDate || !selectedTime}
                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]"
              >
                {saving ? 'Criando...' : 'Criar Agendamento'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
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
    <div className="p-6 space-y-6">
      {/* Header */}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Appointment Details</h3>
              <Button variant="ghost" size="sm" onClick={closeModals}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Client</label>
                <div className="text-gray-900">{selectedAppointment.clientName}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Service</label>
                <div className="text-gray-900">{selectedAppointment.service}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Time</label>
                <div className="text-gray-900">
                  {format(new Date(selectedAppointment.startTime), 'HH:mm')} - 
                  {format(new Date(selectedAppointment.endTime), 'HH:mm')}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Duration</label>
                <div className="text-gray-900">{selectedAppointment.duration} minutes</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="text-gray-900">{getStatusText(selectedAppointment.status)}</div>
              </div>
              {selectedAppointment.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <div className="text-gray-900">{selectedAppointment.phone}</div>
                </div>
              )}
              {selectedAppointment.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Notes</label>
                  <div className="text-gray-900">{selectedAppointment.notes}</div>
                </div>
              )}
            </div>
          </div>
        </div>
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