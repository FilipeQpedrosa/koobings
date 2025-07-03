'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2, Plus, X } from 'lucide-react';
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
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
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

  // Load data when modal opens
  useEffect(() => {
    if (isOpen && step === 1) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [clientsRes, servicesRes, staffRes] = await Promise.all([
        fetch('/api/clients'),
        fetch('/api/services'),
        fetch('/api/business/staff')
      ]);
      
      if (clientsRes.ok) {
        const clientsData = await clientsRes.json();
        setClients(clientsData.data || []);
      }
      
      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        setServices(servicesData.data || []);
      }
      
      if (staffRes.ok) {
        const staffData = await staffRes.json();
        setStaffList(staffData.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async () => {
    if (!newClient.name || !newClient.email) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const clientData = result.data;
          setClients(prev => [...prev, clientData]);
          setSelectedClient(clientData);
          setNewClient({ name: "", email: "", phone: "", notes: "" });
          setShowAddClient(false);
          setClientSearch("");
        } else {
          console.error('Failed to add client:', result.error);
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to add client:', errorData);
      }
    } catch (error) {
      console.error('Failed to add client:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedClient || !selectedServices.length || !selectedStaff || !selectedDate || !selectedTime) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/business/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: selectedClient.id,
          serviceIds: selectedServices,
          staffId: selectedStaff,
          scheduledFor: `${selectedDate}T${selectedTime}:00`,
          notes: notes,
        }),
      });

      if (response.ok) {
        onBookingCreated();
        handleClose();
      }
    } catch (error) {
      console.error('Failed to create booking:', error);
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
    onClose();
  };

  const filteredClients = clients.filter(
    (c: any) =>
      (c.name?.toLowerCase() || '').includes(clientSearch.toLowerCase()) ||
      (c.email?.toLowerCase() || '').includes(clientSearch.toLowerCase())
  );

  const getTimeSlots = () => {
    const slots = [];
    for (let h = 8; h <= 20; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, '0');
        const min = m.toString().padStart(2, '0');
        slots.push(`${hour}:${min}`);
      }
    }
    if (selectedDate === format(new Date(), 'yyyy-MM-dd')) {
      const now = new Date();
      return slots.filter((t) => {
        const [h, m] = t.split(':').map(Number);
        return h > now.getHours() || (h === now.getHours() && m > now.getMinutes());
      });
    }
    return slots;
  };

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
                    className="border border-gray-300 rounded-lg p-3 w-full"
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
                        className="w-full border rounded p-2" 
                        value={newClient.name} 
                        onChange={e => setNewClient(n => ({ ...n, name: e.target.value }))} 
                      />
                      <input 
                        type="email" 
                        placeholder="Email" 
                        className="w-full border rounded p-2" 
                        value={newClient.email} 
                        onChange={e => setNewClient(n => ({ ...n, email: e.target.value }))} 
                      />
                      <input 
                        type="text" 
                        placeholder="Telefone" 
                        className="w-full border rounded p-2" 
                        value={newClient.phone} 
                        onChange={e => setNewClient(n => ({ ...n, phone: e.target.value }))} 
                      />
                      <Button onClick={handleAddClient} disabled={saving || !newClient.name || !newClient.email}>
                        {saving ? 'Guardando...' : 'Guardar Cliente'}
                      </Button>
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
                          <div className="font-semibold">{client.name}</div>
                          <div className="text-sm text-gray-500">{client.email}</div>
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
                        <div className="font-semibold flex items-center gap-2">
                          {service.name}
                          {selectedServices.includes(service.id) && (
                            <span className="text-blue-600">✓</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          Duração: {service.duration} min
                          {service.price && ` • €${service.price}`}
                        </div>
                        {service.description && (
                          <div className="text-sm text-gray-400 mt-1">{service.description}</div>
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Funcionário</label>
                      <select 
                        className="w-full border rounded-lg p-2" 
                        value={selectedStaff} 
                        onChange={e => setSelectedStaff(e.target.value)}
                      >
                        <option value="">Selecionar funcionário</option>
                        {staffList.map((staff: any) => (
                          <option key={staff.id} value={staff.id}>{staff.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                        <input 
                          type="date" 
                          className="w-full border rounded-lg p-2" 
                          value={selectedDate} 
                          min={format(new Date(), 'yyyy-MM-dd')} 
                          onChange={e => setSelectedDate(e.target.value)} 
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hora</label>
                        <select 
                          className="w-full border rounded-lg p-2" 
                          value={selectedTime} 
                          onChange={e => setSelectedTime(e.target.value)}
                        >
                          <option value="">Selecionar hora</option>
                          {getTimeSlots().map((time: string) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notas (opcional)</label>
                      <textarea 
                        placeholder="Notas sobre o agendamento..." 
                        className="w-full border rounded-lg p-2 h-16 resize-none" 
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

function getStatusColor(status: Appointment['status']) {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'COMPLETED':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function getStatusLabel(status: Appointment['status']) {
  switch (status) {
    case 'PENDING': return 'Pendente';
    case 'COMPLETED': return 'Concluído';
    case 'CANCELLED': return 'Cancelado';
    default: return status;
  }
}

export default function RecentAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const router = useRouter();

  // Fetch appointments function
  function fetchAppointments() {
    setIsLoading(true);
    
    async function fetchAppointments() {
      let url = '/api/business/appointments';
      
      const params = new URLSearchParams();
      
      if (dateFilter !== 'ALL') {
        const today = new Date();
        let startDate, endDate;
        
        switch (dateFilter) {
          case 'TODAY':
            startDate = new Date(today.setHours(0, 0, 0, 0));
            endDate = new Date(today.setHours(23, 59, 59, 999));
            break;
          case 'TOMORROW':
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            startDate = new Date(tomorrow.setHours(0, 0, 0, 0));
            endDate = new Date(tomorrow.setHours(23, 59, 59, 999));
            break;
          case 'THIS_WEEK':
            startDate = new Date(today);
            startDate.setDate(today.getDate() - today.getDay());
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            break;
          case 'NEXT_WEEK':
            startDate = new Date(today);
            startDate.setDate(today.getDate() + (7 - today.getDay()));
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            break;
          case 'THIS_MONTH':
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            break;
        }
        
        if (startDate) params.append('startDate', startDate.toISOString());
        if (endDate) params.append('endDate', endDate.toISOString());
      }
      
      try {
        const res = await fetch(url + (params.toString() ? '?' + params.toString() : ''));
        if (!res.ok) throw new Error('Failed to fetch appointments');
        const data = await res.json();
        setAppointments(data?.data?.appointments || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAppointments();
  }

  useEffect(() => {
    fetchAppointments();
  }, [dateFilter]);

  const filteredAppointments = statusFilter === 'ALL'
    ? appointments
    : Array.isArray(appointments) ? appointments.filter(a => a.status === statusFilter) : [];

  async function handleStatusChange(id: string, newStatus: 'PENDING' | 'COMPLETED' | 'CANCELLED') {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } catch (err) {
      alert('Falha ao atualizar status');
    } finally {
      setUpdatingId(null);
    }
  }

  function handleCreateAppointment() {
    setShowBookingModal(true);
  }

  function handleBookingCreated() {
    fetchAppointments(); // Refresh the appointments list
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-full border-2 border-gray-200">
        {/* Header with title and add button */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 sm:gap-0 mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Agendamentos Recentes</h2>
          
          {/* Desktop CTA - Hidden on mobile since we have FAB */}
          <Button 
            onClick={handleCreateAppointment} 
            className="hidden sm:flex bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 border-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="text-sm">Novo Agendamento</span>
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Status Filter */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <label htmlFor="status-filter" className="font-bold text-gray-800 whitespace-nowrap">Status:</label>
            <select
              id="status-filter"
              className="border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full max-w-[150px] bg-white text-gray-800 font-semibold"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Todos</option>
              <option value="PENDING">Pendente</option>
              <option value="CONFIRMED">Confirmado</option>
              <option value="COMPLETED">Concluído</option>
              <option value="CANCELLED">Cancelado</option>
              <option value="NO_SHOW">Não Compareceu</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <label htmlFor="date-filter" className="font-bold text-gray-800 whitespace-nowrap">Período:</label>
            <select
              id="date-filter"
              className="border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full max-w-[150px] bg-white text-gray-800 font-semibold"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
            >
              <option value="ALL">Todos</option>
              <option value="TODAY">Hoje</option>
              <option value="TOMORROW">Amanhã</option>
              <option value="THIS_WEEK">Esta Semana</option>
              <option value="NEXT_WEEK">Próxima Semana</option>
              <option value="THIS_MONTH">Este Mês</option>
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="sm:hidden space-y-4">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Nenhum agendamento encontrado com os filtros atuais.</div>
              ) : (
                filteredAppointments.map((apt) => (
                  <div key={apt.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{apt.client.name}</h3>
                      <Badge className={cn(getStatusColor(apt.status), "text-xs")}>
                        {getStatusLabel(apt.status)}
                      </Badge>
                    </div>
                    <div className="text-gray-700">{apt.services?.[0]?.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{format(new Date(apt.scheduledFor), 'PP p', { locale: ptBR })}</div>
                    <div className="text-sm text-gray-500">{apt.duration} min</div>
                    {apt.notes && apt.notes.trim() !== "" && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-md">
                        <p className="text-xs font-medium text-blue-800">Notas:</p>
                        <p className="text-sm text-blue-700">{apt.notes}</p>
                      </div>
                    )}
                    <div className="mt-4">
                       <select
                          className="w-full border rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                          value={apt.status}
                          disabled={updatingId === apt.id}
                          onChange={e => handleStatusChange(apt.id, e.target.value as 'PENDING' | 'COMPLETED' | 'CANCELLED')}
                        >
                          <option value="PENDING">Pendente</option>
                          <option value="COMPLETED">Concluído</option>
                          <option value="CANCELLED">Cancelado</option>
                        </select>
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* Desktop Table View */}
            <div className="hidden sm:block w-full">
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Cliente</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Serviço</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Data & Hora</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Duração</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Notas</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-gray-500">Nenhum agendamento encontrado com os filtros atuais.</td>
                      </tr>
                    ) : (
                      filteredAppointments.map((apt) => (
                        <tr key={apt.id} className="border-b last:border-b-0 hover:bg-gray-50">
                          <td className="px-4 py-4 font-medium text-sm">{apt.client.name}</td>
                          <td className="px-4 py-4 text-sm">{apt.services?.[0]?.name}</td>
                          <td className="px-4 py-4 text-sm whitespace-nowrap">{format(new Date(apt.scheduledFor), 'dd/MM HH:mm', { locale: ptBR })}</td>
                          <td className="px-4 py-4 text-sm">{apt.duration}min</td>
                          <td className="px-4 py-4 text-sm max-w-xs">
                            {apt.notes && apt.notes.trim() !== "" ? (
                              <div className="text-xs text-gray-600 truncate" title={apt.notes}>
                                {apt.notes}
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">-</span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <Badge className={cn(getStatusColor(apt.status), "text-xs whitespace-nowrap")}>
                              {getStatusLabel(apt.status)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm min-w-[120px]"
                              value={apt.status}
                              disabled={updatingId === apt.id}
                              onChange={e => handleStatusChange(apt.id, e.target.value as 'PENDING' | 'COMPLETED' | 'CANCELLED')}
                            >
                              <option value="PENDING">Pendente</option>
                              <option value="COMPLETED">Concluído</option>
                              <option value="CANCELLED">Cancelado</option>
                            </select>
                          </td>
                        </tr>
                      ))
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
} /* Cache buster 1751397006 */
