'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Clock, User, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomerSlotPickerProps {
  businessSlug: string;
  serviceId: string;
  staffId: string;
  date: string;
  onSlotSelect: (slot: SelectedSlot) => void;
  onBack?: () => void;
  selectedSlot?: SelectedSlot | null;
  className?: string;
}

interface SelectedSlot {
  startSlot: number;
  endSlot: number;
  startTime: string;
  endTime: string;
  slotsNeeded: number;
  duration: number;
}

interface AvailableSlot {
  slotIndex: number;
  time: string;
  isAvailable: boolean;
  isOccupied: boolean;
  canStartService: boolean;
  reason?: string;
}

export default function CustomerSlotPicker({
  businessSlug,
  serviceId,
  staffId,
  date,
  onSlotSelect,
  onBack,
  selectedSlot,
  className
}: CustomerSlotPickerProps) {
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [serviceInfo, setServiceInfo] = useState<{ name: string; slotsNeeded: number; duration: number; price: number } | null>(null);

  // Fetch available slots
  const fetchSlots = async () => {
    if (!serviceId || !staffId || !date) return;

    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        serviceId,
        staffId,
        date
      });

      console.log('🔍 [CUSTOMER_SLOT_PICKER] Fetching slots:', {
        businessSlug,
        serviceId,
        staffId,
        date
      });

      const response = await fetch(`/api/availability/slots-v2?${params}`, {
        credentials: 'include'
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || `HTTP ${response.status}`);
      }

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch slots');
      }

      console.log('✅ [CUSTOMER_SLOT_PICKER] Slots fetched:', result.data);

      setSlots(result.data.availableSlots || []);
      setServiceInfo({
        name: result.data.serviceName,
        slotsNeeded: result.data.slotsNeeded,
        duration: result.data.duration,
        price: result.data.price || 0
      });

    } catch (err: any) {
      console.error('❌ [CUSTOMER_SLOT_PICKER] Error fetching slots:', err);
      setError(err.message || 'Erro ao carregar horários');
      setSlots([]);
      setServiceInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [serviceId, staffId, date]);

  // Handle slot selection
  const handleSlotClick = (slot: AvailableSlot) => {
    if (!slot.canStartService || !serviceInfo) return;

    const endSlot = slot.slotIndex + serviceInfo.slotsNeeded;
    const endTime = slotIndexToTime(endSlot);

    const selectedSlotData: SelectedSlot = {
      startSlot: slot.slotIndex,
      endSlot: endSlot,
      startTime: slot.time,
      endTime: endTime,
      slotsNeeded: serviceInfo.slotsNeeded,
      duration: serviceInfo.duration
    };

    console.log('🎯 [CUSTOMER_SLOT_PICKER] Slot selected:', selectedSlotData);
    onSlotSelect(selectedSlotData);
  };

  // Convert slot index to time string
  const slotIndexToTime = (slotIndex: number): string => {
    const hours = Math.floor(slotIndex / 2);
    const minutes = (slotIndex % 2) * 30;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Check if a slot is the selected one
  const isSlotSelected = (slot: AvailableSlot): boolean => {
    return selectedSlot?.startSlot === slot.slotIndex;
  };

  // Group slots by time period for better UI
  const groupSlotsByPeriod = (slots: AvailableSlot[]) => {
    const morning = slots.filter(slot => slot.slotIndex < 24); // Before 12:00
    const afternoon = slots.filter(slot => slot.slotIndex >= 24 && slot.slotIndex < 36); // 12:00-18:00
    const evening = slots.filter(slot => slot.slotIndex >= 36); // After 18:00
    
    return { morning, afternoon, evening };
  };

  const { morning, afternoon, evening } = groupSlotsByPeriod(slots);

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando horários disponíveis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("text-center py-12", className)}>
        <div className="text-red-600 mb-4">❌ {error}</div>
        <Button onClick={fetchSlots} variant="outline">
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum horário disponível</h3>
        <p className="text-gray-600 mb-4">Não há horários disponíveis para esta data</p>
        {onBack && (
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Escolher outra data
          </Button>
        )}
      </div>
    );
  }

  const renderSlotGroup = (groupSlots: AvailableSlot[], title: string, icon: string) => {
    if (groupSlots.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center text-gray-700 font-medium">
          <span className="mr-2">{icon}</span>
          <span>{title}</span>
          <span className="ml-2 text-sm text-gray-500">({groupSlots.length} horários)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {groupSlots.map((slot) => {
            const isSelected = isSlotSelected(slot);
            const canSelect = slot.canStartService;
            
            return (
              <Button
                key={slot.slotIndex}
                variant={isSelected ? "default" : "outline"}
                size="lg"
                className={cn(
                  "h-auto py-3 px-4 flex flex-col items-center justify-center text-center transition-all",
                  {
                    "bg-blue-600 hover:bg-blue-700 border-blue-600 text-white shadow-lg": isSelected,
                    "border-green-300 hover:border-green-400 hover:bg-green-50 text-green-800": canSelect && !isSelected,
                    "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60": !canSelect,
                    "border-red-200 bg-red-50 text-red-500": slot.isOccupied
                  }
                )}
                disabled={!canSelect}
                onClick={() => handleSlotClick(slot)}
              >
                <div className="font-semibold text-lg">{slot.time}</div>
                {serviceInfo && (
                  <div className="text-xs mt-1 opacity-80">
                    {serviceInfo.duration} min
                  </div>
                )}
                {!canSelect && slot.reason && (
                  <div className="text-xs mt-1 opacity-75">{slot.reason}</div>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Service Info Header */}
      {serviceInfo && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-blue-900">
              <User className="w-5 h-5 mr-3" />
              <div>
                <div className="font-bold text-lg">{serviceInfo.name}</div>
                <div className="flex items-center text-blue-700 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{serviceInfo.duration} minutos ({serviceInfo.slotsNeeded} slot{serviceInfo.slotsNeeded > 1 ? 's' : ''})</span>
                  {serviceInfo.price > 0 && (
                    <>
                      <span className="mx-2">•</span>
                      <span>€{serviceInfo.price.toFixed(2)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Date Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Escolha o seu horário</h3>
        <p className="text-gray-600">
          {new Date(date).toLocaleDateString('pt-PT', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Slots by Time Period */}
      <div className="space-y-6">
        {renderSlotGroup(morning, "Manhã", "🌅")}
        {renderSlotGroup(afternoon, "Tarde", "☀️")}
        {renderSlotGroup(evening, "Noite", "🌙")}
      </div>

      {/* Selected slot confirmation */}
      {selectedSlot && serviceInfo && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
          <div className="text-green-800 font-semibold mb-2">✅ Horário Selecionado</div>
          <div className="text-green-700">
            <div className="text-lg font-bold">{selectedSlot.startTime} - {selectedSlot.endTime}</div>
            <div className="text-sm">
              {serviceInfo.name} • {selectedSlot.duration} minutos
              {serviceInfo.price > 0 && <span> • €{serviceInfo.price.toFixed(2)}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Back button */}
      {onBack && (
        <div className="text-center pt-4 border-t">
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      )}

      {/* Legend */}
      <div className="text-xs text-gray-500 space-y-2 border-t pt-4">
        <div className="text-center font-medium">Legenda:</div>
        <div className="flex justify-center space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-white border border-green-300 rounded mr-2"></div>
            <span>Disponível</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-600 rounded mr-2"></div>
            <span>Selecionado</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded mr-2"></div>
            <span>Indisponível</span>
          </div>
        </div>
      </div>
    </div>
  );
}
