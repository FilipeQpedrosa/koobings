'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, X } from 'lucide-react';
import SlotPicker from '@/components/SlotPicker';

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
    startSlot: number;
    endSlot: number;
    startTime: string;
    endTime: string;
    slotsNeeded: number;
    duration: number;
  } | null>(null);
  const [staff, setStaff] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(0);
  const [usingSlotSystem, setUsingSlotSystem] = useState(true);
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
  const [conflictCheck, setConflictCheck] = useState<{[key: string]: boolean}>({});
  const [checkingConflicts, setCheckingConflicts] = useState(false);

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

  // Reset time selection when staff changes to ensure fresh availability check
  useEffect(() => {
    if (staff) {
      console.log('👤 Staff changed, resetting time selections for:', staff);
      setTime("");
      setSelectedSlot(null);
      // Clear any previous conflict checks
      setConflictCheck({});
    }
  }, [staff]);

  // Update time when slot is selected
  useEffect(() => {
    if (selectedSlot && usingSlotSystem) {
      setTime(selectedSlot.startTime);
      setDuration(selectedSlot.duration);
    }
  }, [selectedSlot, usingSlotSystem]);

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

  // Check for appointment conflicts when staff, date, or services change
  useEffect(() => {
    const checkAppointmentConflicts = async () => {
      // More rigorous validation - ALL fields must be present
      if (!staff || !date || selectedServices.length === 0 || !services.length) {
        console.log('⚠️ Missing required data for conflict check:', { 
          staff: !!staff, 
          date: !!date, 
          selectedServices: selectedServices.length, 
          services: services.length 
        });
        setConflictCheck({});
        setCheckingConflicts(false);
        return;
      }

      console.log('🔄 Starting RIGOROUS appointment conflict check for:', { staff, date, selectedServices });
      setCheckingConflicts(true);

      try {
        // Get the selected service to calculate duration
        const selectedService = services.find((s: any) => selectedServices.includes(s.id));
        if (!selectedService) {
          console.error('❌ Selected service not found in services list');
          setConflictCheck({});
          setCheckingConflicts(false);
          return;
        }

        // Generate time slots for business hours only (8 AM to 8 PM)
        const timeSlots = [];
        for (let h = 8; h <= 20; h++) {
          for (let m = 0; m < 60; m += 30) {
            const hour = h.toString().padStart(2, '0');
            const min = m.toString().padStart(2, '0');
            const timeValue = `${hour}:${min}`;
            timeSlots.push(timeValue);
          }
        }

        console.log('🚀 Making BULK availability check for', timeSlots.length, 'time slots for staff:', staff);
        
        // Make a single bulk API call with better error handling
        const response = await fetch('/api/business/appointments/check-availability', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          credentials: 'include',
          body: JSON.stringify({
            staffId: staff,
            date: date,
            duration: selectedService.duration,
            timeSlots: timeSlots  // Send all time slots at once
          })
        });

        console.log('📊 API Response status:', response.status, response.statusText);

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('📋 API Response data:', result);
        
        if (result.success && result.data && result.data.type === 'bulk' && result.data.results) {
          // Convert bulk results to conflict format
          const conflicts: {[key: string]: boolean} = {};
          let availableCount = 0;
          let occupiedCount = 0;
          
          for (const [timeSlot, slotData] of Object.entries(result.data.results)) {
            const isOccupied = !(slotData as any).available;
            conflicts[timeSlot] = isOccupied;
            
            if (isOccupied) {
              occupiedCount++;
            } else {
              availableCount++;
            }
          }
          
          console.log('✅ Bulk check completed successfully!');
          console.log('📊 Availability summary:', { 
            total: timeSlots.length, 
            available: availableCount, 
            occupied: occupiedCount,
            conflicts: Object.keys(conflicts).filter(k => conflicts[k]).length
          });
          
          setConflictCheck(conflicts);
        } else {
          console.error('❌ Bulk availability check failed - invalid response format:', result);
          // Set all as unavailable if API fails
          const fallbackConflicts: {[key: string]: boolean} = {};
          timeSlots.forEach(slot => {
            fallbackConflicts[slot] = true; // Mark as occupied if uncertain
          });
          setConflictCheck(fallbackConflicts);
        }
      } catch (error) {
        console.error('❌ Error in bulk conflict checking:', error);
        // Set all as unavailable if there's an error
        const timeSlots = [];
        for (let h = 8; h <= 20; h++) {
          for (let m = 0; m < 60; m += 30) {
            const hour = h.toString().padStart(2, '0');
            const min = m.toString().padStart(2, '0');
            const timeValue = `${hour}:${min}`;
            timeSlots.push(timeValue);
          }
        }
        const errorConflicts: {[key: string]: boolean} = {};
        timeSlots.forEach(slot => {
          errorConflicts[slot] = true; // Mark as occupied if error occurs
        });
        setConflictCheck(errorConflicts);
      } finally {
        setCheckingConflicts(false);
      }
    };

    checkAppointmentConflicts();
  }, [staff, date, selectedServices, services]);

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
        const servicesRes = await fetch('/api/business/services', {
          credentials: 'include',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (servicesRes.ok) {
          const servicesData = await servicesRes.json();
          console.log('📋 BookingModal: Services fetched:', servicesData);
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
      // 🔧 FINAL CONFLICT CHECK - Mandatory validation before creating appointment
      console.log('🔍 Final conflict check before creating appointment...');
      
      const selectedService = services.find((s: any) => selectedServices.includes(s.id));
      if (!selectedService) {
        throw new Error('Serviço selecionado não encontrado');
      }
      
      const finalConflictResponse = await fetch('/api/business/appointments/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          staffId: staff,
          date: date,
          time: time.split('-')[0] || time, // Use just the start time
          duration: selectedService.duration
        })
      });

      const finalConflictResult = await finalConflictResponse.json();
      console.log('🎯 Final conflict check result:', finalConflictResult);
      
      if (!finalConflictResult.success) {
        throw new Error('Erro ao verificar disponibilidade: ' + (finalConflictResult.error?.message || 'Erro desconhecido'));
      }
      
      if (!finalConflictResult.data.available) {
        throw new Error(`⚠️ Este horário não está mais disponível para este funcionário. Motivo: ${finalConflictResult.data.reason}`);
      }
      
      console.log('✅ Final conflict check passed, proceeding with appointment creation...');

      // 🔧 FIX: Simplified timezone handling - let JavaScript handle it naturally
      const selectedTime = time.split('-')[0] || time;
      const selectedDateTime = `${date}T${selectedTime}:00`;
      
      // Create the date object and let JavaScript handle the local timezone conversion
      const scheduledForDate = new Date(selectedDateTime);
      
      console.log('📅 Staff Portal - Selected date/time:', selectedDateTime);
      console.log('📅 Staff Portal - JavaScript Date object:', scheduledForDate);
      console.log('📅 Staff Portal - ISO string for database:', scheduledForDate.toISOString());
      
      // Use slots-v2 API if slot system is enabled and slot is selected
      if (usingSlotSystem && selectedSlot) {
        console.log('🎯 [BOOKING_MODAL] Using slots-v2 API');
        
        const slotPayload = {
          clientId: client.id,
          serviceId: selectedServices[0], // Use first service for slots (can be enhanced for multiple services)
          staffId: staff,
          date: date,
          startSlot: selectedSlot.startSlot,
          slotsNeeded: selectedSlot.slotsNeeded,
          notes: notes || ''
        };

        console.log('📤 [BOOKING_MODAL] Slot payload:', slotPayload);

        const res = await fetch('/api/appointments/slots-v2', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(slotPayload),
        });

        const result = await res.json();
        
        if (!res.ok) {
          throw new Error(result.error?.message || `HTTP ${res.status}: ${res.statusText}`);
        }
        
        if (!result.success) {
          throw new Error(result.error?.message || 'Failed to create appointment');
        }

        console.log('✅ [BOOKING_MODAL] Slot appointment created successfully!');
        onBookingCreated();
        handleClose();
        return;
      }

      // Fallback to old API for non-slot bookings
      const payload = {
        clientId: client.id,
        serviceIds: selectedServices, // Changed from serviceId to serviceIds array
        scheduledFor: scheduledForDate.toISOString(),
        notes,
        staffId: staff,
        // Add slot information if this is a slot-based booking
        ...(selectedSlot && {
          slotInfo: {
            startTime: selectedSlot.startTime,
            endTime: selectedSlot.endTime
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
      
      console.log('✅ Appointment created successfully!');
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
      loadingSlots,
      conflictCheck: Object.keys(conflictCheck).length,
      checkingConflicts
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
          availabilityText = ' ⏳ (verificando...)';
        } else if (availabilityData) {
          const { capacity, available, booked } = availabilityData;
          if (capacity > 1) {
            // Multi-pax event: show "X de Y vagas"
            if (available > 0) {
              availabilityText = ` ✅ (${available} de ${capacity} vagas)`;
            } else {
              availabilityText = ` ❌ (esgotado)`;
            }
          } else {
            // Single person: show "Disponível" or "Ocupado"
            availabilityText = available > 0 ? ' ✅ (disponível)' : ' ❌ (ocupado)';
          }
        } else if (slot.capacity && slot.capacity > 1) {
          // Fallback for multi-pax when no availability data
          availabilityText = ` ✅ (${slot.capacity} vagas)`;
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
    console.log('⏰ Using traditional time slots with conflict checking');
    const slots = [];
    for (let h = 8; h <= 20; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, '0');
        const min = m.toString().padStart(2, '0');
        const timeValue = `${hour}:${min}`;
        
        // Check if this time slot has a conflict
        const hasConflict = conflictCheck[timeValue] === true;
        const isCheckingThisSlot = checkingConflicts;
        
        let label = timeValue;
        let disabled = false;
        
        if (!staff || !date || selectedServices.length === 0) {
          // If no staff/date/service selected, show neutral state
          label = `${timeValue}`;
          disabled = true;
        } else if (isCheckingThisSlot) {
          // While checking conflicts, show loading state
          label = `${timeValue} ⏳ (verificando...)`;
          disabled = false; // Allow selection while checking
        } else if (hasConflict) {
          // Conflict detected - show as occupied
          label = `${timeValue} ❌ (ocupado)`;
          disabled = true;
        } else {
          // No conflict - show as available
          label = `${timeValue} ✅ (disponível)`;
          disabled = false;
        }
        
        slots.push({
          value: timeValue,
          label: label,
          slot: null,
          disabled: disabled
        });
      }
    }
    
    // Filter out past times if today
    let filteredSlots = slots;
    if (date === new Date().toISOString().split('T')[0]) {
      const now = new Date();
      filteredSlots = slots.filter((t) => {
        const [h, m] = t.value.split(':').map(Number);
        return h > now.getHours() || (h === now.getHours() && m > now.getMinutes());
      });
    }
    
    // If no staff is selected yet, show message to select staff first
    if (!staff) {
      return [{
        value: '',
        label: 'Selecione um funcionário primeiro',
        slot: null,
        disabled: true
      }];
    }
    
    // If no slots are available due to conflicts, show a message
    const availableSlots = filteredSlots.filter(slot => !slot.disabled);
    if (staff && date && selectedServices.length > 0 && !checkingConflicts && availableSlots.length === 0) {
      return [{
        value: '',
        label: 'Nenhum horário disponível para este funcionário neste dia',
        slot: null,
        disabled: true
      }];
    }
    
    return filteredSlots;
  }

  const handleClose = () => {
    setStep(1);
    setClient(null);
    setClientSearch("");
    setSelectedSlot(null);
    setSlotAvailability([]); // Reset slot availability
    setConflictCheck({}); // Reset conflict checking
    setCheckingConflicts(false);
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
  const stepLabels = ['Cliente', 'Serviço', 'Staff', 'Agendamento'];
  const stepCount = stepLabels.length;
  const progressPercent = ((step - 1) / (stepCount - 1)) * 100;

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
                    <div className="mb-2 font-medium text-gray-700">Selecionar Funcionário</div>
                    <div className="divide-y divide-gray-200">
                      {staffList.map((s: any) => (
                        <button 
                          type="button" 
                          key={s.id} 
                          className={`flex items-center gap-3 p-3 w-full text-left ${staff === s.id ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-50 transition`} 
                          onClick={() => {
                            setStaff(s.id);
                            // Reset time and slot availability when staff changes
                            setTime("");
                            setSelectedSlot(null);
                            setSlotAvailability([]);
                          }}
                        >
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-lg">
                            {s.name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-base">{s.name}</div>
                            <div className="text-xs text-gray-500">{s.email || 'Staff Member'}</div>
                          </div>
                          {staff === s.id && (
                            <span className="text-blue-600 font-bold">✔</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {step === 4 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="font-medium text-gray-700">Agendamento</div>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600">Sistema de slots</label>
                        <input 
                          type="checkbox"
                          checked={usingSlotSystem}
                          onChange={(e) => {
                            setUsingSlotSystem(e.target.checked);
                            setSelectedSlot(null);
                            setTime("");
                          }}
                          className="toggle-checkbox"
                        />
                      </div>
                    </div>
                    
                    {/* Show selected staff info */}
                    {staff && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <div className="text-sm text-blue-800">
                          <strong>Funcionário selecionado:</strong> {staffList.find(s => s.id === staff)?.name || 'Desconhecido'}
                        </div>
                      </div>
                    )}

                    {/* Date Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
                      <input 
                        type="date" 
                        className="w-full border border-gray-300 rounded-lg p-2 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                        value={date} 
                        min={new Date().toISOString().split('T')[0]} 
                        onChange={e => setDate(e.target.value)} 
                      />
                    </div>

                    {/* Slot System vs Old System */}
                    {usingSlotSystem ? (
                      /* New Slot Picker */
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Horários Disponíveis (Sistema de Slots)</label>
                        {selectedServices.length > 0 && staff && date ? (
                          <SlotPicker
                            serviceId={selectedServices[0]}
                            staffId={staff}
                            date={date}
                            onSlotSelect={(slot) => {
                              console.log('🎯 [BOOKING_MODAL] Slot selected:', slot);
                              setSelectedSlot(slot);
                            }}
                            selectedSlot={selectedSlot}
                            className="border border-gray-200 rounded-lg p-4"
                          />
                        ) : (
                          <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg">
                            <p>Selecione um serviço, funcionário e data para ver os horários disponíveis</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Old Time Selection */
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hora * (Sistema Antigo)</label>
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
                            <option 
                              key={t.value} 
                              value={t.value} 
                              disabled={t.disabled}
                              style={{
                                color: t.disabled ? '#9CA3AF' : 
                                       t.label.includes('(ocupado)') ? '#DC2626' : 
                                       t.label.includes('(disponível)') ? '#059669' : 
                                       t.label.includes('(verificando...)') ? '#D97706' : '#374151',
                                fontWeight: t.label.includes('(ocupado)') ? 'bold' : 'normal',
                                backgroundColor: t.label.includes('(ocupado)') ? '#FEE2E2' : 
                                                 t.label.includes('(disponível)') ? '#F0FDF4' : 
                                                 t.label.includes('(verificando...)') ? '#FEF3C7' : 'transparent'
                              }}
                            >
                              {t.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    
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
              {step < stepCount && (
                <Button 
                  type="button" 
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white" 
                  onClick={() => setStep(step + 1)} 
                  disabled={
                    (step === 1 && !client) || 
                    (step === 2 && selectedServices.length === 0) ||
                    (step === 3 && !staff)
                  }
                >
                  Continuar
                </Button>
              )}
              {step === stepCount && (
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white" 
                  disabled={
                    saving || 
                    !client || 
                    !staff || 
                    !date || 
                    selectedServices.length === 0 || 
                    (usingSlotSystem ? !selectedSlot : !time)
                  }
                >
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