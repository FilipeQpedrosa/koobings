'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, X, Clock, Users, User, Calendar, ChevronRight } from 'lucide-react';

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  serviceName: string;
  staffName: string;
  capacity: number;
  booked: number;
  available: boolean;
  price?: number;
  serviceId: string;
  staffId: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isEligible: boolean;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingCreated: () => void;
  selectedDate?: string;
  selectedSlot?: Slot;
  businessSlug?: string;
}

export default function BookingModal({ 
  isOpen, 
  onClose, 
  onBookingCreated, 
  selectedDate,
  selectedSlot,
  businessSlug
}: BookingModalProps) {
  const [view, setView] = useState<'list' | 'details'>('list');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedSlotDetails, setSelectedSlotDetails] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Client management states
  const [showAddClient, setShowAddClient] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', notes: '' });

  useEffect(() => {
    if (isOpen && selectedDate) {
      fetchSlotsForDate();
      fetchClients();
    }
  }, [isOpen, selectedDate]);

  const fetchSlotsForDate = async () => {
    if (!selectedDate) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `/api/business/services/slots/availability?year=${new Date(selectedDate).getFullYear()}&month=${new Date(selectedDate).getMonth() + 1}&businessSlug=${businessSlug}`,
        {
          credentials: 'include',
          cache: 'no-store'
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const dateKey = selectedDate;
          const daySlots = data.data[dateKey] || [];
          setSlots(daySlots);
        }
        }
      } catch (error) {
      console.error('Error fetching slots:', error);
      setError('Erro ao carregar horários');
      } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/staff/clients', {
        credentials: 'include',
        cache: 'no-store'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setClients(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleSlotClick = (slot: Slot) => {
    setSelectedSlotDetails(slot);
    setView('details');
  };

  const handleAddClient = async () => {
    if (!newClient.name || !newClient.email) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/staff/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: newClient.name,
          email: newClient.email,
          phone: newClient.phone,
          notes: newClient.notes
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const newClientData = data.data;
          setClients(prev => [...prev, newClientData]);
          setSelectedClient(newClientData);
          setNewClient({ name: '', email: '', phone: '', notes: '' });
      setShowAddClient(false);
        }
      }
    } catch (error) {
      console.error('Error adding client:', error);
      setError('Erro ao adicionar cliente');
    } finally {
      setSaving(false);
    }
  };

  const handleBookSlot = async () => {
    if (!selectedSlotDetails || !selectedClient) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/business/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          clientId: selectedClient.id,
          serviceIds: [selectedSlotDetails.serviceId],
          staffId: selectedSlotDetails.staffId,
          scheduledFor: new Date(`${selectedDate}T${selectedSlotDetails.startTime}:00`).toISOString(),
          notes: ''
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          onBookingCreated();
          handleClose();
        } else {
          setError(data.error?.message || 'Erro ao criar marcação');
        }
      }
    } catch (error) {
      console.error('Error booking slot:', error);
      setError('Erro ao criar marcação');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setView('list');
    setSelectedSlotDetails(null);
    setSelectedClient(null);
    setClientSearch('');
    setShowAddClient(false);
    setNewClient({ name: '', email: '', phone: '', notes: '' });
    setError('');
    onClose();
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.email.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('pt-PT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-auto max-h-[90vh] flex flex-col mx-2 animate-fade-in">
        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in { animation: fade-in 0.2s ease-out; }
        `}</style>
        
        {/* Header */}
        <div className="sticky top-0 bg-white z-20 border-b px-4 pt-6 pb-4 rounded-t-2xl">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-gray-900">
              {view === 'list' ? 'Horários Disponíveis' : 'Detalhes do Horário'}
            </h2>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {selectedDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(selectedDate).toLocaleDateString('pt-PT', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {view === 'list' && (
            <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
              ) : slots.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {slots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`
                        p-4 rounded-lg border cursor-pointer transition-all duration-200
                        ${slot.available 
                          ? 'bg-white border-green-200 hover:bg-green-50 hover:border-green-300 hover:shadow-md' 
                          : 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60'
                        }
                      `}
                      onClick={() => slot.available && handleSlotClick(slot)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-gray-900">
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </span>
                        </div>
                        <span className={`
                          text-xs px-2 py-1 rounded-full
                          ${slot.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        `}>
                          {slot.available ? 'Disponível' : 'Ocupado'}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        {slot.serviceName}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{slot.staffName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{slot.booked}/{slot.capacity}</span>
                        </div>
                        {slot.price && (
                          <span>€{slot.price}</span>
                        )}
                      </div>
                      
                      {slot.available && (
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Clique para ver detalhes
                          </span>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                      ))}
                    </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-lg font-medium mb-2">
                    Nenhuma aula disponível
                  </div>
                  <div className="text-sm">
                    Não há horários disponíveis para este dia
                  </div>
                      </div>
                    )}
                  </div>
                )}

          {view === 'details' && selectedSlotDetails && (
            <div className="space-y-6">
              {/* Slot Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Detalhes do Horário
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Horário</div>
                    <div className="font-medium">
                      {formatTime(selectedSlotDetails.startTime)} - {formatTime(selectedSlotDetails.endTime)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Serviço</div>
                    <div className="font-medium">{selectedSlotDetails.serviceName}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Funcionário</div>
                    <div className="font-medium">{selectedSlotDetails.staffName}</div>
                            </div>
                  
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Capacidade</div>
                    <div className="font-medium">
                      {selectedSlotDetails.booked}/{selectedSlotDetails.capacity} pessoas
                    </div>
                  </div>
                  
                  {selectedSlotDetails.price && (
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Preço</div>
                      <div className="font-medium text-green-600">€{selectedSlotDetails.price}</div>
                  </div>
                )}
                </div>
              </div>

              {/* Client Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Selecionar Cliente
                </h3>
                
                  <div className="space-y-4">
                  {/* Search */}
                  <input
                    type="text"
                    placeholder="Procurar cliente por nome ou email..."
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    value={clientSearch}
                    onChange={e => setClientSearch(e.target.value)}
                  />
                  
                  {/* Add Client Button */}
                  <div className="flex justify-between items-center">
                        <button 
                          type="button" 
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                      onClick={() => setShowAddClient(true)}
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar novo cliente
                    </button>
                    <span className="text-xs text-gray-500">
                      {filteredClients.length} de {clients.length} clientes
                    </span>
                  </div>
                  
                  {/* Add Client Form */}
                  {showAddClient && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                      <input 
                        type="text" 
                        placeholder="Nome *" 
                        className="w-full border border-gray-300 rounded p-2 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                        value={newClient.name} 
                        onChange={e => setNewClient(n => ({ ...n, name: e.target.value }))} 
                      />
                      <input 
                        type="email" 
                        placeholder="Email *" 
                        className="w-full border border-gray-300 rounded p-2 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                        value={newClient.email} 
                        onChange={e => setNewClient(n => ({ ...n, email: e.target.value }))} 
                      />
                      <input 
                        type="text" 
                        placeholder="Telefone" 
                        className="w-full border border-gray-300 rounded p-2 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                        value={newClient.phone} 
                        onChange={e => setNewClient(n => ({ ...n, phone: e.target.value }))} 
                      />
                      <textarea 
                        placeholder="Notas" 
                        className="w-full border border-gray-300 rounded p-2 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                        value={newClient.notes} 
                        onChange={e => setNewClient(n => ({ ...n, notes: e.target.value }))} 
                      />
                      <Button 
                        type="button" 
                        onClick={handleAddClient} 
                        disabled={saving || !newClient.name || !newClient.email}
                        className="w-full"
                      >
                        {saving ? 'Guardando...' : 'Guardar Cliente'}
                      </Button>
                    </div>
                  )}
                  
                  {/* Client List */}
                  <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                    {filteredClients.map((client) => (
                      <button
                        key={client.id}
                        type="button"
                        className={`
                          flex items-center gap-3 p-3 w-full text-left border-b border-gray-100 last:border-b-0
                          ${selectedClient?.id === client.id ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'}
                        `}
                        onClick={() => setSelectedClient(client)}
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {client.name[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1">
                          <div className="font-semibold text-sm">{client.name}</div>
                          <div className="text-xs text-gray-500">{client.email}</div>
                          </div>
                        <div className="flex items-center gap-2">
                          <span className={`
                            text-xs px-2 py-1 rounded-full
                            ${client.isEligible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                          `}>
                            {client.isEligible ? 'Apto' : 'Não Apto'}
                          </span>
                          {selectedClient?.id === client.id && (
                            <span className="text-blue-600 font-bold">✓</span>
                          )}
                        </div>
                        </button>
                      ))}
                    </div>
                  </div>
                        </div>
                      </div>
                    )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t flex justify-between items-center p-4 rounded-b-2xl">
          <Button 
            variant="outline" 
            onClick={() => setView('list')}
            disabled={view === 'list'}
          >
            Voltar à Lista
          </Button>
          
          {view === 'details' && (
                <Button 
              onClick={handleBookSlot}
              disabled={saving || !selectedClient || !selectedClient.isEligible}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
                  {saving ? (
                <span className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </span>
              ) : (
                'Marcar Aula'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 