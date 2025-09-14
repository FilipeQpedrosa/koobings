'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SlotPickerProps {
  serviceId: string;
  staffId: string;
  date: string;
  businessId?: string;
  onSlotSelect: (slot: SelectedSlot) => void;
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

export default function SlotPicker({
  serviceId,
  staffId,
  date,
  businessId,
  onSlotSelect,
  selectedSlot,
  className
}: SlotPickerProps) {
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [serviceInfo, setServiceInfo] = useState<{ name: string; slotsNeeded: number; duration: number } | null>(null);

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

      if (businessId) {
        params.append('businessId', businessId);
      }

      console.log('🔍 [SLOT_PICKER] Fetching slots:', {
        serviceId,
        staffId,
        date,
        businessId
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

      console.log('✅ [SLOT_PICKER] Slots fetched:', result.data);

      setSlots(result.data.availableSlots || []);
      setServiceInfo({
        name: result.data.serviceName,
        slotsNeeded: result.data.slotsNeeded,
        duration: result.data.duration
      });

    } catch (err: any) {
      console.error('❌ [SLOT_PICKER] Error fetching slots:', err);
      setError(err.message || 'Erro ao carregar horários');
      setSlots([]);
      setServiceInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [serviceId, staffId, date, businessId]);

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

    console.log('🎯 [SLOT_PICKER] Slot selected:', selectedSlotData);
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

  // Group slots by hour for better UI
  const groupedSlots = slots.reduce((groups, slot) => {
    const hour = Math.floor(slot.slotIndex / 2);
    if (!groups[hour]) groups[hour] = [];
    groups[hour].push(slot);
    return groups;
  }, {} as { [key: number]: AvailableSlot[] });

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center py-8", className)}>
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Carregando horários disponíveis...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("text-center py-8", className)}>
        <div className="text-red-600 mb-2">❌ {error}</div>
        <Button onClick={fetchSlots} variant="outline" size="sm">
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className={cn("text-center py-8 text-gray-500", className)}>
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Nenhum horário disponível para esta data</p>
        <p className="text-sm mt-1">Tente escolher outra data</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Service Info */}
      {serviceInfo && (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="flex items-center text-blue-800">
            <User className="w-4 h-4 mr-2" />
            <span className="font-medium">{serviceInfo.name}</span>
          </div>
          <div className="flex items-center text-blue-600 text-sm mt-1">
            <Clock className="w-3 h-3 mr-1" />
            <span>{serviceInfo.duration} min ({serviceInfo.slotsNeeded} slot{serviceInfo.slotsNeeded > 1 ? 's' : ''})</span>
          </div>
        </div>
      )}

      {/* Date Header */}
      <div className="text-sm font-medium text-gray-700">
        Horários disponíveis para {new Date(date).toLocaleDateString('pt-PT', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>

      {/* Slots Grid */}
      <div className="space-y-4">
        {Object.entries(groupedSlots).map(([hour, hourSlots]) => (
          <div key={hour} className="space-y-2">
            <div className="text-sm font-medium text-gray-600">
              {`${hour.padStart(2, '0')}:00`}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {hourSlots.map((slot) => {
                const isSelected = isSlotSelected(slot);
                const canSelect = slot.canStartService;
                
                return (
                  <Button
                    key={slot.slotIndex}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "justify-start h-auto py-2 px-3",
                      {
                        "bg-green-600 hover:bg-green-700 border-green-600": isSelected,
                        "border-green-200 hover:border-green-300 hover:bg-green-50": canSelect && !isSelected,
                        "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed": !canSelect,
                        "border-red-200 bg-red-50 text-red-400": slot.isOccupied
                      }
                    )}
                    disabled={!canSelect}
                    onClick={() => handleSlotClick(slot)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{slot.time}</div>
                      {!canSelect && slot.reason && (
                        <div className="text-xs opacity-75 mt-1">{slot.reason}</div>
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selected slot info */}
      {selectedSlot && (
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="text-green-800 font-medium">Horário selecionado:</div>
          <div className="text-green-700 text-sm">
            {selectedSlot.startTime} - {selectedSlot.endTime} ({selectedSlot.duration} min)
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="text-xs text-gray-500 space-y-1">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-white border border-green-200 rounded mr-1"></div>
            <span>Disponível</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-600 rounded mr-1"></div>
            <span>Selecionado</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded mr-1"></div>
            <span>Indisponível</span>
          </div>
        </div>
      </div>
    </div>
  );
}
