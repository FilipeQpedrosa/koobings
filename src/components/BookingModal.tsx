'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, X } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingCreated: () => void;
  defaultDate?: string; // Add optional default date
  defaultTime?: string; // Add optional default time
}

export default function BookingModal({ isOpen, onClose, onBookingCreated, defaultDate, defaultTime }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [clientSearch, setClientSearch] = useState("");
  const [showAddClient, setShowAddClient] = useState(false);
  const [client, setClient] = useState<{ id: string; name: string; email: string } | null>(null);
  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "", notes: "" });
  const [localClients, setLocalClients] = useState<any[]>([]);
  const [selectedServices, setServicesState] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{
    startTime: string;
    endTime: string;
    capacity?: number;
    slotIndex?: number;
  } | null>(null);
  const [staff, setStaff] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(0);
  const [status, setStatus] = useState('PENDING');
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [serviceSearch, setServiceSearch] = useState("");
  const [clients, setClients] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [slotAvailability, setSlotAvailability] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (isOpen) {
      console.log('📋 BookingModal: Modal opened, fetching data...');
      fetchData();
    }
  }, [isOpen]);

  // Set default date and time when modal opens
  useEffect(() => {
    if (isOpen) {
      // Set default date (today or provided default)
      if (defaultDate) {
        setDate(defaultDate);
      } else {
        // Default to today
        const today = new Date().toISOString().split('T')[0];
        setDate(today);
      }

      // Set default time only if explicitly provided
      if (defaultTime) {
        setTime(defaultTime);
      }
      // If no defaultTime is provided, leave time field empty for user selection
    }
  }, [isOpen, defaultDate, defaultTime]);

  useEffect(() => {
    const total = selectedServices.reduce((sum, id) => {
      const svc = services.find((s: any) => s.id === id);
      return sum + (svc ? svc.duration : 0);
    }, 0);
    setDuration(total);
  }, [selectedServices, services]);

  useEffect(() => { 
    console.log('📋 BookingModal: Updating localClients, count:', clients.length);
    setLocalClients(clients); 
  }, [clients]);

  // Fetch slot availability when service, date, or staff changes
  useEffect(() => {
    const fetchSlotAvailability = async () => {
      console.log('🔄 fetchSlotAvailability called:', {
        selectedServicesLength: selectedServices.length,
        date,
        staff,
        services: services.length
      });
      
      if (!selectedServices.length || !date) {
        console.log('⚠️ Missing requirements for slot availability check');
        return;
      }
      
      const selectedService = services.find((s: any) => selectedServices.includes(s.id));
      console.log('📋 Selected service:', {
        found: !!selectedService,
        name: selectedService?.name,
        id: selectedService?.id,
        hasSlots: selectedService?.slots ? true : false,
        slotsArray: Array.isArray(selectedService?.slots),
        slotsLength: selectedService?.slots?.length
      });
      
      if (!selectedService?.slots || !Array.isArray(selectedService.slots) || selectedService.slots.length === 0) {
        console.log('⚠️ Service has no slots, clearing availability');
        setSlotAvailability([]);
        return;
      }

      console.log('🚀 Fetching slot availability...');
      setLoadingSlots(true);
      try {
        const response = await fetch('/api/business/services/slots/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            serviceId: selectedService.id,
            date,
            ...(staff && { staffId: staff }) // Only include staffId if staff is selected
          })
        });

        const result = await response.json();
        console.log('🎯 Slot availability response:', result);
        
        if (result.success && result.data.serviceType === 'slots') {
          setSlotAvailability(result.data.allSlots || []);
        } else {
          setSlotAvailability([]);
        }
      } catch (error) {
        console.error('❌ Error fetching slot availability:', error);
        setSlotAvailability([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlotAvailability();
  }, [selectedServices, date, staff, services]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [clientsRes, staffRes] = await Promise.all([
        fetch('/api/staff/clients', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        }),
        fetch('/api/business/staff')
      ]);
      
      if (clientsRes.ok) {
        const clientsData = await clientsRes.json();
        console.log('📋 BookingModal: Clients fetched:', clientsData);
        // Use the direct data array from staff/clients API
        const fetchedClients = clientsData.data || [];
        console.log('📋 BookingModal: Setting clients state with', fetchedClients.length, 'clients');
        setClients(fetchedClients);
      } else {
        console.error('Failed to fetch clients:', clientsRes.status, clientsRes.statusText);
      }
      
      if (staffRes.ok) {
        const staffData = await staffRes.json();
        setStaffList(staffData.data || []);
      } else {
        console.error('Failed to fetch staff:', staffRes.status, staffRes.statusText);
      }

      try {
        const servicesRes = await fetch('/api/business/services');
        if (servicesRes.ok) {
          const servicesData = await servicesRes.json();
          setServices(servicesData.data || []);
        } else {
          console.error('Failed to fetch services:', servicesRes.status, servicesRes.statusText);
          setServices([]);
        }
      } catch (error) {
        console.error('Services API error:', error);
        setServices([]);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredClients = localClients.filter(
    (c: any) =>
      (c.name?.toLowerCase() || '').includes(clientSearch.toLowerCase()) ||
      (c.email?.toLowerCase() || '').includes(clientSearch.toLowerCase())
  );

  console.log('📋 BookingModal: Filtered clients:', filteredClients.length, 'out of', localClients.length, 'total clients');

  function handleSelectClient(c: any) {
    setClient(c);
    setShowAddClient(false);
    setClientSearch("");
  }

  async function handleAddClient() {
    setSaving(true);
    setSaveError('');
    try {
      const payload = {
        name: newClient.name,
        email: newClient.email,
        phone: newClient.phone,
        preferredContactMethod: '',
        medicalInfo: {},
        notificationPreferences: {},
        notes: newClient.notes,
      };
      const res = await fetch('/api/staff/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Erro ao criar cliente');
      const created = await res.json();
      const newClientData = created.data;
      
      console.log('✅ BookingModal: New client created:', newClientData);
      
      // Immediately update both clients and localClients state with the new client
      const updatedClients = [...clients, newClientData];
      setClients(updatedClients);
      setLocalClients(updatedClients);
      
      // Select the newly created client
      setClient({ id: newClientData.id, name: newClientData.name, email: newClientData.email });
      // Clear the search to show all clients, not filter to just the new one
      setClientSearch("");
      setShowAddClient(false);
      setNewClient({ name: '', email: '', phone: '', notes: '' });
      
      console.log('✅ BookingModal: Client state updated, new client should appear in list');
      
    } catch (err: any) {
      setSaveError(err.message || 'Erro ao criar cliente');
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('Submitting booking...', { client, staff, date, time, selectedServices, selectedSlot });
    if (!client || !staff || !date || !time || selectedServices.length === 0) return;
    setSaving(true);
    setSaveError('');
    try {
      const payload = {
        clientId: client.id,
        serviceIds: selectedServices, // Changed from serviceId to serviceIds array
        scheduledFor: `${date}T${time.split('-')[0] || time}:00`, // Use start time for slot-based services
        notes,
        staffId: staff,
        // Add slot information if this is a slot-based booking
        ...(selectedSlot && {
          slotInfo: {
            startTime: selectedSlot.startTime,
            endTime: selectedSlot.endTime,
            slotIndex: selectedSlot.slotIndex,
            capacity: selectedSlot.capacity
          }
        })
      };
      const res = await fetch('/api/business/appointments', { // Using the correct API endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error?.message || `HTTP ${res.status}: ${res.statusText}`);
      }
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to create appointment');
      }
      
      onBookingCreated();
      handleClose();
    } catch (err: any) {
      console.error('Booking creation error:', err);
      setSaveError(err.message || 'Erro ao guardar marcação');
    } finally {
      setSaving(false);
    }
  }

  function getTimeSlots() {
    // Check if selected service has specific slots
    const selectedService = services.find((s: any) => selectedServices.includes(s.id));
    
    console.log('🕐 getTimeSlots DEBUG:', {
      selectedServices,
      selectedService: selectedService ? { id: selectedService.id, name: selectedService.name, slots: selectedService.slots } : null,
      hasSlots: selectedService?.slots && Array.isArray(selectedService.slots) && selectedService.slots.length > 0,
      slotAvailability: slotAvailability.length,
      loadingSlots
    });
    
    if (selectedService?.slots && Array.isArray(selectedService.slots) && selectedService.slots.length > 0) {
      // Return specific slots for this service with real availability
      console.log('🎯 Using specific slots for service:', selectedService.name);
      
      // If we're done loading and have no available slots, the service is not available on this day
      if (!loadingSlots && slotAvailability.length === 0) {
        console.log('⚠️ Service not available on selected date');
        return [{
          value: '',
          label: 'Serviço não disponível neste dia',
          slot: null,
          disabled: true
        }];
      }
      
      return selectedService.slots.map((slot: any, index: number) => {
        // Find availability data for this slot
        const availabilityData = slotAvailability.find(avail => avail.slotIndex === index);
        
        let availabilityText = '';
        if (loadingSlots) {
          availabilityText = ' (...)';
        } else if (availabilityData) {
          const { capacity, available, booked } = availabilityData;
          if (capacity > 1) {
            // Multi-pax event: show "X de Y vagas"
            availabilityText = ` (${available} de ${capacity} vagas)`;
          } else {
            // Single person: show "Disponível" or "Ocupado"
            availabilityText = available > 0 ? ' (Disponível)' : ' (Ocupado)';
          }
        } else if (slot.capacity && slot.capacity > 1) {
          // Fallback for multi-pax when no availability data
          availabilityText = ` (${slot.capacity} vagas)`;
        }

        return {
          value: `${slot.startTime}-${slot.endTime}`,
          label: `${slot.startTime} - ${slot.endTime}${availabilityText}`,
          slot: { ...slot, slotIndex: index },
          disabled: loadingSlots ? false : (availabilityData ? availabilityData.available === 0 : true)
        };
      });
    }
    
    // Traditional time slots (30min intervals from 8AM to 8PM)
    console.log('⏰ Using traditional time slots');
    const slots = [];
    for (let h = 8; h <= 20; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, '0');
        const min = m.toString().padStart(2, '0');
        const timeValue = `${hour}:${min}`;
        slots.push({
          value: timeValue,
          label: timeValue,
          slot: null
        });
      }
    }
    
    // Filter out past times if today
    if (date === new Date().toISOString().split('T')[0]) {
      const now = new Date();
      return slots.filter((t) => {
        const [h, m] = t.value.split(':').map(Number);
        return h > now.getHours() || (h === now.getHours() && m > now.getMinutes());
      });
    }
    
    return slots;
  }

  const handleClose = () => {
    setStep(1);
    setClient(null);
    setClientSearch("");
    setSelectedSlot(null);
    setSlotAvailability([]); // Reset slot availability
    setServicesState([]);
    setStaff("");
    setDate("");
    setTime("");
    setNotes("");
    setSaveError('');
    setNewClient({ name: '', email: '', phone: '', notes: '' });
    setShowAddClient(false);
    onClose();
  };

  if (!isOpen) return null;

  // Stepper progress bar logic
  const totalSteps = 3;
  const progressPercent = ((step - 1) / (totalSteps - 1)) * 100;
  const stepLabels = ['Cliente', 'Serviço', 'Agendamento'];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl sm:max-w-xl h-auto max-h-[90vh] flex flex-col mx-2 animate-fade-in">
        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.2s ease-out;
          }
        `}</style>
        
        <div className="sticky top-0 left-0 right-0 bg-white z-20 border-b px-4 pt-6 pb-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Novo Agendamento</h2>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-center relative">
              {stepLabels.map((label, idx) => (
                <div key={label + '-' + idx} className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold z-10 ${step === idx + 1 ? 'bg-blue-600' : idx + 1 < step ? 'bg-blue-400' : 'bg-gray-300'}`}>{idx + 1}</div>
                  <span className={`mt-2 text-xs font-medium ${step === idx + 1 ? 'text-blue-600' : 'text-gray-400'}`}>{label}</span>
                </div>
              ))}
              {/* Blue progress bar */}
              <div className="absolute left-0 right-0 top-4 h-1 bg-gray-200 z-0 rounded-full" style={{marginLeft: '16px', marginRight: '16px'}}>
                <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 sm:px-8 pb-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Add error message for missing fields or save error */}
            {saveError && <div className="text-red-600 text-sm mb-2">{saveError}</div>}
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <>
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="sticky top-0 bg-white z-10 pb-2">
                      <input
                        type="text"
                        placeholder="Procurar cliente por nome ou email..."
                        className="border border-gray-300 rounded-lg p-3 w-full bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        value={clientSearch}
                        onChange={e => setClientSearch(e.target.value)}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <button type="button" className="flex items-center gap-2 text-blue-600 hover:underline" onClick={() => setShowAddClient(true)}>
                          <Plus className="w-4 h-4" />
                          Adicionar novo cliente
                        </button>
                        <span className="text-xs text-gray-500">
                          {filteredClients.length} de {localClients.length} clientes
                        </span>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {filteredClients.map((c: any, idx: number) => (
                        <button type="button" key={c.id || c.email || idx} className={`flex items-center gap-3 p-3 w-full text-left ${client?.id === c.id ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-50 transition`} onClick={() => handleSelectClient(c)}>
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                            {c.name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-base">{c.name}</div>
                            <div className="text-xs text-gray-500">{c.email}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                    {showAddClient && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-2 space-y-2 animate-fade-in">
                        <input type="text" placeholder="Nome" className="w-full border border-gray-300 rounded p-2 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" value={newClient.name} onChange={e => setNewClient(n => ({ ...n, name: e.target.value }))} />
                        <input type="email" placeholder="Email" className="w-full border border-gray-300 rounded p-2 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" value={newClient.email} onChange={e => setNewClient(n => ({ ...n, email: e.target.value }))} />
                        <input type="text" placeholder="Telefone" className="w-full border border-gray-300 rounded p-2 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" value={newClient.phone} onChange={e => setNewClient(n => ({ ...n, phone: e.target.value }))} />
                        <textarea placeholder="Notas" className="w-full border border-gray-300 rounded p-2 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" value={newClient.notes} onChange={e => setNewClient(n => ({ ...n, notes: e.target.value }))} />
                        <Button type="button" onClick={handleAddClient} disabled={saving || !newClient.name || !newClient.email}>
                          {saving ? 'Guardando...' : 'Guardar Cliente'}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Procurar serviços..."
                        className="border border-gray-300 rounded-lg p-2 flex-1 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        value={serviceSearch}
                        onChange={e => setServiceSearch(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto">
                      {services
                        .filter((svc: any) =>
                          (!serviceSearch || svc.name.toLowerCase().includes(serviceSearch.toLowerCase()) || (svc.description && svc.description.toLowerCase().includes(serviceSearch.toLowerCase())))
                        )
                        .map((svc: any, idx: number) => (
                          <button
                            key={svc.id || idx}
                            type="button"
                            className={`flex flex-col items-start p-4 rounded-lg border transition shadow-sm relative text-left w-full ${selectedServices.includes(svc.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                            onClick={() => {
                              setServicesState([svc.id]);
                              setTime(""); // Reset time when service changes
                              setSelectedSlot(null);
                              setSlotAvailability([]); // Reset slot availability when service changes
                            }}
                          >
                            <div className="font-semibold text-base mb-1 flex items-center gap-2">
                              {svc.name}
                              {selectedServices.includes(svc.id) && (
                                <span className="ml-2 text-blue-600">✔</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mb-1">Duração: {svc.duration} min{svc.price ? ` • €${svc.price}` : ''}</div>
                            {svc.description && <div className="text-xs text-gray-400 line-clamp-2">{svc.description}</div>}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div className="space-y-4">
                    <div className="mb-2 font-medium text-gray-700">Agendamento</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Funcionário *</label>
                        <select className="w-full border border-gray-300 rounded-lg p-2 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" value={staff} onChange={e => setStaff(e.target.value)}>
                          <option value="">Selecionar funcionário</option>
                          {staffList.map((s: any) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
                        <input type="date" className="w-full border border-gray-300 rounded-lg p-2 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" value={date} min={new Date().toISOString().split('T')[0]} onChange={e => setDate(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hora *</label>
                        <select 
                          className="w-full border border-gray-300 rounded-lg p-2 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                          value={time} 
                          onChange={(e) => {
                            setTime(e.target.value);
                            // If this is a slot-based service, save the slot info
                            const timeSlots = getTimeSlots();
                            const selectedTimeSlot = timeSlots.find((t: any) => t.value === e.target.value);
                            if (selectedTimeSlot?.slot) {
                              setSelectedSlot(selectedTimeSlot.slot);
                            } else {
                              setSelectedSlot(null);
                            }
                          }}
                        >
                          <option value="">Selecionar hora</option>
                          {getTimeSlots().map((t: any) => (
                            <option key={t.value} value={t.value} disabled={t.disabled}>{t.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                      <textarea placeholder="Notas adicionais..." className="w-full border border-gray-300 rounded-lg p-2 h-16 resize-none bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" value={notes} onChange={e => setNotes(e.target.value)} />
                    </div>
                  </div>
                )}
              </>
            )}
            {/* Action buttons inside the form */}
            <div className="sticky bottom-0 left-0 right-0 bg-white border-t flex flex-col sm:flex-row justify-end gap-2 p-2 sm:p-4 z-10">
              {step > 1 && <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => setStep(step - 1)}>Voltar</Button>}
              {step < 3 && <Button type="button" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setStep(step + 1)} disabled={step === 1 ? !client : selectedServices.length === 0}>Continuar</Button>}
              {step === 3 && (
                <Button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white" disabled={saving || !client || !staff || !date || !time || selectedServices.length === 0}>
                  {saving ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </span>
                  ) : 'Criar Agendamento'}
                </Button>
              )}
              <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={handleClose}>Cancelar</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 